import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { App } from "../../app/App";
import {
  AppStateProvider,
  createDefaultPersistedState,
  PERSISTED_STATE_KEY,
  type StorageAdapter,
  UI_PREFERENCES_KEY,
} from "../../app/state";
import type { SignalType } from "../../domain";

class MemoryStorage implements StorageAdapter {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

function renderSignalsApp(storage = new MemoryStorage()) {
  storage.setItem(UI_PREFERENCES_KEY, JSON.stringify({ hasSeenIntro: true }));
  window.location.hash = "#signals";

  return {
    storage,
    ...render(
      <AppStateProvider storage={storage}>
        <App />
      </AppStateProvider>,
    ),
  };
}

async function fillSignalForm({
  count,
  event,
  intensity,
  location,
  time,
}: {
  count: string;
  event: SignalType;
  intensity: number;
  location: string;
  time: string;
}) {
  const user = userEvent.setup();
  const dialog = screen.getByRole("dialog");

  await user.selectOptions(
    within(dialog).getByRole("combobox", { name: "Что произошло?" }),
    event,
  );
  await user.clear(within(dialog).getByRole("textbox", { name: "Где это произошло?" }));
  await user.type(
    within(dialog).getByRole("textbox", { name: "Где это произошло?" }),
    location,
  );
  fireEvent.change(
    within(dialog).getByRole("spinbutton", { name: "Количество" }),
    { target: { value: count } },
  );
  fireEvent.change(
    within(dialog).getByRole("slider", {
      name: "Насколько сильным был сигнал?",
    }),
    { target: { value: String(intensity) } },
  );
  fireEvent.change(within(dialog).getByLabelText("Время"), {
    target: { value: time },
  });
}

function readPersistedState(storage: MemoryStorage) {
  return JSON.parse(storage.getItem(PERSISTED_STATE_KEY) ?? "null") as ReturnType<
    typeof createDefaultPersistedState
  >;
}

describe("SignalsSection", () => {
  beforeEach(() => {
    window.location.hash = "";
  });

  it("добавляет валидное наблюдение, пересчитывает analytics и сохраняет unknown location", async () => {
    const user = userEvent.setup();
    const { storage, unmount } = renderSignalsApp();

    expect(screen.getByRole("heading", { level: 1, name: "Сигналы" })).toBeInTheDocument();
    expect(screen.getByText("3 наблюдения")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Добавить сигнал" }));
    await fillSignalForm({
      count: "4",
      event: "barn_rustling",
      intensity: 10,
      location: "Северное поле",
      time: "12:00",
    });
    await user.click(
      screen.getByRole("button", { name: "Добавить наблюдение" }),
    );

    expect(screen.getByText("4 наблюдения")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Шорох" })).toBeInTheDocument();
    expect(screen.getByText("Северное поле")).toBeInTheDocument();

    await waitFor(() => {
      expect(readPersistedState(storage).signals).toHaveLength(4);
    });

    await user.click(screen.getByRole("link", { name: "Обзор" }));
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "9 предполагаемых кроликов",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Северное поле: Высокая активность, 1 наблюдение",
      }),
    ).toHaveAttribute("data-placement", "other");

    unmount();
    renderSignalsApp(storage);
    expect(screen.getByText("Северное поле")).toBeInTheDocument();
  });

  it("показывает ошибки из shared Zod contract", async () => {
    const user = userEvent.setup();
    renderSignalsApp();

    await user.click(screen.getByRole("button", { name: "Добавить сигнал" }));
    const dialog = screen.getByRole("dialog", { name: "Добавить сигнал" });
    await user.type(
      within(dialog).getByRole("textbox", { name: "Где это произошло?" }),
      "   ",
    );
    fireEvent.change(
      within(dialog).getByRole("spinbutton", { name: "Количество" }),
      { target: { value: "0" } },
    );
    fireEvent.change(within(dialog).getByLabelText("Время"), {
      target: { value: "25:61" },
    });

    await user.click(
      within(dialog).getByRole("button", { name: "Добавить наблюдение" }),
    );

    expect(screen.getByText("Укажите место наблюдения.")).toBeInTheDocument();
    expect(screen.getByText("Введите целое число больше нуля.")).toBeInTheDocument();
    expect(screen.getByText("Используйте время в формате ЧЧ:ММ.")).toBeInTheDocument();
    expect(screen.getByText("3 наблюдения")).toBeInTheDocument();
  });

  it("редактирует наблюдение с сохранением id и принимает большие count и intensity 10", async () => {
    const user = userEvent.setup();
    const { storage } = renderSignalsApp();

    await user.click(
      screen.getByRole("button", {
        name: "Изменить сигнал: Пропавшая морковь, Огород",
      }),
    );
    const dialog = screen.getByRole("dialog", { name: "Изменить сигнал" });
    const location = within(dialog).getByRole("textbox", {
      name: "Где это произошло?",
    });
    const count = within(dialog).getByRole("spinbutton", { name: "Количество" });

    await user.clear(location);
    await user.type(
      location,
      "Очень длинное название северного экспериментального участка",
    );
    fireEvent.change(count, { target: { value: "125" } });
    fireEvent.change(
      within(dialog).getByRole("slider", {
        name: "Насколько сильным был сигнал?",
      }),
      { target: { value: "10" } },
    );
    fireEvent.change(within(dialog).getByLabelText("Время"), {
      target: { value: "23:59" },
    });
    await user.click(
      within(dialog).getByRole("button", { name: "Сохранить изменения" }),
    );

    await waitFor(() => {
      const updated = readPersistedState(storage).signals.find(
        ({ id }) => id === "evt_001",
      );
      expect(updated).toMatchObject({ count: 125, intensity: 10, time: "23:59" });
      expect(updated?.location).toBe(
        "Очень длинное название северного экспериментального участка",
      );
    });
  });

  it("удаляет observation, сбрасывает preview и очищает invalid shared selection", async () => {
    const user = userEvent.setup();
    const storage = new MemoryStorage();
    storage.setItem(UI_PREFERENCES_KEY, JSON.stringify({ hasSeenIntro: true }));
    window.location.hash = "#overview";
    render(
      <AppStateProvider storage={storage}>
        <App />
      </AppStateProvider>,
    );

    fireEvent.change(
      screen.getByRole("slider", { name: "Интенсивность наблюдения" }),
      { target: { value: "10" } },
    );
    await user.click(screen.getByRole("link", { name: "Сигналы" }));
    await user.click(
      await screen.findByRole("button", {
        name: "Удалить сигнал: Новая ямка, У забора",
      }),
    );

    expect(screen.getByText("2 наблюдения")).toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: "Обзор" }));
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "3 предполагаемых кроликов",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Закреплённая зона")).not.toBeInTheDocument();
    expect(document.querySelector(".farm-map")).not.toHaveAttribute(
      "data-linked-signal",
    );
    expect(
      screen.getByRole("button", { name: "Применить к данным" }),
    ).toBeDisabled();
    expect(readPersistedState(storage).signals.map(({ id }) => id)).toEqual([
      "evt_001",
      "evt_003",
    ]);
  });

  it("требует confirmation для delete all и переводит весь Overview в empty state", async () => {
    const user = userEvent.setup();
    renderSignalsApp();

    await user.click(
      screen.getByRole("button", { name: "Удалить все сигналы" }),
    );
    let dialog = screen.getByRole("dialog", { name: "Удалить все сигналы?" });
    await user.click(within(dialog).getByRole("button", { name: "Отмена" }));
    expect(screen.getByText("3 наблюдения")).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Удалить все сигналы?" }),
      ).not.toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", { name: "Удалить все сигналы" }),
    );
    dialog = screen.getByRole("dialog", { name: "Удалить все сигналы?" });
    await user.click(
      within(dialog).getByRole("button", { name: "Удалить все сигналы" }),
    );

    expect(
      screen.getByRole("heading", { name: "Список сигналов пуст" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: "Обзор" }));
    expect(
      await screen.findByRole("heading", { name: "Пока недостаточно данных" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Пока нет наблюдений для карты")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Пока нечего анализировать" })).toBeInTheDocument();
    expect(
      screen.getByText(/Для сценария нужно хотя бы одно наблюдение/),
    ).toBeInTheDocument();
    expect(screen.getByText("Начните с наблюдения")).toBeInTheDocument();
  });

  it("восстанавливает только initial signals и сохраняет model settings и intro preference", async () => {
    const user = userEvent.setup();
    const storage = new MemoryStorage();
    storage.setItem(
      PERSISTED_STATE_KEY,
      JSON.stringify({
        ...createDefaultPersistedState(),
        signals: [],
        modelSettings: {
          ...createDefaultPersistedState().modelSettings,
          sensitivity: 1.2,
        },
      }),
    );
    renderSignalsApp(storage);

    await user.click(
      screen.getByRole("button", { name: "Восстановить исходные данные" }),
    );

    await waitFor(() => {
      const persisted = readPersistedState(storage);
      expect(persisted.signals).toHaveLength(3);
      expect(persisted.modelSettings.sensitivity).toBe(1.2);
      expect(JSON.parse(storage.getItem(UI_PREFERENCES_KEY) ?? "null")).toEqual({
        hasSeenIntro: true,
      });
    });

    await user.click(screen.getByRole("link", { name: "Обзор" }));
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "6 предполагаемых кроликов",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (_content, element) =>
          element?.classList.contains("overview-confidence") === true &&
          element.textContent === "Уверенность в оценке · 73%",
      ),
    ).toBeInTheDocument();
  });

  it("закрывает add sheet по Escape и возвращает focus на CTA", async () => {
    const user = userEvent.setup();
    renderSignalsApp();
    const trigger = screen.getByRole("button", { name: "Добавить сигнал" });

    await user.click(trigger);
    expect(screen.getByRole("button", { name: "Закрыть" })).toHaveFocus();
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Добавить сигнал" }),
      ).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });
});

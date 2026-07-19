import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { UiSelectionProvider } from "../../app/selection";
import {
  AppStateProvider,
  createDefaultPersistedState,
  PERSISTED_STATE_KEY,
  type StorageAdapter,
} from "../../app/state";
import { Overview } from "../overview/Overview";

class MemoryStorage implements StorageAdapter {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

function renderScenarioLab(storage = new MemoryStorage()) {
  return {
    storage,
    ...render(
      <AppStateProvider storage={storage}>
        <UiSelectionProvider>
          <Overview />
        </UiSelectionProvider>
      </AppStateProvider>,
    ),
  };
}

function setScenarioIntensity(value: number) {
  fireEvent.change(
    screen.getByRole("slider", { name: "Интенсивность наблюдения" }),
    { target: { value: String(value) } },
  );
}

function readPersistedState(storage: MemoryStorage) {
  return JSON.parse(storage.getItem(PERSISTED_STATE_KEY) ?? "null") as ReturnType<
    typeof createDefaultPersistedState
  >;
}

describe("WhatIfScenarioLab", () => {
  it("по умолчанию выбирает самое impactful событие event-level", () => {
    renderScenarioLab();

    expect(screen.getByRole("radio", { name: /Новые ямки/ })).toBeChecked();
    expect(screen.getByRole("radio", { name: /Движение/ })).not.toBeChecked();
    expect(screen.getByRole("slider", { name: "Интенсивность наблюдения" })).toHaveValue("7");
  });

  it("держит preview изолированным и распространяет его в Hero, Map и Evidence", async () => {
    const { storage } = renderScenarioLab();
    const comparison = screen.getByRole("region", {
      name: "Сравнение текущей оценки и сценария",
    });

    setScenarioIntensity(10);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "6 предполагаемых кроликов",
      }),
    ).toBeInTheDocument();
    expect(within(comparison).getByText("5")).toBeInTheDocument();
    expect(within(comparison).getByText("6")).toBeInTheDocument();
    expect(within(comparison).getByText("73%")).toBeInTheDocument();
    expect(within(comparison).getByText("76%")).toBeInTheDocument();

    const fence = screen.getByRole("button", {
      name: /У забора: Высокая активность, 1 наблюдение/,
    });
    expect(fence).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("evidence-item-new_hole")).toHaveTextContent("48%");
    expect(screen.getByTestId("evidence-item-new_hole")).toHaveAttribute(
      "data-selected",
      "true",
    );
    expect(document.querySelector(".farm-map__details")).toHaveTextContent("2,80");

    await waitFor(() => {
      expect(readPersistedState(storage).signals[1]?.intensity).toBe(7);
    });
  });

  it("связывает выбор observation с соответствующими Map и Evidence", async () => {
    const user = userEvent.setup();
    renderScenarioLab();

    await user.click(screen.getByRole("radio", { name: /Движение/ }));

    await waitFor(() => {
      expect(screen.getByRole("radio", { name: /Движение/ })).toBeChecked();
      expect(
        screen.getByRole("button", {
          name: /Сарай: Высокая активность, 1 наблюдение/,
        }),
      ).toHaveAttribute("aria-pressed", "true");
    });
    expect(screen.getByTestId("evidence-item-motion_sensor")).toHaveAttribute(
      "data-selected",
      "true",
    );
  });

  it("применяет observation preview, сохраняет model settings и показывает inline confirmation", async () => {
    const user = userEvent.setup();
    const storage = new MemoryStorage();
    const configuredState = {
      ...createDefaultPersistedState(),
      modelSettings: {
        ...createDefaultPersistedState().modelSettings,
        sensitivity: 1.2,
      },
    };
    storage.setItem(PERSISTED_STATE_KEY, JSON.stringify(configuredState));
    renderScenarioLab(storage);

    setScenarioIntensity(10);
    await user.click(screen.getByRole("button", { name: "Применить к данным" }));

    expect(screen.getByText("Данные обновлены")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Применить к данным" })).toBeDisabled();
    expect(screen.getByRole("slider", { name: "Интенсивность наблюдения" })).toHaveValue("10");

    await waitFor(() => {
      const persisted = readPersistedState(storage);
      expect(persisted.signals[1]?.intensity).toBe(10);
      expect(persisted.modelSettings).toEqual(configuredState.modelSettings);
    });
  });

  it("сбрасывает preview без изменения основных данных", async () => {
    const user = userEvent.setup();
    const { storage } = renderScenarioLab();

    setScenarioIntensity(10);
    await user.click(screen.getByRole("button", { name: "Сбросить сценарий" }));

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "5 предполагаемых кроликов",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Интенсивность наблюдения" })).toHaveValue("7");
    expect(screen.getByRole("button", { name: "Сбросить сценарий" })).toBeDisabled();
    expect(readPersistedState(storage).signals[1]?.intensity).toBe(7);
  });

  it("показывает empty state без ложного сравнения", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      PERSISTED_STATE_KEY,
      JSON.stringify({ ...createDefaultPersistedState(), signals: [] }),
    );
    renderScenarioLab(storage);

    const lab = document.getElementById("scenario-lab");
    expect(lab).toHaveAccessibleName("Проверить гипотезу");
    expect(lab).toHaveTextContent("Для сценария нужно хотя бы одно наблюдение");
    expect(within(lab as HTMLElement).queryByText("Сейчас")).not.toBeInTheDocument();
  });
});

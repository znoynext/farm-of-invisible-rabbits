import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { App } from "./App";
import {
  AppStateProvider,
  createDefaultPersistedState,
  PERSISTED_STATE_KEY,
  type StorageAdapter,
  UI_PREFERENCES_KEY,
} from "./state";
import { initialSignals } from "../data/initialSignals";

class MemoryStorage implements StorageAdapter {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

function renderApp(storage = new MemoryStorage()) {
  return {
    storage,
    ...render(
      <AppStateProvider storage={storage}>
        <App />
      </AppStateProvider>,
    ),
  };
}

describe("App", () => {
  beforeEach(() => {
    window.location.hash = "";
  });

  it("при первом посещении показывает короткое введение", () => {
    renderApp();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Их не видно. Но следы остаются.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Farm of Invisible Rabbits"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Открыть радар" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", { name: "Основная навигация" }),
    ).not.toBeInTheDocument();
  });

  it("CTA открывает приложение и сохраняет intro preference", async () => {
    const user = userEvent.setup();
    const { storage } = renderApp();

    await user.click(screen.getByRole("button", { name: "Открыть радар" }));

    expect(
      await screen.findByRole("navigation", { name: "Основная навигация" }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(JSON.parse(storage.getItem(UI_PREFERENCES_KEY) ?? "null")).toEqual({
        hasSeenIntro: true,
      });
    });
  });

  it("при повторном посещении сразу показывает приложение", () => {
    const storage = new MemoryStorage();
    storage.setItem(UI_PREFERENCES_KEY, JSON.stringify({ hasSeenIntro: true }));

    renderApp(storage);

    expect(
      screen.getByRole("navigation", { name: "Основная навигация" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        level: 1,
        name: "Их не видно. Но следы остаются.",
      }),
    ).not.toBeInTheDocument();
  });

  it("показывает canonical clear output из derived analytics", async () => {
    const user = userEvent.setup();
    const storage = new MemoryStorage();
    storage.setItem(UI_PREFERENCES_KEY, JSON.stringify({ hasSeenIntro: true }));
    renderApp(storage);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "5 предполагаемых кроликов",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Умеренная активность")).toBeInTheDocument();
    expect(
      screen.getByText(
        (_content, element) =>
          element?.classList.contains("overview-confidence") === true &&
          element.textContent === "Уверенность в оценке · 73%",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Основной источник активности — новые ямки в районе забора.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/Последнее наблюдение/)).toHaveTextContent(
      "Последнее наблюдение · 10:05 · Сарай",
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Где остаются следы" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "У забора: Высокая активность, 1 наблюдение",
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Разобраться, почему" }));
    const evidence = document.getElementById("evidence");

    expect(window.location.hash).toBe("#evidence");
    expect(evidence).toHaveAccessibleName("Что повлияло на оценку");
    await waitFor(() => expect(evidence).toHaveFocus());
    expect(document.getElementById("overview-evidence-summary")).toBeInTheDocument();
  });

  it("показывает canonical aggregated contributions и отдельную формулу события", async () => {
    const user = userEvent.setup();
    const storage = new MemoryStorage();
    storage.setItem(UI_PREFERENCES_KEY, JSON.stringify({ hasSeenIntro: true }));
    renderApp(storage);

    const holeEvidence = screen.getByTestId("evidence-item-new_hole");
    const motionEvidence = screen.getByTestId("evidence-item-motion_sensor");
    const carrotEvidence = screen.getByTestId("evidence-item-missing_carrot");

    expect(holeEvidence).toHaveAttribute("data-strength", "dominant");
    expect(holeEvidence).toHaveTextContent("Новые ямки");
    expect(holeEvidence).toHaveTextContent("40%");
    expect(motionEvidence).toHaveTextContent("32%");
    expect(carrotEvidence).toHaveTextContent("28%");

    await user.click(within(holeEvidence).getByRole("button"));

    expect(within(holeEvidence).getByText("Расчёт влияния")).toBeInTheDocument();
    expect(within(holeEvidence).getByText("2 × 1,40 × 0,70 = 1,96")).toBeInTheDocument();
    expect(within(holeEvidence).getAllByText("У забора")).toHaveLength(2);
    expect(within(holeEvidence).getByText("7/10")).toBeInTheDocument();
  });

  it("связывает Evidence и Farm Map в обе стороны", async () => {
    const user = userEvent.setup();
    const storage = new MemoryStorage();
    storage.setItem(UI_PREFERENCES_KEY, JSON.stringify({ hasSeenIntro: true }));
    renderApp(storage);

    const holeEvidence = screen.getByTestId("evidence-item-new_hole");
    const carrotEvidence = screen.getByTestId("evidence-item-missing_carrot");
    const holeZone = screen.getByRole("button", {
      name: "У забора: Высокая активность, 1 наблюдение",
    });
    const gardenZone = screen.getByRole("button", {
      name: "Огород: Умеренная активность, 1 наблюдение",
    });

    await user.click(within(holeEvidence).getByRole("button"));

    expect(holeZone).toHaveAttribute("data-related", "true");
    expect(gardenZone).toHaveAttribute("data-related", "false");

    await user.click(gardenZone);

    expect(carrotEvidence).toHaveAttribute("data-map-linked", "true");
    expect(holeEvidence).toHaveAttribute("data-map-linked", "false");
  });

  it("не создаёт duplicate IDs в Overview flow", () => {
    const storage = new MemoryStorage();
    storage.setItem(UI_PREFERENCES_KEY, JSON.stringify({ hasSeenIntro: true }));
    renderApp(storage);

    const ids = [...document.querySelectorAll<HTMLElement>("[id]")].map(
      ({ id }) => id,
    );

    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain("overview-evidence-summary");
    expect(ids).toContain("evidence");
  });

  it("вычисляет dominant evidence по изменённым данным", () => {
    const storage = new MemoryStorage();
    storage.setItem(UI_PREFERENCES_KEY, JSON.stringify({ hasSeenIntro: true }));
    storage.setItem(
      PERSISTED_STATE_KEY,
      JSON.stringify({
        ...createDefaultPersistedState(),
        signals: [{ ...initialSignals[0]!, location: "Теплица" }],
      }),
    );
    renderApp(storage);

    expect(
      screen.getByText(
        "Основной источник активности — пропавшая морковь в зоне «Теплица».",
      ),
    ).toBeInTheDocument();
  });

  it("не добавляет ложную единственную location для multi-location dominant type", () => {
    const storage = new MemoryStorage();
    storage.setItem(UI_PREFERENCES_KEY, JSON.stringify({ hasSeenIntro: true }));
    storage.setItem(
      PERSISTED_STATE_KEY,
      JSON.stringify({
        ...createDefaultPersistedState(),
        signals: [
          {
            id: "evt_a",
            event: "new_hole",
            location: "Север",
            count: 1,
            intensity: 8,
            time: "09:00",
          },
          {
            id: "evt_b",
            event: "new_hole",
            location: "Юг",
            count: 1,
            intensity: 8,
            time: "10:00",
          },
        ],
      }),
    );
    renderApp(storage);

    expect(
      screen.getByText("Основной источник активности — новые ямки."),
    ).toBeInTheDocument();
    expect(screen.getByTestId("evidence-item-new_hole")).toHaveTextContent(
      "2 локациях · Север · Юг",
    );
  });

  it("показывает честный empty state без уверенного вывода о нуле", async () => {
    const user = userEvent.setup();
    const storage = new MemoryStorage();
    storage.setItem(UI_PREFERENCES_KEY, JSON.stringify({ hasSeenIntro: true }));
    storage.setItem(
      PERSISTED_STATE_KEY,
      JSON.stringify({ ...createDefaultPersistedState(), signals: [] }),
    );
    renderApp(storage);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Пока недостаточно данных",
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /0 предполагаемых кроликов/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Пока нечего анализировать" }),
    ).toBeInTheDocument();
    expect(document.getElementById("evidence")).not.toHaveTextContent("0%");

    await user.click(screen.getByRole("link", { name: "Добавить сигнал" }));
    await waitFor(() => {
      expect(window.location.hash).toBe("#signals");
    });
  });

  it("повторно открывает Intro из «О проекте» и возвращает focus", async () => {
    const user = userEvent.setup();
    const storage = new MemoryStorage();
    storage.setItem(UI_PREFERENCES_KEY, JSON.stringify({ hasSeenIntro: true }));
    renderApp(storage);

    const trigger = screen.getByRole("button", { name: "О проекте" });
    await user.click(trigger);

    expect(
      await screen.findByRole("dialog", { name: "Farm of Invisible Rabbits" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Открыть радар" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "О проекте" })).toHaveFocus();
    });
  });

  it("переключает разделы через hash-навигацию", async () => {
    const user = userEvent.setup();
    const storage = new MemoryStorage();
    storage.setItem(UI_PREFERENCES_KEY, JSON.stringify({ hasSeenIntro: true }));
    renderApp(storage);

    await user.click(screen.getByRole("link", { name: "Сигналы" }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 1, name: "Сигналы" }),
      ).toBeInTheDocument();
    });
    expect(window.location.hash).toBe("#signals");
  });
});

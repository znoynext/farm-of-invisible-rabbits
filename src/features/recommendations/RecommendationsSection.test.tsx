import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import { UiSelectionProvider } from "../../app/selection";
import {
  AppStateProvider,
  createDefaultPersistedState,
  PERSISTED_STATE_KEY,
  type StorageAdapter,
} from "../../app/state";
import type { SignalEvent } from "../../domain";
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

function renderRecommendations(signals?: readonly SignalEvent[]) {
  const storage = new MemoryStorage();

  if (signals) {
    storage.setItem(
      PERSISTED_STATE_KEY,
      JSON.stringify({ ...createDefaultPersistedState(), signals }),
    );
  }

  render(
    <AppStateProvider storage={storage}>
      <UiSelectionProvider>
        <Overview />
      </UiSelectionProvider>
    </AppStateProvider>,
  );

  return {
    section: screen.getByRole("region", { name: "Что стоит сделать" }),
    storage,
  };
}

describe("RecommendationsSection", () => {
  it("показывает три канонических действия с отдельными причинами", () => {
    const { section } = renderRecommendations();

    expect(within(section).getAllByRole("listitem")).toHaveLength(3);
    expect(section).toHaveTextContent("Проверить зону «У забора»");
    expect(section).toHaveTextContent("Обнаружена новая ямка высокой интенсивности");
    expect(section).toHaveTextContent("Проверить место срабатывания «Сарай»");
    expect(section).toHaveTextContent("Усилить наблюдение в зоне «Огород»");
  });

  it("спокойно предлагает собрать данные при низкой уверенности", () => {
    const weakSignal: SignalEvent = {
      id: "evt_weak",
      event: "barn_rustling",
      location: "Сад",
      count: 1,
      intensity: 1,
      time: "12:00",
    };
    const { section } = renderRecommendations([weakSignal]);

    expect(section).toHaveTextContent("Собрать дополнительные наблюдения");
    expect(section).toHaveTextContent("Уверенность в оценке ниже 50%");
  });

  it("ставит защиту урожая первой при высокой оценке", () => {
    const strongSignal: SignalEvent = {
      id: "evt_strong",
      event: "barn_rustling",
      location: "Поле",
      count: 100,
      intensity: 10,
      time: "12:00",
    };
    const { section } = renderRecommendations([strongSignal]);
    const items = within(section).getAllByRole("listitem");

    expect(items[0]).toHaveTextContent("Усилить защиту урожая");
    expect(items[0]).toHaveTextContent("Оценка достигла восьми кроликов");
  });

  it("сохраняет domain ordering для нескольких ямок", () => {
    const holes: SignalEvent[] = [
      {
        id: "evt_beta",
        event: "new_hole",
        location: "Бета",
        count: 2,
        intensity: 6,
        time: "09:00",
      },
      {
        id: "evt_alpha",
        event: "new_hole",
        location: "Альфа",
        count: 2,
        intensity: 6,
        time: "10:00",
      },
    ];
    const { section } = renderRecommendations(holes);
    const items = within(section).getAllByRole("listitem");

    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent("Собрать дополнительные наблюдения");
    expect(items[1]).toHaveTextContent("Альфа");
    expect(items[2]).toHaveTextContent("Бета");
  });

  it("показывает action-oriented empty state без списка процентов", () => {
    const { section } = renderRecommendations([]);

    expect(section).toHaveTextContent("Начните с наблюдения");
    expect(section).toHaveTextContent("Добавьте первый сигнал");
    expect(within(section).queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("использует scenario analytics до Apply, не меняя persistent data", async () => {
    const { section, storage } = renderRecommendations();

    fireEvent.change(
      screen.getByRole("slider", { name: "Интенсивность наблюдения" }),
      { target: { value: "1" } },
    );

    expect(section).toHaveTextContent("Для временного сценария");
    expect(section).not.toHaveTextContent("Проверить зону «У забора»");
    expect(section).toHaveTextContent("Проверить место срабатывания «Сарай»");

    await waitFor(() => {
      const raw = storage.getItem(PERSISTED_STATE_KEY);
      const persisted = JSON.parse(raw ?? "null") as ReturnType<
        typeof createDefaultPersistedState
      >;
      expect(persisted.signals[1]?.intensity).toBe(7);
    });
  });
});

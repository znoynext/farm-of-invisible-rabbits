import { initialSignals } from "../data/initialSignals";
import { buildRecommendations } from "./recommendations";
import type { SignalEvent } from "./types";

describe("recommendations", () => {
  it("формирует канонические рекомендации в фиксированном порядке", () => {
    const recommendations = buildRecommendations(initialSignals);

    expect(recommendations.map(({ kind, location }) => ({ kind, location })))
      .toEqual([
        { kind: "inspect_new_hole", location: "У забора" },
        { kind: "inspect_motion", location: "Сарай" },
        { kind: "increase_observation", location: "Огород" },
      ]);
    expect(recommendations[0]?.message).toContain("новая ямка");
    expect(recommendations[0]).toMatchObject({
      action: "Проверить зону «У забора»",
      reason: "Обнаружена новая ямка высокой интенсивности.",
    });
  });

  it("рекомендует собрать данные при confidence ниже 50", () => {
    const weakSignal: SignalEvent = {
      id: "evt_weak",
      event: "barn_rustling",
      location: "Сад",
      count: 1,
      intensity: 1,
      time: "12:00",
    };

    expect(buildRecommendations([weakSignal]).map(({ kind }) => kind)).toContain(
      "collect_observations",
    );
  });

  it("рекомендует защитить урожай при estimate не меньше восьми", () => {
    const strongSignal: SignalEvent = {
      id: "evt_strong",
      event: "barn_rustling",
      location: "Поле",
      count: 100,
      intensity: 10,
      time: "12:00",
    };

    expect(buildRecommendations([strongSignal]).map(({ kind }) => kind)).toContain(
      "protect_crops",
    );
  });

  it("возвращает fallback без значимых сигналов", () => {
    expect(buildRecommendations([])).toEqual([
      expect.objectContaining({
        action: "Начните с наблюдения",
        kind: "continue_observation",
      }),
    ]);
  });

  it("возвращает не больше трёх рекомендаций", () => {
    const extraSignals: SignalEvent[] = [
      ...initialSignals,
      { ...initialSignals[1]!, id: "evt_004", location: "Сад", time: "11:00" },
      { ...initialSignals[2]!, id: "evt_005", location: "Поле", time: "11:10" },
    ];

    expect(buildRecommendations(extraSignals)).toHaveLength(3);
  });

  it("сохраняет глобальные приоритеты и выбирает strongest location в top-3", () => {
    const signals: SignalEvent[] = [
      {
        id: "evt_weaker",
        event: "new_hole",
        location: "Дальний сад",
        count: 80,
        intensity: 6,
        time: "08:00",
      },
      {
        id: "evt_stronger",
        event: "new_hole",
        location: "Ближний сад",
        count: 100,
        intensity: 6,
        time: "12:00",
      },
    ];

    expect(buildRecommendations(signals).map(({ kind, location }) => ({ kind, location })))
      .toEqual([
        { kind: "protect_crops", location: undefined },
        { kind: "collect_observations", location: undefined },
        { kind: "inspect_new_hole", location: "Ближний сад" },
      ]);
  });

  it("использует стабильный tie-breaker независимо от порядка событий", () => {
    const alpha: SignalEvent = {
      id: "evt_alpha",
      event: "new_hole",
      location: "Альфа",
      count: 100,
      intensity: 6,
      time: "12:00",
    };
    const beta: SignalEvent = {
      ...alpha,
      id: "evt_beta",
      location: "Бета",
      time: "08:00",
    };

    expect(buildRecommendations([beta, alpha])).toEqual(
      buildRecommendations([alpha, beta]),
    );
    expect(buildRecommendations([beta, alpha])[2]?.location).toBe("Альфа");
  });
});

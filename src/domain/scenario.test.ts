import { initialSignals } from "../data/initialSignals";
import { DEFAULT_SIGNAL_WEIGHTS } from "./constants";
import { findMostImpactfulObservation } from "./scenario";
import type { SignalEvent } from "./types";

describe("what-if scenario domain helpers", () => {
  it("выбирает самое impactful событие, а не агрегированный тип", () => {
    const result = findMostImpactfulObservation(initialSignals);

    expect(result?.signal.id).toBe("evt_002");
    expect(result?.signal.event).toBe("new_hole");
    expect(result?.impact).toBeCloseTo(1.96, 8);
  });

  it("учитывает текущие веса модели", () => {
    const result = findMostImpactfulObservation(initialSignals, {
      ...DEFAULT_SIGNAL_WEIGHTS,
      motion_sensor: 3,
    });

    expect(result?.signal.id).toBe("evt_003");
  });

  it("детерминированно разрешает tie по id независимо от порядка массива", () => {
    const first: SignalEvent = {
      id: "evt_b",
      event: "missing_carrot",
      location: "Юг",
      count: 1,
      intensity: 10,
      time: "10:00",
    };
    const second: SignalEvent = {
      ...first,
      id: "evt_a",
      location: "Север",
    };

    expect(findMostImpactfulObservation([first, second])?.signal.id).toBe("evt_a");
    expect(findMostImpactfulObservation([second, first])?.signal.id).toBe("evt_a");
  });

  it("возвращает null для пустых наблюдений", () => {
    expect(findMostImpactfulObservation([])).toBeNull();
  });
});

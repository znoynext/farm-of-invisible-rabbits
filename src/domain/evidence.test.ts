import { initialSignals } from "../data/initialSignals";
import { DEFAULT_SIGNAL_WEIGHTS } from "./constants";
import { findLatestObservation, findStrongestEvidence } from "./evidence";
import type { SignalEvent, SignalWeights } from "./types";

describe("evidence selectors", () => {
  it("находит последнее реальное наблюдение по времени события", () => {
    expect(findLatestObservation(initialSignals)).toEqual(initialSignals[2]);
  });

  it("находит канонический strongest evidence динамически", () => {
    const strongest = findStrongestEvidence(initialSignals);

    expect(strongest?.signal.id).toBe("evt_002");
    expect(strongest?.signal.event).toBe("new_hole");
    expect(strongest?.impact).toBeCloseTo(1.96, 10);
    expect(strongest?.contribution).toBeCloseTo((1.96 / 4.96) * 100, 10);
  });

  it("учитывает изменённые веса и не привязан к canonical типу", () => {
    const strongest = findStrongestEvidence(initialSignals, {
      ...DEFAULT_SIGNAL_WEIGHTS,
      missing_carrot: 3,
      new_hole: 0.1,
      motion_sensor: 0.1,
    });

    expect(strongest?.signal.event).toBe("missing_carrot");
  });

  it("возвращает null для пустых данных и нулевого evidence", () => {
    const zeroWeights: SignalWeights = {
      missing_carrot: 0,
      new_hole: 0,
      motion_sensor: 0,
      barn_rustling: 0,
    };

    expect(findLatestObservation([])).toBeNull();
    expect(findStrongestEvidence([])).toBeNull();
    expect(findStrongestEvidence(initialSignals, zeroWeights)).toBeNull();
  });

  it("детерминированно разрешает равный impact по id", () => {
    const signals: SignalEvent[] = [
      {
        id: "evt_b",
        event: "missing_carrot",
        location: "Север",
        count: 1,
        intensity: 10,
        time: "12:00",
      },
      {
        id: "evt_a",
        event: "missing_carrot",
        location: "Юг",
        count: 1,
        intensity: 10,
        time: "12:00",
      },
    ];

    expect(findStrongestEvidence(signals)?.signal.id).toBe("evt_a");
    expect(findLatestObservation(signals)?.id).toBe("evt_b");
  });
});

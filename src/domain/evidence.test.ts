import { initialSignals } from "../data/initialSignals";
import { DEFAULT_SIGNAL_WEIGHTS } from "./constants";
import {
  buildSignalEvidenceGroups,
  findDominantEvidence,
  findLatestObservation,
} from "./evidence";
import type { SignalEvent, SignalWeights } from "./types";

describe("evidence selectors", () => {
  it("находит последнее реальное наблюдение по времени события", () => {
    expect(findLatestObservation(initialSignals)).toEqual(initialSignals[2]);
  });

  it("определяет canonical dominant evidence по агрегированному типу", () => {
    const dominant = findDominantEvidence(initialSignals);

    expect(dominant?.signalType).toBe("new_hole");
    expect(dominant?.impact).toBeCloseTo(1.96, 10);
    expect(dominant?.contribution).toBeCloseTo((1.96 / 4.96) * 100, 10);
    expect(dominant?.strongestLocation).toBe("У забора");
  });

  it("строит canonical aggregated contributions без presentation rounding", () => {
    const groups = buildSignalEvidenceGroups(initialSignals);

    expect(groups.map(({ signalType }) => signalType)).toEqual([
      "new_hole",
      "motion_sensor",
      "missing_carrot",
    ]);
    expect(groups.map(({ strength }) => strength)).toEqual([
      "dominant",
      "strong",
      "supporting",
    ]);
    expect(groups[0]?.contribution).toBeCloseTo((1.96 / 4.96) * 100, 10);
    expect(groups[1]?.contribution).toBeCloseTo((1.6 / 4.96) * 100, 10);
    expect(groups[2]?.contribution).toBeCloseTo((1.4 / 4.96) * 100, 10);
    expect(groups.reduce((total, group) => total + group.contribution, 0)).toBeCloseTo(
      100,
      10,
    );
    expect(groups[0]?.events[0]).toMatchObject({
      effectiveCount: 2,
      intensityFactor: 0.7,
      weight: 1.4,
    });
    expect(groups[0]?.events[0]?.impact).toBeCloseTo(1.96, 10);
  });

  it("учитывает изменённые веса в агрегированном доминирующем типе", () => {
    const dominant = findDominantEvidence(initialSignals, {
      ...DEFAULT_SIGNAL_WEIGHTS,
      missing_carrot: 3,
      new_hole: 0.1,
      motion_sensor: 0.1,
    });

    expect(dominant?.signalType).toBe("missing_carrot");
  });

  it("возвращает null для пустых данных и нулевого evidence", () => {
    const zeroWeights: SignalWeights = {
      missing_carrot: 0,
      new_hole: 0,
      motion_sensor: 0,
      barn_rustling: 0,
    };

    expect(findLatestObservation([])).toBeNull();
    expect(findDominantEvidence([])).toBeNull();
    expect(findDominantEvidence(initialSignals, zeroWeights)).toBeNull();
  });

  it("детерминированно разрешает равный агрегированный impact по порядку типов", () => {
    const signals: SignalEvent[] = [
      {
        id: "evt_hole",
        event: "new_hole",
        location: "Юг",
        count: 1,
        intensity: 5,
        time: "12:00",
      },
      {
        id: "evt_carrot",
        event: "missing_carrot",
        location: "Север",
        count: 1,
        intensity: 10,
        time: "12:00",
      },
    ];

    expect(findDominantEvidence(signals)?.signalType).toBe("missing_carrot");
    expect(findLatestObservation(signals)?.id).toBe("evt_hole");
  });

  it("не приписывает dominant type одну локацию при сопоставимом multi-location impact", () => {
    const signals: SignalEvent[] = [
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
      {
        id: "evt_c",
        event: "missing_carrot",
        location: "Огород",
        count: 1,
        intensity: 2,
        time: "11:00",
      },
    ];

    const dominant = findDominantEvidence(signals);
    const dominantGroup = buildSignalEvidenceGroups(signals)[0];

    expect(dominant).toMatchObject({ signalType: "new_hole" });
    expect(dominant?.strongestLocation).toBeUndefined();
    expect(dominantGroup?.locations).toEqual(["Север", "Юг"]);
    expect(dominantGroup?.events).toHaveLength(2);
  });
});

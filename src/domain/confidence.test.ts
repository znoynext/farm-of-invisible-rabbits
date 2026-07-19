import { initialSignals } from "../data/initialSignals";
import { DEFAULT_SIGNAL_WEIGHTS } from "./constants";
import { calculateConfidence } from "./confidence";
import { calculateEstimate } from "./estimation";
import type { SignalEvent } from "./types";

describe("confidence", () => {
  it("возвращает каноническое значение", () => {
    expect(calculateConfidence(initialSignals)).toBe(73);
  });

  it("возвращает ноль для пустых данных", () => {
    expect(calculateConfidence([])).toBe(0);
  });

  it("не зависит от sensitivity", () => {
    const confidenceAtLowSensitivity = calculateConfidence(initialSignals);
    const confidenceAtHighSensitivity = calculateConfidence(initialSignals);

    expect(calculateEstimate(initialSignals, { sensitivity: 0.5 }).estimatedRabbits).not.toBe(
      calculateEstimate(initialSignals, { sensitivity: 1.5 }).estimatedRabbits,
    );
    expect(confidenceAtHighSensitivity).toBe(confidenceAtLowSensitivity);
  });

  it("не зависит от весов сигналов", () => {
    const changedWeights = {
      ...DEFAULT_SIGNAL_WEIGHTS,
      missing_carrot: 3,
      new_hole: 0,
    };

    expect(calculateEstimate(initialSignals, { weights: changedWeights }).totalEvidence).not.toBe(
      calculateEstimate(initialSignals).totalEvidence,
    );
    expect(calculateConfidence(initialSignals)).toBe(73);
  });

  it("всегда ограничен диапазоном от 0 до 100", () => {
    const signalTypes = [
      "missing_carrot",
      "new_hole",
      "motion_sensor",
      "barn_rustling",
    ] as const;
    const maximalSignals: SignalEvent[] = Array.from({ length: 12 }, (_, index) => ({
      id: `evt_${index}`,
      event: signalTypes[index % signalTypes.length] ?? "missing_carrot",
      location: `Зона ${index % 4}`,
      count: 10,
      intensity: 10,
      time: "12:00",
    }));

    expect(calculateConfidence(maximalSignals)).toBe(100);
    expect(calculateConfidence([{ ...maximalSignals[0]!, intensity: 1 }])).toBeGreaterThanOrEqual(
      0,
    );
    expect(calculateConfidence(maximalSignals)).toBeLessThanOrEqual(100);
  });
});

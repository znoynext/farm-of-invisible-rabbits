import { initialSignals } from "../data/initialSignals";
import { DEFAULT_SIGNAL_WEIGHTS } from "./constants";
import {
  calculateEffectiveCount,
  calculateEstimate,
  calculateEventImpact,
} from "./estimation";
import type { SignalEvent } from "./types";

const baseSignal: SignalEvent = {
  id: "evt_test",
  event: "missing_carrot",
  location: "Огород",
  count: 5,
  intensity: 5,
  time: "12:00",
};

describe("estimation", () => {
  it("возвращает каноническую оценку", () => {
    const result = calculateEstimate(initialSignals);

    expect(result.totalEvidence).toBeCloseTo(4.96, 10);
    expect(result.estimatedRabbits).toBe(5);
  });

  it("возвращает нулевую оценку для пустых данных", () => {
    expect(calculateEstimate([])).toEqual({
      totalEvidence: 0,
      estimatedRabbits: 0,
    });
  });

  it("применяет diminishing returns после пяти наблюдений", () => {
    const gainFromFiveToSix = calculateEffectiveCount(6) - calculateEffectiveCount(5);
    const gainFromSixToSeven = calculateEffectiveCount(7) - calculateEffectiveCount(6);

    expect(gainFromFiveToSix).toBe(1);
    expect(gainFromSixToSeven).toBeGreaterThan(0);
    expect(gainFromSixToSeven).toBeLessThan(gainFromFiveToSix);
  });

  it("не уменьшает impact при увеличении intensity", () => {
    const lowerImpact = calculateEventImpact({ ...baseSignal, intensity: 3 });
    const higherImpact = calculateEventImpact({ ...baseSignal, intensity: 8 });

    expect(higherImpact).toBeGreaterThanOrEqual(lowerImpact);
  });

  it("не уменьшает impact при увеличении веса", () => {
    const lowerImpact = calculateEventImpact(baseSignal, {
      ...DEFAULT_SIGNAL_WEIGHTS,
      missing_carrot: 0.4,
    });
    const higherImpact = calculateEventImpact(baseSignal, {
      ...DEFAULT_SIGNAL_WEIGHTS,
      missing_carrot: 1.2,
    });

    expect(higherImpact).toBeGreaterThanOrEqual(lowerImpact);
  });

  it("не уменьшает estimate при увеличении sensitivity", () => {
    const estimates = [0.5, 1, 1.5].map(
      (sensitivity) => calculateEstimate(initialSignals, { sensitivity }).estimatedRabbits,
    );

    expect(estimates[1]).toBeGreaterThanOrEqual(estimates[0] ?? 0);
    expect(estimates[2]).toBeGreaterThanOrEqual(estimates[1] ?? 0);
  });
});

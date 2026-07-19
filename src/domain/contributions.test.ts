import { initialSignals } from "../data/initialSignals";
import {
  calculateEventContributions,
  calculateSignalContributions,
} from "./contributions";
import type { SignalWeights } from "./types";

const zeroWeights: SignalWeights = {
  missing_carrot: 0,
  new_hole: 0,
  motion_sensor: 0,
  barn_rustling: 0,
};

describe("contributions", () => {
  it("нормализует канонические raw contributions до 100 процентов", () => {
    const contributions = calculateSignalContributions(initialSignals);
    const byType = Object.fromEntries(
      contributions.map(({ signalType, contribution }) => [signalType, contribution]),
    );

    expect(byType.missing_carrot).toBeCloseTo(28.23, 2);
    expect(byType.new_hole).toBeCloseTo(39.52, 2);
    expect(byType.motion_sensor).toBeCloseTo(32.26, 2);
    expect(byType.barn_rustling).toBe(0);
    expect(contributions.reduce((total, item) => total + item.contribution, 0)).toBeCloseTo(
      100,
      10,
    );
  });

  it("сохраняет event-level contributions без presentation rounding", () => {
    const contributions = calculateEventContributions(initialSignals);

    expect(contributions).toHaveLength(3);
    expect(contributions.reduce((total, item) => total + item.contribution, 0)).toBeCloseTo(
      100,
      10,
    );
    expect(contributions[0]?.contribution).not.toBe(
      Math.round(contributions[0]?.contribution ?? 0),
    );
  });

  it("возвращает нулевые contributions при нулевом evidence", () => {
    expect(
      calculateEventContributions([initialSignals[0]!], zeroWeights)[0]?.contribution,
    ).toBe(0);
    expect(
      calculateSignalContributions([initialSignals[0]!], zeroWeights).every(
        (item) => item.contribution === 0,
      ),
    ).toBe(true);
  });
});

import { deriveAnalytics, deriveScenarioAnalytics } from "./analytics";
import { createDefaultAppState } from "./defaults";
import { appStateReducer } from "./reducer";

describe("derived analytics", () => {
  it("вычисляет канонические результаты domain functions без хранения в state", () => {
    const state = createDefaultAppState();
    const analytics = deriveAnalytics(state);

    expect(state).not.toHaveProperty("estimate");
    expect(state).not.toHaveProperty("confidence");
    expect(state).not.toHaveProperty("contributions");
    expect(state).not.toHaveProperty("recommendations");
    expect(state).not.toHaveProperty("locationActivity");
    expect(state).not.toHaveProperty("overallActivity");
    expect(analytics.estimate.totalEvidence).toBeCloseTo(4.96, 10);
    expect(analytics.estimate.estimatedRabbits).toBe(5);
    expect(analytics.confidence).toBe(73);
    expect(analytics.overallActivity).toBe("moderate");
    expect(
      analytics.signalContributions.reduce(
        (total, contribution) => total + contribution.contribution,
        0,
      ),
    ).toBeCloseTo(100, 10);
  });

  it("вычисляет preview отдельно и не меняет confidence из-за sensitivity", () => {
    const state = createDefaultAppState();
    const previewState = appStateReducer(state, {
      type: "scenario/updatePreview",
      payload: { modelSettings: { sensitivity: 1.5 } },
    });
    const baseAnalytics = deriveAnalytics(previewState);
    const previewAnalytics = deriveScenarioAnalytics(previewState);

    expect(baseAnalytics.estimate.estimatedRabbits).toBe(5);
    expect(previewAnalytics.estimate.estimatedRabbits).toBe(7);
    expect(previewAnalytics.confidence).toBe(baseAnalytics.confidence);
    expect(previewState.modelSettings.sensitivity).toBe(1);
  });

  it("empty scenario возвращает нулевые estimate и confidence", () => {
    const previewState = appStateReducer(createDefaultAppState(), {
      type: "scenario/updatePreview",
      payload: { signals: [] },
    });
    const analytics = deriveScenarioAnalytics(previewState);

    expect(analytics.estimate).toEqual({ totalEvidence: 0, estimatedRabbits: 0 });
    expect(analytics.confidence).toBe(0);
    expect(analytics.overallActivity).toBe("none");
    expect(analytics.eventContributions).toEqual([]);
    expect(analytics.locationActivity).toEqual([]);
  });
});

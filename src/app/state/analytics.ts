import {
  aggregateLocationActivity,
  buildRecommendations,
  calculateConfidence,
  calculateEstimate,
  calculateEventContributions,
  calculateSignalContributions,
  classifyOverallActivity,
  findLatestObservation,
  findStrongestEvidence,
} from "../../domain";
import type {
  EstimationResult,
  EventContribution,
  LocationActivity,
  OverallActivityLevel,
  Recommendation,
  SignalContribution,
  SignalEvent,
  StrongestEvidence,
} from "../../domain";
import type { AppState, ModelSettings, ScenarioPreview } from "./types";

type AnalyticsSource = Pick<ScenarioPreview, "signals" | "modelSettings">;

export interface DerivedAnalytics {
  readonly estimate: EstimationResult;
  readonly confidence: number;
  readonly eventContributions: readonly EventContribution[];
  readonly signalContributions: readonly SignalContribution[];
  readonly recommendations: readonly Recommendation[];
  readonly locationActivity: readonly LocationActivity[];
  readonly overallActivity: OverallActivityLevel;
  readonly latestObservation: SignalEvent | null;
  readonly strongestEvidence: StrongestEvidence | null;
}

function estimationOptions(modelSettings: ModelSettings) {
  return {
    sensitivity: modelSettings.sensitivity,
    weights: modelSettings.weights,
  };
}

export function deriveAnalytics(source: AnalyticsSource): DerivedAnalytics {
  const options = estimationOptions(source.modelSettings);
  const estimate = calculateEstimate(source.signals, options);

  return {
    estimate,
    confidence: calculateConfidence(source.signals),
    eventContributions: calculateEventContributions(
      source.signals,
      source.modelSettings.weights,
    ),
    signalContributions: calculateSignalContributions(
      source.signals,
      source.modelSettings.weights,
    ),
    recommendations: buildRecommendations(source.signals, options),
    locationActivity: aggregateLocationActivity(
      source.signals,
      source.modelSettings.weights,
    ),
    overallActivity: classifyOverallActivity(estimate.estimatedRabbits),
    latestObservation: findLatestObservation(source.signals),
    strongestEvidence: findStrongestEvidence(
      source.signals,
      source.modelSettings.weights,
    ),
  };
}

export function deriveScenarioAnalytics(state: AppState): DerivedAnalytics {
  return deriveAnalytics(state.scenarioPreview ?? state);
}

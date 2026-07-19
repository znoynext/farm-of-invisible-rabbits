import { calculateConfidence } from "./confidence";
import { DEFAULT_SIGNAL_WEIGHTS } from "./constants";
import {
  calculateEstimate,
  calculateEventImpact,
  type EstimationOptions,
} from "./estimation";
import type { SignalEvent, SignalWeights } from "./types";

export type RecommendationKind =
  | "inspect_new_hole"
  | "inspect_motion"
  | "increase_observation"
  | "collect_observations"
  | "protect_crops"
  | "continue_observation";

export interface Recommendation {
  readonly id: string;
  readonly kind: RecommendationKind;
  readonly message: string;
  readonly location?: string;
}
interface RankedRecommendation {
  readonly recommendation: Recommendation;
  readonly productPriority: number;
  readonly relevantImpact: number;
  readonly stableKey: string;
}

const MAX_RECOMMENDATIONS = 3;

const PRODUCT_PRIORITY: Readonly<Record<RecommendationKind, number>> = {
  protect_crops: 500,
  collect_observations: 400,
  inspect_new_hole: 300,
  inspect_motion: 250,
  increase_observation: 200,
  continue_observation: 0,
};

function compareStableKeys(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function compareRecommendations(
  left: RankedRecommendation,
  right: RankedRecommendation,
): number {
  if (left.productPriority !== right.productPriority) {
    return right.productPriority - left.productPriority;
  }

  if (left.relevantImpact !== right.relevantImpact) {
    return right.relevantImpact - left.relevantImpact;
  }

  return compareStableKeys(left.stableKey, right.stableKey);
}

function createCandidate(
  recommendation: Recommendation,
  relevantImpact: number,
): RankedRecommendation {
  return {
    recommendation,
    productPriority: PRODUCT_PRIORITY[recommendation.kind],
    relevantImpact,
    stableKey: recommendation.id,
  };
}

function addLocationCandidates(
  candidates: RankedRecommendation[],
  signals: readonly SignalEvent[],
  weights: SignalWeights,
  predicate: (signal: SignalEvent) => boolean,
  buildRecommendation: (location: string) => Recommendation,
): void {
  const impactByLocation = new Map<string, number>();

  for (const signal of signals) {
    if (predicate(signal)) {
      const currentImpact = impactByLocation.get(signal.location) ?? 0;
      impactByLocation.set(
        signal.location,
        currentImpact + calculateEventImpact(signal, weights),
      );
    }
  }

  for (const [location, impact] of impactByLocation) {
    candidates.push(createCandidate(buildRecommendation(location), impact));
  }
}

export function buildRecommendations(
  signals: readonly SignalEvent[],
  estimationOptions: EstimationOptions = {},
): Recommendation[] {
  if (signals.length === 0) {
    return [
      {
        id: "continue-observation",
        kind: "continue_observation",
        message: "Значимых сигналов нет — продолжить наблюдение.",
      },
    ];
  }

  const weights = estimationOptions.weights ?? DEFAULT_SIGNAL_WEIGHTS;
  const candidates: RankedRecommendation[] = [];

  addLocationCandidates(
    candidates,
    signals,
    weights,
    (signal) => signal.event === "new_hole" && signal.intensity >= 6,
    (location) => ({
      id: `inspect-new-hole:${location}`,
      kind: "inspect_new_hole",
      location,
      message: `Проверить зону «${location}»: обнаружена новая ямка высокой интенсивности.`,
    }),
  );

  addLocationCandidates(
    candidates,
    signals,
    weights,
    (signal) => signal.event === "motion_sensor" && signal.intensity >= 7,
    (location) => ({
      id: `inspect-motion:${location}`,
      kind: "inspect_motion",
      location,
      message: `Проверить место срабатывания «${location}»: зафиксировано интенсивное движение.`,
    }),
  );

  addLocationCandidates(
    candidates,
    signals,
    weights,
    (signal) => signal.event === "missing_carrot" && signal.count >= 5,
    (location) => ({
      id: `increase-observation:${location}`,
      kind: "increase_observation",
      location,
      message: `Усилить наблюдение в зоне «${location}»: пропало не менее пяти морковок.`,
    }),
  );

  const confidence = calculateConfidence(signals);
  const { estimatedRabbits } = calculateEstimate(signals, estimationOptions);

  if (confidence < 50) {
    candidates.push(
      createCandidate(
        {
          id: "collect-observations",
          kind: "collect_observations",
          message: "Собрать дополнительные наблюдения для более надёжной оценки.",
        },
        50 - confidence,
      ),
    );
  }

  if (estimatedRabbits >= 8) {
    candidates.push(
      createCandidate(
        {
          id: "protect-crops",
          kind: "protect_crops",
          message: "Усилить защиту урожая: оценка достигла восьми кроликов.",
        },
        estimatedRabbits,
      ),
    );
  }

  if (candidates.length === 0) {
    return [
      {
        id: "continue-observation",
        kind: "continue_observation",
        message: "Значимых сигналов нет — продолжить наблюдение.",
      },
    ];
  }

  return candidates
    .sort(compareRecommendations)
    .slice(0, MAX_RECOMMENDATIONS)
    .map(({ recommendation }) => recommendation);
}

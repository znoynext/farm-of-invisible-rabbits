import { DEFAULT_SIGNAL_WEIGHTS } from "./constants";
import { calculateEventImpact, calculateTotalEvidence } from "./estimation";
import { classifyLocationActivity } from "./activity";
import type { LocationActivityLevel } from "./activity";
import type { SignalEvent, SignalWeights } from "./types";

export interface LocationActivity {
  readonly location: string;
  readonly eventCount: number;
  readonly observedCount: number;
  readonly totalImpact: number;
  readonly contribution: number;
  readonly activityLevel: LocationActivityLevel;
}

interface MutableLocationActivity {
  location: string;
  eventCount: number;
  observedCount: number;
  totalImpact: number;
}

function compareLocationActivity(
  left: LocationActivity,
  right: LocationActivity,
): number {
  if (left.totalImpact !== right.totalImpact) {
    return right.totalImpact - left.totalImpact;
  }

  return left.location < right.location ? -1 : left.location > right.location ? 1 : 0;
}

export function aggregateLocationActivity(
  signals: readonly SignalEvent[],
  weights: SignalWeights = DEFAULT_SIGNAL_WEIGHTS,
): LocationActivity[] {
  const totalEvidence = calculateTotalEvidence(signals, weights);
  const activityByLocation = new Map<string, MutableLocationActivity>();

  for (const signal of signals) {
    const current = activityByLocation.get(signal.location) ?? {
      location: signal.location,
      eventCount: 0,
      observedCount: 0,
      totalImpact: 0,
    };

    current.eventCount += 1;
    current.observedCount += signal.count;
    current.totalImpact += calculateEventImpact(signal, weights);
    activityByLocation.set(signal.location, current);
  }

  return [...activityByLocation.values()]
    .map((activity) => ({
      ...activity,
      contribution:
        totalEvidence === 0 ? 0 : (activity.totalImpact / totalEvidence) * 100,
      activityLevel: classifyLocationActivity(activity.totalImpact),
    }))
    .sort(compareLocationActivity);
}

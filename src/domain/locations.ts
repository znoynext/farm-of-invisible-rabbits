import { DEFAULT_SIGNAL_WEIGHTS, SUPPORTED_SIGNAL_TYPES } from "./constants";
import { calculateEventImpact, calculateTotalEvidence } from "./estimation";
import { classifyLocationActivity } from "./activity";
import type { LocationActivityLevel } from "./activity";
import type { SignalEvent, SignalType, SignalWeights } from "./types";

export interface LocationActivity {
  readonly location: string;
  readonly eventCount: number;
  readonly observedCount: number;
  readonly totalImpact: number;
  readonly contribution: number;
  readonly activityLevel: LocationActivityLevel;
  readonly signalTypes: readonly SignalType[];
  readonly strongestSignal: SignalEvent;
}

interface MutableLocationActivity {
  location: string;
  eventCount: number;
  observedCount: number;
  totalImpact: number;
  signalTypes: Set<SignalType>;
  strongestImpact: number;
  strongestSignal: SignalEvent;
}

const signalTypeOrder = new Map(
  SUPPORTED_SIGNAL_TYPES.map((signalType, index) => [signalType, index]),
);

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
    const signalImpact = calculateEventImpact(signal, weights);
    const current = activityByLocation.get(signal.location) ?? {
      location: signal.location,
      eventCount: 0,
      observedCount: 0,
      totalImpact: 0,
      signalTypes: new Set<SignalType>(),
      strongestImpact: Number.NEGATIVE_INFINITY,
      strongestSignal: signal,
    };

    current.eventCount += 1;
    current.observedCount += signal.count;
    current.totalImpact += signalImpact;
    current.signalTypes.add(signal.event);

    if (
      signalImpact > current.strongestImpact ||
      (signalImpact === current.strongestImpact &&
        signal.id < current.strongestSignal.id)
    ) {
      current.strongestImpact = signalImpact;
      current.strongestSignal = signal;
    }

    activityByLocation.set(signal.location, current);
  }

  return [...activityByLocation.values()]
    .map((activity) => {
      return {
        location: activity.location,
        eventCount: activity.eventCount,
        observedCount: activity.observedCount,
        totalImpact: activity.totalImpact,
        strongestSignal: activity.strongestSignal,
        contribution:
          totalEvidence === 0 ? 0 : (activity.totalImpact / totalEvidence) * 100,
        activityLevel: classifyLocationActivity(activity.totalImpact),
        signalTypes: [...activity.signalTypes].sort(
          (left, right) =>
            (signalTypeOrder.get(left) ?? 0) - (signalTypeOrder.get(right) ?? 0),
        ),
      };
    })
    .sort(compareLocationActivity);
}

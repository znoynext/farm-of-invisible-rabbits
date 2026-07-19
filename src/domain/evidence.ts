import { DEFAULT_SIGNAL_WEIGHTS } from "./constants";
import { calculateEventContributions } from "./contributions";
import type { SignalEvent, SignalWeights } from "./types";

export interface StrongestEvidence {
  readonly signal: SignalEvent;
  readonly impact: number;
  readonly contribution: number;
}

export function findLatestObservation(
  signals: readonly SignalEvent[],
): SignalEvent | null {
  return signals.reduce<SignalEvent | null>((latest, signal) => {
    if (!latest) {
      return signal;
    }

    if (signal.time !== latest.time) {
      return signal.time > latest.time ? signal : latest;
    }

    return signal.id > latest.id ? signal : latest;
  }, null);
}

export function findStrongestEvidence(
  signals: readonly SignalEvent[],
  weights: SignalWeights = DEFAULT_SIGNAL_WEIGHTS,
): StrongestEvidence | null {
  const contributions = calculateEventContributions(signals, weights);

  return contributions.reduce<StrongestEvidence | null>(
    (strongest, contribution, index) => {
      const signal = signals[index];

      if (!signal || contribution.impact <= 0) {
        return strongest;
      }

      if (
        !strongest ||
        contribution.impact > strongest.impact ||
        (contribution.impact === strongest.impact && signal.id < strongest.signal.id)
      ) {
        return {
          signal,
          impact: contribution.impact,
          contribution: contribution.contribution,
        };
      }

      return strongest;
    },
    null,
  );
}

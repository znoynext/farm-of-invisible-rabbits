import { DEFAULT_SIGNAL_WEIGHTS } from "./constants";
import { calculateEventImpact } from "./estimation";
import type { SignalEvent, SignalWeights } from "./types";

export interface ImpactfulObservation {
  readonly signal: SignalEvent;
  readonly impact: number;
}

export function findMostImpactfulObservation(
  signals: readonly SignalEvent[],
  weights: SignalWeights = DEFAULT_SIGNAL_WEIGHTS,
): ImpactfulObservation | null {
  return signals.reduce<ImpactfulObservation | null>((strongest, signal) => {
    const impact = calculateEventImpact(signal, weights);

    if (!strongest || impact > strongest.impact) {
      return { signal, impact };
    }

    if (impact === strongest.impact && signal.id < strongest.signal.id) {
      return { signal, impact };
    }

    return strongest;
  }, null);
}

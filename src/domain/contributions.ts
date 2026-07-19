import { DEFAULT_SIGNAL_WEIGHTS, SUPPORTED_SIGNAL_TYPES } from "./constants";
import { calculateEventImpact, calculateTotalEvidence } from "./estimation";
import type { SignalEvent, SignalType, SignalWeights } from "./types";

export interface EventContribution {
  readonly eventId: string;
  readonly signalType: SignalType;
  readonly impact: number;
  readonly contribution: number;
}
export interface SignalContribution {
  readonly signalType: SignalType;
  readonly impact: number;
  readonly contribution: number;
}

export function calculateEventContributions(
  signals: readonly SignalEvent[],
  weights: SignalWeights = DEFAULT_SIGNAL_WEIGHTS,
): EventContribution[] {
  const totalEvidence = calculateTotalEvidence(signals, weights);

  return signals.map((signal) => {
    const impact = calculateEventImpact(signal, weights);

    return {
      eventId: signal.id,
      signalType: signal.event,
      impact,
      contribution: totalEvidence === 0 ? 0 : (impact / totalEvidence) * 100,
    };
  });
}

export function calculateSignalContributions(
  signals: readonly SignalEvent[],
  weights: SignalWeights = DEFAULT_SIGNAL_WEIGHTS,
): SignalContribution[] {
  const eventContributions = calculateEventContributions(signals, weights);
  const totalEvidence = eventContributions.reduce(
    (total, contribution) => total + contribution.impact,
    0,
  );

  return SUPPORTED_SIGNAL_TYPES.map((signalType) => {
    const impact = eventContributions.reduce(
      (total, contribution) =>
        contribution.signalType === signalType ? total + contribution.impact : total,
      0,
    );

    return {
      signalType,
      impact,
      contribution: totalEvidence === 0 ? 0 : (impact / totalEvidence) * 100,
    };
  });
}

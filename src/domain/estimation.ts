import { DEFAULT_SENSITIVITY, DEFAULT_SIGNAL_WEIGHTS } from "./constants";
import type { SignalEvent, SignalWeights } from "./types";

export interface EstimationOptions {
  readonly sensitivity?: number;
  readonly weights?: SignalWeights;
}
export interface EstimationResult {
  readonly totalEvidence: number;
  readonly estimatedRabbits: number;
}

export function calculateEffectiveCount(count: number): number {
  return count <= 5 ? count : 5 + Math.sqrt(count - 5);
}

export function calculateEventImpact(
  signal: SignalEvent,
  weights: SignalWeights = DEFAULT_SIGNAL_WEIGHTS,
): number {
  const intensityFactor = signal.intensity / 10;

  return calculateEffectiveCount(signal.count) * weights[signal.event] * intensityFactor;
}

export function calculateTotalEvidence(
  signals: readonly SignalEvent[],
  weights: SignalWeights = DEFAULT_SIGNAL_WEIGHTS,
): number {
  return signals.reduce(
    (total, signal) => total + calculateEventImpact(signal, weights),
    0,
  );
}

export function calculateEstimate(
  signals: readonly SignalEvent[],
  options: EstimationOptions = {},
): EstimationResult {
  const weights = options.weights ?? DEFAULT_SIGNAL_WEIGHTS;
  const sensitivity = options.sensitivity ?? DEFAULT_SENSITIVITY;
  const totalEvidence = calculateTotalEvidence(signals, weights);

  return {
    totalEvidence,
    estimatedRabbits: Math.max(0, Math.round(totalEvidence * sensitivity)),
  };
}

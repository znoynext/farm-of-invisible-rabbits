import type { SignalEvent } from "./types";

export function calculateConfidence(signals: readonly SignalEvent[]): number {
  if (signals.length === 0) {
    return 0;
  }

  const uniqueSignalTypes = new Set(signals.map((signal) => signal.event)).size;
  const uniqueLocations = new Set(signals.map((signal) => signal.location)).size;
  const averageIntensity =
    signals.reduce((total, signal) => total + signal.intensity, 0) / signals.length;

  const diversity = Math.min(uniqueSignalTypes / 4, 1);
  const coverage = Math.min(uniqueLocations / 3, 1);
  const volume = Math.min(signals.length / 5, 1);
  const strength = averageIntensity / 10;
  const confidence = Math.round(
    diversity * 30 + coverage * 20 + volume * 25 + strength * 25,
  );

  return Math.min(100, Math.max(0, confidence));
}

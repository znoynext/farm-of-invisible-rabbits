import { DEFAULT_SIGNAL_WEIGHTS, SUPPORTED_SIGNAL_TYPES } from "./constants";
import {
  calculateEventContributions,
  calculateSignalContributions,
} from "./contributions";
import { calculateEffectiveCount } from "./estimation";
import type { SignalEvent, SignalType, SignalWeights } from "./types";

export interface DominantEvidence {
  readonly signalType: SignalType;
  readonly impact: number;
  readonly contribution: number;
  readonly strongestLocation?: string;
}

export type EvidenceStrength = "dominant" | "strong" | "supporting";

export interface EvidenceEventDetail {
  readonly signal: SignalEvent;
  readonly effectiveCount: number;
  readonly intensityFactor: number;
  readonly weight: number;
  readonly impact: number;
  readonly contribution: number;
}

export interface SignalEvidenceGroup {
  readonly signalType: SignalType;
  readonly impact: number;
  readonly contribution: number;
  readonly strength: EvidenceStrength;
  readonly locations: readonly string[];
  readonly events: readonly EvidenceEventDetail[];
}

interface LocationImpact {
  readonly location: string;
  readonly impact: number;
}

const signalTypeOrder = new Map(
  SUPPORTED_SIGNAL_TYPES.map((signalType, index) => [signalType, index]),
);

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

export function findDominantEvidence(
  signals: readonly SignalEvent[],
  weights: SignalWeights = DEFAULT_SIGNAL_WEIGHTS,
): DominantEvidence | null {
  const dominantContribution = calculateSignalContributions(signals, weights).reduce<
    ReturnType<typeof calculateSignalContributions>[number] | null
  >((dominant, contribution) => {
    if (contribution.impact <= 0) {
      return dominant;
    }

    if (!dominant || contribution.impact > dominant.impact) {
      return contribution;
    }

    return dominant;
  }, null);

  if (!dominantContribution) {
    return null;
  }

  const locationImpacts = aggregateLocationImpacts(
    signals,
    weights,
    dominantContribution.signalType,
  );
  const strongestLocation = resolveClearlyDominantLocation(locationImpacts);

  return {
    signalType: dominantContribution.signalType,
    impact: dominantContribution.impact,
    contribution: dominantContribution.contribution,
    ...(strongestLocation ? { strongestLocation } : {}),
  };
}

export function buildSignalEvidenceGroups(
  signals: readonly SignalEvent[],
  weights: SignalWeights = DEFAULT_SIGNAL_WEIGHTS,
): SignalEvidenceGroup[] {
  const eventContributions = calculateEventContributions(signals, weights);
  const signalContributions = calculateSignalContributions(signals, weights);
  const dominant = findDominantEvidence(signals, weights);
  const observedTypes = new Set(signals.map((signal) => signal.event));
  const positiveContributions = signalContributions
    .filter(({ impact }) => impact > 0)
    .sort(compareSignalContributions);
  const strongSignalType = positiveContributions.find(
    ({ signalType }) => signalType !== dominant?.signalType,
  )?.signalType;

  return signalContributions
    .filter(({ signalType }) => observedTypes.has(signalType))
    .sort(compareSignalContributions)
    .map((signalContribution) => {
      const events = signals.flatMap((signal, index) => {
        if (signal.event !== signalContribution.signalType) {
          return [];
        }

        const eventContribution = eventContributions[index];

        if (!eventContribution) {
          return [];
        }

        return [{
          signal,
          effectiveCount: calculateEffectiveCount(signal.count),
          intensityFactor: signal.intensity / 10,
          weight: weights[signal.event],
          impact: eventContribution.impact,
          contribution: eventContribution.contribution,
        }];
      });

      return {
        ...signalContribution,
        strength:
          signalContribution.signalType === dominant?.signalType
            ? "dominant"
            : signalContribution.signalType === strongSignalType
              ? "strong"
              : "supporting",
        locations: aggregateLocationImpacts(
          signals,
          weights,
          signalContribution.signalType,
        ).map(({ location }) => location),
        events,
      };
    });
}

function aggregateLocationImpacts(
  signals: readonly SignalEvent[],
  weights: SignalWeights,
  signalType: SignalType,
): LocationImpact[] {
  const impacts = new Map<string, number>();
  const eventContributions = calculateEventContributions(signals, weights);

  signals.forEach((signal, index) => {
    if (signal.event !== signalType) {
      return;
    }

    impacts.set(
      signal.location,
      (impacts.get(signal.location) ?? 0) + (eventContributions[index]?.impact ?? 0),
    );
  });

  return [...impacts.entries()]
    .map(([location, impact]) => ({ location, impact }))
    .sort((left, right) => {
      if (left.impact !== right.impact) {
        return right.impact - left.impact;
      }

      return compareText(left.location, right.location);
    });
}

function resolveClearlyDominantLocation(
  locations: readonly LocationImpact[],
): string | undefined {
  const strongest = locations[0];

  if (!strongest) {
    return undefined;
  }

  const next = locations[1];

  if (!next) {
    return strongest.location;
  }

  const totalImpact = locations.reduce((total, location) => total + location.impact, 0);
  const hasClearShare = totalImpact > 0 && strongest.impact / totalImpact >= 0.6;
  const hasClearLead = strongest.impact >= next.impact * 1.5;

  return hasClearShare && hasClearLead ? strongest.location : undefined;
}

function compareSignalContributions(
  left: ReturnType<typeof calculateSignalContributions>[number],
  right: ReturnType<typeof calculateSignalContributions>[number],
): number {
  if (left.impact !== right.impact) {
    return right.impact - left.impact;
  }

  return (
    (signalTypeOrder.get(left.signalType) ?? 0) -
    (signalTypeOrder.get(right.signalType) ?? 0)
  );
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

export type FarmMapPlacementKind = "canonical" | "other";

export interface FarmMapPlacement {
  readonly id: string;
  readonly kind: FarmMapPlacementKind;
  readonly x: number;
  readonly y: number;
  readonly mobileX: number;
  readonly mobileY: number;
}

const canonicalPlacements: Readonly<Record<string, FarmMapPlacement>> = {
  "огород": {
    id: "garden",
    kind: "canonical",
    x: 27,
    y: 37,
    mobileX: 28,
    mobileY: 32,
  },
  "у забора": {
    id: "fence",
    kind: "canonical",
    x: 64,
    y: 29,
    mobileX: 70,
    mobileY: 26,
  },
  "сарай": {
    id: "barn",
    kind: "canonical",
    x: 76,
    y: 68,
    mobileX: 66,
    mobileY: 70,
  },
};

function normalizeLocation(location: string): string {
  return location.trim().toLocaleLowerCase("ru-RU");
}

function hashLocation(location: string): number {
  let hash = 2166136261;

  for (const character of normalizeLocation(location)) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function resolveFarmMapPlacement(location: string): FarmMapPlacement {
  const normalized = normalizeLocation(location);
  const canonical = canonicalPlacements[normalized];

  if (canonical) {
    return canonical;
  }

  const hash = hashLocation(normalized);
  const x = 18 + (hash % 65);
  const y = 82 + ((hash >>> 8) % 8);

  return {
    id: `other-${hash.toString(36)}`,
    kind: "other",
    x,
    y,
    mobileX: 18 + ((hash >>> 4) % 65),
    mobileY: 86,
  };
}

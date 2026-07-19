import type { SignalType, SignalWeights } from "./types";

export const SUPPORTED_SIGNAL_TYPES = [
  "missing_carrot",
  "new_hole",
  "motion_sensor",
  "barn_rustling",
] as const satisfies readonly SignalType[];

export const DEFAULT_SIGNAL_WEIGHTS: SignalWeights = Object.freeze({
  missing_carrot: 0.7,
  new_hole: 1.4,
  motion_sensor: 2,
  barn_rustling: 1.1,
});

export const DEFAULT_SENSITIVITY = 1;

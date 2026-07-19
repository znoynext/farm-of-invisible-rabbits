export type SignalType =
  | "missing_carrot"
  | "new_hole"
  | "motion_sensor"
  | "barn_rustling";

export interface SignalEvent {
  readonly id: string;
  readonly event: SignalType;
  readonly location: string;
  readonly count: number;
  readonly intensity: number;
  readonly time: string;
}

export type SignalWeights = Readonly<Record<SignalType, number>>;

import type { SignalType } from "../../domain";

export const signalTypeLabels: Record<SignalType, string> = {
  missing_carrot: "Пропавшая морковь",
  new_hole: "Новая ямка",
  motion_sensor: "Датчик движения",
  barn_rustling: "Шорох",
};

export const signalTypeOptions = Object.entries(signalTypeLabels) as readonly [
  SignalType,
  string,
][];

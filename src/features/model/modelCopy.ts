import type { SignalType } from "../../domain";

export const modelSignalLabels: Record<SignalType, string> = {
  missing_carrot: "Пропавшая морковь",
  new_hole: "Новые ямки",
  motion_sensor: "Движение",
  barn_rustling: "Шорох",
};

export function describeWeight(weight: number): string {
  if (weight === 0) {
    return "Не учитывается";
  }

  if (weight <= 0.75) {
    return "Небольшое влияние";
  }

  if (weight <= 1.5) {
    return "Умеренное влияние";
  }

  if (weight <= 2.25) {
    return "Сильное влияние";
  }

  return "Очень сильное влияние";
}

export function describeSensitivity(sensitivity: number): string {
  if (sensitivity <= 0.8) {
    return "Осторожная";
  }

  if (sensitivity >= 1.2) {
    return "Чувствительная";
  }

  return "Сбалансированная";
}

export function formatModelValue(value: number): string {
  return value.toLocaleString("ru-RU", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  });
}

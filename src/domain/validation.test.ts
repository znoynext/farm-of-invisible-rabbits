import { initialSignals } from "../data/initialSignals";
import { DEFAULT_SIGNAL_WEIGHTS } from "./constants";
import {
  sensitivitySchema,
  signalDatasetSchema,
  signalEventSchema,
  signalWeightsSchema,
} from "./validation";

describe("domain validation", () => {
  it("принимает канонические данные и настройки", () => {
    expect(signalDatasetSchema.safeParse(initialSignals).success).toBe(true);
    expect(signalWeightsSchema.safeParse(DEFAULT_SIGNAL_WEIGHTS).success).toBe(true);
    expect(sensitivitySchema.safeParse(1).success).toBe(true);
  });

  it.each([
    ["неподдерживаемый тип", { ...initialSignals[0], event: "rabbit_seen" }],
    ["пустая локация", { ...initialSignals[0], location: " " }],
    ["отрицательный count", { ...initialSignals[0], count: -1 }],
    ["нулевой count", { ...initialSignals[0], count: 0 }],
    ["дробный count", { ...initialSignals[0], count: 1.5 }],
    ["нулевая intensity", { ...initialSignals[0], intensity: 0 }],
    ["intensity выше 10", { ...initialSignals[0], intensity: 11 }],
    ["нечисловая intensity", { ...initialSignals[0], intensity: Number.NaN }],
    ["невалидное время", { ...initialSignals[0], time: "25:61" }],
    ["лишнее поле", { ...initialSignals[0], secret: "unexpected" }],
  ])("отклоняет %s", (_caseName, value) => {
    expect(signalEventSchema.safeParse(value).success).toBe(false);
  });

  it("отклоняет повторяющиеся id", () => {
    expect(
      signalDatasetSchema.safeParse([initialSignals[0], { ...initialSignals[1], id: "evt_001" }])
        .success,
    ).toBe(false);
  });

  it.each([0, 3])("принимает граничный вес %s", (weight) => {
    expect(
      signalWeightsSchema.safeParse({
        ...DEFAULT_SIGNAL_WEIGHTS,
        motion_sensor: weight,
      }).success,
    ).toBe(true);
  });

  it.each([-0.01, 3.01])("отклоняет вес %s вне диапазона", (weight) => {
    expect(
      signalWeightsSchema.safeParse({
        ...DEFAULT_SIGNAL_WEIGHTS,
        motion_sensor: weight,
      }).success,
    ).toBe(false);
  });

  it("принимает дробную intensity в допустимом диапазоне", () => {
    expect(
      signalEventSchema.safeParse({ ...initialSignals[0], intensity: 4.5 }).success,
    ).toBe(true);
  });

  it("отклоняет неполные веса и sensitivity вне диапазона", () => {
    expect(
      signalWeightsSchema.safeParse({
        missing_carrot: 0.7,
        new_hole: 1.4,
        motion_sensor: 2,
      }).success,
    ).toBe(false);
    expect(sensitivitySchema.safeParse(0.49).success).toBe(false);
    expect(sensitivitySchema.safeParse(1.51).success).toBe(false);
  });
});

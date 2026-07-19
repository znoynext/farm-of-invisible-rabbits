import { initialSignals } from "../../data/initialSignals";
import { DEFAULT_SENSITIVITY, DEFAULT_SIGNAL_WEIGHTS } from "../../domain";
import type { SignalEvent } from "../../domain";
import { createDefaultAppState } from "./defaults";
import { appStateReducer } from "./reducer";

const addedSignal: SignalEvent = {
  id: "evt_004",
  event: "barn_rustling",
  location: "Амбар",
  count: 3,
  intensity: 6,
  time: "11:20",
};

describe("appStateReducer", () => {
  it("добавляет сигнал и не допускает повторяющийся id", () => {
    const initialState = createDefaultAppState();
    const addedState = appStateReducer(initialState, {
      type: "signal/add",
      payload: addedSignal,
    });
    const duplicateState = appStateReducer(addedState, {
      type: "signal/add",
      payload: addedSignal,
    });

    expect(addedState.signals).toHaveLength(initialSignals.length + 1);
    expect(addedState.signals.at(-1)).toEqual(addedSignal);
    expect(duplicateState).toBe(addedState);
  });

  it("отклоняет сигналы с нулевыми count или intensity", () => {
    const initialState = createDefaultAppState();
    const zeroCountState = appStateReducer(initialState, {
      type: "signal/add",
      payload: { ...addedSignal, count: 0 },
    });
    const zeroIntensityState = appStateReducer(initialState, {
      type: "signal/add",
      payload: { ...addedSignal, intensity: 0 },
    });

    expect(zeroCountState).toBe(initialState);
    expect(zeroIntensityState).toBe(initialState);
  });

  it("обновляет существующий сигнал", () => {
    const initialState = createDefaultAppState();
    const updatedSignal = { ...initialSignals[0]!, intensity: 9 };
    const state = appStateReducer(initialState, {
      type: "signal/update",
      payload: updatedSignal,
    });

    expect(state.signals.find((signal) => signal.id === updatedSignal.id)).toEqual(
      updatedSignal,
    );
    expect(initialState.signals[0]?.intensity).toBe(4);
  });

  it("удаляет один или все сигналы", () => {
    const initialState = createDefaultAppState();
    const withoutOne = appStateReducer(initialState, {
      type: "signal/delete",
      payload: { id: "evt_002" },
    });
    const withoutAll = appStateReducer(withoutOne, { type: "signals/deleteAll" });

    expect(withoutOne.signals.map(({ id }) => id)).toEqual(["evt_001", "evt_003"]);
    expect(withoutAll.signals).toEqual([]);
  });

  it("восстанавливает стартовые сигналы", () => {
    const emptyState = appStateReducer(createDefaultAppState(), {
      type: "signals/deleteAll",
    });
    const resetState = appStateReducer(emptyState, { type: "signals/reset" });

    expect(resetState.signals).toEqual(initialSignals);
    expect(resetState.signals).not.toBe(initialSignals);
  });

  it("обновляет и сбрасывает настройки модели", () => {
    const changedState = appStateReducer(createDefaultAppState(), {
      type: "modelSettings/update",
      payload: {
        sensitivity: 1.5,
        weights: { new_hole: 2.4 },
      },
    });
    const resetState = appStateReducer(changedState, { type: "modelSettings/reset" });

    expect(changedState.modelSettings).toEqual({
      sensitivity: 1.5,
      weights: { ...DEFAULT_SIGNAL_WEIGHTS, new_hole: 2.4 },
    });
    expect(resetState.modelSettings).toEqual({
      sensitivity: DEFAULT_SENSITIVITY,
      weights: DEFAULT_SIGNAL_WEIGHTS,
    });
  });

  it("отклоняет обновление модели с весом выше трёх", () => {
    const initialState = createDefaultAppState();
    const state = appStateReducer(initialState, {
      type: "modelSettings/update",
      payload: { weights: { motion_sensor: 3.01 } },
    });

    expect(state).toBe(initialState);
  });

  it("держит scenario preview изолированным от основного state", () => {
    const initialState = createDefaultAppState();
    const previewState = appStateReducer(initialState, {
      type: "scenario/updatePreview",
      payload: {
        signals: [addedSignal],
        modelSettings: { sensitivity: 1.5 },
      },
    });

    expect(previewState.signals).toEqual(initialSignals);
    expect(previewState.modelSettings.sensitivity).toBe(DEFAULT_SENSITIVITY);
    expect(previewState.scenarioPreview).toMatchObject({
      signals: [addedSignal],
      modelSettings: { sensitivity: 1.5 },
    });

    const resetState = appStateReducer(previewState, { type: "scenario/reset" });
    expect(resetState.scenarioPreview).toBeNull();
    expect(resetState.signals).toEqual(initialSignals);
  });

  it("применяет scenario preview одним предсказуемым переходом", () => {
    const previewState = appStateReducer(createDefaultAppState(), {
      type: "scenario/updatePreview",
      payload: {
        signals: [addedSignal],
        modelSettings: {
          sensitivity: 1.5,
          weights: { barn_rustling: 1.8 },
        },
      },
    });
    const appliedState = appStateReducer(previewState, { type: "scenario/apply" });

    expect(appliedState.signals).toEqual([addedSignal]);
    expect(appliedState.modelSettings).toEqual({
      sensitivity: 1.5,
      weights: { ...DEFAULT_SIGNAL_WEIGHTS, barn_rustling: 1.8 },
    });
    expect(appliedState.scenarioPreview).toBeNull();
  });

  it("What-if apply изменяет observation data, но сохраняет model settings", () => {
    const configuredState = appStateReducer(createDefaultAppState(), {
      type: "modelSettings/update",
      payload: {
        sensitivity: 1.2,
        weights: { motion_sensor: 2.8 },
      },
    });
    const whatIfSignal = { ...initialSignals[2]!, intensity: 10 };
    const previewState = appStateReducer(configuredState, {
      type: "scenario/updateObservations",
      payload: { signals: [whatIfSignal] },
    });
    const appliedState = appStateReducer(previewState, {
      type: "scenario/applyObservations",
    });

    expect(previewState.scenarioPreview?.modelSettings).toEqual(
      configuredState.modelSettings,
    );
    expect(appliedState.signals).toEqual([whatIfSignal]);
    expect(appliedState.modelSettings).toEqual(configuredState.modelSettings);
    expect(appliedState.scenarioPreview).toBeNull();
  });

  it("хранит hasSeenIntro отдельно от продуктовых данных", () => {
    const state = appStateReducer(createDefaultAppState(), {
      type: "ui/introSeen",
      payload: true,
    });

    expect(state.uiPreferences.hasSeenIntro).toBe(true);
    expect(state.signals).toEqual(initialSignals);
  });
});

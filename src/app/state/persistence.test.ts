import { initialSignals } from "../../data/initialSignals";
import { DEFAULT_SIGNAL_WEIGHTS } from "../../domain";
import { createDefaultAppState, createDefaultPersistedState } from "./defaults";
import {
  loadAppState,
  loadPersistedState,
  PERSISTED_STATE_KEY,
  savePersistedState,
  saveUiPreferences,
  type StorageAdapter,
  UI_PREFERENCES_KEY,
} from "./persistence";
import { appStateReducer } from "./reducer";

class MemoryStorage implements StorageAdapter {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

describe("versioned persistence", () => {
  it("сохраняет и восстанавливает валидный state", () => {
    const storage = new MemoryStorage();
    const state = {
      ...createDefaultPersistedState(),
      signals: [initialSignals[2]!],
      modelSettings: {
        sensitivity: 1.3,
        weights: { ...DEFAULT_SIGNAL_WEIGHTS, motion_sensor: 2.5 },
      },
    };

    expect(savePersistedState(storage, state)).toBe(true);
    expect(loadPersistedState(storage)).toEqual(state);
  });

  it("восстанавливает defaults после corrupted JSON", () => {
    const storage = new MemoryStorage();
    storage.setItem(PERSISTED_STATE_KEY, "{not-json");

    expect(loadPersistedState(storage)).toEqual(createDefaultPersistedState());
  });

  it.each([
    [
      "несовместимой schemaVersion",
      { ...createDefaultPersistedState(), schemaVersion: 2 },
    ],
    ["отсутствующих полей", { schemaVersion: 1, signals: initialSignals }],
    [
      "невалидных значений",
      {
        ...createDefaultPersistedState(),
        signals: [{ ...initialSignals[0]!, count: -1 }],
      },
    ],
    [
      "нулевом count",
      {
        ...createDefaultPersistedState(),
        signals: [{ ...initialSignals[0]!, count: 0 }],
      },
    ],
    [
      "нулевой intensity",
      {
        ...createDefaultPersistedState(),
        signals: [{ ...initialSignals[0]!, intensity: 0 }],
      },
    ],
    [
      "весе модели выше трёх",
      {
        ...createDefaultPersistedState(),
        modelSettings: {
          ...createDefaultPersistedState().modelSettings,
          weights: { ...DEFAULT_SIGNAL_WEIGHTS, motion_sensor: 3.01 },
        },
      },
    ],
  ])("восстанавливает defaults при %s", (_caseName, value) => {
    const storage = new MemoryStorage();
    storage.setItem(PERSISTED_STATE_KEY, JSON.stringify(value));

    expect(loadPersistedState(storage)).toEqual(createDefaultPersistedState());
  });

  it("не включает UI preferences и scenario preview в основной persisted state", () => {
    const storage = new MemoryStorage();
    const withIntro = appStateReducer(createDefaultAppState(), {
      type: "ui/introSeen",
      payload: true,
    });
    const withPreview = appStateReducer(withIntro, {
      type: "scenario/updatePreview",
      payload: { signals: [] },
    });

    expect(savePersistedState(storage, withPreview)).toBe(true);
    expect(saveUiPreferences(storage, withPreview.uiPreferences)).toBe(true);

    const persistedValue = JSON.parse(storage.getItem(PERSISTED_STATE_KEY) ?? "null");
    const uiValue = JSON.parse(storage.getItem(UI_PREFERENCES_KEY) ?? "null");

    expect(Object.keys(persistedValue).sort()).toEqual([
      "modelSettings",
      "schemaVersion",
      "signals",
    ]);
    expect(persistedValue).not.toHaveProperty("scenarioPreview");
    expect(persistedValue).not.toHaveProperty("uiPreferences");
    expect(uiValue).toEqual({ hasSeenIntro: true });

    const restoredState = loadAppState(storage);
    expect(restoredState.uiPreferences.hasSeenIntro).toBe(true);
    expect(restoredState.scenarioPreview).toBeNull();
  });

  it("безопасно обрабатывает недоступное storage", () => {
    expect(loadAppState(null)).toEqual(createDefaultAppState());
    expect(savePersistedState(null, createDefaultPersistedState())).toBe(false);
    expect(saveUiPreferences(null, { hasSeenIntro: true })).toBe(false);
  });
});

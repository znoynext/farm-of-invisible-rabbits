import { initialSignals } from "../../data/initialSignals";
import { DEFAULT_SENSITIVITY, DEFAULT_SIGNAL_WEIGHTS } from "../../domain";
import type { SignalEvent } from "../../domain";
import {
  STATE_SCHEMA_VERSION,
  type AppState,
  type ModelSettings,
  type PersistedState,
  type UiPreferences,
} from "./types";

function cloneSignals(signals: readonly SignalEvent[]): SignalEvent[] {
  return signals.map((signal) => ({ ...signal }));
}
export function cloneModelSettings(settings: ModelSettings): ModelSettings {
  return {
    sensitivity: settings.sensitivity,
    weights: { ...settings.weights },
  };
}

export function createDefaultModelSettings(): ModelSettings {
  return {
    sensitivity: DEFAULT_SENSITIVITY,
    weights: { ...DEFAULT_SIGNAL_WEIGHTS },
  };
}

export function createDefaultPersistedState(): PersistedState {
  return {
    schemaVersion: STATE_SCHEMA_VERSION,
    signals: cloneSignals(initialSignals),
    modelSettings: createDefaultModelSettings(),
  };
}

export function createDefaultUiPreferences(): UiPreferences {
  return { hasSeenIntro: false };
}

export function createDefaultAppState(): AppState {
  return {
    ...createDefaultPersistedState(),
    uiPreferences: createDefaultUiPreferences(),
    scenarioPreview: null,
  };
}

export function clonePersistedState(state: PersistedState): PersistedState {
  return {
    schemaVersion: STATE_SCHEMA_VERSION,
    signals: cloneSignals(state.signals),
    modelSettings: cloneModelSettings(state.modelSettings),
  };
}

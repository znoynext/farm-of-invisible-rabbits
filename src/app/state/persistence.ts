import {
  clonePersistedState,
  createDefaultPersistedState,
  createDefaultUiPreferences,
} from "./defaults";
import { persistedStateSchema, uiPreferencesSchema } from "./schemas";
import type { AppState, PersistedState, UiPreferences } from "./types";

export const PERSISTED_STATE_KEY = "farm-of-invisible-rabbits:v1";
export const UI_PREFERENCES_KEY = "farm-of-invisible-rabbits:ui:v1";

export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export function getBrowserStorage(): StorageAdapter | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadPersistedState(storage: StorageAdapter | null): PersistedState {
  if (!storage) {
    return createDefaultPersistedState();
  }

  try {
    const rawValue = storage.getItem(PERSISTED_STATE_KEY);

    if (!rawValue) {
      return createDefaultPersistedState();
    }

    const result = persistedStateSchema.safeParse(JSON.parse(rawValue));

    return result.success
      ? clonePersistedState(result.data)
      : createDefaultPersistedState();
  } catch {
    return createDefaultPersistedState();
  }
}

export function loadUiPreferences(storage: StorageAdapter | null): UiPreferences {
  if (!storage) {
    return createDefaultUiPreferences();
  }

  try {
    const rawValue = storage.getItem(UI_PREFERENCES_KEY);

    if (!rawValue) {
      return createDefaultUiPreferences();
    }

    const result = uiPreferencesSchema.safeParse(JSON.parse(rawValue));

    return result.success ? { ...result.data } : createDefaultUiPreferences();
  } catch {
    return createDefaultUiPreferences();
  }
}

export function loadAppState(storage: StorageAdapter | null): AppState {
  return {
    ...loadPersistedState(storage),
    uiPreferences: loadUiPreferences(storage),
    scenarioPreview: null,
  };
}

export function savePersistedState(
  storage: StorageAdapter | null,
  state: PersistedState,
): boolean {
  if (!storage) {
    return false;
  }

  try {
    const value = persistedStateSchema.parse({
      schemaVersion: state.schemaVersion,
      signals: state.signals,
      modelSettings: state.modelSettings,
    });
    storage.setItem(PERSISTED_STATE_KEY, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function saveUiPreferences(
  storage: StorageAdapter | null,
  preferences: UiPreferences,
): boolean {
  if (!storage) {
    return false;
  }

  try {
    const value = uiPreferencesSchema.parse(preferences);
    storage.setItem(UI_PREFERENCES_KEY, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

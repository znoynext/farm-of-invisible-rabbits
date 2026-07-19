import { signalDatasetSchema, signalEventSchema } from "../../domain";
import {
  cloneModelSettings,
  createDefaultModelSettings,
  createDefaultPersistedState,
} from "./defaults";
import { modelSettingsSchema } from "./schemas";
import type {
  AppAction,
  AppState,
  ModelSettings,
  ModelSettingsPatch,
  ScenarioPreview,
} from "./types";

function updateModelSettings(
  settings: ModelSettings,
  patch: ModelSettingsPatch = {},
): ModelSettings | null {
  const candidate = {
    sensitivity: patch.sensitivity ?? settings.sensitivity,
    weights: {
      ...settings.weights,
      ...patch.weights,
    },
  };
  const result = modelSettingsSchema.safeParse(candidate);

  return result.success ? result.data : null;
}

function updateScenarioPreview(
  state: AppState,
  action: Extract<AppAction, { type: "scenario/updatePreview" }>,
): ScenarioPreview | null {
  const current = state.scenarioPreview ?? {
    signals: state.signals,
    modelSettings: state.modelSettings,
  };
  const signalsResult = signalDatasetSchema.safeParse(
    action.payload.signals ?? current.signals,
  );
  const modelSettings = updateModelSettings(
    current.modelSettings,
    action.payload.modelSettings,
  );

  if (!signalsResult.success || !modelSettings) {
    return null;
  }

  return {
    signals: signalsResult.data,
    modelSettings,
  };
}

export function appStateReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "signal/add": {
      const result = signalEventSchema.safeParse(action.payload);

      if (!result.success || state.signals.some((signal) => signal.id === result.data.id)) {
        return state;
      }

      return {
        ...state,
        signals: [...state.signals, result.data],
        scenarioPreview: null,
      };
    }

    case "signal/update": {
      const result = signalEventSchema.safeParse(action.payload);
      const index = state.signals.findIndex((signal) => signal.id === action.payload.id);

      if (!result.success || index === -1) {
        return state;
      }

      return {
        ...state,
        signals: state.signals.map((signal, signalIndex) =>
          signalIndex === index ? result.data : signal,
        ),
        scenarioPreview: null,
      };
    }

    case "signal/delete": {
      if (!state.signals.some((signal) => signal.id === action.payload.id)) {
        return state;
      }

      return {
        ...state,
        signals: state.signals.filter((signal) => signal.id !== action.payload.id),
        scenarioPreview: null,
      };
    }

    case "signals/deleteAll":
      return {
        ...state,
        signals: [],
        scenarioPreview: null,
      };

    case "signals/reset":
      return {
        ...state,
        signals: createDefaultPersistedState().signals,
        scenarioPreview: null,
      };

    case "modelSettings/update": {
      const modelSettings = updateModelSettings(state.modelSettings, action.payload);

      if (!modelSettings) {
        return state;
      }

      return {
        ...state,
        modelSettings,
        scenarioPreview: null,
      };
    }

    case "modelSettings/reset":
      return {
        ...state,
        modelSettings: createDefaultModelSettings(),
        scenarioPreview: null,
      };

    case "scenario/updatePreview": {
      const scenarioPreview = updateScenarioPreview(state, action);

      return scenarioPreview ? { ...state, scenarioPreview } : state;
    }

    case "scenario/updateObservations": {
      const signalsResult = signalDatasetSchema.safeParse(action.payload.signals);

      if (!signalsResult.success) {
        return state;
      }

      return {
        ...state,
        scenarioPreview: {
          signals: signalsResult.data,
          modelSettings: cloneModelSettings(state.modelSettings),
        },
      };
    }

    case "scenario/apply":
      if (!state.scenarioPreview) {
        return state;
      }

      return {
        ...state,
        signals: state.scenarioPreview.signals.map((signal) => ({ ...signal })),
        modelSettings: cloneModelSettings(state.scenarioPreview.modelSettings),
        scenarioPreview: null,
      };

    case "scenario/applyObservations":
      if (!state.scenarioPreview) {
        return state;
      }

      return {
        ...state,
        signals: state.scenarioPreview.signals.map((signal) => ({ ...signal })),
        scenarioPreview: null,
      };

    case "scenario/reset":
      return state.scenarioPreview ? { ...state, scenarioPreview: null } : state;

    case "ui/introSeen":
      return {
        ...state,
        uiPreferences: { hasSeenIntro: action.payload },
      };
  }
}

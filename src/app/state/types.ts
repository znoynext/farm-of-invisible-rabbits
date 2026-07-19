import type { SignalEvent, SignalWeights } from "../../domain";

export const STATE_SCHEMA_VERSION = 1 as const;

export interface ModelSettings {
  readonly sensitivity: number;
  readonly weights: SignalWeights;
}

export interface PersistedState {
  readonly schemaVersion: typeof STATE_SCHEMA_VERSION;
  readonly signals: readonly SignalEvent[];
  readonly modelSettings: ModelSettings;
}

export interface UiPreferences {
  readonly hasSeenIntro: boolean;
}

export interface ScenarioPreview {
  readonly signals: readonly SignalEvent[];
  readonly modelSettings: ModelSettings;
}

export interface AppState extends PersistedState {
  readonly uiPreferences: UiPreferences;
  readonly scenarioPreview: ScenarioPreview | null;
}

export interface ModelSettingsPatch {
  readonly sensitivity?: number;
  readonly weights?: Partial<SignalWeights>;
}

export interface ScenarioPreviewPatch {
  readonly signals?: readonly SignalEvent[];
  readonly modelSettings?: ModelSettingsPatch;
}

export interface ObservationScenarioPatch {
  readonly signals: readonly SignalEvent[];
}

export type AppAction =
  | { readonly type: "signal/add"; readonly payload: SignalEvent }
  | { readonly type: "signal/update"; readonly payload: SignalEvent }
  | { readonly type: "signal/delete"; readonly payload: { readonly id: string } }
  | { readonly type: "signals/deleteAll" }
  | { readonly type: "signals/reset" }
  | {
      readonly type: "modelSettings/update";
      readonly payload: ModelSettingsPatch;
    }
  | { readonly type: "modelSettings/reset" }
  | {
      readonly type: "scenario/updatePreview";
      readonly payload: ScenarioPreviewPatch;
    }
  /** Product What-if path: preview observation data without changing model settings. */
  | {
      readonly type: "scenario/updateObservations";
      readonly payload: ObservationScenarioPatch;
    }
  | { readonly type: "scenario/apply" }
  /** Product What-if path: apply observation data only. */
  | { readonly type: "scenario/applyObservations" }
  | { readonly type: "scenario/reset" }
  | { readonly type: "ui/introSeen"; readonly payload: boolean };

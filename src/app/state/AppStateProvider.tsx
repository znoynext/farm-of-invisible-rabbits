import { useEffect, useMemo, useReducer } from "react";
import type { ReactNode } from "react";

import { AppStateContext } from "./context";
import {
  getBrowserStorage,
  loadAppState,
  savePersistedState,
  saveUiPreferences,
  type StorageAdapter,
} from "./persistence";
import { appStateReducer } from "./reducer";

export interface AppStateProviderProps {
  readonly children: ReactNode;
  readonly storage?: StorageAdapter | null;
}
export function AppStateProvider({ children, storage }: AppStateProviderProps) {
  const resolvedStorage = useMemo(
    () => (storage === undefined ? getBrowserStorage() : storage),
    [storage],
  );
  const [state, dispatch] = useReducer(appStateReducer, resolvedStorage, loadAppState);

  useEffect(() => {
    savePersistedState(resolvedStorage, {
      schemaVersion: state.schemaVersion,
      signals: state.signals,
      modelSettings: state.modelSettings,
    });
  }, [resolvedStorage, state.modelSettings, state.schemaVersion, state.signals]);

  useEffect(() => {
    saveUiPreferences(resolvedStorage, state.uiPreferences);
  }, [resolvedStorage, state.uiPreferences]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

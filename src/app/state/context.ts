import { createContext, useContext } from "react";
import type { Dispatch } from "react";

import type { AppAction, AppState } from "./types";

export interface AppStateContextValue {
  readonly state: AppState;
  readonly dispatch: Dispatch<AppAction>;
}
export const AppStateContext = createContext<AppStateContextValue | null>(null);

export function useAppState(): AppStateContextValue {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState должен использоваться внутри AppStateProvider.");
  }

  return context;
}

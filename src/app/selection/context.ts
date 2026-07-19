import { createContext, useContext } from "react";

import type { SignalType } from "../../domain";

export interface UiSelectionValue {
  readonly selectedLocation: string | null;
  readonly selectedSignalType: SignalType | null;
  readonly setSelectedLocation: (location: string | null) => void;
  readonly setSelectedSignalType: (signalType: SignalType | null) => void;
}

export const UiSelectionContext = createContext<UiSelectionValue | null>(null);

export function useUiSelection(): UiSelectionValue {
  const context = useContext(UiSelectionContext);

  if (!context) {
    throw new Error("useUiSelection должен использоваться внутри UiSelectionProvider.");
  }

  return context;
}

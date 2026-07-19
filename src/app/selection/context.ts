import { createContext, useContext } from "react";

export interface UiSelectionValue {
  readonly selectedLocation: string | null;
  readonly setSelectedLocation: (location: string | null) => void;
}

export const UiSelectionContext = createContext<UiSelectionValue | null>(null);

export function useUiSelection(): UiSelectionValue {
  const context = useContext(UiSelectionContext);

  if (!context) {
    throw new Error("useUiSelection должен использоваться внутри UiSelectionProvider.");
  }

  return context;
}

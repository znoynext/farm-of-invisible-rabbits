import { useMemo, useState, type ReactNode } from "react";

import type { SignalType } from "../../domain";
import { UiSelectionContext } from "./context";

export function UiSelectionProvider({ children }: { readonly children: ReactNode }) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedSignalType, setSelectedSignalType] = useState<SignalType | null>(null);
  const value = useMemo(
    () => ({
      selectedLocation,
      selectedSignalType,
      setSelectedLocation,
      setSelectedSignalType,
    }),
    [selectedLocation, selectedSignalType],
  );

  return (
    <UiSelectionContext.Provider value={value}>
      {children}
    </UiSelectionContext.Provider>
  );
}

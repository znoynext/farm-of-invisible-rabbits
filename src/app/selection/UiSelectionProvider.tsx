import { useMemo, useState, type ReactNode } from "react";

import { UiSelectionContext } from "./context";

export function UiSelectionProvider({ children }: { readonly children: ReactNode }) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const value = useMemo(
    () => ({ selectedLocation, setSelectedLocation }),
    [selectedLocation],
  );

  return (
    <UiSelectionContext.Provider value={value}>
      {children}
    </UiSelectionContext.Provider>
  );
}

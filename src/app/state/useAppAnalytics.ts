import { useMemo } from "react";

import { deriveAnalytics } from "./analytics";
import { useAppState } from "./context";

export function useAppAnalytics() {
  const { state } = useAppState();
  const { modelSettings, signals } = state;

  return useMemo(
    () => deriveAnalytics({ modelSettings, signals }),
    [modelSettings, signals],
  );
}

export function useScenarioAnalytics() {
  const { state } = useAppState();
  const { modelSettings, scenarioPreview, signals } = state;

  return useMemo(
    () => deriveAnalytics(scenarioPreview ?? { modelSettings, signals }),
    [modelSettings, scenarioPreview, signals],
  );
}

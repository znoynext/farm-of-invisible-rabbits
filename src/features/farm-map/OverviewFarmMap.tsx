import { useEffect } from "react";

import { useUiSelection } from "../../app/selection";
import { useAppAnalytics } from "../../app/state";
import { FarmMap } from "./FarmMap";

export function OverviewFarmMap() {
  const analytics = useAppAnalytics();
  const {
    selectedLocation,
    selectedSignalType,
    setSelectedLocation,
    setSelectedSignalType,
  } = useUiSelection();

  useEffect(() => {
    if (
      selectedLocation &&
      !analytics.locationActivity.some(
        ({ location }) => location === selectedLocation,
      )
    ) {
      setSelectedLocation(null);
    }
  }, [analytics.locationActivity, selectedLocation, setSelectedLocation]);

  return (
    <FarmMap
      locations={analytics.locationActivity}
      onSelectedLocationChange={(location) => {
        setSelectedSignalType(null);
        setSelectedLocation(location);
      }}
      selectedLocation={selectedLocation}
      selectedSignalType={selectedSignalType}
    />
  );
}

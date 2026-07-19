import { useEffect, useState } from "react";

import {
  defaultSectionId,
  isSectionId,
  type SectionId,
} from "../data/navigation";

function readSectionFromHash(): SectionId {
  const hashValue = window.location.hash.slice(1);
  return isSectionId(hashValue) ? hashValue : defaultSectionId;
}

export function useHashNavigation(): SectionId {
  const [activeSection, setActiveSection] = useState(readSectionFromHash);

  useEffect(() => {
    const syncSection = () => {
      setActiveSection(readSectionFromHash());
    };

    window.addEventListener("hashchange", syncSection);
    return () => window.removeEventListener("hashchange", syncSection);
  }, []);

  return activeSection;
}

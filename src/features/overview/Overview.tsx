import { EvidenceSection } from "../evidence/EvidenceSection";
import { OverviewFarmMap } from "../farm-map/OverviewFarmMap";
import { RecommendationsSection } from "../recommendations/RecommendationsSection";
import { WhatIfScenarioLab } from "../what-if/WhatIfScenarioLab";
import { OverviewHero } from "./OverviewHero";

export function Overview() {
  return (
    <div className="overview-flow">
      <OverviewHero />
      <OverviewFarmMap />
      <EvidenceSection />
      <WhatIfScenarioLab />
      <RecommendationsSection />
    </div>
  );
}

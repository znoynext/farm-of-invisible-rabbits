import { EvidenceSection } from "../evidence/EvidenceSection";
import { OverviewFarmMap } from "../farm-map/OverviewFarmMap";
import { OverviewHero } from "./OverviewHero";

export function Overview() {
  return (
    <div className="overview-flow">
      <OverviewHero />
      <OverviewFarmMap />
      <EvidenceSection />
    </div>
  );
}

import { EvidenceSection } from "../evidence/EvidenceSection";
import { OverviewFarmMap } from "../farm-map/OverviewFarmMap";
import { RecommendationsSection } from "../recommendations/RecommendationsSection";
import { WhatIfScenarioLab } from "../what-if/WhatIfScenarioLab";
import { OverviewHero } from "./OverviewHero";

export function Overview() {
  return (
    <div className="overview-flow">
      <div className="overview-opening">
        <OverviewHero />
        <OverviewGuidance />
      </div>
      <OverviewFarmMap />
      <EvidenceSection />
      <WhatIfScenarioLab />
      <RecommendationsSection />
    </div>
  );
}

function OverviewGuidance() {
  const paths = [
    {
      action: "Открыть сигналы",
      description: "Добавьте, измените или удалите сигнал с фермы.",
      href: "#signals",
      title: "Изменить наблюдения",
    },
    {
      action: "Проверить гипотезу",
      description:
        "Временно измените один сигнал и посмотрите результат без сохранения данных.",
      href: "#scenario-lab",
      title: "Проверить гипотезу",
    },
    {
      action: "Открыть модель",
      description:
        "Измените чувствительность системы или вес разных типов сигналов.",
      href: "#model",
      title: "Настроить модель",
    },
  ] as const;

  return (
    <section
      aria-labelledby="overview-guidance-title"
      className="overview-guidance"
    >
      <header className="overview-guidance__header">
        <div>
          <p className="eyebrow">Следующий шаг</p>
          <h2 id="overview-guidance-title">Что можно сделать дальше</h2>
        </div>
        <p>
          Текущая оценка рассчитана по вашим наблюдениям. Измените данные или
          настройки и посмотрите, как перестроится результат.
        </p>
      </header>

      <ol className="overview-guidance__paths">
        {paths.map((path, index) => (
          <li key={path.href}>
            <span aria-hidden="true" className="overview-guidance__index">
              0{index + 1}
            </span>
            <div>
              <h3>{path.title}</h3>
              <p>{path.description}</p>
              <a className="overview-guidance__action" href={path.href}>
                {path.action}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

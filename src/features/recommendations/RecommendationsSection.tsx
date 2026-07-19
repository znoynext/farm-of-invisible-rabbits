import { motion, useReducedMotion } from "motion/react";

import { useAppState, useScenarioAnalytics } from "../../app/state";
import { Surface } from "../../components/ui";

export function RecommendationsSection() {
  const { state } = useAppState();
  const analytics = useScenarioAnalytics();
  const prefersReducedMotion = useReducedMotion();
  const isPreviewActive = state.scenarioPreview !== null;
  const effectiveSignals = state.scenarioPreview?.signals ?? state.signals;
  const recommendations = analytics.recommendations;
  const contentKey = recommendations.map(({ id }) => id).join("|");

  return (
    <Surface
      aria-labelledby="recommendations-title"
      className="recommendations-section"
      data-preview-active={isPreviewActive}
      id="recommendations"
      role="region"
      tone="secondary"
    >
      <header className="recommendations-section__header">
        <div>
          <p className="eyebrow">Действие</p>
          <h2 id="recommendations-title">Что стоит сделать</h2>
        </div>
        <p>
          Практические шаги следуют из тех же наблюдений, что формируют оценку.
          Порядок учитывает важность и силу сигналов.
        </p>
      </header>

      <div className="recommendations-section__body">
        <div className="recommendations-section__context">
          <span aria-hidden="true" />
          <p aria-live="polite">
            {isPreviewActive
              ? "Предпросмотр: действия обновлены для сценария"
              : "По текущим наблюдениям"}
          </p>
        </div>

        {effectiveSignals.length === 0 ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="recommendations-empty"
            initial={{ opacity: 0.72, y: prefersReducedMotion ? 0 : 8 }}
            key={contentKey}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.24,
              ease: [0.2, 0, 0, 1],
            }}
          >
            <span aria-hidden="true">01</span>
            <div>
              <h3>{recommendations[0]?.action}</h3>
              <p>{recommendations[0]?.reason}</p>
            </div>
          </motion.div>
        ) : (
          <motion.ol
            animate={{ opacity: 1, y: 0 }}
            aria-live="polite"
            className="recommendations-list"
            initial={{ opacity: 0.72, y: prefersReducedMotion ? 0 : 8 }}
            key={contentKey}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.24,
              ease: [0.2, 0, 0, 1],
            }}
          >
            {recommendations.map((recommendation, index) => (
              <li key={recommendation.id}>
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{recommendation.action}</h3>
                  <p>{recommendation.reason}</p>
                </div>
              </li>
            ))}
          </motion.ol>
        )}
      </div>
    </Surface>
  );
}

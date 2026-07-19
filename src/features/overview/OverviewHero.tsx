import { ArrowDownRight, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Surface } from "../../components/ui";
import type { OverallActivityLevel, SignalType } from "../../domain";
import { useAppAnalytics, useAppState } from "../../app/state";

const activityLabels: Record<OverallActivityLevel, string> = {
  none: "Активность не подтверждена",
  low: "Низкая активность",
  moderate: "Умеренная активность",
  high: "Высокая активность",
};

const signalEvidenceLabels: Record<SignalType, string> = {
  missing_carrot: "пропавшая морковь",
  new_hole: "новые ямки",
  motion_sensor: "движение",
  barn_rustling: "шорох",
};

export function OverviewHero() {
  const { state } = useAppState();
  const analytics = useAppAnalytics();
  const prefersReducedMotion = useReducedMotion();

  if (state.signals.length === 0) {
    return <OverviewEmptyState />;
  }

  const latestObservation = analytics.latestObservation;
  const dominantEvidence = analytics.dominantEvidence;
  const strongestEvidenceText = dominantEvidence
    ? `Основной источник активности — ${signalEvidenceLabels[dominantEvidence.signalType]}${dominantEvidence.strongestLocation ? ` ${formatLocation(dominantEvidence.strongestLocation)}` : ""}.`
    : "Текущие веса не выделяют основной источник активности.";

  return (
    <Surface
      className={`overview-hero overview-hero--${analytics.overallActivity}`}
      data-testid="overview-hero"
    >
      <header className="overview-hero__header">
        <p className="eyebrow">Состояние фермы</p>
        {latestObservation ? (
          <p className="overview-hero__latest">
            Последнее наблюдение · <time dateTime={latestObservation.time}>{latestObservation.time}</time>
            <span aria-hidden="true"> · </span>
            <span>{latestObservation.location}</span>
          </p>
        ) : null}
      </header>

      <div className="overview-hero__body">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="overview-answer"
          initial={{
            opacity: 0,
            y: prefersReducedMotion ? 0 : 12,
          }}
          key={`${analytics.estimate.estimatedRabbits}-${analytics.overallActivity}`}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.42,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <h1
            aria-label={`${analytics.estimate.estimatedRabbits} предполагаемых кроликов`}
            className="overview-estimate"
            id="section-title"
          >
            <span className="overview-estimate__number">
              {analytics.estimate.estimatedRabbits}
            </span>
            <span className="overview-estimate__label">
              предполагаемых кроликов
            </span>
          </h1>
          <p className="overview-activity">
            <span aria-hidden="true" className="overview-activity__mark" />
            {activityLabels[analytics.overallActivity]}
          </p>
        </motion.div>

        <motion.section
          animate={{ opacity: 1, x: 0 }}
          aria-labelledby="overview-evidence-summary-title"
          className="overview-evidence"
          id="overview-evidence-summary"
          initial={{
            opacity: 0,
            x: prefersReducedMotion ? 0 : 14,
          }}
          key={`${analytics.confidence}-${dominantEvidence?.signalType ?? "none"}`}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.42,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <h2 className="visually-hidden" id="overview-evidence-summary-title">
            Основания оценки
          </h2>
          <p className="overview-confidence">
            Уверенность в оценке · <strong>{analytics.confidence}%</strong>
          </p>
          <div aria-hidden="true" className="overview-confidence__track">
            <motion.span
              animate={{ scaleX: analytics.confidence / 100 }}
              initial={{ scaleX: prefersReducedMotion ? analytics.confidence / 100 : 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.42,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </div>
          <p className="overview-evidence__statement">{strongestEvidenceText}</p>
          <a className="button button--secondary overview-evidence__cta" href="#evidence">
            Разобраться, почему
            <ArrowDownRight aria-hidden="true" size={18} strokeWidth={1.8} />
          </a>
        </motion.section>
      </div>

      <OverviewTraceField activity={analytics.overallActivity} />
    </Surface>
  );
}

function OverviewEmptyState() {
  return (
    <Surface className="overview-empty" data-testid="overview-empty">
      <header className="overview-hero__header">
        <p className="eyebrow">Состояние фермы</p>
        <p className="overview-hero__latest">Наблюдений пока нет</p>
      </header>
      <div className="overview-empty__body">
        <div aria-hidden="true" className="overview-empty__trace">
          <span />
          <span />
          <span />
        </div>
        <div className="overview-empty__copy">
          <p className="overview-empty__index">Нет сигнала · Нет вывода</p>
          <h1 id="section-title">Пока недостаточно данных</h1>
          <p>
            Добавьте первое наблюдение — система пересчитает оценку и объяснит,
            какие следы повлияли на результат.
          </p>
          <a className="button button--primary overview-empty__cta" href="#signals">
            Добавить сигнал
            <ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
          </a>
        </div>
      </div>
    </Surface>
  );
}

function OverviewTraceField({ activity }: { readonly activity: OverallActivityLevel }) {
  return (
    <div aria-hidden="true" className="overview-traces" data-activity={activity}>
      <svg viewBox="0 0 960 180">
        <path className="overview-traces__path" d="M8 150C243 63 518 52 950 18" />
        <circle className="overview-traces__ring" cx="714" cy="70" r="24" />
        <circle className="overview-traces__ring overview-traces__ring--outer" cx="714" cy="70" r="43" />
        <circle className="overview-traces__dot" cx="342" cy="104" r="5" />
        <circle className="overview-traces__dot overview-traces__dot--quiet" cx="375" cy="89" r="3" />
        <path className="overview-traces__arc" d="M522 143c27-35 68-52 119-48" />
        <path className="overview-traces__arc overview-traces__arc--outer" d="M548 160c32-37 77-54 132-48" />
        <path className="overview-traces__wave" d="M80 86c20-17 40 17 60 0s40 17 60 0" />
      </svg>
    </div>
  );
}

function formatLocation(location: string): string {
  const normalized = location.trim();

  switch (normalized.toLocaleLowerCase("ru-RU")) {
    case "огород":
      return "на огороде";
    case "у забора":
      return "в районе забора";
    case "сарай":
      return "в сарае";
    default:
      return `в зоне «${normalized}»`;
  }
}

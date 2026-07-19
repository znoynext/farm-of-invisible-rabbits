import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { useUiSelection } from "../../app/selection";
import { useAppState, useScenarioAnalytics } from "../../app/state";
import { SignalTypeMark } from "../../components/SignalTypeMark";
import { Surface } from "../../components/ui";
import type {
  EvidenceEventDetail,
  EvidenceStrength,
  SignalEvidenceGroup,
  SignalType,
} from "../../domain";

const signalLabels: Record<SignalType, string> = {
  missing_carrot: "Пропавшая морковь",
  new_hole: "Новые ямки",
  motion_sensor: "Движение",
  barn_rustling: "Шорох",
};

const influenceLabels: Record<EvidenceStrength, string> = {
  dominant: "Главный вклад",
  strong: "Сильный вклад",
  supporting: "Поддерживающий вклад",
};

export function EvidenceSection() {
  const { state } = useAppState();
  const analytics = useScenarioAnalytics();
  const prefersReducedMotion = useReducedMotion();
  const displayedSignals = state.scenarioPreview?.signals ?? state.signals;
  const {
    selectedLocation,
    selectedSignalType,
    setSelectedLocation,
    setSelectedSignalType,
  } = useUiSelection();
  const [expandedSignalType, setExpandedSignalType] = useState<SignalType | null>(
    null,
  );

  useEvidenceAnchorFocus(Boolean(prefersReducedMotion));

  if (displayedSignals.length === 0) {
    return (
      <Surface
        aria-labelledby="evidence-title"
        className="evidence-section evidence-section--empty"
        id="evidence"
        tabIndex={-1}
      >
        <div className="evidence-empty__mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div>
          <p className="eyebrow">Причины оценки</p>
          <h2 id="evidence-title">Пока нечего анализировать</h2>
          <p>
            Добавьте наблюдение — здесь появятся его вклад, место и понятный
            разбор расчёта.
          </p>
        </div>
      </Surface>
    );
  }

  function activateSignal(signalType: SignalType) {
    setSelectedLocation(null);
    setSelectedSignalType(signalType);
  }

  function revealSignal(signalType: SignalType) {
    activateSignal(signalType);
    setExpandedSignalType(signalType);
  }

  return (
    <Surface
      aria-labelledby="evidence-title"
      className="evidence-section"
      id="evidence"
      tabIndex={-1}
    >
      <header className="evidence-section__header">
        <div>
          <p className="eyebrow">Причины оценки</p>
          <h2 id="evidence-title">Что повлияло на оценку</h2>
        </div>
        <div className="evidence-section__intro">
          <p>
            Сигналы одного типа собраны вместе. Откройте строку, чтобы увидеть,
            как количество, интенсивность и вес дали итоговый вклад.
          </p>
          <p className="evidence-section__total">
            Общий вклад сигналов · <strong>{formatNumber(analytics.estimate.totalEvidence)}</strong>
          </p>
        </div>
      </header>

      <ol aria-label="Вклад типов сигналов" className="evidence-list">
        {analytics.evidenceGroups.map((group, index) => {
          const isExpanded = expandedSignalType === group.signalType;
          const isSelected = selectedSignalType === group.signalType;
          const isMapLinked = Boolean(
            selectedLocation && group.locations.includes(selectedLocation),
          );
          const detailsId = `evidence-details-${group.signalType}`;

          return (
            <li
              className="evidence-item"
              data-map-linked={isMapLinked}
              data-selected={isSelected}
              data-strength={group.strength}
              data-testid={`evidence-item-${group.signalType}`}
              key={group.signalType}
            >
              <button
                aria-controls={detailsId}
                aria-expanded={isExpanded}
                className="evidence-item__trigger"
                onClick={() => revealSignal(group.signalType)}
                onFocus={() => revealSignal(group.signalType)}
                onPointerEnter={() => activateSignal(group.signalType)}
                onPointerLeave={() => {
                  if (expandedSignalType !== group.signalType) {
                    setSelectedSignalType(null);
                  }
                }}
                type="button"
              >
                <span className="evidence-item__index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="evidence-item__mark" aria-hidden="true">
                  <SignalTypeMark type={group.signalType} />
                </span>
                <span className="evidence-item__copy">
                  <span className="evidence-item__role">
                    {influenceLabels[group.strength]}
                  </span>
                  <strong>{signalLabels[group.signalType]}</strong>
                  <span>{formatLocations(group.locations)}</span>
                </span>
                <span className="evidence-item__contribution">
                  <strong>{formatPercent(group.contribution)}%</strong>
                  <span>от общего влияния</span>
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className="evidence-item__chevron"
                  size={19}
                  strokeWidth={1.7}
                />
              </button>

              <AnimatePresence initial={false}>
                {isExpanded ? (
                  <motion.div
                    animate={{ height: "auto", opacity: 1 }}
                    className="evidence-details"
                    exit={{ height: 0, opacity: 0 }}
                    id={detailsId}
                    initial={{ height: 0, opacity: 0 }}
                    key={detailsId}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.24,
                      ease: [0.2, 0, 0, 1],
                    }}
                  >
                    <div className="evidence-details__inner">
                      <p className="evidence-details__lead">
                        {describeGroup(group)}
                      </p>
                      <ol aria-label={`Наблюдения: ${signalLabels[group.signalType]}`}>
                        {group.events.map((event, eventIndex) => (
                          <EvidenceEvent
                            detail={event}
                            index={eventIndex}
                            key={event.signal.id}
                          />
                        ))}
                      </ol>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
    </Surface>
  );
}

function EvidenceEvent({
  detail,
  index,
}: {
  readonly detail: EvidenceEventDetail;
  readonly index: number;
}) {
  return (
    <li className="evidence-event">
      <header>
        <p>Наблюдение {index + 1}</p>
        <time dateTime={detail.signal.time}>{detail.signal.time}</time>
      </header>
      <dl className="evidence-event__facts">
        <div>
          <dt>Тип</dt>
          <dd>{signalLabels[detail.signal.event]}</dd>
        </div>
        <div>
          <dt>Локация</dt>
          <dd>{detail.signal.location}</dd>
        </div>
        <div>
          <dt>Количество</dt>
          <dd>{detail.signal.count}</dd>
        </div>
        <div>
          <dt>Интенсивность</dt>
          <dd>{detail.signal.intensity}/10</dd>
        </div>
      </dl>
      <div className="evidence-formula">
        <p>Расчёт влияния</p>
        <code>
          {formatNumber(detail.effectiveCount)} × {formatNumber(detail.weight)} ×{" "}
          {formatNumber(detail.intensityFactor)} = {formatNumber(detail.impact)}
        </code>
        <span>
          учтённое количество × вес × доля интенсивности ·{" "}
          {formatDecimalPercent(detail.contribution)}% общего влияния
        </span>
      </div>
      <p className="evidence-event__explanation">
        {formatCount(detail.signal.count)} с интенсивностью {detail.signal.intensity}/10
        {detail.effectiveCount === detail.signal.count
          ? " учитываются напрямую"
          : ` дают эффективное количество ${formatNumber(detail.effectiveCount)} из-за убывающей отдачи`}
        ; после веса {formatNumber(detail.weight)} влияние равно {formatNumber(detail.impact)}.
      </p>
    </li>
  );
}

function useEvidenceAnchorFocus(prefersReducedMotion: boolean) {
  useEffect(() => {
    let frame = 0;

    const focusEvidence = () => {
      if (window.location.hash !== "#evidence") {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        const target = document.getElementById("evidence");
        target?.scrollIntoView?.({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
        target?.focus({ preventScroll: true });
      });
    };

    focusEvidence();
    window.addEventListener("hashchange", focusEvidence);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", focusEvidence);
    };
  }, [prefersReducedMotion]);
}

function describeGroup(group: SignalEvidenceGroup): string {
  const eventCount = group.events.length;
  const eventWord = eventCount === 1 ? "наблюдение" : "наблюдения";
  const resultVerb = eventCount === 1 ? "дало" : "дали";

  return `${signalLabels[group.signalType]}: ${eventCount} ${eventWord} в ${formatLocationCount(group.locations.length)} ${resultVerb} ${formatDecimalPercent(group.contribution)}% общего влияния. Каждое событие рассчитано отдельно.`;
}

function formatLocations(locations: readonly string[]): string {
  if (locations.length === 1) {
    return locations[0] ?? "";
  }

  return `${formatLocationCount(locations.length)} · ${locations.join(" · ")}`;
}

function formatLocationCount(count: number): string {
  const word = count === 1 ? "локации" : "локациях";
  return `${count} ${word}`;
}

function formatCount(count: number): string {
  const modulo100 = count % 100;
  const modulo10 = count % 10;

  if (modulo100 >= 11 && modulo100 <= 14) {
    return `${count} наблюдений`;
  }

  if (modulo10 === 1) {
    return `${count} наблюдение`;
  }

  if (modulo10 >= 2 && modulo10 <= 4) {
    return `${count} наблюдения`;
  }

  return `${count} наблюдений`;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 2,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function formatPercent(value: number): string {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(value);
}

function formatDecimalPercent(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(value);
}

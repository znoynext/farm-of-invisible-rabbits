import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { useUiSelection } from "../../app/selection";
import {
  useAppAnalytics,
  useAppState,
  useScenarioAnalytics,
} from "../../app/state";
import { SignalTypeMark } from "../../components/SignalTypeMark";
import { Button, Slider, Surface } from "../../components/ui";
import {
  findMostImpactfulObservation,
  type SignalEvent,
  type SignalType,
} from "../../domain";

const signalLabels: Record<SignalType, string> = {
  missing_carrot: "Пропавшая морковь",
  new_hole: "Новые ямки",
  motion_sensor: "Движение",
  barn_rustling: "Шорох",
};

const APPLY_CONFIRMATION_DURATION = 1_300;

export function WhatIfScenarioLab() {
  const { dispatch, state } = useAppState();
  const currentAnalytics = useAppAnalytics();
  const scenarioAnalytics = useScenarioAnalytics();
  const prefersReducedMotion = useReducedMotion();
  const {
    setSelectedLocation,
    setSelectedSignalType,
  } = useUiSelection();
  const defaultObservation = useMemo(
    () => findMostImpactfulObservation(state.signals, state.modelSettings.weights),
    [state.modelSettings.weights, state.signals],
  );
  const [selectedEventId, setSelectedEventId] = useState<string | null>(
    () => defaultObservation?.signal.id ?? null,
  );
  const [showAppliedConfirmation, setShowAppliedConfirmation] = useState(false);
  const confirmationTimer = useRef<number | null>(null);
  const selectedSignal =
    state.signals.find(({ id }) => id === selectedEventId) ??
    defaultObservation?.signal ??
    null;
  const previewSignals = state.scenarioPreview?.signals ?? state.signals;
  const previewSignal =
    previewSignals.find(({ id }) => id === selectedSignal?.id) ?? selectedSignal;
  const hasPreview = state.scenarioPreview !== null;

  useEffect(
    () => () => {
      if (confirmationTimer.current !== null) {
        window.clearTimeout(confirmationTimer.current);
      }
    },
    [],
  );

  if (!selectedSignal || !previewSignal) {
    return <ScenarioEmptyState />;
  }

  const selectedSignalId = selectedSignal.id;
  const selectedSignalIntensity = selectedSignal.intensity;
  const selectedSignalLocation = selectedSignal.location;
  const selectedSignalEvent = selectedSignal.event;

  function selectObservation(signal: SignalEvent) {
    dispatch({ type: "scenario/reset" });
    setShowAppliedConfirmation(false);
    setSelectedEventId(signal.id);
    setSelectedLocation(signal.location);
    setSelectedSignalType(signal.event);
  }

  function updateIntensity(intensity: number) {
    setShowAppliedConfirmation(false);
    setSelectedLocation(selectedSignalLocation);
    setSelectedSignalType(selectedSignalEvent);

    if (intensity === selectedSignalIntensity) {
      dispatch({ type: "scenario/reset" });
      return;
    }

    dispatch({
      type: "scenario/updateObservations",
      payload: {
        signals: state.signals.map((signal) =>
          signal.id === selectedSignalId ? { ...signal, intensity } : signal,
        ),
      },
    });
  }

  function applyScenario() {
    if (!hasPreview) {
      return;
    }

    dispatch({ type: "scenario/applyObservations" });
    setShowAppliedConfirmation(true);

    if (confirmationTimer.current !== null) {
      window.clearTimeout(confirmationTimer.current);
    }

    confirmationTimer.current = window.setTimeout(() => {
      setShowAppliedConfirmation(false);
      confirmationTimer.current = null;
    }, APPLY_CONFIRMATION_DURATION);
  }

  function resetScenario() {
    dispatch({ type: "scenario/reset" });
    setShowAppliedConfirmation(false);
  }

  return (
    <Surface
      aria-labelledby="scenario-lab-title"
      className="scenario-lab"
      data-preview-active={hasPreview}
      id="scenario-lab"
    >
      <header className="scenario-lab__header">
        <div>
          <p className="eyebrow">Эксперимент</p>
          <h2 id="scenario-lab-title">Проверить гипотезу</h2>
        </div>
        <p>
          Измените интенсивность одного наблюдения. До применения исходные данные
          останутся прежними, а весь обзор покажет сценарий.
        </p>
      </header>

      <div className="scenario-lab__layout">
        <fieldset className="scenario-events">
          <legend>Наблюдение для проверки</legend>
          <div className="scenario-events__list">
            {state.signals.map((signal) => (
              <label className="scenario-event" key={signal.id}>
                <input
                  checked={signal.id === selectedSignal.id}
                  name="scenario-observation"
                  onChange={() => selectObservation(signal)}
                  type="radio"
                  value={signal.id}
                />
                <span aria-hidden="true" className="scenario-event__mark">
                  <SignalTypeMark type={signal.event} />
                </span>
                <span className="scenario-event__copy">
                  <strong>{signalLabels[signal.event]}</strong>
                  <span>{signal.location} · {signal.time}</span>
                </span>
                <span className="scenario-event__intensity">{signal.intensity}/10</span>
              </label>
            ))}
          </div>
        </fieldset>

        <section
          aria-label="Сравнение текущей оценки и сценария"
          aria-live="polite"
          className="scenario-comparison"
        >
          <ScenarioResult
            confidence={currentAnalytics.confidence}
            estimate={currentAnalytics.estimate.estimatedRabbits}
            label="Сейчас"
            prefersReducedMotion={Boolean(prefersReducedMotion)}
          />
          <div aria-hidden="true" className="scenario-comparison__arrow">
            <ArrowRight size={24} strokeWidth={1.5} />
          </div>
          <ScenarioResult
            confidence={scenarioAnalytics.confidence}
            estimate={scenarioAnalytics.estimate.estimatedRabbits}
            label="Сценарий"
            prefersReducedMotion={Boolean(prefersReducedMotion)}
          />
          <p className="scenario-comparison__note">
            Интенсивность влияет и на оценку, и на уверенность через среднюю силу
            наблюдений.
          </p>
        </section>

        <div className="scenario-intensity">
          <div className="scenario-intensity__context">
            <SignalTypeMark type={selectedSignal.event} />
            <p>
              <strong>{signalLabels[selectedSignal.event]}</strong>
              <span>{selectedSignal.location}</span>
            </p>
          </div>
          <Slider
            aria-describedby="scenario-intensity-hint"
            label="Интенсивность наблюдения"
            max={10}
            min={1}
            onChange={(event) => updateIntensity(Number(event.currentTarget.value))}
            step={1}
            value={previewSignal.intensity}
            valueText={`${previewSignal.intensity} из 10`}
          />
          <p id="scenario-intensity-hint">
            Исходное значение · {selectedSignal.intensity} из 10
          </p>
        </div>

        <div className="scenario-actions">
          <Button disabled={!hasPreview} onClick={applyScenario}>
            Применить к данным
          </Button>
          <Button disabled={!hasPreview} onClick={resetScenario} variant="quiet">
            Сбросить сценарий
          </Button>
          <div
            aria-live="polite"
            className="scenario-actions__confirmation"
            role="status"
          >
            {showAppliedConfirmation ? (
              <span>
                <Check aria-hidden="true" size={17} strokeWidth={2} />
                Данные обновлены
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Surface>
  );
}

function ScenarioResult({
  confidence,
  estimate,
  label,
  prefersReducedMotion,
}: {
  readonly confidence: number;
  readonly estimate: number;
  readonly label: string;
  readonly prefersReducedMotion: boolean;
}) {
  return (
    <div className="scenario-result">
      <p>{label}</p>
      <motion.strong
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0.62, y: prefersReducedMotion ? 0 : 6 }}
        key={`${estimate}-${confidence}`}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.24,
          ease: [0.2, 0, 0, 1],
        }}
      >
        {estimate}
      </motion.strong>
      <span>предполагаемых кроликов</span>
      <dl>
        <div>
          <dt>Уверенность</dt>
          <dd>{confidence}%</dd>
        </div>
      </dl>
    </div>
  );
}

function ScenarioEmptyState() {
  return (
    <Surface aria-labelledby="scenario-lab-title" className="scenario-lab scenario-lab--empty" id="scenario-lab">
      <div aria-hidden="true" className="scenario-lab__empty-mark">
        <span />
        <span />
      </div>
      <div>
        <p className="eyebrow">Эксперимент</p>
        <h2 id="scenario-lab-title">Проверить гипотезу</h2>
        <p>Для сценария нужно хотя бы одно наблюдение. Добавьте сигнал в разделе данных.</p>
      </div>
    </Surface>
  );
}

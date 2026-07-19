import { useEffect, useRef, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { useAppAnalytics, useAppState } from "../../app/state";
import { SignalTypeMark } from "../../components/SignalTypeMark";
import { Button, Slider, Surface } from "../../components/ui";
import {
  DEFAULT_SENSITIVITY,
  DEFAULT_SIGNAL_WEIGHTS,
  SUPPORTED_SIGNAL_TYPES,
  type SignalType,
} from "../../domain";
import {
  describeSensitivity,
  describeWeight,
  formatModelValue,
  modelSignalLabels,
} from "./modelCopy";

const RESET_CONFIRMATION_DURATION = 1_300;

export function ModelSettingsSection() {
  const { dispatch, state } = useAppState();
  const analytics = useAppAnalytics();
  const prefersReducedMotion = useReducedMotion();
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const confirmationTimer = useRef<number | null>(null);
  const settingsAreDefault = isDefaultModelSettings(state.modelSettings);
  const sensitivityDescription = describeSensitivity(
    state.modelSettings.sensitivity,
  );
  const dominantLabel = analytics.dominantEvidence
    ? modelSignalLabels[analytics.dominantEvidence.signalType]
    : "Источник не выделен";

  useEffect(
    () => () => {
      if (confirmationTimer.current !== null) {
        window.clearTimeout(confirmationTimer.current);
      }
    },
    [],
  );

  function clearResetConfirmation() {
    setShowResetConfirmation(false);

    if (confirmationTimer.current !== null) {
      window.clearTimeout(confirmationTimer.current);
      confirmationTimer.current = null;
    }
  }

  function updateSensitivity(sensitivity: number) {
    clearResetConfirmation();
    dispatch({ type: "scenario/reset" });
    dispatch({
      type: "modelSettings/update",
      payload: { sensitivity },
    });
  }

  function updateWeight(signalType: SignalType, weight: number) {
    clearResetConfirmation();
    dispatch({ type: "scenario/reset" });
    dispatch({
      type: "modelSettings/update",
      payload: { weights: { [signalType]: weight } },
    });
  }

  function resetModelSettings() {
    dispatch({ type: "scenario/reset" });
    dispatch({ type: "modelSettings/reset" });
    setShowResetConfirmation(true);

    if (confirmationTimer.current !== null) {
      window.clearTimeout(confirmationTimer.current);
    }

    confirmationTimer.current = window.setTimeout(() => {
      setShowResetConfirmation(false);
      confirmationTimer.current = null;
    }, RESET_CONFIRMATION_DURATION);
  }

  return (
    <Surface className="model-section section-stage" id="model">
      <header className="model-section__header">
        <div>
          <p className="eyebrow">Прозрачные настройки</p>
          <h1 id="section-title">Модель оценки</h1>
        </div>
        <div className="model-section__introduction">
          <p>Настройте, как система интерпретирует наблюдения с фермы.</p>
          <p>
            Настройки применяются локально и сразу пересчитывают связанные выводы.
          </p>
        </div>
      </header>

      <section
        aria-label="Текущий результат модели"
        aria-live="polite"
        className="model-live-result"
      >
        <div className="model-live-result__answer">
          <p>Текущая оценка</p>
          <motion.strong
            animate={{ opacity: 1, y: 0 }}
            initial={{
              opacity: 0.62,
              y: prefersReducedMotion ? 0 : 6,
            }}
            key={analytics.estimate.estimatedRabbits}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.24,
              ease: [0.2, 0, 0, 1],
            }}
          >
            {analytics.estimate.estimatedRabbits}
          </motion.strong>
          <span>предполагаемых кроликов</span>
        </div>
        <dl className="model-live-result__context">
          <div>
            <dt>Основной источник</dt>
            <dd>{dominantLabel}</dd>
          </div>
          <div>
            <dt>Уверенность</dt>
            <dd>{analytics.confidence}% · не зависит от настроек модели</dd>
          </div>
        </dl>
      </section>

      <div className="model-controls">
        <section
          aria-labelledby="sensitivity-title"
          className="model-sensitivity"
        >
          <header>
            <p className="model-control-index">01 · Общая реакция</p>
            <h2 id="sensitivity-title">Чувствительность</h2>
            <p>
              Масштабирует итоговую оценку после того, как система сложила
              влияние всех наблюдений.
            </p>
          </header>

          <div className="model-sensitivity__readout">
            <strong>{formatModelValue(state.modelSettings.sensitivity)}</strong>
            <span>{sensitivityDescription}</span>
          </div>

          <Slider
            aria-describedby="sensitivity-explanation"
            aria-valuetext={`${formatModelValue(state.modelSettings.sensitivity)} — ${sensitivityDescription.toLocaleLowerCase("ru-RU")} чувствительность`}
            label="Чувствительность модели"
            max={1.5}
            min={0.5}
            onChange={(event) =>
              updateSensitivity(Number(event.currentTarget.value))
            }
            step={0.1}
            value={state.modelSettings.sensitivity}
            valueText={formatModelValue(state.modelSettings.sensitivity)}
          />
          <div aria-hidden="true" className="model-sensitivity__range-labels">
            <span>Осторожная</span>
            <span>Чувствительная</span>
          </div>
          <p id="sensitivity-explanation">
            Меняет количество предполагаемых кроликов, но не меняет уверенность.
          </p>
        </section>

        <section aria-labelledby="weights-title" className="model-weights">
          <header>
            <p className="model-control-index">02 · Сила свидетельств</p>
            <h2 id="weights-title">Веса сигналов</h2>
            <p>
              Определяют, насколько сильно каждый тип следа влияет на общую
              доказательную базу.
            </p>
          </header>

          <div className="model-weights__list">
            {SUPPORTED_SIGNAL_TYPES.map((signalType, index) => (
              <WeightControl
                index={index + 1}
                key={signalType}
                onChange={(weight) => updateWeight(signalType, weight)}
                signalType={signalType}
                weight={state.modelSettings.weights[signalType]}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="model-reset-row">
        <Button
          disabled={settingsAreDefault}
          onClick={resetModelSettings}
          variant="secondary"
        >
          <RotateCcw aria-hidden="true" size={17} strokeWidth={1.8} />
          Вернуть стандартные настройки
        </Button>
        <div aria-live="polite" className="model-reset-row__status" role="status">
          {showResetConfirmation ? (
            <span>
              <Check aria-hidden="true" size={17} strokeWidth={2} />
              Стандартные настройки восстановлены
            </span>
          ) : settingsAreDefault ? (
            <span>Используются стандартные настройки</span>
          ) : (
            <span>Настройки отличаются от стандартных</span>
          )}
        </div>
      </div>

      <section aria-labelledby="model-explanation-title" className="model-explanation">
        <header>
          <p className="eyebrow">Как получается ответ</p>
          <h2 id="model-explanation-title">Прозрачная цепочка расчёта</h2>
        </header>
        <ol>
          <li>
            <span>01</span>
            <p><strong>Количество</strong> показывает, сколько однотипных следов замечено.</p>
          </li>
          <li>
            <span>02</span>
            <p><strong>Убывающая отдача</strong> смягчает влияние повторов после пяти наблюдений.</p>
          </li>
          <li>
            <span>03</span>
            <p><strong>Интенсивность</strong> переводит силу наблюдения из шкалы 1–10 в коэффициент.</p>
          </li>
          <li>
            <span>04</span>
            <p><strong>Вес сигнала</strong> задаёт относительную значимость типа следа.</p>
          </li>
          <li>
            <span>05</span>
            <p><strong>Чувствительность</strong> масштабирует суммарное evidence перед округлением.</p>
          </li>
          <li>
            <span>06</span>
            <p><strong>Уверенность</strong> оценивает разнообразие, покрытие, объём и силу данных отдельно.</p>
          </li>
        </ol>
      </section>

      <div className="model-disclaimers">
        <p>
          Уверенность отражает качество и разнообразие собранных данных, а не
          статистическую вероятность точного количества кроликов.
        </p>
        <p>
          Это прозрачная эвристическая модель для демонстрации интерактивной
          оценки. Она не является статистически обученной или научно
          валидированной системой обнаружения кроликов.
        </p>
      </div>
    </Surface>
  );
}

function WeightControl({
  index,
  onChange,
  signalType,
  weight,
}: {
  readonly index: number;
  readonly onChange: (weight: number) => void;
  readonly signalType: SignalType;
  readonly weight: number;
}) {
  const influence = describeWeight(weight);
  const descriptionId = `weight-${signalType}-description`;

  return (
    <article className="model-weight" data-influence={influence}>
      <div aria-hidden="true" className="model-weight__index">
        {String(index).padStart(2, "0")}
      </div>
      <div className="model-weight__identity">
        <span aria-hidden="true" className="model-weight__mark">
          <SignalTypeMark type={signalType} />
        </span>
        <div>
          <h3>{modelSignalLabels[signalType]}</h3>
          <p id={descriptionId}>{influence}</p>
        </div>
      </div>
      <Slider
        aria-describedby={descriptionId}
        aria-valuetext={`${formatModelValue(weight)} — ${influence.toLocaleLowerCase("ru-RU")}`}
        label={`Вес: ${modelSignalLabels[signalType]}`}
        max={3}
        min={0}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        step={0.1}
        value={weight}
        valueText={formatModelValue(weight)}
      />
    </article>
  );
}

function isDefaultModelSettings(settings: {
  readonly sensitivity: number;
  readonly weights: Readonly<Record<SignalType, number>>;
}): boolean {
  return (
    settings.sensitivity === DEFAULT_SENSITIVITY &&
    SUPPORTED_SIGNAL_TYPES.every(
      (signalType) =>
        settings.weights[signalType] === DEFAULT_SIGNAL_WEIGHTS[signalType],
    )
  );
}

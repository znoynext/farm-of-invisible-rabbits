import { useState } from "react";
import { Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { useUiSelection } from "../../app/selection";
import { useAppState, type AppAction } from "../../app/state";
import { SignalTypeMark } from "../../components/SignalTypeMark";
import { Button, Dialog, EmptyState, Surface } from "../../components/ui";
import { initialSignals } from "../../data/initialSignals";
import type { SignalEvent } from "../../domain";
import { SignalFormDialog } from "./SignalFormDialog";
import { signalTypeLabels } from "./signalCopy";

type SignalFormMode =
  | { readonly kind: "add" }
  | { readonly kind: "edit"; readonly signal: SignalEvent }
  | null;

export function SignalsSection() {
  const { dispatch, state } = useAppState();
  const {
    selectedLocation,
    selectedSignalType,
    setSelectedLocation,
    setSelectedSignalType,
  } = useUiSelection();
  const prefersReducedMotion = useReducedMotion();
  const [formMode, setFormMode] = useState<SignalFormMode>(null);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);

  function reconcileSelection(nextSignals: readonly SignalEvent[]) {
    if (
      selectedLocation &&
      !nextSignals.some(({ location }) => location === selectedLocation)
    ) {
      setSelectedLocation(null);
    }

    if (
      selectedSignalType &&
      !nextSignals.some(({ event }) => event === selectedSignalType)
    ) {
      setSelectedSignalType(null);
    }
  }

  function applySignalMutation(
    action: AppAction,
    nextSignals: readonly SignalEvent[],
  ) {
    dispatch({ type: "scenario/reset" });
    dispatch(action);
    reconcileSelection(nextSignals);
  }

  function saveSignal(signal: SignalEvent) {
    if (formMode?.kind === "edit") {
      const nextSignals = state.signals.map((current) =>
        current.id === signal.id ? signal : current,
      );
      applySignalMutation({ type: "signal/update", payload: signal }, nextSignals);
    } else {
      const nextSignals = [...state.signals, signal];
      applySignalMutation({ type: "signal/add", payload: signal }, nextSignals);
    }

    setFormMode(null);
  }

  function deleteSignal(signal: SignalEvent) {
    const nextSignals = state.signals.filter(({ id }) => id !== signal.id);
    applySignalMutation(
      { type: "signal/delete", payload: { id: signal.id } },
      nextSignals,
    );
  }

  function deleteAllSignals() {
    applySignalMutation({ type: "signals/deleteAll" }, []);
    setIsDeleteAllOpen(false);
  }

  function restoreInitialSignals() {
    const nextSignals = initialSignals.map((signal) => ({ ...signal }));
    applySignalMutation({ type: "signals/reset" }, nextSignals);
    setIsRestoreOpen(false);
  }

  return (
    <Surface className="section-stage signals-section">
      <header className="signals-section__header">
        <div>
          <p className="eyebrow">Доказательная база</p>
          <h1 id="section-title">Сигналы</h1>
        </div>
        <div className="signals-section__intro">
          <p>Наблюдения, на которых строится текущая оценка.</p>
          <p aria-live="polite" className="signals-section__count">
            {formatObservationCount(state.signals.length)}
          </p>
        </div>
      </header>

      <div aria-label="Управление наблюдениями" className="signals-toolbar">
        <Button onClick={() => setFormMode({ kind: "add" })}>
          <Plus aria-hidden="true" size={18} strokeWidth={1.8} />
          Добавить сигнал
        </Button>
        <div className="signals-toolbar__secondary">
          <Button onClick={() => setIsRestoreOpen(true)} variant="quiet">
            <RotateCcw aria-hidden="true" size={17} strokeWidth={1.8} />
            Восстановить исходные данные
          </Button>
          <Button
            className="signals-button--danger"
            disabled={state.signals.length === 0}
            onClick={() => setIsDeleteAllOpen(true)}
            variant="quiet"
          >
            <Trash2 aria-hidden="true" size={17} strokeWidth={1.8} />
            Удалить все сигналы
          </Button>
        </div>
      </div>

      {state.signals.length > 0 ? (
        <ol aria-label="Текущие наблюдения" className="signals-list">
          <AnimatePresence initial={false} mode="popLayout">
            {state.signals.map((signal, index) => (
              <motion.li
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
                key={signal.id}
                layout={!prefersReducedMotion}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.24,
                  ease: [0.2, 0, 0, 1],
                }}
              >
                <article className="signal-card" data-signal-id={signal.id}>
                  <div className="signal-card__identity">
                    <span aria-hidden="true" className="signal-card__index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span aria-hidden="true" className="signal-card__mark">
                      <SignalTypeMark type={signal.event} />
                    </span>
                    <div>
                      <h2>{signalTypeLabels[signal.event]}</h2>
                      <p>{signal.location}</p>
                    </div>
                  </div>

                  <dl className="signal-card__metrics">
                    <div>
                      <dt>Количество</dt>
                      <dd>{formatNumber(signal.count)}</dd>
                    </div>
                    <div>
                      <dt>Интенсивность</dt>
                      <dd>
                        <strong>{signal.intensity}/10</strong>
                        <span aria-hidden="true" className="signal-card__intensity">
                          <span style={{ width: `${signal.intensity * 10}%` }} />
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt>Время</dt>
                      <dd>
                        <time dateTime={signal.time}>{signal.time}</time>
                      </dd>
                    </div>
                  </dl>

                  <div className="signal-card__actions">
                    <Button
                      aria-label={`Изменить сигнал: ${signalTypeLabels[signal.event]}, ${signal.location}`}
                      onClick={() => setFormMode({ kind: "edit", signal })}
                      size="compact"
                      variant="quiet"
                    >
                      <Pencil aria-hidden="true" size={16} strokeWidth={1.8} />
                      Изменить
                    </Button>
                    <Button
                      aria-label={`Удалить сигнал: ${signalTypeLabels[signal.event]}, ${signal.location}`}
                      className="signal-card__delete"
                      onClick={() => deleteSignal(signal)}
                      size="compact"
                      variant="quiet"
                    >
                      <Trash2 aria-hidden="true" size={16} strokeWidth={1.8} />
                      Удалить
                    </Button>
                  </div>
                </article>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      ) : (
        <div className="signals-empty">
          <EmptyState
            description="Добавьте первое наблюдение или восстановите исходный набор данных."
            eyebrow="Нет наблюдений"
            title="Список сигналов пуст"
          />
        </div>
      )}

      {formMode ? (
        <SignalFormDialog
          existingSignals={state.signals}
          key={formMode.kind === "edit" ? formMode.signal.id : "add"}
          onCancel={() => setFormMode(null)}
          onSave={saveSignal}
          {...(formMode.kind === "edit" ? { signal: formMode.signal } : {})}
        />
      ) : null}

      <Dialog
        description="Текущие наблюдения будут заменены стартовым набором. Добавленные и изменённые наблюдения будут потеряны."
        eyebrow="Необратимо для текущего списка"
        onOpenChange={setIsRestoreOpen}
        open={isRestoreOpen}
        title="Восстановить исходные данные?"
      >
        <div className="signal-confirm">
          <Button
            className="signal-confirm__restore"
            onClick={restoreInitialSignals}
          >
            Восстановить исходные данные
          </Button>
          <Button onClick={() => setIsRestoreOpen(false)} variant="quiet">
            Отмена
          </Button>
        </div>
      </Dialog>

      <Dialog
        description="Текущая оценка перейдёт в пустое состояние. Исходные данные можно будет восстановить."
        eyebrow="Необратимо для текущего списка"
        onOpenChange={setIsDeleteAllOpen}
        open={isDeleteAllOpen}
        title="Удалить все сигналы?"
      >
        <div className="signal-confirm">
          <Button className="signal-confirm__delete" onClick={deleteAllSignals}>
            Удалить все сигналы
          </Button>
          <Button onClick={() => setIsDeleteAllOpen(false)} variant="quiet">
            Отмена
          </Button>
        </div>
      </Dialog>
    </Surface>
  );
}

function formatObservationCount(count: number): string {
  const modulo100 = count % 100;
  const modulo10 = count % 10;
  let label = "наблюдений";

  if (modulo100 < 11 || modulo100 > 14) {
    if (modulo10 === 1) {
      label = "наблюдение";
    } else if (modulo10 >= 2 && modulo10 <= 4) {
      label = "наблюдения";
    }
  }

  return `${formatNumber(count)} ${label}`;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(value);
}

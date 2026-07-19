import { useCallback, useId, useState, type FormEvent } from "react";

import { Button, Dialog, Slider, TextField } from "../../components/ui";
import {
  signalEventSchema,
  type SignalEvent,
  type SignalType,
} from "../../domain";
import { signalTypeOptions } from "./signalCopy";

type SignalFormDialogProps = {
  readonly existingSignals: readonly SignalEvent[];
  readonly onCancel: () => void;
  readonly onSave: (signal: SignalEvent) => void;
  readonly signal?: SignalEvent;
};

type SignalDraft = {
  count: string;
  event: SignalType;
  intensity: string;
  location: string;
  time: string;
};

type SignalField = keyof SignalDraft;
type FormErrors = Partial<Record<SignalField | "form", string>>;

const fieldErrorCopy: Record<SignalField, string> = {
  event: "Выберите тип сигнала.",
  location: "Укажите место наблюдения.",
  count: "Введите целое число больше нуля.",
  intensity: "Укажите значение от 1 до 10.",
  time: "Используйте время в формате ЧЧ:ММ.",
};

export function SignalFormDialog({
  existingSignals,
  onCancel,
  onSave,
  signal,
}: SignalFormDialogProps) {
  const isEditing = Boolean(signal);
  const selectId = useId();
  const selectErrorId = `${selectId}-error`;
  const intensityErrorId = `${selectId}-intensity-error`;
  const [draft, setDraft] = useState<SignalDraft>(() => createDraft(signal));
  const [errors, setErrors] = useState<FormErrors>({});
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onCancel();
      }
    },
    [onCancel],
  );

  function updateDraft<Field extends SignalField>(
    field: Field,
    value: SignalDraft[Field],
  ) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const nextErrors = { ...current };
      delete nextErrors[field];
      delete nextErrors.form;
      return nextErrors;
    });
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const candidate = {
      id: signal?.id ?? createSignalId(existingSignals),
      event: draft.event,
      location: draft.location,
      count: Number(draft.count),
      intensity: Number(draft.intensity),
      time: draft.time,
    };
    const result = signalEventSchema.safeParse(candidate);

    if (!result.success) {
      const nextErrors: FormErrors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (field !== undefined && isSignalField(field) && !nextErrors[field]) {
          nextErrors[field] = fieldErrorCopy[field];
        } else if (field === "id") {
          nextErrors.form = "Не удалось создать уникальный идентификатор.";
        }
      }

      setErrors(nextErrors);
      return;
    }

    onSave(result.data);
  }

  return (
    <Dialog
      description={
        isEditing
          ? "Изменения сразу станут частью текущей оценки."
          : "Добавьте наблюдение — система сразу пересчитает оценку и объяснение."
      }
      eyebrow={isEditing ? "Редактирование" : "Новое наблюдение"}
      onOpenChange={handleOpenChange}
      open
      title={isEditing ? "Изменить сигнал" : "Добавить сигнал"}
    >
      <form className="signal-form" noValidate onSubmit={submitForm}>
        <div className="signal-form__fields">
          <div className="field signal-form__field--wide">
            <label className="field__label" htmlFor={selectId}>
              Что произошло?
            </label>
            <select
              aria-describedby={errors.event ? selectErrorId : undefined}
              aria-invalid={errors.event ? true : undefined}
              className="text-input signal-form__select"
              id={selectId}
              onChange={(event) =>
                updateDraft("event", event.currentTarget.value as SignalType)
              }
              value={draft.event}
            >
              {signalTypeOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {errors.event ? (
              <span className="field__error" id={selectErrorId}>
                {errors.event}
              </span>
            ) : null}
          </div>

          <div className="signal-form__field--wide">
            <TextField
              {...(errors.location ? { error: errors.location } : {})}
              label="Где это произошло?"
              onChange={(event) =>
                updateDraft("location", event.currentTarget.value)
              }
              placeholder="Например, Северное поле"
              value={draft.location}
            />
          </div>

          <TextField
            {...(errors.count ? { error: errors.count } : {})}
            inputMode="numeric"
            label="Количество"
            min={1}
            onChange={(event) => updateDraft("count", event.currentTarget.value)}
            step={1}
            type="number"
            value={draft.count}
          />

          <TextField
            {...(errors.time ? { error: errors.time } : {})}
            label="Время"
            onChange={(event) => updateDraft("time", event.currentTarget.value)}
            type="time"
            value={draft.time}
          />

          <div className="signal-form__field--wide">
            <Slider
              aria-describedby={errors.intensity ? intensityErrorId : undefined}
              aria-invalid={errors.intensity ? true : undefined}
              label="Насколько сильным был сигнал?"
              max={10}
              min={1}
              onChange={(event) =>
                updateDraft("intensity", event.currentTarget.value)
              }
              step={1}
              value={draft.intensity}
              valueText={`${draft.intensity} из 10`}
            />
            {errors.intensity ? (
              <span className="field__error" id={intensityErrorId}>
                {errors.intensity}
              </span>
            ) : null}
          </div>
        </div>

        {errors.form ? (
          <p className="signal-form__error" role="alert">
            {errors.form}
          </p>
        ) : null}

        <div className="signal-form__actions">
          <Button type="submit">
            {isEditing ? "Сохранить изменения" : "Добавить наблюдение"}
          </Button>
          <Button onClick={onCancel} variant="quiet">
            Отмена
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

function createDraft(signal?: SignalEvent): SignalDraft {
  return {
    event: signal?.event ?? "missing_carrot",
    location: signal?.location ?? "",
    count: signal ? String(signal.count) : "1",
    intensity: signal ? String(signal.intensity) : "5",
    time: signal?.time ?? "",
  };
}

function createSignalId(signals: readonly SignalEvent[]): string {
  const existingIds = new Set(signals.map(({ id }) => id));
  const randomPart =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID().replaceAll("-", "").slice(0, 16)
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  const baseId = `evt_${randomPart}`;
  let candidate = baseId;
  let collisionIndex = 2;

  while (existingIds.has(candidate)) {
    candidate = `${baseId}_${collisionIndex}`;
    collisionIndex += 1;
  }

  return candidate;
}

function isSignalField(value: PropertyKey): value is SignalField {
  return ["event", "location", "count", "intensity", "time"].includes(
    String(value),
  );
}

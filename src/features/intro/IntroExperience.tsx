import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "../../components/ui";

type IntroExperienceProps = {
  readonly onComplete: () => void;
  readonly onDismiss?: () => void;
  readonly reopened?: boolean;
};

const signals = [
  { label: "Пропавшая морковь", type: "dots" },
  { label: "Новые ямки", type: "rings" },
  { label: "Движение", type: "arcs" },
  { label: "Шорох", type: "waves" },
] as const;

export function IntroExperience({
  onComplete,
  onDismiss,
  reopened = false,
}: IntroExperienceProps) {
  const actionRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.64;

  useEffect(() => {
    if (!reopened) {
      return undefined;
    }

    actionRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onDismiss?.();
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        actionRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onDismiss, reopened]);

  return (
    <motion.main
      animate={{ opacity: 1, scale: 1 }}
      aria-labelledby="intro-product-title"
      aria-modal={reopened ? "true" : undefined}
      className="product-intro"
      exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.99 }}
      initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.995 }}
      key="intro"
      role={reopened ? "dialog" : undefined}
      transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
    >
      <div aria-hidden="true" className="product-intro__field-lines">
        <span />
        <span />
        <span />
      </div>

      <header className="product-intro__header">
        <span className="product-intro__index">Введение · 01</span>
        <span className="product-intro__mode">Локальная система наблюдения</span>
      </header>

      <div className="product-intro__layout">
        <section className="product-intro__copy">
          <p className="product-intro__product" id="intro-product-title">
            Farm of Invisible Rabbits
          </p>
          <h1>Их не видно. Но следы остаются.</h1>
          <p className="product-intro__explanation">
            Farm of Invisible Rabbits анализирует косвенные сигналы на ферме и
            помогает оценить возможное количество невидимых кроликов.
          </p>

          <ul aria-label="Наблюдаемые сигналы" className="intro-signal-list">
            {signals.map((signal, index) => (
              <motion.li
                animate={{ opacity: 1, y: 0 }}
                initial={{
                  opacity: 0,
                  y: prefersReducedMotion ? 0 : 8,
                }}
                key={signal.type}
                transition={{
                  delay: prefersReducedMotion ? 0 : 0.16 + index * 0.07,
                  duration: prefersReducedMotion ? 0 : 0.44,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <TraceMark type={signal.type} />
                <span>{signal.label}</span>
              </motion.li>
            ))}
          </ul>

          <p className="product-intro__prompt">
            Меняйте наблюдения, проверяйте гипотезы и смотрите, как система
            объясняет результат.
          </p>

          <div className="product-intro__actions">
            <Button
              className="product-intro__cta"
              onClick={onComplete}
              ref={actionRef}
            >
              Открыть радар
              <span aria-hidden="true">↗</span>
            </Button>
            <p className="product-intro__trust">
              <span aria-hidden="true" className="product-intro__trust-mark" />
              Все расчёты прозрачны и воспроизводимы
            </p>
          </div>
        </section>

        <IntroTraceField />
      </div>
    </motion.main>
  );
}

type TraceType = (typeof signals)[number]["type"];

function TraceMark({ type }: { readonly type: TraceType }) {
  return (
    <svg aria-hidden="true" className={`trace-mark trace-mark--${type}`} viewBox="0 0 48 32">
      {type === "dots" ? (
        <>
          <circle cx="10" cy="22" r="3" />
          <circle cx="23" cy="13" r="2.5" />
          <circle cx="37" cy="20" r="2" />
        </>
      ) : null}
      {type === "rings" ? (
        <>
          <circle cx="24" cy="16" r="6" />
          <circle cx="24" cy="16" r="12" />
        </>
      ) : null}
      {type === "arcs" ? (
        <>
          <path d="M11 24c5-9 13-13 25-12" />
          <path d="M17 27c4-6 10-9 19-8" />
        </>
      ) : null}
      {type === "waves" ? (
        <>
          <path d="M5 12c6-7 12 7 18 0s12 7 19 0" />
          <path d="M5 22c6-7 12 7 18 0s12 7 19 0" />
        </>
      ) : null}
    </svg>
  );
}

function IntroTraceField() {
  return (
    <div aria-hidden="true" className="intro-trace-field">
      <svg className="intro-trace-field__svg" viewBox="0 0 620 680">
        <path className="intro-field-line" d="M32 566C163 477 324 464 590 279" />
        <path className="intro-field-line intro-field-line--quiet" d="M58 638C216 544 393 532 604 444" />

        <g className="intro-trace intro-trace--dots">
          <circle cx="162" cy="164" r="8" />
          <circle cx="205" cy="129" r="6" />
          <circle cx="248" cy="164" r="5" />
          <circle cx="278" cy="116" r="3.5" />
        </g>

        <g className="intro-trace intro-trace--rings">
          <circle cx="438" cy="235" r="29" />
          <circle cx="438" cy="235" r="52" />
          <circle cx="438" cy="235" r="78" />
        </g>

        <g className="intro-trace intro-trace--arcs">
          <path d="M124 421c34-47 86-70 155-67" />
          <path d="M148 463c48-57 110-83 185-76" />
          <path d="M181 499c48-49 105-69 171-57" />
        </g>

        <g className="intro-trace intro-trace--waves">
          <path d="M360 554c29-36 58 36 87 0s58 36 87 0" />
          <path d="M351 594c32-36 64 36 96 0s64 36 96 0" />
        </g>
      </svg>

      <span className="intro-trace-label intro-trace-label--one">След 01</span>
      <span className="intro-trace-label intro-trace-label--two">След 02</span>
      <span className="intro-trace-field__caption">Наблюдения вместо догадок</span>
    </div>
  );
}

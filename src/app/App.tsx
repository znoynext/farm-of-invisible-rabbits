import { useEffect, useRef, useState, type RefObject } from "react";
import { ArrowUpRight, Info } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { SignalMark } from "../components/SignalMark";
import {
  Button,
  EmptyState,
  Surface,
} from "../components/ui";
import {
  defaultSectionId,
  navigationItems,
} from "../data/navigation";
import { IntroExperience } from "../features/intro/IntroExperience";
import { PrimaryNavigation } from "../features/navigation/PrimaryNavigation";
import { useHashNavigation } from "../hooks/useHashNavigation";
import { useAppState } from "./state";

export function App() {
  const { dispatch, state } = useAppState();
  const [isIntroReopened, setIsIntroReopened] = useState(false);
  const aboutButtonRef = useRef<HTMLButtonElement>(null);
  const shouldRestoreFocus = useRef(false);
  const shouldShowIntro = !state.uiPreferences.hasSeenIntro || isIntroReopened;

  useEffect(() => {
    if (!shouldShowIntro && shouldRestoreFocus.current) {
      shouldRestoreFocus.current = false;
      aboutButtonRef.current?.focus();
    }
  }, [shouldShowIntro]);

  function closeIntro() {
    if (isIntroReopened) {
      shouldRestoreFocus.current = true;
    }

    if (!state.uiPreferences.hasSeenIntro) {
      dispatch({ type: "ui/introSeen", payload: true });
    }

    setIsIntroReopened(false);
  }

  function dismissReopenedIntro() {
    shouldRestoreFocus.current = true;
    setIsIntroReopened(false);
  }

  return (
    <AnimatePresence initial={false} mode="sync">
      {shouldShowIntro ? (
        <IntroExperience
          onComplete={closeIntro}
          onDismiss={dismissReopenedIntro}
          reopened={isIntroReopened}
        />
      ) : (
        <RadarApp
          aboutButtonRef={aboutButtonRef}
          onOpenIntro={() => setIsIntroReopened(true)}
        />
      )}
    </AnimatePresence>
  );
}

type RadarAppProps = {
  readonly aboutButtonRef: RefObject<HTMLButtonElement | null>;
  readonly onOpenIntro: () => void;
};

function RadarApp({ aboutButtonRef, onOpenIntro }: RadarAppProps) {
  const activeSectionId = useHashNavigation();
  const prefersReducedMotion = useReducedMotion();
  const activeSection =
    navigationItems.find((item) => item.id === activeSectionId) ??
    navigationItems.find((item) => item.id === defaultSectionId);

  if (!activeSection) {
    return null;
  }

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="app-shell"
      exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.995 }}
      initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.005 }}
      key="radar"
      transition={{
        duration: prefersReducedMotion ? 0 : 0.64,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <a className="skip-link" href="#main-content">
        Перейти к содержимому
      </a>

      <div aria-hidden="true" className="field-lines">
        <span />
        <span />
        <span />
      </div>

      <header className="site-header">
        <a aria-label="Farm of Invisible Rabbits — главная" className="brand" href="#overview">
          <SignalMark className="brand-mark" />
          <span className="brand-name">Farm of Invisible Rabbits</span>
        </a>
        <div className="header-cluster">
          <PrimaryNavigation activeSection={activeSectionId} />
          <Button
            aria-label="О проекте"
            className="about-button"
            onClick={onOpenIntro}
            ref={aboutButtonRef}
            size="compact"
            variant="quiet"
          >
            <Info aria-hidden="true" size={17} strokeWidth={1.8} />
            <span>О проекте</span>
          </Button>
        </div>
      </header>

      <main className="content-frame" id="main-content">
        <section aria-labelledby="product-title" className="intro-column">
          <p className="status-line">
            <span aria-hidden="true" className="status-dot" />
            Система готова к наблюдению
          </p>
          <h1 id="product-title">Farm of Invisible Rabbits</h1>
          <p className="subtitle">
            Система наблюдения за невидимыми кроликами
          </p>
          <div aria-label="Принципы системы" className="intro-facts">
            <span>Локальная модель</span>
            <span>Косвенные сигналы</span>
            <span>Объяснимый результат</span>
          </div>
        </section>

        <AnimatePresence mode="wait">
          <motion.section
            animate={{ opacity: 1, y: 0 }}
            aria-labelledby="section-title"
            className="section-transition"
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
            key={activeSection.id}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.32,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {activeSection.id === "overview" ? (
              <Surface className="section-stage overview-surface">
                <div className="section-copy">
                  <p className="eyebrow">{activeSection.eyebrow}</p>
                  <h2 id="section-title">{activeSection.title}</h2>
                  <p>{activeSection.description}</p>
                </div>
                <ObservationField />
              </Surface>
            ) : (
              <Surface
                className="section-stage placeholder-surface"
                tone="secondary"
              >
                <EmptyState
                  description={activeSection.description}
                  eyebrow={activeSection.eyebrow}
                  title={activeSection.title}
                  titleId="section-title"
                />
                <div aria-hidden="true" className="placeholder-trace">
                  <SignalMark />
                </div>
              </Surface>
            )}
          </motion.section>
        </AnimatePresence>
      </main>

      <footer className="site-footer">
        <span>Детерминированная модель</span>
        <span>Локальные данные</span>
        <span>Без runtime ИИ</span>
      </footer>

    </motion.div>
  );
}

function ObservationField() {
  return (
    <div
      aria-label="Поле косвенных сигналов: точки, кольца, дуги и волны"
      className="observation-field"
      role="img"
    >
      <svg
        aria-hidden="true"
        className="evidence-constellation"
        viewBox="0 0 720 360"
      >
        <path className="field-path field-path--one" d="M35 284C179 170 328 149 685 77" />
        <path className="field-path field-path--two" d="M44 326C236 227 437 201 681 176" />
        <circle className="signal-ring signal-ring--large" cx="184" cy="112" r="36" />
        <circle className="signal-ring signal-ring--small" cx="184" cy="112" r="20" />
        <circle className="signal-dot signal-dot--one" cx="395" cy="210" r="7" />
        <circle className="signal-dot signal-dot--two" cx="423" cy="228" r="4" />
        <circle className="signal-dot signal-dot--three" cx="371" cy="238" r="3" />
        <path className="signal-arc" d="M502 117c37 5 67 30 78 63" />
        <path className="signal-arc signal-arc--outer" d="M511 86c55 8 99 46 115 96" />
        <path className="signal-wave" d="M96 249c22-18 44 18 66 0s44 18 66 0" />
        <path className="signal-wave signal-wave--quiet" d="M84 270c28-18 56 18 84 0s56 18 84 0" />
      </svg>
      <span aria-hidden="true" className="location-label location-label--garden">
        Огород
      </span>
      <span aria-hidden="true" className="location-label location-label--barn">
        Сарай
      </span>
      <span aria-hidden="true" className="location-label location-label--fence">
        У забора
      </span>
      <div aria-hidden="true" className="field-caption">
        <span>Косвенные сигналы</span>
        <ArrowUpRight size={18} strokeWidth={1.7} />
      </div>
    </div>
  );
}

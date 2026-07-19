import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { SignalMark } from "../components/SignalMark";
import {
  defaultSectionId,
  navigationItems,
} from "../data/navigation";
import { PrimaryNavigation } from "../features/navigation/PrimaryNavigation";
import { useHashNavigation } from "../hooks/useHashNavigation";

export function App() {
  const activeSectionId = useHashNavigation();
  const prefersReducedMotion = useReducedMotion();
  const activeSection =
    navigationItems.find((item) => item.id === activeSectionId) ??
    navigationItems.find((item) => item.id === defaultSectionId);

  if (!activeSection) {
    return null;
  }

  return (
    <div className="app-shell">
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
        <PrimaryNavigation activeSection={activeSectionId} />
      </header>

      <main className="content-frame" id="main-content">
        <div className="intro-column">
          <p className="status-line">
            <span aria-hidden="true" className="status-dot" />
            Система готова к наблюдению
          </p>
          <h1>Farm of Invisible Rabbits</h1>
          <p className="subtitle">
            Система наблюдения за невидимыми кроликами
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.section
            animate={{ opacity: 1, y: 0 }}
            aria-labelledby="section-title"
            className="section-stage"
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
            key={activeSection.id}
            transition={{ duration: prefersReducedMotion ? 0 : 0.28 }}
          >
            <div className="section-copy">
              <p className="eyebrow">{activeSection.eyebrow}</p>
              <h2 id="section-title">{activeSection.title}</h2>
              <p>{activeSection.description}</p>
            </div>

            <div aria-hidden="true" className="observation-field">
              <div className="observation-orbit">
                <span className="observation-point observation-point-large" />
                <span className="observation-point observation-point-small" />
                <span className="observation-arc" />
              </div>
              <div className="field-caption">
                <span>Косвенные сигналы</span>
                <ArrowUpRight size={18} strokeWidth={1.7} />
              </div>
            </div>
          </motion.section>
        </AnimatePresence>
      </main>

      <footer className="site-footer">
        <span>Одностраничное приложение</span>
        <span>Локальные данные</span>
        <span>Объяснимая модель</span>
      </footer>
    </div>
  );
}

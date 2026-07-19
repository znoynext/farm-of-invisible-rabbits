import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Surface } from "../../components/ui";
import { publicAiWorklogCheckpoints } from "../../data/aiWorklog";

export function AiWorklogSection() {
  const [expandedPromptId, setExpandedPromptId] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <Surface className="worklog-section section-stage" id="ai-worklog">
      <header className="worklog-hero">
        <div>
          <p className="eyebrow">AI Worklog</p>
          <h1 id="section-title">AI Worklog</h1>
        </div>
        <div className="worklog-hero__introduction">
          <p>
            Как проект создавался с помощью ИИ, какие решения принимал человек и
            как результат проходил проверку.
          </p>
          <p>
            Здесь нет скрытых рассуждений или полной переписки — только важные
            решения, изменения и результаты проверок.
          </p>
        </div>
      </header>

      <section
        aria-labelledby="worklog-questions-title"
        className="worklog-questions"
      >
        <div>
          <p className="eyebrow">Что показывает журнал</p>
          <h2 id="worklog-questions-title">От первой задачи до финальной проверки</h2>
        </div>
        <ol>
          <li>
            <strong>Первая задача</strong>
            <span>Как был сформулирован стартовый запрос к AI.</span>
          </li>
          <li>
            <strong>Помощь AI</strong>
            <span>Какие варианты структуры, архитектуры и интерфейса предложил AI.</span>
          </li>
          <li>
            <strong>Решение человека</strong>
            <span>Что было принято, изменено или отклонено.</span>
          </li>
          <li>
            <strong>Доработка продукта</strong>
            <span>Как менялись логика, UX/UI и поведение интерфейса.</span>
          </li>
          <li>
            <strong>Слабые места</strong>
            <span>Какие проблемы нашли проверки и внешние аудиты и как их исправили.</span>
          </li>
          <li>
            <strong>Проверка результата</strong>
            <span>Какие тесты и ручные проверки подтвердили итог.</span>
          </li>
        </ol>
      </section>

      <div aria-label="Принцип работы" className="worklog-process">
        <span>Предложение AI</span>
        <span aria-hidden="true">→</span>
        <span>Решение человека</span>
        <span aria-hidden="true">→</span>
        <span>Изменение</span>
        <span aria-hidden="true">→</span>
        <span>Проверка</span>
      </div>

      <div className="worklog-selection-note">
        <span>{String(publicAiWorklogCheckpoints.length).padStart(2, "0")}</span>
        <p>
          ключевых этапов из полного рабочего журнала — только реальные решения
          и проверки, без приватных данных.
        </p>
      </div>

      <ol className="worklog-timeline">
        {publicAiWorklogCheckpoints.map((checkpoint, index) => {
          const isExpanded = expandedPromptId === checkpoint.id;
          const promptId = `worklog-prompt-${checkpoint.id}`;
          const sequence = String(index + 1).padStart(2, "0");

          return (
            <li
              className="worklog-entry"
              data-emphasis={checkpoint.emphasis}
              data-testid="ai-worklog-checkpoint"
              key={checkpoint.id}
            >
              <div aria-hidden="true" className="worklog-entry__marker">
                <span>{sequence}</span>
                <i />
              </div>

              <article aria-labelledby={`worklog-title-${checkpoint.id}`}>
                <header className="worklog-entry__header">
                  <p>{checkpoint.phase}</p>
                  <h2 id={`worklog-title-${checkpoint.id}`}>
                    {checkpoint.sourceTitle}
                  </h2>
                  <p className="worklog-entry__task">
                    <span className="worklog-label">Задача этапа</span>
                    {checkpoint.task}
                  </p>
                </header>

                <div className="worklog-decision-flow">
                  <section aria-label="Предложение AI">
                    <p className="worklog-label">Что предложил AI</p>
                    <p>{checkpoint.aiSuggestion}</p>
                  </section>
                  <span aria-hidden="true" className="worklog-decision-flow__arrow">
                    →
                  </span>
                  <section aria-label="Решение человека">
                    <p className="worklog-label">Решение человека</p>
                    <p>{checkpoint.humanDecision}</p>
                  </section>
                </div>

                <dl className="worklog-result">
                  <div>
                    <dt>
                      {checkpoint.emphasis === "audit"
                        ? "Что было не так и что исправили"
                        : "Что изменилось"}
                    </dt>
                    <dd>{checkpoint.changed}</dd>
                  </div>
                  <div>
                    <dt>Как проверили</dt>
                    <dd>{checkpoint.validation}</dd>
                  </div>
                </dl>

                <div className="worklog-disclosure">
                  <button
                    aria-controls={promptId}
                    aria-expanded={isExpanded}
                    onClick={() =>
                      setExpandedPromptId(isExpanded ? null : checkpoint.id)
                    }
                    type="button"
                  >
                    <span>
                      {isExpanded
                        ? "Скрыть исходный запрос"
                        : "Показать исходный запрос"}
                    </span>
                    <ChevronDown aria-hidden="true" size={18} strokeWidth={1.8} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded ? (
                      <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className="worklog-prompt"
                        exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -4 }}
                        id={promptId}
                        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 6 }}
                        key={promptId}
                        transition={{
                          duration: prefersReducedMotion ? 0 : 0.2,
                          ease: [0.2, 0, 0, 1],
                        }}
                      >
                        <p className="worklog-label">
                          Как была сформулирована задача для AI
                        </p>
                        <p>{checkpoint.promptSummary}</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </article>
            </li>
          );
        })}
      </ol>

      <footer className="worklog-footer-note">
        <p>AI помогал исследовать варианты и выполнять работу.</p>
        <p>Решения, границы и критерии готовности оставались за человеком.</p>
      </footer>
    </Surface>
  );
}

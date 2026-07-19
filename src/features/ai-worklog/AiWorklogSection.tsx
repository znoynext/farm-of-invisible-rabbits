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
          <h1 id="section-title">Как я работал с ИИ</h1>
        </div>
        <div className="worklog-hero__introduction">
          <p>
            Отобранные решения, в которых ИИ предлагал подход, человек определял
            границы, а результат проходил проверку.
          </p>
          <p>
            Это не стенограмма и не скрытые рассуждения — только отобранные
            факты из рабочего журнала проекта.
          </p>
        </div>
      </header>

      <div aria-label="Принцип работы" className="worklog-process">
        <span>Предложение ИИ</span>
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
          отобранных checkpoints из полного рабочего журнала — без выдуманного
          Final QA и без публикации приватных данных.
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
                  <p className="worklog-entry__task">{checkpoint.task}</p>
                </header>

                <div className="worklog-decision-flow">
                  <section aria-label="Предложение ИИ">
                    <p className="worklog-label">Что предложил ИИ</p>
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
                    <dt>Что изменилось</dt>
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
                    <span>{isExpanded ? "Скрыть запрос" : "Показать запрос"}</span>
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
                        <p className="worklog-label">Краткий запрос к ИИ</p>
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

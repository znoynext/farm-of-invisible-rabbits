export type PublicAiWorklogCheckpoint = {
  readonly id: string;
  readonly phase: string;
  readonly sourceTitle: string;
  readonly task: string;
  readonly promptSummary: string;
  readonly aiSuggestion: string;
  readonly humanDecision: string;
  readonly changed: string;
  readonly validation: string;
  readonly emphasis: "standard" | "audit" | "milestone";
};

export const publicAiWorklogCheckpoints = [
  {
    id: "ai-first-workflow",
    phase: "Основа процесса",
    sourceTitle: "Подготовка AI-first рабочего процесса",
    task:
      "Создать правила проекта, компактный контекст и специализированные проверки до начала разработки приложения.",
    promptSummary:
      "Зафиксировать продуктовые, расчётные, визуальные и QA-требования так, чтобы следующие этапы выполнялись автономно и проверяемо.",
    aiSuggestion:
      "Оставить постоянные короткие правила в AGENTS.md, источники истины — в документации, а контекстные проверки — в отдельных project skills.",
    humanDecision:
      "Разделить product guardrails, проверку модели, visual review, фиксацию Worklog и release QA, чтобы каждый контроль включался только тогда, когда он нужен.",
    changed:
      "Появились правила проекта, пять документов-источников истины и пять skills с непересекающимися обязанностями; основная ветка получила имя main.",
    validation:
      "Структура и metadata skills проверены; поиск не нашёл placeholders, секреты или machine-specific пути. На этом этапе React-приложение и remote ещё не создавались.",
    emphasis: "milestone",
  },
  {
    id: "deterministic-domain",
    phase: "Архитектура модели",
    sourceTitle: "Детерминированная domain model",
    task:
      "Создать независимые от React расчёты estimate, confidence, contributions, locations, recommendations и validation.",
    promptSummary:
      "Реализовать канонические формулы, сохранить raw-точность и проверить обязательные инварианты стартового набора данных.",
    aiSuggestion:
      "Разделить расчёты на чистые TypeScript-модули и передавать sensitivity и weights только туда, где они действительно влияют на результат.",
    humanDecision:
      "Оставить presentation rounding за пределами domain layer, confidence считать только по наблюдениям, а Zod использовать для проверки входных событий и настроек.",
    changed:
      "Добавлены чистые domain-модули, канонические события, детерминированные рекомендации, validation schemas и unit-тесты без зависимости от React или browser APIs.",
    validation:
      "Lint, 34 unit-теста и production build прошли. Подтверждены total evidence около 4,96, estimate 5, confidence 73, diminishing returns и независимость confidence от weights и sensitivity.",
    emphasis: "standard",
  },
  {
    id: "audit-one-remediation",
    phase: "Независимый AI-аудит",
    sourceTitle: "Исправления по результатам внешнего Audit #1",
    task:
      "Закрыть gaps в runtime validation, activity semantics, recommendation ranking, CI contract и границе What-if без переписывания архитектуры.",
    promptSummary:
      "Проверить foundation независимым AI-assisted аудитом, принять решение по каждому подтверждённому finding и выполнить точечную remediation.",
    aiSuggestion:
      "Сохранить Context/useReducer и versioned persistence, расширить общие schemas, перенести activity thresholds в domain и явно ранжировать рекомендации.",
    humanDecision:
      "Архитектуру сохранить. Для продуктового What-if выделить observation-only actions, чтобы эксперимент не мог незаметно изменить model settings.",
    changed:
      "Усилены Zod-границы событий и весов, добавлены domain activity levels, стабильный top-3 ranking, test:run contract и observation-only scenario path.",
    validation:
      "Сначала аудит зафиксировал конкретные gaps, затем focused suite из 72 тестов и полный suite из 77 тестов, lint и build подтвердили исправления. Незапущенные E2E не отмечались как PASS.",
    emphasis: "audit",
  },
  {
    id: "assignment-alignment",
    phase: "Продуктовые границы",
    sourceTitle: "Повторная сверка требований перед UI",
    task:
      "Перед крупными UI-этапами собрать требования MOX assignment в единый проверяемый acceptance contract.",
    promptSummary:
      "Зафиксировать Scenario 2, интерактивность, clear primary output, AI Worklog внутри UI, deliverables и evaluation criteria.",
    aiSuggestion:
      "Вынести assignment requirements в отдельный source of truth и подключить его к product guardrails, QA и CI.",
    humanDecision:
      "Не менять одобренные архитектуру и domain model; усилить guardrails и честно оставить ещё не реализованные assignment checks незаполненными.",
    changed:
      "Добавлен assignment-level источник истины, обновлены product brief, проектные правила, product guardrails и QA checklist без изменений бизнес-логики.",
    validation:
      "Docs review подтвердил 20 обязательных clauses и 16 ещё незаполненных checks; lint, 77 тестов, build и GitHub Actions run завершились успешно.",
    emphasis: "standard",
  },
  {
    id: "design-system",
    phase: "Визуальное решение",
    sourceTitle: "Визуальный фундамент Design System",
    task:
      "Создать компактный визуальный и interaction-фундамент, затем проверить реальный desktop/mobile render.",
    promptSummary:
      "Сформировать спокойный, интеллектуальный и тактильный язык без dashboard-first и AI SaaS эстетики, с responsive и accessibility contract.",
    aiSuggestion:
      "Построить композицию на editorial asymmetry, matte surfaces, сильной типографике и отдельном mobile-порядке вместо KPI grid.",
    humanDecision:
      "Принять природную палитру с accessibility-safe оттенками и создать только реально нужные tokens и UI primitives, не раздувая component library.",
    changed:
      "App shell получил типографическую и пространственную композицию, custom SVG-следы, доступные primitives, responsive states и reduced-motion поддержку.",
    validation:
      "Desktop 1440 px, mobile 390 px и dialog проверены реальным render review. После исправления label semantics, mobile sizing и contrast прошли lint, 79 тестов, build и 8 E2E.",
    emphasis: "milestone",
  },
  {
    id: "interactive-analytical-flow",
    phase: "Связанный продуктовый flow",
    sourceTitle: "Интерактивный analytical flow",
    task:
      "Связать Signals CRUD, Farm Map, Evidence, observation-only What-if и рекомендации в объяснимый путь от данных к действию.",
    promptSummary:
      "Распространить временный сценарий на Hero, Map, Evidence и Recommendations, не меняя persistent signals до Apply. После внешнего Audit #3 устранить скрытую causality default selection.",
    aiSuggestion:
      "Использовать единый derived analytics path, pure helper для самого impactful observation и существующие scenario actions; recommendation thresholds оставить только в domain.",
    humanDecision:
      "Не создавать отдельное сохраняемое состояние для What-if. Связанный выбор менять только после явного действия пользователя; изменения сигналов должны сбрасывать устаревший сценарий, а восстановление исходных данных — выполняться только после явного подтверждения.",
    changed:
      "Карта, объяснение, What-if, рекомендации и управление сигналами соединены общей аналитикой и временным выбором. Audit #3 убрал скрытую стартовую подсветку, а Audit #4 добавил подтверждение перед заменой пользовательских наблюдений.",
    validation:
      "Регрессионные тесты подтвердили исправления Audit #3 и #4: отмена и Escape не меняют состояние, подтверждение сбрасывает сценарий и сохраняет настройки. Диалог проверен на 1440 и 390 px; число публичных записей осталось в заданном диапазоне.",
    emphasis: "audit",
  },
] as const satisfies readonly PublicAiWorklogCheckpoint[];

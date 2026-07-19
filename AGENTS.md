# Farm of Invisible Rabbits

## Project

Farm of Invisible Rabbits — интерактивное статическое SPA для тестового задания MOX Creative Studio. Пользовательский интерфейс полностью на русском языке; название продукта остаётся на английском.

Источники истины: `docs/assignment-requirements.md`, `docs/product-brief.md`, `docs/domain-model.md`, `docs/design-direction.md`, `docs/qa-checklist.md` и `docs/ai-worklog-notes.md`.

Перед major product milestone, release QA и submission сверять результат с `docs/assignment-requirements.md`.

## Working principles

- Сначала изучать текущее состояние проекта и сохранять рабочие архитектурные паттерны.
- Не переписывать работающий код без причины и не добавлять зависимости без реальной необходимости.
- Отделять domain logic от React UI; делать расчёты полностью детерминированными.
- Не использовать runtime LLM для вычислений.
- Не добавлять backend, database, authentication или секреты.
- Не утверждать, что проверка выполнена, если она не запускалась.

## Feature freeze

После успешного Audit #4 remediation продукт находится в feature freeze.

До submission разрешены только bug fixes, accessibility fixes, QA fixes, safe visual polish, documentation, release preparation и deployment.

Запрещены новые product features, изменение domain formulas без подтверждённого BLOCKER/HIGH, новые dependencies без release-critical необходимости, risky redesign и architecture migration.

## AI Worklog discipline

После каждой значимой задачи оценивать, содержит ли выполненная работа материал для AI Worklog. Использовать `ai-worklog-capture`, если принято важное архитектурное, расчётное, UX/UI, interaction, infrastructure, deployment или QA/release-решение; обнаружена существенная проблема; внешний AI-аудит выявил недостаток; либо завершён milestone.

Сначала определить, нужно обновить существующий checkpoint или создать новый. Рабочих записей может быть больше семи, но публичный AI Worklog позже должен содержать примерно 5–7 самых сильных checkpoints. Внешние AI-аудиты считать частью AI-assisted development process и фиксировать только проверенные факты, решение человека, изменения и повторную валидацию.

Не создавать checkpoint для мелких CSS fixes, formatting, routine refactoring, dependency housekeeping, обычного lint или незначительных bug fixes. Не сохранять chain-of-thought, credentials, secrets или private data.

## Product priorities

1. Корректная и проверяемая логика.
2. Современный цельный UX и высокий visual quality.
3. Интерактивность и explainability.
4. Responsive, accessibility и стабильность.
5. Реальный AI Worklog.
6. README и deployment.

## UI constraints

Избегать generic admin dashboard, типичного AI-generated SaaS UI, neon, glow, чрезмерных gradients, бессмысленного glassmorphism, декоративного 3D, нефункциональных анимаций и стандартной сетки KPI cards как основы Overview.

Использовать матовые приглушённые природные цвета, сильную типографическую иерархию, controlled whitespace, спокойные функциональные animations и отдельную mobile art direction.

## Project Skills

Загружать только навыки, относящиеся к текущей задаче:

- `product-guardrails` — при изменении архитектуры, новой продуктовой функции, UX flow, scope или завершении крупного этапа.
- `domain-model-verifier` — при изменении estimate, confidence, contributions, recommendations, model или what-if.
- `ui-art-direction` — перед реализацией крупных пользовательских экранов и визуально значимых features; сначала сформировать краткую UI specification.
- `design-quality-review` — после крупных UI-изменений.
- `ai-worklog-capture` — после значимого этапа, чтобы зафиксировать реальные решения и проверки по задаче и diff.
- `qa-release-gate` — перед milestone, release или deployment.

# AI Worklog notes

Рабочий журнал реальных AI-first решений. Не записывать chain-of-thought, секреты и события задним числом. Добавлять checkpoint только после значимого этапа и только по фактам задачи, diff и выполненных проверок.

## Шаблон checkpoint

~~~text
Stage:

Task:

Prompt summary:

AI suggestion:

Decision taken:

Reason:

What changed:

Problem found:

Validation performed:

Outcome:
~~~

## Checkpoint: Подготовка AI-first рабочего процесса

**Stage:** Подготовка AI-first рабочего процесса.

**Task:** Создать repository-level правила, компактный project context, пять специализированных project skills и основу реального AI Worklog без создания React/Vite-приложения.

**Prompt summary:** Зафиксировать продуктовые, domain, design и QA-требования так, чтобы следующие этапы могли выполняться автономно и проверяемо.

**AI suggestion:** Держать постоянные короткие правила в `AGENTS.md`, канонические спецификации — в `docs/`, а условные проверки — в отдельных skills, загружаемых только по контексту задачи.

**Decision taken:** Созданы пять навыков с непересекающимися обязанностями: product guardrails, domain verification, design review, AI Worklog capture и release QA.

**Reason:** Постоянные правила должны действовать всегда, а подробные model, design и release-проверки нужны на разных этапах. Разделение уменьшает контекст и не смешивает продуктовый scope, корректность расчётов, визуальную оценку и доказательства готовности.

**What changed:** Добавлены `AGENTS.md`, пять документов-источников истины и пять project skills с метаданными implicit invocation. Начальная ветка переименована из `master` в `main`.

**Problem found:** Первично сгенерированные кириллические описания в `agents/openai.yaml` получили повреждённую кодировку. Метаданные повторно сгенерированы в явном UTF-8 режиме; также добавлена явная политика `allow_implicit_invocation: true`.

**Validation performed:** Все пять `SKILL.md` прошли штатный `quick_validate.py`; подтверждено наличие обязательных файлов и пяти implicit-invocation policies; поиск не нашёл placeholders, секреты или machine-specific absolute paths; React/Vite-артефакты и Git remote отсутствуют; текущая ветка — `main`.

**Outcome:** AI-first среда подготовлена для следующего этапа; приложение и внешние Git-операции не создавались.

## Checkpoint: Технический фундамент frontend

**Stage:** Создание production-ready frontend foundation.

**Task:** Настроить React/TypeScript/Vite SPA со строгим TypeScript, Tailwind CSS, Motion, Lucide, Zod, ESLint, Vitest, Testing Library и Playwright; создать минимальный русский app shell без бизнес-логики.

**Prompt summary:** Подготовить запускаемый и проверяемый frontend-каркас со структурой по слоям, GitHub Pages-совместимой навигацией и обязательными lint, test и build.

**AI suggestion:** Использовать URL hash как лёгкий навигационный контракт без router, относительный Vite base для статического hosting и отдельные конфигурации unit/UI и E2E-тестов.

**Decision taken:** Создан адаптивный app shell с четырьмя русскими разделами, матовой природной палитрой, функциональным Motion-переходом и отдельной фиксированной mobile-навигацией. Архитектурные каталоги разделяют app, domain, features, components, data, hooks и styles.

**Reason:** Hash-навигация работает на GitHub Pages без server fallback и дополнительной зависимости. Разделение конфигураций не позволяет Vitest подхватывать Playwright specs, а domain остаётся свободным от преждевременной бизнес-логики.

**What changed:** Добавлены npm manifest и lockfile, Vite/Tailwind/TypeScript/ESLint/Vitest/Playwright configs, app shell, hash-navigation hook, UI-компоненты, стили, Testing Library setup, два UI-теста и один Playwright smoke test.

**Problem found:** Первая пакетная установка получила peer-конфликт неопределённой версии React types; согласованные версии установлены явно без `--force`. Первый Vitest run включил E2E spec и не имел runtime globals; области тестов разделены. Для полного E2E потребовался Chromium и запуск headless browser вне GUI-ограничений sandbox.

**Validation performed:** `npm run lint` — PASS; `npm run test` — 1 файл и 2 теста PASS; `npm run build` — PASS; Playwright smoke — 1 тест PASS; production preview вернул HTTP 200; desktop и mobile app shell проверены визуально, hash-переход работает, console errors не обнаружены; `npm audit` — 0 уязвимостей.

**Outcome:** Frontend foundation готов к следующему этапу. Backend, database, authentication, runtime LLM, бизнес-логика, Git remote и push не добавлены.

## Checkpoint: UI art direction до реализации

**Stage:** Расширение UI-first рабочего процесса.

**Task:** Добавить repository skill, который проектирует крупные пользовательские экраны и визуально значимые features до production implementation.

**Prompt summary:** Ввести обязательную краткую UI specification для Intro, Overview Hero, Farm Map, Evidence, What-if, Signals, Model, AI Worklog и других крупных UI-разделов, не смешивая её с post-implementation review.

**AI suggestion:** Разделить цикл на два явных контракта: `ui-art-direction` определяет пользовательскую задачу, иерархию, responsive-композицию, состояния, motion и критерии проверки до кода; `design-quality-review` сравнивает с ними реально отрендеренный UI после реализации.

**Decision taken:** Создан `ui-art-direction` с workflow `SPEC → IMPLEMENT → RENDER → REVIEW → REFINE → VALIDATE`; в `AGENTS.md` он расположен перед `design-quality-review` и загружается только для крупных пользовательских UI-задач.

**Reason:** Существующий review качественно оценивал готовый интерфейс, но не задавал обязательный design contract до начала реализации. Новый skill закрывает этот этап без дублирования проверки фактического результата.

**What changed:** Добавлены `.agents/skills/ui-art-direction/SKILL.md` и metadata `agents/openai.yaml`; список Project Skills в `AGENTS.md` расширен до шести навыков.

**Problem found:** До изменения repository workflow не имел отдельного pre-implementation UI specification gate.

**Validation performed:** `SKILL.md` прошёл штатный `quick_validate.py`; `openai.yaml` успешно разобран как YAML; ссылки на product, design и domain docs разрешаются; trigger и non-trigger границы, порядок skills, отсутствие placeholders, секретов и machine-specific paths проверены. Runtime-проверки приложения не запускались, поскольку исходный код и бизнес-логика не менялись.

**Outcome:** Крупные UI-задачи теперь начинаются с art direction specification, а визуальная оценка реализованного интерфейса остаётся ответственностью `design-quality-review`.

## Checkpoint: Детерминированная domain model

**Stage:** Реализация расчётной модели.

**Task:** Создать независимые от React модули estimation, confidence, contributions, locations, recommendations и validation со стартовыми данными и unit-тестами.

**Prompt summary:** Реализовать канонические формулы и rule-based рекомендации из `docs/domain-model.md`, сохранить raw-точность вычислений и проверить обязательные инварианты.

**AI suggestion:** Разделить типы, константы и каждую область расчётов на чистые TypeScript-модули; принимать sensitivity и weights только там, где они влияют на estimate, а confidence вычислять исключительно по событиям.

**Decision taken:** Расчётный слой размещён в `src/domain`, канонические события — в `src/data/initialSignals.ts`; Zod используется только для проверки входных событий и настроек, presentation rounding не входит в domain calculations.

**Reason:** Явные границы модулей делают формулы проверяемыми и не позволяют React UI или параметрам оценки неявно менять confidence. Нормализация по raw impact сохраняет точность contributions и агрегации локаций.

**What changed:** Добавлены domain types и constants, расчёты estimate и confidence, event/signal contributions, activity by location, шесть детерминированных recommendation rules, validation schemas, barrel export и шесть файлов unit-тестов. Стартовый набор содержит три заданных события без изменений значений.

**Problem found:** Первый production build выявил, что тестовые обращения к элементам `initialSignals` не учитывали `noUncheckedIndexedAccess`. Fixtures получили явные non-null assertions для известных элементов канонического массива; production-формулы не менялись.

**Validation performed:** Финальные `npm run lint` — PASS; `npm run test` — 7 файлов и 34 теста PASS; `npm run build` — PASS. Тестами подтверждены `totalEvidence ≈ 4.96`, estimate `5`, confidence `73`, diminishing returns, монотонность impact и estimate, независимость confidence от sensitivity и weights, normalization contributions, confidence bounds, location aggregation, recommendations и отклонение invalid inputs. Проверка импортов не обнаружила зависимости domain model от React или browser APIs.

**Outcome:** Детерминированная domain model готова к подключению к UI; бизнес-логика не зависит от React, backend, database, authentication или runtime LLM не добавлены.

## Checkpoint: State architecture и versioned persistence

**Stage:** Создание единого state layer.

**Task:** Реализовать React Context + useReducer, безопасное локальное сохранение, отдельные UI preferences, временный what-if preview и derived analytics без Redux или Zustand.

**Prompt summary:** Хранить только исходные сигналы, настройки модели и schema version под ключом `farm-of-invisible-rabbits:v1`; валидировать восстановленные данные через Zod, восстанавливать defaults при повреждении и не сохранять временное UI/scenario state.

**AI suggestion:** Использовать один типизированный reducer, а persistence построить как явный whitelist двух схем: продуктовый state и отдельный `hasSeenIntro`. Estimate, confidence, contributions, recommendations и location activity вычислять selectors напрямую через domain functions.

**Decision taken:** State layer размещён в `src/app/state`; основной provider подключён в корне приложения. Scenario preview хранит полный валидированный draft сигналов и настроек, применяется одной reducer action и очищается после apply/reset или изменения базовых данных.

**Reason:** Явный whitelist не позволяет временным selection, dialog, hover/focus и what-if данным случайно попасть в localStorage. Отсутствие derived analytics в reducer устраняет риск рассинхронизации исходных данных и результатов модели.

**What changed:** Добавлены state types, defaults, Zod schemas, reducer со всеми обязательными actions, versioned persistence adapter, отдельный ключ UI preferences, analytics selectors, Context provider и memoized hooks. Добавлены reducer, persistence и analytics unit-тесты; `main.tsx` обёрнут в provider без изменения пользовательского интерфейса.

**Problem found:** Первый lint после реализации сообщил две `react-hooks/exhaustive-deps` warnings в analytics hooks. Hooks изменены так, чтобы memoization явно зависела только от signals, model settings и scenario preview; повторный lint прошёл без warnings.

**Validation performed:** Focused state suite — 3 файла и 18 тестов PASS. Финальные `npm run lint` — PASS; `npm run test` — 10 файлов и 52 теста PASS; `npm run build` — PASS. Тестами подтверждены reducer transitions, add/update/delete/delete-all/reset, model settings reset, corrupted JSON fallback, schema/missing-field/invalid-value fallback, отдельное сохранение `hasSeenIntro`, отсутствие scenario preview в persisted state, preview isolation и apply/reset. Derived analytics сохранили канонические estimate `5`, confidence `73`, нормализацию contributions и empty result `0/0`.

**Outcome:** Предсказуемый state layer готов к подключению продуктовых UI-разделов; новые зависимости, backend, database, authentication и runtime LLM не добавлены.

## Checkpoint: Исправления по результатам внешнего Audit #1

**Stage:** Audit #1 remediation перед созданием GitHub repository.

**Task:** Закрыть выявленные gaps в CI contract, runtime validation, activity classification, recommendation ranking и semantic границе What-if без переписывания одобренной архитектуры и без UI-изменений.

**Prompt summary:** Добавить `test:run`, унифицировать Zod contracts для SignalEvent и model weights, перенести activity thresholds в domain, усилить deterministic top-3 recommendations, зафиксировать observation-only What-if path и добавить responsive target 390 px.

**AI suggestion:** Сохранить Context/useReducer и versioned persistence, расширив существующие общие schemas и reducer actions. Для recommendations использовать явное ранжирование product priority → relevant impact → stable key, а semantic activity levels вычислять pure domain helpers.

**Decision taken:** Основные архитектурные границы сохранены. Generic scenario preview оставлен для будущих задач, а product What-if получил отдельные observation-only update/apply actions, которые не меняют model settings.

**Reason:** Audit подтвердил архитектуру, но выявил расхождение между будущим UI contract и runtime validation. Domain classification добавлена до реализации Farm Map, чтобы thresholds не переносились в React; явная priority model не позволяет менее важным однотипным location recommendations вытеснять глобальные действия.

**What changed:** Добавлен `npm run test:run`; SignalEvent schema теперь требует `count >= 1` и intensity `1–10`, веса ограничены `0–3`. Добавлены location и overall activity classifiers, activity level в location aggregation, явное recommendation ranking и термин «новая ямка». Reducer получил observation-only What-if path; QA checklist расширен target 390 px; domain source of truth и тесты обновлены.

**Problem found:** Внешний Audit #1 обнаружил gaps между UI/persisted-data contract и runtime validation, отсутствие domain activity classifications, неявный top-3 ranking и отсутствующий CI script contract. Другие замечания в checkpoint не добавлялись.

**Validation performed:** Focused `npm run test:run -- src/domain src/app/state` — 10 файлов и 72 теста PASS. Финальные `npm run lint` — PASS; `npm run test:run` — 11 файлов и 77 тестов PASS; `npm run build` — PASS. Подтверждены canonical estimate `5`, confidence `73`, validation boundaries, persisted invalid-weight fallback, reducer rejection, activity thresholds, recommendation priorities и observation-only What-if apply. `npm test` отдельно не запускался, потому что выполняет ту же команду `vitest run`. E2E и responsive 390 не запускались и не отмечались PASS, так как не обязательны для этого milestone.

**Outcome:** Все gaps Audit #1 закрыты без UI-изменений, новых зависимостей, remote или push. Milestone QA gate по обязательным проверкам — PASS.

## Checkpoint: Публичный architecture milestone и базовый CI

**Stage:** Публикация проверенного архитектурного фундамента.

**Task:** Создать публичный GitHub repository, сохранить подготовленную локальную историю как первый осмысленный milestone, добавить воспроизводимый CI и закрепить дисциплину AI Worklog.

**Prompt summary:** Опубликовать foundation после внешнего Audit #1.1, не начинать UI-разработку и deployment, запускать на каждом push и pull request обязательные lint, unit/UI tests и production build.

**AI suggestion:** Оставить remote repository пустым до первого локального commit, использовать минимальный permission scope `contents: read`, npm cache и официальный Node setup; GitHub Pages и E2E gate отложить до соответствующего этапа.

**Decision taken:** Создан PUBLIC repository `znoynext/farm-of-invisible-rabbits`; ветка `main` опубликована с root commit `96eee0c`. CI использует `actions/checkout@v6`, `actions/setup-node@v6`, Node.js 24 и последовательность `npm ci` → lint → test → build. В `AGENTS.md` добавлено постоянное правило отбора значимых AI Worklog checkpoints.

**Reason:** Публичный milestone фиксирует проверяемую точку архитектуры после аудита, а CI не позволяет следующим изменениям незаметно нарушить lint, тесты или production build. Deployment остаётся отдельным решением и не смешивается с foundation milestone.

**What changed:** Добавлены `.github/workflows/ci.yml`, минимальный честный `README.md`, расширенные исключения generated, environment, audit и editor artifacts в `.gitignore`; настроены `origin` и upstream `main`. В публичную историю вошли project foundation, skills, domain, state, persistence, Audit #1 fixes, tests и docs.

**Problem found:** Сохранённая GitHub-аутентификация первоначально была недействительна; пользователь выполнил повторный вход. Перед публичной публикацией потребовалось явное подтверждение, а отсутствующая Git identity была настроена локально с privacy-preserving GitHub noreply после разрешения пользователя.

**Validation performed:** Перед публикацией `npm run lint` — PASS; `npm run test` — 11 файлов и 77 тестов PASS; `npm run build` — PASS; canonical estimate `5` и confidence `73` подтверждены тестами. Проверка staged files не нашла секретов и незапланированных artifacts. GitHub подтвердил visibility `PUBLIC`, default branch `main` и доступность commit. GitHub Actions run `29688198881` завершён PASS: `npm ci`, lint, test и build прошли.

**Outcome:** Первый стабильный architecture milestone доступен в публичном GitHub repository, автоматический CI активен. GitHub Pages, deployment и новая UI-разработка не выполнялись.

## Checkpoint: Повторная сверка требований перед UI

**Stage:** Assignment requirements alignment перед началом крупных UI-этапов.

**Task:** Повторно сверить проект с MOX assignment перед UI-разработкой и создать явный assignment-level acceptance contract.

**Prompt summary:** Зафиксировать выбранный Scenario 2, обязательную интерактивность, clear primary output, AI Worklog внутри UI, deliverables и evaluation criteria; подключить эти требования к product guardrails, QA и CI без изменения business logic.

**AI suggestion:** Вынести assignment requirements в отдельный source of truth и добавить assignment QA gate, сохранив product brief компактным и не смешивая продуктовые предупреждения с release-статусами.

**Decision taken / Human decision:** Не менять одобренную архитектуру и domain model; усилить repository guardrails до начала UI и оставить все ещё не реализованные assignment checks незаполненными.

**Reason:** До изменения требования задания были распределены между product brief, QA и рабочими правилами, поэтому выбранный сценарий, clear output и submission contract нельзя было проверить как единый acceptance contract.

**What changed:** Добавлен `docs/assignment-requirements.md`; обновлены product brief, `AGENTS.md`, `product-guardrails` и assignment-секция QA checklist. В CI команда тестов приведена к принятому release contract `npm run test:run` без изменения test semantics.

**Problem found:** Явный assignment-level source of truth и отдельный assignment compliance gate отсутствовали. Ошибок в одобренной domain model или архитектуре не выявлено.

**Validation performed:** Docs review подтвердил 20 обязательных assignment clauses, 16 незаполненных QA checks, корректные ссылки, YAML/front matter и scoped diff без изменений `src`. `npm run lint` — PASS; `npm run test` — 11 файлов и 77 тестов PASS; `npm run build` — PASS. GitHub Actions run `29688877554` для commit `2df0138` завершён PASS с `npm run test:run`.

**Outcome:** Repository sources of truth синхронизированы с MOX assignment до начала UI. Design System, UI, domain formulas, зависимости и GitHub Pages не изменялись.

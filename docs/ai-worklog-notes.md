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

**Maintenance update:** После реализации Farm Map, Evidence, What-if, Recommendations и Signals CRUD существующие `domain-model-verifier`, `ui-art-direction` и `design-quality-review` усилены вместо создания новых пересекающихся skills. QA contract дополнен domain boundaries, connected interaction, persistence и accessibility checks; product UI, domain implementation, formulas и dependencies не менялись. Все шесть project skills прошли `quick_validate.py`, а 60 focused domain tests подтвердили отражённые в verifier контракты.

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

## Checkpoint: Визуальный фундамент Design System

**Stage:** Создание визуального и interaction-фундамента до продуктовых экранов.

**Task:** Сформировать compact UI specification, реализовать ограниченные design tokens и primitives, затем проверить реальный desktop/mobile render и исправить Critical/High проблемы.

**Prompt summary:** Создать спокойный, интеллектуальный, premium и тактильный визуальный язык без dashboard-first и AI SaaS эстетики; поддержать обязательные responsive widths, accessibility и reduced motion.

**AI suggestion:** Построить visual center как editorial asymmetry «крупная типографика ↔ поле косвенных следов», использовать ограниченные matte surfaces и отдельный mobile порядок observation → explanation вместо KPI grid или stacked desktop.

**Decision taken:** Принята стартовая природная палитра с отдельными accessibility-safe text shades; tokens разделены на color, type, space, radii, border, shadow, focus и motion. Создан только необходимый набор Button, Surface, Dialog/Sheet, TextField, Slider, Empty State и VisuallyHidden; существующая Navigation сохранена.

**Reason:** Такое разделение даёт следующим экранам единый визуальный и accessibility contract, не создавая большой абстрактный component library и не смешивая Design System с domain logic.

**What changed:** App shell получил новую типографическую и spatial composition, custom SVG-сигналы dots/rings/arcs/waves, доступный справочный dialog и честные Empty States. Добавлены token/primitives styles, UI components, unit tests и responsive Playwright coverage для пяти целевых ширин.

**Problem found:** Первый UI test выявил, что hint/error и slider output загрязняли accessible names из-за вложения в `<label>`. Render review также обнаружил растянутый mobile close-control и недостаточный контраст quiet/terracotta мелкого текста (3.04:1 и 3.90:1). Структура labels, grid alignment и text shades исправлены.

**Validation performed:** Реальные renders проверены на 1440 px и 390 px, отдельно проверен mobile dialog. `design-quality-review`: Critical — нет; две High impact группы исправлены и повторно отрендерены. `npm run lint` — PASS; `npm run test` — 12 файлов и 79 тестов PASS; `npm run build` — PASS. Playwright — 8 тестов PASS: 1440/1280/1024/768/390 без horizontal overflow, touch targets, focus-visible, Escape/focus restore, reduced motion и основной flow без console errors.

**Outcome:** Custom-designed visual foundation готов к следующим крупным UI-разделам. Domain model, state semantics, зависимости, backend и runtime LLM не изменялись; push и удалённый CI не выполнялись по условию этапа.

## Checkpoint: Короткое Intro experience

**Stage:** Реализация первого пользовательского входа в продукт.

**Task:** Создать короткое Intro без rabbit imagery и marketing landing page, сохранить выбор пользователя локально и позволить повторно открыть введение из приложения.

**Prompt summary:** На первом посещении показать смысл системы, четыре типа косвенных следов, один CTA и trust-сообщение; после CTA открывать приложение, на следующих посещениях пропускать Intro, а reset domain data не должен менять intro preference.

**AI suggestion:** Использовать полноэкранную асимметричную композицию с одним действием и собственными SVG marks; связать её с уже существующим отдельным `hasSeenIntro`, а повторное открытие хранить только как временное UI-состояние.

**Decision taken:** Intro и приложение переключаются одним Motion-переходом длительностью 640 ms. CTA выставляет `hasSeenIntro = true`; «О проекте» открывает тот же экран без изменения persistence, а закрытие возвращает focus на trigger. Для reduced motion длительность перехода и stagger равны нулю.

**Reason:** Один intro-flow не дублирует объяснение продукта и сохраняет ясную границу между долговременной UI preference, временным состоянием повторного открытия и domain data.

**What changed:** Добавлены `IntroExperience` и отдельные responsive styles с dots, rings, arcs и waves; app shell подключён к UI preference; прежний справочный контент заменён действием «О проекте». UI/reducer/E2E tests покрывают first visit, CTA, repeat visit, reopen, focus restore и изоляцию intro preference от reset данных.

**Problem found:** В post-render review повторно открытый Intro получил focus trap для соответствия dialog-семантике. Первый E2E запуск также выявил неточную проверку `focus-visible`: программный focus после pointer-click не моделировал клавиатурную модальность Chromium; проверка заменена реальной Tab-навигацией без ослабления UI styles.

**Validation performed:** Реальные renders проверены на 1440, 768 и 390 px; `design-quality-review`: Critical — нет, High impact accessibility-замечание исправлено. Финальные `npm run lint` — PASS; `npm run test` — 12 файлов и 83 теста PASS; `npm run build` — PASS; Playwright после исправления проверки — 9 тестов PASS, включая persistence, reopen/Escape/focus restore, пять responsive widths и reduced motion.

**Outcome:** Короткое Intro готово: первый визит объясняет продукт и открывает радар, повторный визит сразу ведёт в приложение, а domain reset не сбрасывает intro preference. Новые зависимости и business logic не добавлялись; push не выполнялся по условию этапа.

## Checkpoint: Ясный основной результат Overview

**Stage:** Реализация clear primary output для главного экрана.

**Task:** За 5–10 секунд показать оценку количества кроликов, уровень активности, уверенность модели, последнее наблюдение и главный фактор результата; отдельно спроектировать честный empty state и мобильную композицию.

**Prompt summary:** Создать Overview Hero с крупным `estimatedRabbits`, domain-классификацией активности, confidence, динамическим strongest evidence и переходом к объяснению. Не подменять отсутствие данных уверенным выводом о нуле; проверить Intro, Overview и empty state реальными desktop/mobile renders.

**AI suggestion:** Построить экран как единую editorial surface с ответом слева и доказательной связью справа, а не как KPI grid. Последнее наблюдение и strongest evidence вынести в чистые детерминированные domain selectors; на mobile сохранить порядок «ответ → активность → уверенность → причина → действие» и не использовать stacked desktop layout.

**Decision taken:** Canonical Overview показывает `5 предполагаемых кроликов`, «Умеренная активность», «Уверенность в оценке · 73%», последнее реальное наблюдение `10:05 · Сарай` и вычисленную фразу о новых ямках у забора. При пустом массиве сигналов отображается «Пока недостаточно данных» и действие «Добавить сигнал» без misleading zero estimate.

**Reason:** Primary output должен быть понятен до перехода к деталям, но оставаться проверяемым: React получает estimate, confidence, activity, latest observation и strongest evidence из domain/state analytics, а не вычисляет или hardcode-ит их в UI. Единая поверхность сохраняет спокойный visual language и объясняет причинную связь без dashboard-first композиции.

**What changed:** Добавлены `findLatestObservation` и `findStrongestEvidence`, расширен analytics selector, создан responsive `OverviewHero` с custom SVG traces и empty state. UI/unit/E2E tests покрывают canonical output, динамический strongest evidence, empty state, responsive widths, CTA и reduced motion.

**Problem found:** UI test выявил склеенное accessible name у составного числового заголовка; добавлена явная русская метка. Реальный render на 390 px обнаружил частичное перекрытие CTA фиксированной навигацией; мобильные вертикальные интервалы блока доказательств скорректированы и результат переснят. Первый screenshot Overview был сделан до завершения входной анимации, поэтому capture-процесс получил явную задержку до визуального review.

**Validation performed:** `npm run lint` — PASS; `npm run test` — 13 файлов и 91 тест PASS; `npm run build` — PASS; Playwright — 10 тестов PASS, включая 1440/1280/1024/768/390, canonical output, empty state и reduced motion. Domain tests подтвердили canonical estimate `5`, confidence `73`, последнее событие `evt_003` и strongest evidence `evt_002`. Проверены реальные screenshots Intro desktop/390, Overview desktop/390 и empty state; `design-quality-review`: Critical — нет, найденная High impact mobile-проблема исправлена.

**Outcome:** Clear primary output готов и связан с детерминированной моделью. Основной результат читается сразу на desktop и mobile, главный фактор вычисляется из текущих данных и весов, а отсутствие наблюдений не маскируется под уверенную оценку.

## Checkpoint: Интерактивная Farm Map

**Stage:** Реализация spatial interface в основном Overview flow.

**Task:** Показать, где на ферме происходят наблюдения, сравнить активность зон и подготовить общий выбор локации для будущей связи Farm Map → Evidence → What-if.

**Prompt summary:** Создать аналитическую 2.5D-карту на SVG/CSS/Motion без внешних картографических библиотек и изображения кролика; поддержать канонические и произвольные локации, pointer/keyboard/touch, empty state, отдельную mobile-композицию и scenario-compatible входные данные.

**AI suggestion:** Передавать карте готовую `locationActivity` через props, расширить pure domain aggregation составом типов и сильнейшим событием, а неперсистентный выбор вынести в отдельный UI context. Для неизвестных локаций использовать нормализованный deterministic hash и ограниченную область «Другие участки».

**Decision taken:** Канонические зоны получили фиксированные anchors, произвольные — стабильные координаты только в fallback-области. Интерактивность реализована HTML-кнопками поверх декоративного SVG: это сохраняет spatial language и одновременно даёт нативные accessible names, keyboard activation и touch targets. `selectedLocation` не добавлен в persisted state; `FarmMap` не знает, получены данные из base state или scenario preview.

**Reason:** Такой контракт не дублирует thresholds в React, не связывает карту с persistence и позволяет будущим Evidence/What-if использовать тот же временный выбор. Отдельная mobile-схема сохраняет смысл зон без механического уменьшения desktop SVG.

**What changed:** `aggregateLocationActivity` теперь детерминированно возвращает `signalTypes` и `strongestSignal`; добавлены placement helper, shared UI selection provider, custom marks четырёх типов сигналов, `FarmMap`, отдельные responsive styles и включение карты после Overview Hero. Unit/UI/E2E tests покрывают canonical levels, unknown fallback, selection, keyboard, 390 px touch targets, empty state и передачу scenario-derived analytics через props.

**Problem found:** Первый render review показал, что исходная фраза слишком точно связывала размер marker с raw impact, хотя визуальный размер кодирует semantic activity level. Текст уточнён: размер и тон показывают активность, а точный total impact остаётся в detail area. Артефакт видимого skip-link на locator screenshots отдельно проверен по bounding box и не оказался дефектом интерфейса.

**Validation performed:** Реальные состояния default 1440, selected 1024, mobile 390 и empty 1440 отрендерены и визуально проверены. `design-quality-review`: Critical — нет; High impact после уточнения explainability — нет. `npm run lint` — PASS; `npm run test` — 16 файлов и 99 тестов PASS; `npm run build` — PASS; Playwright — 12 тестов PASS, включая selection, keyboard, mobile touch targets, empty state, пять responsive widths и reduced motion. Существующие domain tests сохранили canonical estimate `5`, confidence `73` и исходные impact calculations.

**Outcome:** Farm Map стала основным spatial-слоем Overview и готова к будущей связи с Evidence и What-if без изменения persisted state или domain formulas. Новые зависимости, backend, database, authentication и runtime LLM не добавлялись.

## Checkpoint: Explainability и remediation Audit #2

**Stage:** Реализация подробного Evidence и устранение двух замечаний внешнего Audit #2.

**Task:** Объяснить вклад типов сигналов, места и формулу каждого события; передать `#evidence` полноценному разделу, исключить semantic contradiction между Hero и агрегированным Evidence и связать выбор с Farm Map.

**Prompt summary:** Создать editorial analytical composition без таблицы или bar-chart-first UI, раскрывать raw-derived event details по click/tap/focus, поддержать empty state и двустороннюю Evidence ↔ Farm Map связь. Hero и Evidence должны использовать единый deterministic dominant aggregated signal contract.

**AI suggestion:** Определять dominant evidence в pure domain layer по суммарному impact типа, сохранять raw precision и строить отдельные группы с формулой каждого события. Локацию в кратком выводе показывать только при явном лидерстве; временный выбор типа расширить в существующем неперсистентном UI context.

**Decision taken:** `dominantEvidence` использует агрегированный impact с фиксированным tie-breaking. Relevant location добавляется при единственной локации либо при доле не менее 60% и преимуществе минимум в 1,5 раза над следующей. Hero summary получил `overview-evidence-summary`, подробный раздел владеет `evidence`; hash-переход переводит focus на этот target. Evidence показывает устойчивые роли dominant/strong/supporting, а события одного типа рассчитываются и объясняются отдельно.

**Reason:** Один domain contract устраняет противоречие между кратким ответом и подробным анализом, не переносит вычисления в React и не выдаёт сопоставимые multi-location данные за одну точную локацию. Shared UI selection сохраняет связь областей без добавления временного состояния в persistence.

**What changed:** Добавлены `findDominantEvidence`, `buildSignalEvidenceGroups`, domain tests и контракт в `docs/domain-model.md`; создан responsive Evidence section с custom signal marks, raw-derived formula details, русскими объяснениями и empty state. Hero, analytics, Farm Map и UI selection context обновлены для единой семантики и двусторонней подсветки; CTA, unique IDs и connected interactions покрыты UI/E2E tests.

**Problem found:** Реальный render review обнаружил англоязычные технические подписи внутри русского UI и несвязанный detail карты при выборе типа сигнала. Подписи переведены, а карта теперь выбирает первую deterministic relevant location и одновременно подсвечивает все связанные зоны. Грамматика singular-объяснения также исправлена.

**Validation performed:** Реально отрендерены и проверены Evidence default/expanded на 1440 px, mobile 390 px, map-linked и empty состояния. `design-quality-review`: Critical — нет; найденные High impact языковая и linked-detail проблемы исправлены. `npm run lint` — PASS; `npm run test` — 16 файлов и 106 тестов PASS; `npm run build` — PASS; Playwright — 13 тестов PASS, включая реальный CTA target/focus, canonical contributions, формулу, unique IDs, Evidence ↔ Farm Map, empty state, пять responsive widths и reduced motion.

**Outcome:** Evidence стал главным explainability layer и закрыл оба MEDIUM замечания Audit #2. Canonical Hero и подробный анализ согласованно называют новые ямки dominant source, а multi-location сценарии не получают ложную единственную location. Новые зависимости, backend, database, authentication и runtime LLM не добавлялись.

## Checkpoint: Интерактивный analytical flow

**Stage:** Завершение основного analytical flow: Пространство → Почему → Эксперимент → Действие.

**Task:** Связать управление наблюдениями, Farm Map, Evidence, observation-only What-if и финальные rule-based рекомендации в один объяснимый путь от входных данных к действию.

**Prompt summary:** По умолчанию выбрать самое impactful event-level наблюдение, сравнить «Сейчас → Сценарий», распространить preview на Hero, Map, Evidence и Recommendations, не менять model settings и persistent signals до Apply, а финальный раздел «Что стоит сделать» построить только на существующем `buildRecommendations` с максимумом из трёх действий и deterministic ordering. По Audit #3 отделить внутренний default What-if от явного shared selection Map/Evidence. Затем подключить полноценный Signals CRUD к тому же base dataset, persistence и shared validation, исключив stale preview и selection.

**AI suggestion:** Переиспользовать уже проверенные `scenario/updateObservations` и `scenario/applyObservations`, а default event определить pure domain helper по `eventImpact`. Base analytics оставить источником колонки «Сейчас», единый scenario analytics передать всем downstream-областям. Готовые action и reason формировать в `buildRecommendations`, чтобы React не дублировал thresholds, ordering или причины.

**Decision taken:** What-if не получил собственного persisted store и не изменяет `modelSettings`. Выбор event хранится локально, tie разрешается детерминированно по `id`; изменение slider создаёт preview-копию observations. Default radio остаётся внутренним состоянием Lab, а shared `selectedLocation` и `selectedSignalType` обновляются только из явных обработчиков выбора observation или изменения intensity. Каждая CRUD mutation выполняет ordered reset scenario → изменение base signals → очистку только невалидной shared selection; восстановление сигналов не затрагивает model settings и intro preference. Hero, Farm Map, Evidence и финальный Recommendations читают scenario analytics до Apply. Recommendations вынесены из лаборатории в самостоятельный supporting action layer после эксперимента; action и reason приходят из domain result.

**Reason:** Один derived analytics path исключает расхождение между картиной фермы, объяснением, экспериментом и предлагаемыми действиями. Observation-only reducer contract сохраняет независимость весов и sensitivity, а отдельный финальный Recommendations не конкурирует с primary result и завершает flow практическим следующим шагом.

**What changed:** Добавлены pure helper `findMostImpactfulObservation`, domain contract What-if, responsive `WhatIfScenarioLab`, comparison, event selection, slider, inline Apply confirmation и empty state. Hero, Farm Map и Evidence подключены к preview analytics. `buildRecommendations` расширен отдельными action/reason без изменения правил, создан responsive раздел «Что стоит сделать» для canonical, low-confidence, high-estimate, multiple-holes, empty и preview states. В remediation удалён mount-time propagation default observation; connected selection перенесён в `selectObservation` и `updateIntensity`. Раздел `#signals` заменил placeholder на responsive editorial list, add/edit sheet, direct single delete, confirmed delete all и restore; формы используют `signalEventSchema`, сохраняют id при edit и генерируют уникальный id при add. Unit/UI/E2E regression покрывает CRUD, validation, persistence/reload, scenario reset, selection cleanup, coordinated empty states и canonical restore.

**Problem found:** Полный UI suite обнаружил второй одинаковый CTA «Добавить сигнал» в empty Overview после добавления Lab; лишнее действие удалено. Production build выявил nullable narrowing внутри обработчика intensity; значения зафиксированы после empty guard. После добавления Recommendations старый E2E locator заголовка карты стал неоднозначным из-за нового `h3` с названием той же зоны; locator уточнён через exact match, продуктовая семантика не менялась. Внешний Audit #3 выявил скрытую mount-time causality: default observation сразу выставляло Map/Evidence selected state без действия пользователя. Первый build remediation также потребовал зафиксировать `location` и `event` после nullable guard для TypeScript closure. При Signals implementation strict build выявил явные `undefined` в optional props; они заменены conditional props без ослабления TypeScript. Focused UI tests нашли нестабильный `onOpenChange`, который повторно запускал focus-init Dialog при каждом вводе и мог закрыть форму на пробеле; callback стабилизирован.

**Validation performed:** Focused recommendations/domain/What-if suite — 3 файла и 19 тестов PASS. Для Audit #3 новый regression test сначала воспроизвёл `aria-pressed="true"` на initial Map и после fix прошёл; focused What-if suite — 6 тестов PASS, focused Playwright — 1 тест PASS. Signals focused suite — 4 файла и 41 тест PASS; CRUD E2E journey — PASS. Финальные `npm run lint` — PASS; `npm run test` — 20 файлов и 129 тестов PASS; `npm run build` — PASS; Playwright — 15 тестов PASS, включая neutral initial selection, observation-only preview/apply/reload, полный CRUD/reload/empty/restore journey, пять responsive widths и reduced motion. Recommendations ранее реально отрендерены и просмотрены в default и preview на 1440 px, empty на 1280 px и default на 390 px; remediation states Map/Evidence/What-if реально отрендерены и проверены до и после slider interaction на 1440 и 390 px. Signals list, add/edit form, empty state и long-location state реально проверены на 1440, 1280, 1024 и 390 px. `design-quality-review`: Critical — нет; найденная High impact focus-проблема исправлена.

**Outcome:** Основной analytical flow завершён: пользователь управляет исходными наблюдениями, видит пространство сигналов, понимает причины оценки, проверяет гипотезу и получает до трёх детерминированных действий. Default What-if selection больше не выглядит как пользовательский выбор на Map/Evidence; connected state появляется только после осмысленного взаимодействия. Preview согласованно меняет весь Overview, но не затрагивает persistent observations и model settings до явного Apply; CRUD безопасно делает изменённые persisted signals единственным новым base source. Новые зависимости, backend, database, authentication и runtime LLM не добавлялись.

## Checkpoint: Прозрачная настройка модели без stale scenario

**Stage:** Реализация управления интерпретацией observations.

**Task:** Создать объяснимый раздел «Модель оценки» с sensitivity, весами сигналов, live analytics, persistence и безопасным взаимодействием с active What-if preview.

**Prompt summary:** Дать пользователю диапазоны sensitivity `0.5–1.5` и weights `0–3`, сохранить canonical defaults и confidence invariants, пересчитывать связанные analytics, объяснить эвристическую формулу и не допустить stale scenario state при model mutation.

**AI suggestion:** Считать model setting изменением базовой модели: сначала сбрасывать observation preview, затем применять валидированную mutation через существующий reducer. Не хранить analytics в state и не менять shared selection, если observations и её ссылки остаются валидными.

**Decision taken:** UI отправляет ordered `scenario/reset` → `modelSettings/update` или `modelSettings/reset`; reducer повторно гарантирует scenario cleanup и валидирует значения через Zod. Signals и intro preference сохраняются, явная Map/Evidence selection не очищается и новая selection не создаётся. Все live значения приходят из общего `deriveAnalytics` path.

**Reason:** Scenario preview содержит снимок observations и model settings; его сохранение после изменения базовой модели создало бы два несогласованных источника результата. Поскольку model mutation не удаляет observations, существующая явная selection остаётся валидной и не требует скрытого изменения.

**What changed:** Placeholder `#model` заменён full-width responsive разделом с live estimate, dominant evidence, неизменным confidence, sensitivity, четырьмя signal-weight controls, qualitative influence, reset feedback, прозрачной цепочкой расчёта и двумя disclaimers. Добавлены UI, reducer и E2E tests для boundaries, analytics, persistence/reload, reset и scenario causality.

**Problem found:** Первый desktop render сохранил базовую двухколоночную app-shell сетку и сжал Model в левую колонку; добавлен отдельный full-width contract `content-frame--model`. Focused E2E также выявил неверное ожидание теста: после усиления веса моркови default What-if корректно меняется на другое самое impactful observation; проверка заменена на настоящий контракт отсутствующего preview и disabled Apply.

**Validation performed:** Focused suite — 10 файлов и 89 тестов PASS. Реально отрендерены default 1440/1024/768/390, changed sensitivity, changed weights и reset; после исправления `design-quality-review`: Critical — нет, High impact — нет. Финальные `npm run lint` — PASS; `npm run test` — 21 файл и 138 тестов PASS два последовательных раза; `npm run build` — PASS; Playwright — 16 тестов PASS, включая Model journey, persistence, scenario reset, пять responsive widths и reduced motion; focused propagation recheck Hero/Map/Evidence/Recommendations — 1 тест PASS.

**Outcome:** Пользователь может прозрачно настраивать интерпретацию наблюдений без изменения формул или confidence semantics. Model Settings сохраняются локально, согласованно пересчитывают продукт и не оставляют stale What-if state. Новые зависимости, backend, database, authentication и runtime LLM не добавлялись.

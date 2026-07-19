---
name: ui-art-direction
description: Проектировать краткую UI/UX specification Farm of Invisible Rabbits до реализации Intro, Overview Hero, Farm Map, Evidence, What-if Scenario Lab, Signals, Model, AI Worklog и других крупных пользовательских UI features. Не использовать для domain calculations, bug fixes без изменения UX, dependency updates или refactoring без изменения интерфейса; фактически реализованный UI после реализации проверяет design-quality-review.
---

# UI Art Direction

Сначала сформировать решение, затем начинать production implementation. Не заменять этим навыком post-implementation ревью.

## Источники

1. Прочитать `../../../docs/product-brief.md` и `../../../docs/design-direction.md`.
2. Изучить существующую композицию, компоненты и UI-паттерны затрагиваемой области.
3. Прочитать `../../../docs/domain-model.md`, только если экран объясняет расчёты, confidence, contributions, weights, sensitivity или what-if.

## UI specification

Сформировать краткую спецификацию в контексте задачи. Не создавать отдельный файл без практической необходимости.

### User goal

Определить одну пользовательскую задачу экрана и критерий её успешного завершения.

### What user understands in 3 seconds

Сформулировать, какой ответ, состояние или следующий шаг должен быть очевиден практически сразу.

### Primary information

Назвать главное содержимое и данные, без которых экран не решает задачу.

### Primary action

Выбрать одно главное действие либо явно указать, что экран информационный и primary CTA не нужен.

### Secondary actions

Оставить только поддерживающие действия. Не создавать конкурирующие или лишние CTA.

### Information hierarchy

Определить:

- visual center;
- primary information;
- supporting information;
- details on demand.

### Desktop composition

Описать сетку, visual center, направление чтения, пространство и отношения между основными областями.

### Tablet composition

Перекомпоновать приоритеты для средней ширины. Не ограничиваться пропорциональным уменьшением desktop.

### Mobile composition

Спроектировать отдельный порядок, навигацию и touch-взаимодействия вокруг главной задачи. Не превращать mobile в простой stacked desktop layout.

### Interaction states

Выбрать только реально необходимые состояния из списка: default, hover, focus, selected, active, disabled, empty, error, loading. Не добавлять loading без реальной асинхронной операции.

### Motion

Для каждой animation назвать одну функцию:

- показать причинно-следственное изменение;
- подтвердить действие;
- показать связь;
- объяснить изменение данных;
- помочь понять переход состояния.

Если функция не определена, animation не добавлять. Для `prefers-reduced-motion` описать равноценный статический переход.

### Connected interactions

Особенно проверить связность Hero ↔ Evidence ↔ Farm Map ↔ What-if: выбор или изменение в одной области должно иметь понятное отражение в связанных областях, если связь относится к задаче экрана.

### Accessibility

Определить semantic hierarchy, keyboard flow, `focus-visible`, touch targets, отсутствие hover-only functionality и reduced-motion behavior.

### Mutation causality

Для UI, изменяющего signals или model settings, заранее определить:

- что относится к persistent state, а что остаётся temporary state;
- что происходит с активным What-if preview;
- как устраняется stale Map/Evidence selection;
- какие связанные sections пересчитываются;
- какой feedback подтверждает mutation;
- как destructive action влияет на связанные empty states.

Применять к Signals CRUD, delete all, restore initial, Model Settings и model reset. Не создавать скрытые side effects, выглядящие как пользовательский выбор.

### Forms and controls

Для Signals и Model заранее определить validation feedback, placement ошибок, destructive hierarchy, confirmation, dialog/sheet behavior, mobile keyboard/touch UX, Save/Cancel и disabled states. Не добавлять loading state для локальных synchronous operations.

## Visual principles

Добиваться ощущения современного, спокойного, минималистичного, интеллектуального, premium и визуально самостоятельного продукта.

Использовать:

- матовые приглушённые цвета;
- controlled whitespace;
- крупную типографическую иерархию;
- ограниченное количество surfaces;
- функциональную асимметрию;
- custom SVG signal marks;
- функциональный motion.

Избегать generic admin dashboard, AI-generated SaaS aesthetic, KPI grid как основы UI, neon, glow, heavy gradients, gratuitous glassmorphism, decorative 3D, одинаковых rounded cards повсюду, excessive pills, случайных иконок и bento layout без информационной причины.

Учитывать только общие принципы Apple — visual hierarchy, whitespace, motion discipline; Aviasales — понятный flow и дружелюбные controls; Blink — живой spatial data interface. Не копировать визуальные решения этих продуктов.

## Implementation handoff

1. Перед implementation проверить, что спецификация отвечает на все обязательные разделы и не оставляет нерешённых Critical-вопросов.
2. Выполнить цикл: `SPEC → IMPLEMENT → RENDER → REVIEW → REFINE → VALIDATE`.
3. После implementation не оценивать качество только по коду. Если среда позволяет, запустить приложение и получить desktop и mobile screenshots.
4. Передать спецификацию и render в `design-quality-review`: сравнить composition, hierarchy, spacing, typography, density, balance и responsive; исправить Critical и High impact проблемы.
5. Сохранить границу ответственности: этот skill проектирует и задаёт критерии до реализации, а `design-quality-review` оценивает фактический результат после неё.

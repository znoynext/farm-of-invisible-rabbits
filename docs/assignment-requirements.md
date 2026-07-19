# Assignment requirements

Acceptance contract исходного тестового задания MOX Creative Studio. Последующие продуктовые решения, milestone, release QA и submission проверяются по этому документу вместе с остальными repository sources of truth.

## Selected scenario

- **Selected scenario:** Scenario 2 — invisible rabbit farm.
- **Product:** Farm of Invisible Rabbits.

Не менять выбранный сценарий без явного решения пользователя.

## Mandatory product requirements

### Interactive interface

Результат — настоящий интерактивный интерфейс, а не статическая презентация концепции.

### Starting data

Приложение содержит стартовый dataset, позволяющий сразу увидеть осмысленный результат.

### Editable/interactable data

Пользователь работает с входными данными через controls. В текущем продукте обязательный механизм — Signals CRUD.

### Interactive controls

Изменения входных данных или параметров меняют output. Текущие механизмы:

- Signals CRUD;
- What-if;
- Model settings.

### Clear output

Основной ответ должен быть понятен быстро и явно показывать:

- estimated rabbits;
- activity;
- confidence;
- strongest evidence.

### AI Worklog

AI Worklog обязателен внутри UI. Финальная версия содержит 5–7 выбранных реальных checkpoints. Каждый сильный checkpoint отражает:

- Task;
- Prompt summary;
- AI suggestion;
- Human decision;
- What changed;
- Validation.

Не публиковать chain-of-thought, credentials, secrets или private data.

## Required deliverables

### Working product

Для текущей реализации — доступный GitHub Pages Live Demo.

### Source code

PUBLIC GitHub repository.

### README

README обязательно содержит:

- описание продукта;
- выбранный Scenario 2;
- инструкции запуска;
- stack;
- capabilities;
- краткое объяснение AI process;
- тестирование;
- limitations;
- Live Demo;
- ссылку на repository.

### AI Worklog inside UI

Обязательная часть пользовательского интерфейса, сформированная из реальных рабочих notes.

## Evaluation criteria

- Working interactivity;
- AI usage and AI Worklog quality;
- Architecture and independent decisions;
- Logic, data and testability;
- UX/UI quality;
- README and submission quality.

Приоритет — не только реализовать функции, но сделать решение понятным, проверяемым и демонстрирующим качественный AI-assisted workflow.

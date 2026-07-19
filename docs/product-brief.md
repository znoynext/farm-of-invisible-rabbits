# Product brief

## Product

**Farm of Invisible Rabbits** — интерактивная система, которая анализирует косвенные сигналы на ферме и оценивает возможное количество невидимых кроликов.

Пользовательский интерфейс полностью на русском языке. Название продукта остаётся на английском.

Выбран **Scenario 2 — invisible rabbit farm**. Assignment-level acceptance contract зафиксирован в [`docs/assignment-requirements.md`](./assignment-requirements.md).

## Основной UX flow

Введение → Ответ → Картина наблюдений → Причины оценки → Эксперимент → Рекомендации → Управление данными и моделью.

## Clear primary output

Основной ответ должен быстро объяснять estimated rabbits, activity, confidence и strongest evidence.

## Обязательные области

- Intro
- Обзор
- Сигналы
- Модель
- Работа с ИИ

## Возможности

- стартовые данные;
- добавление, редактирование, удаление и сброс сигналов;
- estimate, confidence и contributions;
- активность по локациям;
- рекомендации;
- what-if сценарии;
- веса сигналов и sensitivity;
- интерактивная карта фермы;
- локальное сохранение;
- обязательный AI Worklog внутри UI с финальной выборкой из 5–7 реальных checkpoints.

## Delivery

- публичный GitHub repository;
- live deployment;
- README;
- AI Worklog внутри интерфейса.

---
name: domain-model-verifier
description: Проверять детерминированные расчёты и инварианты модели Farm of Invisible Rabbits. Использовать при изменении estimate, confidence, contributions, recommendations, model, signal weights или what-if.
---

# Domain Model Verifier

1. Прочитать `../../../docs/domain-model.md` как каноническую спецификацию.
2. Проследить изменённый путь от входных событий до результата, не смешивая domain logic с React UI.
3. Проверить формулы тестами или воспроизводимыми вычислениями и подтвердить инварианты:
   - default estimate = `5`;
   - default confidence = `73`;
   - `0 <= confidence <= 100`;
   - `estimate >= 0`;
   - для пустых данных estimate = `0` и confidence = `0`;
   - sensitivity не влияет на confidence;
   - signal weights не влияют на confidence;
   - contributions при ненулевом evidence нормализуются до 100%, а при нулевом равны 0;
   - diminishing returns применяется после count = 5;
   - одинаковые входы всегда дают одинаковые результаты.
4. Для recommendations и what-if проверить объяснимую связь с теми же данными и формулами.
5. Зафиксировать фактически выполненные проверки и расхождения. Не утверждать корректность по одному чтению кода, если доступен исполняемый тест.

---
name: domain-model-verifier
description: Проверять детерминированные расчёты и инварианты модели Farm of Invisible Rabbits. Использовать при изменении totalEvidence, estimate, confidence, contributions, activity, dominant evidence, recommendations, model settings, signal weights или observation-only What-if.
---

# Domain Model Verifier

Оставаться строго в области deterministic calculations, model invariants, evidence calculations, recommendations и What-if model semantics. Не использовать этот skill как persistence, state-management или UI QA checklist.

## Базовая проверка

1. Прочитать `../../../docs/domain-model.md` как главный source of truth. Не дублировать из него полный алгоритм в этом skill.
2. Проследить изменённый путь от входных событий до результата, не смешивая domain logic с React UI.
3. Проверить формулы исполняемыми тестами или воспроизводимыми вычислениями. Если executable test существует, не подтверждать correctness только чтением кода.
4. Использовать tolerance для floating-point сравнений и подтвердить canonical dataset:
   - totalEvidence ≈ `4.96`;
   - estimate = `5`;
   - confidence = `73`.
5. Подтвердить model contracts:
   - `0.5 <= sensitivity <= 1.5`;
   - `0 <= signal weight <= 3`;
   - default weights: `missing_carrot = 0.7`, `new_hole = 1.4`, `motion_sensor = 2`, `barn_rustling = 1.1`;
   - `0 <= confidence <= 100`, `estimate >= 0`;
   - пустые данные дают estimate = `0` и confidence = `0`;
   - sensitivity и signal weights не влияют на confidence;
   - contributions нормализуются по raw precision, presentation rounding не участвует в расчёте;
   - diminishing returns действует после count = `5`;
   - одинаковые входы дают одинаковые результаты.

## Activity contracts

- Проверить location activity: impact `< 0.75` → `low`, `0.75 <= impact < 1.5` → `moderate`, impact `>= 1.5` → `high`.
- Проверить overall activity: estimate `0` → `none`, `1–2` → `low`, `3–6` → `moderate`, `7+` → `high`.
- В boundary tests включить `0.74`, `0.75`, значение строго меньше `1.5`, `1.5`, а также границы overall activity.

## Dominant evidence

- Проверить aggregation impact по signal type и deterministic tie-breaking.
- Убедиться, что Hero и Evidence используют единый domain contract.
- Возвращать `strongestLocation` только по documented clear-dominance rule из `../../../docs/domain-model.md`.
- Не приписывать единственную location сопоставимому multi-location evidence.

## Recommendations

- Держать rules и thresholds в domain layer; React не должен восстанавливать их.
- Проверить deterministic ranking: product priority → relevant impact → stable semantic key.
- Подтвердить максимум три результата, одинаковый ordering для одинаковых inputs и применение тех же rules к scenario preview.

## What-if model semantics

- Проверить default event по максимальному eventImpact и deterministic tie.
- Изменять только observations; Apply не должен менять modelSettings.
- Не включать sensitivity или weights в observation Scenario Lab.
- Допускать изменение confidence от intensity.
- Вычислять base и scenario через общий calculation path.
- Не добавлять сюда UI selection causality или persistence mechanics.

Зафиксировать только реально выполненные проверки и найденные расхождения.

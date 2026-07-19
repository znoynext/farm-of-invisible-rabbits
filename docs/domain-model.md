# Domain model

Это каноническая спецификация расчётов Farm of Invisible Rabbits.

## Сигналы и стандартные веса

- `missing_carrot`: `0.7`
- `new_hole`: `1.4`
- `motion_sensor`: `2.0`
- `barn_rustling`: `1.1`

Валидный `SignalEvent`: непустая после trim локация, целый `count >= 1`, числовая intensity в диапазоне `1–10` и время `HH:mm`. Каждый вес модели ограничен диапазоном `0–3`.

## Оценка количества

~~~text
effectiveCount = count, если count <= 5
effectiveCount = 5 + sqrt(count - 5), если count > 5

intensityFactor = intensity / 10
eventImpact = effectiveCount × signalWeight × intensityFactor
totalEvidence = sum(eventImpact)
estimatedRabbits = max(0, round(totalEvidence × sensitivity))
~~~

Sensitivity по умолчанию: `1.0`. Диапазон UI: `0.5–1.5`.

## Contribution

~~~text
eventContribution = eventImpact / totalEvidence × 100
~~~

При `totalEvidence = 0` contribution каждого события равен `0`.

## Confidence

~~~text
diversity = min(uniqueSignalTypes / 4, 1)
coverage = min(uniqueLocations / 3, 1)
volume = min(numberOfEvents / 5, 1)
strength = averageIntensity / 10

confidence = round(
  diversity × 30 +
  coverage × 20 +
  volume × 25 +
  strength × 25
)
~~~

При пустых данных confidence равен `0`. Значение всегда ограничено диапазоном `0–100` и не зависит от sensitivity или весов сигналов.

Confidence отражает качество и разнообразие доказательной базы, а не статистическую вероятность точного количества кроликов.

## Канонический начальный результат

- `totalEvidence ≈ 4.96`
- `estimatedRabbits = 5`
- `confidence = 73`
- contributions: `missing_carrot ≈ 28%`, `new_hole ≈ 40%`, `motion_sensor ≈ 32%`

## Уровни активности

Активность локации по `totalImpact`:

- `low`: меньше `0.75`;
- `moderate`: от `0.75` до `1.5` не включительно;
- `high`: `1.5` и выше.

Общая активность по `estimatedRabbits`:

- `none`: `0`;
- `low`: `1–2`;
- `moderate`: `3–6`;
- `high`: `7+`.

Semantic values вычисляются в domain layer; локализованные подписи принадлежат UI layer.

## Dominant evidence

`dominantEvidence` определяется по суммарному `impact` типа сигнала, а не по одному сильнейшему событию. При равном impact используется фиксированный порядок поддерживаемых типов. Hero и подробный Evidence используют один pure domain result.

Локация добавляется к краткому выводу только при ясном лидерстве внутри dominant type: это единственная локация либо она даёт не менее 60% impact типа и минимум в 1,5 раза превосходит следующую. При сопоставимых локациях вывод остаётся без ложной единственной location.

## Recommendation ranking

Rule-based рекомендации ранжируются детерминированно: product priority → relevant impact → стабильный semantic key. Глобальные рекомендации о защите урожая и недостатке доказательств не могут быть вытеснены несколькими менее важными рекомендациями одного типа только из-за порядка событий.

## What-if scenario

Scenario Lab изменяет только копию observation data. `modelSettings`, включая sensitivity и веса сигналов, берутся из основной модели без изменений. До применения preview не заменяет persistent signals; после применения сохраняется только обновлённый набор наблюдений.

По умолчанию выбирается существующее событие с максимальным `eventImpact`. При равном impact используется лексикографический порядок `id`, поэтому выбор не зависит от порядка массива. Изменение intensity может менять estimate и confidence: confidence учитывает среднюю интенсивность, но по-прежнему не зависит от sensitivity и весов.

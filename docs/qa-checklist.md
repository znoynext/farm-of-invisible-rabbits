# QA checklist

Отмечать каждый пункт только по фактически выполненной проверке.

## Assignment compliance

- [ ] Scenario 2 явно указан
- [ ] interactive interface
- [ ] starting data
- [ ] editable/interactable input data
- [ ] controls affect output
- [ ] clear primary output
- [ ] AI Worklog inside UI
- [ ] AI Worklog contains 5–7 selected checkpoints
- [ ] checkpoints based on real notes
- [ ] README explains selected scenario
- [ ] README has startup
- [ ] README has stack
- [ ] README has AI process explanation
- [ ] source code publicly accessible
- [ ] live demo accessible
- [ ] final links verified

## Functional

- [ ] initial data
- [ ] add
- [ ] edit
- [ ] delete
- [ ] delete all
- [ ] reset
- [ ] restore initial data requires explicit confirmation before replacing changed observations
- [ ] cancel/escape restore leaves signals and active scenario unchanged
- [ ] sensitivity
- [ ] weights
- [ ] what-if preview
- [ ] what-if apply
- [ ] recommendations

## Domain

- [ ] canonical totalEvidence ≈ 4.96
- [ ] canonical estimate = 5
- [ ] canonical confidence = 73
- [ ] diminishing returns
- [ ] confidence bounds
- [ ] contribution normalization
- [ ] location aggregation
- [ ] location activity boundaries
- [ ] overall activity boundaries
- [ ] dominant evidence deterministic
- [ ] dominant location clear-dominance rule
- [ ] recommendation ranking deterministic
- [ ] maximum 3 recommendations
- [ ] What-if default observation deterministic
- [ ] sensitivity does not affect confidence
- [ ] weights do not affect confidence

## Integration

- [ ] Map ↔ Evidence connected selection
- [ ] initial What-if does not create shared selection
- [ ] explicit What-if interaction connects Map/Evidence
- [ ] preview → Hero
- [ ] preview → Map
- [ ] preview → Evidence
- [ ] preview → Recommendations
- [ ] What-if Apply changes observations only
- [ ] CRUD clears stale scenario preview when required
- [ ] model mutation clears stale scenario preview when required
- [ ] invalid shared selection clears after data mutation

## Persistence

- [ ] schemaVersion persists
- [ ] signals persist
- [ ] modelSettings persist
- [ ] intro preference persists separately
- [ ] scenario preview does not persist
- [ ] Map/Evidence selection does not persist
- [ ] corrupted persistence fallback

## UI

- [ ] Intro
- [ ] Overview
- [ ] Map
- [ ] Evidence
- [ ] What-if
- [ ] Signals
- [ ] Model
- [ ] AI Worklog
- [ ] Empty state

## Responsive

- [ ] 1440 px
- [ ] 1280 px
- [ ] 1024 px
- [ ] 768 px
- [ ] 390 px

## Accessibility

- [ ] keyboard
- [ ] focus-visible
- [ ] no critical hover-only information
- [ ] interactive map controls accessible
- [ ] dialog focus trap
- [ ] Escape
- [ ] focus restore
- [ ] destructive confirmation keyboard accessible
- [ ] no color-only critical meaning
- [ ] slider names
- [ ] touch targets
- [ ] reduced motion

## Release

- [ ] lint
- [ ] unit/UI tests
- [ ] E2E
- [ ] build
- [ ] production preview
- [ ] console errors
- [ ] deployment smoke test

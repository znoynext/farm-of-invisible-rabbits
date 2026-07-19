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
- [ ] persistence
- [ ] corrupted persistence fallback
- [ ] sensitivity
- [ ] weights
- [ ] what-if preview
- [ ] what-if apply
- [ ] recommendations

## Domain

- [ ] canonical estimate = 5
- [ ] canonical confidence = 73
- [ ] diminishing returns
- [ ] confidence bounds
- [ ] contribution normalization
- [ ] location aggregation

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
- [ ] dialogs
- [ ] Escape
- [ ] focus restore
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

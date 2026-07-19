# QA checklist

Отмечать каждый пункт только по фактически выполненной проверке.

## Assignment compliance

- [x] Scenario 2 явно указан
- [x] interactive interface
- [x] starting data
- [x] editable/interactable input data
- [x] controls affect output
- [x] clear primary output
- [x] AI Worklog inside UI
- [x] AI Worklog contains 5–7 selected checkpoints
- [x] checkpoints based on real notes
- [x] README explains selected scenario
- [x] README has startup
- [x] README has stack
- [x] README has AI process explanation
- [x] README describes capabilities and limitations
- [x] README links to public repository
- [x] source code publicly accessible
- [ ] live demo accessible
- [ ] final links verified

## Functional

- [x] initial data
- [x] add
- [x] edit
- [x] delete
- [x] delete all
- [x] reset
- [x] restore initial data requires explicit confirmation before replacing changed observations
- [x] cancel/escape restore leaves signals and active scenario unchanged
- [x] sensitivity
- [x] weights
- [x] what-if preview
- [x] what-if apply
- [x] recommendations

## Domain

- [x] canonical totalEvidence ≈ 4.96
- [x] canonical estimate = 5
- [x] canonical confidence = 73
- [x] diminishing returns
- [x] confidence bounds
- [x] contribution normalization
- [x] location aggregation
- [x] location activity boundaries
- [x] overall activity boundaries
- [x] dominant evidence deterministic
- [x] dominant location clear-dominance rule
- [x] recommendation ranking deterministic
- [x] maximum 3 recommendations
- [x] What-if default observation deterministic
- [x] sensitivity does not affect confidence
- [x] weights do not affect confidence

## Integration

- [x] Map ↔ Evidence connected selection
- [x] initial What-if does not create shared selection
- [x] explicit What-if interaction connects Map/Evidence
- [x] preview → Hero
- [x] preview → Map
- [x] preview → Evidence
- [x] preview → Recommendations
- [x] What-if Apply changes observations only
- [x] CRUD clears stale scenario preview when required
- [x] model mutation clears stale scenario preview when required
- [x] invalid shared selection clears after data mutation

## Persistence

- [x] schemaVersion persists
- [x] signals persist
- [x] modelSettings persist
- [x] intro preference persists separately
- [x] scenario preview does not persist
- [x] Map/Evidence selection does not persist
- [x] corrupted persistence fallback

## UI

- [x] Intro
- [x] Overview
- [x] Map
- [x] Evidence
- [x] What-if
- [x] Signals
- [x] Model
- [x] AI Worklog
- [x] Empty state

## Responsive

- [x] 1440 px
- [x] 1280 px
- [x] 1024 px
- [x] 768 px
- [x] 390 px

## Accessibility

- [x] keyboard
- [x] focus-visible
- [x] no critical hover-only information
- [x] interactive map controls accessible
- [x] dialog focus trap
- [x] Escape
- [x] focus restore
- [x] destructive confirmation keyboard accessible
- [x] no color-only critical meaning
- [x] slider names
- [x] touch targets
- [x] reduced motion

## Release

- [x] lint
- [x] unit/UI tests
- [x] E2E
- [x] build
- [x] production preview
- [x] console errors
- [ ] deployment smoke test

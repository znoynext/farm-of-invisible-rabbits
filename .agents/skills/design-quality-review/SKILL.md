---
name: design-quality-review
description: Выполнять визуальное и UX-ревью Farm of Invisible Rabbits после крупных UI-изменений, включая новые экраны, существенные responsive-изменения, Farm Map и связанные Evidence/What-if взаимодействия.
---

# Design Quality Review

1. Прочитать `../../../docs/design-direction.md`, UI constraints в `../../../AGENTS.md` и относящиеся пункты `../../../docs/qa-checklist.md`.
2. Проверить реальные состояния интерфейса на целевых размерах, если приложение можно запустить; не выдавать чтение кода за визуальную проверку.
3. Оценить:
   - hierarchy, first impression, typography и spacing;
   - visual identity, consistency и качество Farm Map;
   - функциональность motion и `prefers-reduced-motion`;
   - desktop, tablet, mobile и touch UX;
   - keyboard, focus и другие accessibility-состояния;
   - empty states;
   - связность Evidence ↔ Farm Map ↔ What-if.
4. Для затронутых областей дополнительно проверить:
   - **Forms:** visible labels, validation, error placement, Save/Cancel hierarchy, disabled states и long values/locations;
   - **Dialogs and sheets:** desktop/mobile composition, focus trap, Escape, focus restore, internal scroll, viewport overflow и virtual keyboard risk;
   - **Destructive actions:** delete, delete all, restore/reset, ясность confirmation и отсутствие конкуренции destructive action с primary action;
   - **Model controls:** slider readability, numeric value, qualitative meaning, keyboard/touch и visual hierarchy;
   - **AI Worklog:** editorial readability, hierarchy длинного текста, prompt disclosure, mobile, отсутствие chat/transcript visual language и generic SaaS-card grid, понятную цепочку AI proposal → human decision → verification;
   - **Long-page integrity:** fixed/sticky navigation, anchors, scroll margins, последний content block, safe bottom spacing на `390px` и отсутствие horizontal overflow.
5. Не предлагать rabbit imagery, dashboard-first композицию или запрещённые визуальные приёмы.
6. Выдать краткий отчёт строго по разделам:
   - **Critical** — блокирующие проблемы;
   - **High impact** — заметные улучшения UX или качества;
   - **Polish** — необязательная доводка;
   - **Keep** — удачные решения, которые нужно сохранить.

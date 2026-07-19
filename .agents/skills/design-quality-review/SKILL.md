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
   - keyboard, focus, dialogs и другие accessibility-состояния;
   - empty states;
   - связность Evidence ↔ Farm Map ↔ What-if.
4. Не предлагать rabbit imagery, dashboard-first композицию или запрещённые визуальные приёмы.
5. Выдать краткий отчёт строго по разделам:
   - **Critical** — блокирующие проблемы;
   - **High impact** — заметные улучшения UX или качества;
   - **Polish** — необязательная доводка;
   - **Keep** — удачные решения, которые нужно сохранить.

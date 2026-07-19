# Design direction

Farm of Invisible Rabbits должен ощущаться как современный custom-designed digital product, а не dashboard-first интерфейс.

## UX-последовательность

Ответ → Пространство → Почему → Эксперимент → Действие.

## Visual language

- матовая природная палитра и приглушённые оттенки;
- крупная типографика и много controlled whitespace;
- минимальный визуальный шум;
- спокойные animations;
- custom SVG signal marks.

Самих кроликов визуально не показывать. Использовать только косвенные следы:

- `missing_carrot` — точки;
- `new_hole` — кольца;
- `motion_sensor` — расходящиеся дуги;
- `barn_rustling` — мягкие волнообразные линии.

## Farm Map

Создать интерактивную 2.5D SVG/CSS-схему. Не использовать Google Maps, Mapbox, Leaflet, Three.js или WebGL.

Связать взаимодействия: Evidence ↔ Farm Map ↔ What-if.

Motion использовать только для причинно-следственных изменений, переходов состояния, пространственной связи, появления и раскрытия информации. Поддерживать `prefers-reduced-motion`.

Desktop, tablet и mobile проектировать отдельно; mobile не должен быть простым уменьшением desktop.

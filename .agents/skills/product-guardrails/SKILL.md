---
name: product-guardrails
description: Проверять продуктовые границы и assignment contract Farm of Invisible Rabbits. Использовать при изменении архитектуры, создании новой продуктовой функции, изменении UX flow, расширении scope, завершении крупного этапа, release или submission.
---

# Product Guardrails

1. Прочитать `../../../AGENTS.md`, `../../../docs/assignment-requirements.md` и `../../../docs/product-brief.md`; при UI-решениях также прочитать `../../../docs/design-direction.md`.
2. Сопоставить задачу и фактический diff с требованиями тестового задания.
3. Проверить:
   - выбранный Scenario 2 не изменён без явного решения пользователя;
   - продукт остаётся настоящим интерактивным интерфейсом, controls влияют на output;
   - основной output быстро объясняет estimate, activity, confidence и strongest evidence;
   - UI полностью на русском языке, кроме названия Farm of Invisible Rabbits;
   - функция помогает основному UX flow и остаётся объяснимой пользователю;
   - AI Worklog остаётся обязательной частью UI и основан на реальных notes;
   - milestone, release и submission сохраняют обязательные deliverables и README contract;
   - scope не включает ненужные backend, database, authentication или runtime LLM;
   - новые зависимости и расширение scope имеют практическое обоснование.
4. Предупредить, если теряется интерактивность или clear output, отсутствует AI Worklog либо нарушается submission contract. Остановить изменение при конфликте с обязательным требованием; явно назвать конфликт и минимальный способ его устранить.
5. Сообщить только найденные отклонения, принятые решения и оставшийся риск. Не подменять этим навыком проверку формул, визуальное ревью или release QA.

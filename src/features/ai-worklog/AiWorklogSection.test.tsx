import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { publicAiWorklogCheckpoints } from "../../data/aiWorklog";
import { AiWorklogSection } from "./AiWorklogSection";

const documentedCheckpointTitles = [
  "Подготовка AI-first рабочего процесса",
  "Детерминированная domain model",
  "Исправления по результатам внешнего Audit #1",
  "Повторная сверка требований перед UI",
  "Визуальный фундамент Design System",
  "Интерактивный analytical flow",
  "Финальная проверка качества",
] as const;

describe("AiWorklogSection", () => {
  it("показывает семь отобранных реальных checkpoints", () => {
    render(<AiWorklogSection />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "От первой задачи до финальной проверки",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Как был сформулирован стартовый запрос к AI.")).toBeInTheDocument();
    expect(screen.getByText("Какие проблемы нашли проверки и внешние аудиты и как их исправили.")).toBeInTheDocument();
    expect(screen.getAllByTestId("ai-worklog-checkpoint")).toHaveLength(7);
    expect(publicAiWorklogCheckpoints.length).toBeGreaterThanOrEqual(5);
    expect(publicAiWorklogCheckpoints.length).toBeLessThanOrEqual(7);
    expect(publicAiWorklogCheckpoints.map(({ sourceTitle }) => sourceTitle)).toEqual(
      documentedCheckpointTitles,
    );

    for (const title of documentedCheckpointTitles) {
      expect(screen.getByRole("heading", { level: 2, name: title })).toBeInTheDocument();
    }
  });

  it("раскрывает и скрывает краткий запрос доступной кнопкой", async () => {
    const user = userEvent.setup();
    render(<AiWorklogSection />);

    const trigger = screen.getAllByRole("button", { name: "Показать исходный запрос" })[0]!;
    const promptId = trigger.getAttribute("aria-controls");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(promptId).toBeTruthy();
    expect(document.getElementById(promptId!)).not.toBeInTheDocument();

    trigger.focus();
    await user.keyboard("{Enter}");

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById(promptId!)).toHaveTextContent(
      publicAiWorklogCheckpoints[0].promptSummary,
    );

    await user.click(screen.getByRole("button", { name: "Скрыть исходный запрос" }));
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("не публикует секреты или локальные персональные пути", () => {
    const publicContent = JSON.stringify(publicAiWorklogCheckpoints);

    expect(publicContent).not.toMatch(/[A-Z]:\\Users\\/i);
    expect(publicContent).not.toMatch(/(?:github_pat_|ghp_|sk-)[A-Za-z0-9_-]{8,}/);
    expect(publicContent).not.toMatch(/BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/);
  });
});

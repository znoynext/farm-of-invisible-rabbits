import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { App } from "./App";

describe("App", () => {
  it("показывает название продукта и русский подзаголовок", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Farm of Invisible Rabbits",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Система наблюдения за невидимыми кроликами"),
    ).toBeInTheDocument();
  });

  it("переключает разделы через hash-навигацию", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("link", { name: "Сигналы" }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 2, name: "Сигналы фермы" }),
      ).toBeInTheDocument();
    });
    expect(window.location.hash).toBe("#signals");
  });
});

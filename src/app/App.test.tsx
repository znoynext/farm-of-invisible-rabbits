import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { App } from "./App";
import {
  AppStateProvider,
  type StorageAdapter,
  UI_PREFERENCES_KEY,
} from "./state";

class MemoryStorage implements StorageAdapter {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

function renderApp(storage = new MemoryStorage()) {
  return {
    storage,
    ...render(
      <AppStateProvider storage={storage}>
        <App />
      </AppStateProvider>,
    ),
  };
}

describe("App", () => {
  beforeEach(() => {
    window.location.hash = "";
  });

  it("при первом посещении показывает короткое введение", () => {
    renderApp();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Их не видно. Но следы остаются.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Farm of Invisible Rabbits"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Открыть радар" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", { name: "Основная навигация" }),
    ).not.toBeInTheDocument();
  });

  it("CTA открывает приложение и сохраняет intro preference", async () => {
    const user = userEvent.setup();
    const { storage } = renderApp();

    await user.click(screen.getByRole("button", { name: "Открыть радар" }));

    expect(
      await screen.findByRole("navigation", { name: "Основная навигация" }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(JSON.parse(storage.getItem(UI_PREFERENCES_KEY) ?? "null")).toEqual({
        hasSeenIntro: true,
      });
    });
  });

  it("при повторном посещении сразу показывает приложение", () => {
    const storage = new MemoryStorage();
    storage.setItem(UI_PREFERENCES_KEY, JSON.stringify({ hasSeenIntro: true }));

    renderApp(storage);

    expect(
      screen.getByRole("navigation", { name: "Основная навигация" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        level: 1,
        name: "Их не видно. Но следы остаются.",
      }),
    ).not.toBeInTheDocument();
  });

  it("повторно открывает Intro из «О проекте» и возвращает focus", async () => {
    const user = userEvent.setup();
    const storage = new MemoryStorage();
    storage.setItem(UI_PREFERENCES_KEY, JSON.stringify({ hasSeenIntro: true }));
    renderApp(storage);

    const trigger = screen.getByRole("button", { name: "О проекте" });
    await user.click(trigger);

    expect(
      await screen.findByRole("dialog", { name: "Farm of Invisible Rabbits" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Открыть радар" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "О проекте" })).toHaveFocus();
    });
  });

  it("переключает разделы через hash-навигацию", async () => {
    const user = userEvent.setup();
    const storage = new MemoryStorage();
    storage.setItem(UI_PREFERENCES_KEY, JSON.stringify({ hasSeenIntro: true }));
    renderApp(storage);

    await user.click(screen.getByRole("link", { name: "Сигналы" }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 2, name: "Сигналы фермы" }),
      ).toBeInTheDocument();
    });
    expect(window.location.hash).toBe("#signals");
  });
});

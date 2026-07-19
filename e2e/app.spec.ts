import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const targetViewports = [
  { height: 900, label: "1440", width: 1440 },
  { height: 850, label: "1280", width: 1280 },
  { height: 768, label: "1024", width: 1024 },
  { height: 900, label: "768", width: 768 },
  { height: 844, label: "390", width: 390 },
] as const;

async function openRadar(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Открыть радар" }).click();
  await expect(
    page.getByRole("navigation", { name: "Основная навигация" }),
  ).toBeVisible();
}

test("показывает Intro только при первом посещении", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Их не видно. Но следы остаются.",
    }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Открыть радар" }).click();
  await expect(
    page.getByRole("navigation", { name: "Основная навигация" }),
  ).toBeVisible();

  await page.reload();

  await expect(
    page.getByRole("navigation", { name: "Основная навигация" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Их не видно. Но следы остаются.",
    }),
  ).toBeHidden();
});

test("открывает app shell и переключает раздел", async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      runtimeErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => runtimeErrors.push(error.message));

  await openRadar(page);

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "5 предполагаемых кроликов",
    }),
  ).toBeVisible();
  await expect(page.getByText("Умеренная активность")).toBeVisible();
  await expect(page.locator(".overview-confidence")).toHaveText(
    "Уверенность в оценке · 73%",
  );
  await expect(
    page.getByText(
      "Основной источник активности — новые ямки в районе забора.",
    ),
  ).toBeVisible();
  await expect(page.getByText(/Последнее наблюдение/)).toContainText("10:05");
  await expect(
    page.getByRole("heading", { level: 2, name: "Где остаются следы" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Разобраться, почему" }).click();
  await expect(page).toHaveURL(/#evidence$/);

  await page.getByRole("link", { name: "Сигналы" }).click();

  await expect(page).toHaveURL(/#signals$/);
  await expect(
    page.getByRole("heading", { level: 2, name: "Сигналы фермы" }),
  ).toBeVisible();
  expect(runtimeErrors).toEqual([]);
});

test("связывает выбор зоны на карте с аналитическими деталями", async ({ page }) => {
  await openRadar(page);

  const garden = page.getByRole("button", {
    name: "Огород: Умеренная активность, 1 наблюдение",
  });
  await garden.scrollIntoViewIfNeeded();
  await garden.click();

  await expect(garden).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Закреплённая зона")).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: "Огород" })).toBeVisible();

  const barn = page.getByRole("button", {
    name: "Сарай: Высокая активность, 1 наблюдение",
  });
  await barn.focus();
  await page.keyboard.press("Enter");

  await expect(barn).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("heading", { level: 3, name: "Сарай" })).toBeVisible();
});

test("сохраняет touch-safe зоны в отдельной mobile-композиции карты", async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await openRadar(page);

  const map = page.getByTestId("farm-map-diagram");
  await map.scrollIntoViewIfNeeded();
  await expect(map.locator(".farm-map__landscape--mobile")).toBeVisible();
  await expect(map.locator(".farm-map__landscape--desktop")).toBeHidden();

  for (const zone of await map.getByRole("button").all()) {
    const box = await zone.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  }

  const fence = page.getByRole("button", {
    name: "У забора: Высокая активность, 1 наблюдение",
  });
  await fence.click();
  await expect(fence).toHaveAttribute("aria-pressed", "true");
});

test("повторно открывает Intro и возвращает focus после Escape", async ({
  page,
}) => {
  await openRadar(page);

  const trigger = page.getByRole("button", { name: "О проекте" });
  await trigger.click();

  await expect(
    page.getByRole("dialog", { name: "Farm of Invisible Rabbits" }),
  ).toBeVisible();

  await page.keyboard.press("Escape");

  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("показывает empty state без misleading zero estimate", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "farm-of-invisible-rabbits:ui:v1",
      JSON.stringify({ hasSeenIntro: true }),
    );
    window.localStorage.setItem(
      "farm-of-invisible-rabbits:v1",
      JSON.stringify({
        schemaVersion: 1,
        signals: [],
        modelSettings: {
          sensitivity: 1,
          weights: {
            missing_carrot: 0.7,
            new_hole: 1.4,
            motion_sensor: 2,
            barn_rustling: 1.1,
          },
        },
      }),
    );
  });
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Пока недостаточно данных" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /0 предполагаемых кроликов/ }),
  ).toHaveCount(0);
  await expect(page.getByText("Пока нет наблюдений для карты")).toBeVisible();

  await page.getByRole("link", { name: "Добавить сигнал" }).click();
  await expect(page).toHaveURL(/#signals$/);
});

for (const viewport of targetViewports) {
  test(`не создаёт horizontal overflow на ширине ${viewport.label}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await openRadar(page);

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "5 предполагаемых кроликов",
      }),
    ).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Основная навигация" })).toBeVisible();

    const firstNavigationLink = page
      .getByRole("navigation", { name: "Основная навигация" })
      .getByRole("link")
      .first();
    for (let tabIndex = 0; tabIndex < 5; tabIndex += 1) {
      if (await firstNavigationLink.evaluate((element) => element === document.activeElement)) {
        break;
      }

      await page.keyboard.press("Tab");
    }

    await expect(firstNavigationLink).toBeFocused();
    expect(
      await firstNavigationLink.evaluate(
        (element) => getComputedStyle(element).outlineStyle,
      ),
    ).toBe("solid");

    if (viewport.width <= 768) {
      const navigationLinks = page
        .getByRole("navigation", { name: "Основная навигация" })
        .getByRole("link");

      for (const link of await navigationLinks.all()) {
        const box = await link.boundingBox();
        expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
      }
    }

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );

    expect(hasHorizontalOverflow).toBe(false);
  });
}

test("сохраняет навигацию при reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openRadar(page);

  await page.getByRole("link", { name: "Модель" }).click();

  await expect(
    page.getByRole("heading", { level: 2, name: "Управление моделью" }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),
  ).toBe("auto");
});

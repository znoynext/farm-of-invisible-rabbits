import { expect, test } from "@playwright/test";

test("открывает app shell и переключает раздел", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Farm of Invisible Rabbits",
    }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Сигналы" }).click();

  await expect(page).toHaveURL(/#signals$/);
  await expect(
    page.getByRole("heading", { level: 2, name: "Сигналы фермы" }),
  ).toBeVisible();
});

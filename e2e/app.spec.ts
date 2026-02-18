import { test, expect } from "@playwright/test";

test.describe("Snake app", () => {
  test("loads and shows menu with title", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /snake/i })).toBeVisible();
    await expect(page.getByRole("button", { name: "Play", exact: true })).toBeVisible();
  });

  test("can open How to Play modal", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /how to play/i }).click();
    await expect(page.getByRole("heading", { name: /how to play/i })).toBeVisible();
    await expect(page.getByText(/guide the snake/i)).toBeVisible();
    await expect(page.getByText(/progress/i)).toBeVisible();
    await page.getByRole("button", { name: "Close" }).click();
    await expect(page.getByRole("heading", { name: /how to play/i })).not.toBeVisible();
  });

  test("can open Settings modal", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /settings/i }).click();
    await expect(page.getByRole("heading", { name: /settings/i })).toBeVisible();
    await page.getByRole("button", { name: "Close" }).click();
    await expect(page.getByRole("heading", { name: /settings/i })).not.toBeVisible();
  });

  test("can open Leaderboard modal", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /leaderboard/i }).click();
    await expect(page.getByRole("heading", { name: /leaderboard/i })).toBeVisible();
    await page.getByRole("button", { name: "Close" }).click();
    await expect(page.getByRole("heading", { name: /leaderboard/i })).not.toBeVisible();
  });

  test("starts game when Play is clicked", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Play", exact: true }).click();
    await expect(page.getByText(/ready|go|countdown/i).or(page.getByText(/score:/i))).toBeVisible({ timeout: 10000 });
  });

  test("shows Pause button when playing", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Play", exact: true }).click();
    await page.waitForTimeout(3500);
    await expect(page.getByRole("button", { name: /pause/i })).toBeVisible({ timeout: 5000 });
  });
});

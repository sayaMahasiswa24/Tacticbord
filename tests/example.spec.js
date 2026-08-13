// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/tacticbord-react/i);
});

test('loads the main page', async ({ page }) => {
  await page.goto('/');

  // Wait for the app to load
  const root = page.locator('#root');
  await expect(root).toBeVisible();
});

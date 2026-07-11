import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const BASE_URL = 'https://a1bdeac4.medioevo-site.pages.dev';

test.describe.configure({ timeout: 60000 });

test.describe('Accessibility Tests - Preview', () => {
  test('wiki home page should have no accessibility violations', async ({ page }) => {
    await page.goto(`${BASE_URL}/wiki`);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('wiki books index should have no accessibility violations', async ({ page }) => {
    await page.goto(`${BASE_URL}/wiki/books`);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('book detail page should have no accessibility violations', async ({ page }) => {
    await page.goto(`${BASE_URL}/wiki/books/00-el-observador`);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('wiki atlas index should have no accessibility violations', async ({ page }) => {
    await page.goto(`${BASE_URL}/wiki/atlas`);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('wiki systems index should have no accessibility violations', async ({ page }) => {
    await page.goto(`${BASE_URL}/wiki/systems`);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
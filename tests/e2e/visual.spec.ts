import { expect, test } from '@playwright/test';

const INTRO_KEY = 'yulia-portfolio:intro-seen';

const viewports = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1440', width: 1440, height: 900 },
] as const;

test.describe('visual regression', () => {
  for (const viewport of viewports) {
    test(`${viewport.name} full page`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript((key) => window.sessionStorage.setItem(key, '1'), INTRO_KEY);
      await page.goto('./');
      await page.evaluate(async () => { await document.fonts.ready; });
      await expect(page).toHaveScreenshot(`${viewport.name}-full.png`, {
        fullPage: true,
        animations: 'disabled',
        caret: 'hide',
        maxDiffPixelRatio: 0.012,
      });
    });
  }

  test('mobile menu open', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript((key) => window.sessionStorage.setItem(key, '1'), INTRO_KEY);
    await page.goto('./');
    await page.getByRole('button', { name: 'Меню' }).click();
    await expect(page.getByRole('dialog')).toHaveScreenshot('mobile-menu-open.png', {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.01,
    });
  });
});

import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const INTRO_KEY = 'yulia-portfolio:intro-seen';

async function skipIntro(page: Page) {
  await page.addInitScript((key) => window.sessionStorage.setItem(key, '1'), INTRO_KEY);
}

test.describe('public portfolio', () => {
  test('GIVEN the production page WHEN loaded THEN core content and contact links are available', async ({ page }) => {
    await skipIntro(page);
    await page.goto('./');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Юлия');
    const telegramLink = page.getByRole('link', { name: /Написать в Telegram/i }).first();
    await expect(telegramLink).toHaveAttribute('href', 'https://t.me/yulleishn');
    await expect(page.getByRole('heading', { name: /UNNI/i })).toBeVisible();
  });

  test('GIVEN a desktop visitor WHEN navigating by anchors THEN the intended section becomes visible', async ({ page }) => {
    await skipIntro(page);
    await page.goto('./');

    await page.getByRole('navigation', { name: 'Основная навигация' }).getByRole('link', { name: 'Проект' }).click();
    await expect(page).toHaveURL(/#case$/);
    await expect(page.locator('#case')).toBeInViewport();
  });

  test('GIVEN a mobile visitor WHEN opening and closing the menu THEN focus and navigation remain accessible', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await skipIntro(page);
    await page.goto('./');

    const menuButton = page.getByRole('button', { name: 'Меню' });
    await menuButton.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(menuButton).toBeFocused();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('GIVEN the first visit WHEN the intro completes and the page reloads THEN it is not replayed in the same session', async ({ page }) => {
    await page.goto('./');
    const intro = page.getByTestId('intro-overlay');
    await expect(intro).toBeVisible();
    await expect(intro).toBeHidden({ timeout: 3_000 });

    await page.reload();
    await expect(page.getByTestId('intro-overlay')).toHaveCount(0);
  });

  test('GIVEN reduced motion WHEN loaded THEN content remains available without requiring animation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./');

    await expect(page.getByTestId('intro-overlay')).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('#contact')).toBeAttached();
  });

  test('GIVEN representative viewports WHEN rendered THEN the document has no horizontal overflow', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 },
      { width: 375, height: 812 },
      { width: 390, height: 844 },
      { width: 430, height: 932 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1440, height: 900 },
    ];

    await skipIntro(page);
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('./');
      const dimensions = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(dimensions.scrollWidth, `overflow at ${viewport.width}px`).toBeLessThanOrEqual(
        dimensions.clientWidth + 1,
      );
    }
  });

  test('GIVEN the finished page WHEN audited THEN it has no serious or critical automated accessibility violations', async ({ page }) => {
    await skipIntro(page);
    await page.goto('./');
    const results = await new AxeBuilder({ page }).analyze();
    const highImpact = results.violations.filter(
      (violation) => violation.impact === 'critical' || violation.impact === 'serious',
    );
    expect(highImpact).toEqual([]);
  });
});

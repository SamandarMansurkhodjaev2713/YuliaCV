import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const INTRO_KEY = 'yulia-portfolio:intro-seen';
const LOCALE_KEY = 'yulia-portfolio:locale';

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
    await expect(page.getByRole('link', { name: /Написать на почту/i }).first()).toHaveAttribute(
      'href',
      'mailto:theyullek4@mail.ru',
    );
    await expect(page.getByRole('heading', { level: 2, name: /UNNI/i })).toBeVisible();
    await expect(page.locator('#experience')).toContainText('Sab Lab');
    await expect(page.locator('#experience')).toContainText('WillPower');
  });

  test('GIVEN a desktop visitor WHEN navigating by anchors THEN the intended section becomes visible', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await skipIntro(page);
    await page.goto('./');

    const navigation = page.getByRole('navigation', { name: 'Основная навигация' });
    await navigation.getByRole('link', { name: 'Проект' }).click();
    await expect(page).toHaveURL(/#case$/);
    await expect(page.locator('#case')).toBeInViewport();

    await navigation.getByRole('link', { name: 'Опыт' }).click();
    await expect(page).toHaveURL(/#experience$/);
    await expect(page.locator('#experience')).toBeInViewport();
  });

  test('GIVEN a visitor WHEN switching the language THEN copy, html lang and title follow and the choice persists', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await skipIntro(page);
    await page.goto('./');

    await page.getByRole('group', { name: 'Язык сайта' }).getByRole('button', { name: 'EN' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Yulia');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page).toHaveTitle(/Yulia Brynskikh/);
    await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Experience' })).toBeVisible();

    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Yulia');
    expect(await page.evaluate((key) => window.localStorage.getItem(key), LOCALE_KEY)).toBe('en');
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
    await expect(dialog.getByRole('link', { name: 'Опыт' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(menuButton).toBeFocused();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('GIVEN the first visit WHEN the intro completes and the page reloads THEN it is not replayed in the same session', async ({ page }) => {
    await page.goto('./');
    const intro = page.getByTestId('intro-overlay');
    await expect(intro).toBeVisible();
    await expect(intro).toHaveAttribute('data-phase', 'handoff', { timeout: 6_000 });
    await expect(intro).toHaveCount(0, { timeout: 3_000 });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page.reload();
    await expect(page.getByTestId('intro-overlay')).toHaveCount(0);
  });

  test('GIVEN the first visit WHEN the visitor clicks the intro THEN it is skipped quickly', async ({ page }) => {
    await page.goto('./');
    const intro = page.getByTestId('intro-overlay');
    await expect(intro).toBeVisible();
    await intro.click({ position: { x: 20, y: 20 }, force: true });
    await expect(intro).toHaveCount(0, { timeout: 2_500 });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
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
      { width: 360, height: 800 },
      { width: 375, height: 812 },
      { width: 390, height: 844 },
      { width: 430, height: 932 },
      { width: 500, height: 900 },
      { width: 768, height: 1024 },
      { width: 844, height: 390 },
      { width: 900, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1280, height: 800 },
      { width: 1440, height: 900 },
      { width: 1920, height: 1080 },
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
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./');
    /* WebKit reaches `load` before style resolution has finished, and
       getComputedStyle then reports the initial value for every inherited
       property — black text on every element without its own colour rule, which
       axe reads as dozens of contrast failures that do not exist on screen.
       Waiting for the fonts and a painted frame forces the real cascade. */
    await page.evaluate(async () => {
      await document.fonts.ready;
      await new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve(null)));
      });
    });
    const results = await new AxeBuilder({ page }).analyze();
    const highImpact = results.violations.filter(
      (violation) => violation.impact === 'critical' || violation.impact === 'serious',
    );
    expect(highImpact).toEqual([]);
  });
});

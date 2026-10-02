import { test, expect } from './fixtures.js';

async function startGame(page) {
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
  await page.locator('.menu__btn--play').click();
  await expect(page.locator('.menu')).toBeHidden();
  await expect(page.locator('.hud')).toBeVisible();
}

test.describe('Gameplay', () => {
  test('ESC pausa e ESC despausa', async ({ page }) => {
    await startGame(page);

    await page.keyboard.press('Escape');
    await expect(page.locator('.pause')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('.pause')).toBeHidden();
  });

  test('botão Resume retoma o jogo', async ({ page }) => {
    await startGame(page);

    await page.keyboard.press('Escape');
    await expect(page.locator('.pause')).toBeVisible();

    await page.locator('.pause__btn--resume').click();
    await expect(page.locator('.pause')).toBeHidden();
  });

  test('botão Restart reinicia a fase (fecha pausa)', async ({ page }) => {
    await startGame(page);

    await page.keyboard.press('Escape');
    await expect(page.locator('.pause')).toBeVisible();

    await page.locator('.pause__btn--restart').click();
    await expect(page.locator('.pause')).toBeHidden();
    await expect(page.locator('.hud')).toBeVisible();
  });

  test('botão Quit volta ao menu', async ({ page }) => {
    await startGame(page);

    await page.keyboard.press('Escape');
    await page.locator('.pause__btn--quit').click();

    await expect(page.locator('.menu')).toBeVisible();
    await expect(page.locator('.pause')).toBeHidden();
  });

  test('HUD mostra 3 corações e contador', async ({ page }) => {
    await startGame(page);

    const hearts = page.locator('.hud__heart');
    await expect(hearts).toHaveCount(3);

    const counter = page.locator('.hud__counter');
    await expect(counter).toHaveText(/^\d+ \/ \d+$/);
  });
});

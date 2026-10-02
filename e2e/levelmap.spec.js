import { test, expect } from './fixtures.js';

test.describe('Mapa de fases', () => {
  test('abre pelo menu e mostra 10 células', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    await page.locator('.menu__btn--map').click();
    await expect(page.locator('.levelmap')).toBeVisible();
    await expect(page.locator('.levelmap__cell')).toHaveCount(10);
  });

  test('apenas a fase 1 está desbloqueada inicialmente', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    await page.locator('.menu__btn--map').click();
    const unlocked = page.locator('.levelmap__cell:not([disabled])');
    await expect(unlocked).toHaveCount(1);
  });

  test('botão Voltar retorna ao menu', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    await page.locator('.menu__btn--map').click();
    await expect(page.locator('.levelmap')).toBeVisible();

    await page.locator('.levelmap__back').click();
    await expect(page.locator('.levelmap')).toBeHidden();
    await expect(page.locator('.menu')).toBeVisible();
  });

  test('ESC fecha o mapa e volta ao menu', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    await page.locator('.menu__btn--map').click();
    await expect(page.locator('.levelmap')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('.levelmap')).toBeHidden();
    await expect(page.locator('.menu')).toBeVisible();
  });

  test('clicar na fase 1 desbloqueada inicia o jogo', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    await page.locator('.menu__btn--map').click();
    await page.locator('.levelmap__cell:not([disabled])').first().click();

    await expect(page.locator('.levelmap')).toBeHidden();
    await expect(page.locator('.hud')).toBeVisible();
  });
});

import { test, expect } from './fixtures.js';

test.describe('Menu inicial', () => {
  test('abre com menu visível e foco em Play', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    const menu = page.locator('.menu');
    await expect(menu).toBeVisible();

    const playBtn = page.locator('.menu__btn--play');
    await expect(playBtn).toBeVisible();

    // Foco inicial deve estar em Play (via requestAnimationFrame)
    await page.waitForTimeout(200);
    const focused = await playBtn.evaluate(el => el === document.activeElement);
    expect(focused).toBe(true);
  });

  test('tem 3 botões: Play, Info, Mute', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.menu__btn--play')).toBeVisible();
    await expect(page.locator('.menu__btn--info')).toBeVisible();
    await expect(page.locator('.menu__btn--mute')).toBeVisible();
  });

  test('Play inicia o jogo (menu esconde, HUD aparece)', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    await page.locator('.menu__btn--play').click();

    // Menu some
    await expect(page.locator('.menu')).toBeHidden();
    // HUD aparece
    await expect(page.locator('.hud')).toBeVisible();
  });

  test('Info abre Como Jogar e Voltar retorna ao menu', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    await page.locator('.menu__btn--info').click();
    await expect(page.locator('.howto')).toBeVisible();

    await page.locator('.howto__back').click();
    await expect(page.locator('.howto')).toBeHidden();
    await expect(page.locator('.menu')).toBeVisible();
  });

  test('ESC fecha Como Jogar e volta ao menu', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    await page.locator('.menu__btn--info').click();
    await expect(page.locator('.howto')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('.howto')).toBeHidden();
    await expect(page.locator('.menu')).toBeVisible();
  });
});

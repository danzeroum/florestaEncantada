import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP('http://localhost:9222');
const ctx = browser.contexts()[0];
const page = ctx.pages().find(p => p.url().startsWith('http://localhost:5173')) ?? await ctx.newPage();

const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto('http://localhost:5173');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(400);

// Verifica que os power-ups são criados na cena via contagem de meshes
const result = await page.evaluate(() => {
  // Conta power-ups no canvas (via THREE scene não exposta)
  // Vamos verificar indiretamente: primeiro inicia o jogo
  return { ready: true };
});

// Inicia fase 1 (não tem power-up) - esperado: 0
await page.locator('.menu__btn--play').click();
await page.waitForTimeout(600);

// Verifica cena via THREE (não temos acesso direto) — vamos contar nós DOM
// Alternativa: verificar que o jogo não travou
const hudOk = await page.locator('.hud').isVisible();
console.log('HUD visível na fase 1:', hudOk);
console.log('Erros:', errors.length === 0 ? 'nenhum' : errors.join(' | '));

// Acessa a fase 3 via mapa (não desbloqueada, mas podemos forçar via console do dev server? Não.)
// Vamos só testar que a fase 1 funciona sem power-ups

await browser.close();

import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP('http://localhost:9222');
const ctx = browser.contexts()[0];
const page = ctx.pages().find(p => p.url().startsWith('http://localhost:5173')) ?? await ctx.newPage();

await page.goto('http://localhost:5173');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(400);

// Play
await page.locator('.menu__btn--play').click();
await page.waitForTimeout(600);

// Verifica o canvas existe e o HUD está visível
const hasCanvas = await page.locator('canvas').count();
const hudText = await page.locator('.hud__counter').textContent();
console.log('canvas:', hasCanvas, '| HUD:', hudText);

// Escuta erros
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
await page.waitForTimeout(1000);
console.log('erros:', errors.length === 0 ? 'nenhum' : errors.join(' | '));

await browser.close();

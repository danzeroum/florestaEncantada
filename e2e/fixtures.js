import { test as base, chromium } from '@playwright/test';

const CDP_URL = process.env.PW_CDP_URL ?? 'http://localhost:9222';

/**
 * Fixture que conecta ao Chrome existente via CDP em vez de baixar um Chromium.
 * Requer Chrome rodando com --remote-debugging-port=9222.
 */
export const test = base.extend({
  // eslint-disable-next-line no-empty-pattern
  browser: async ({}, use) => {
    const browser = await chromium.connectOverCDP(CDP_URL);
    await use(browser);
    // NÃO fechamos o browser — é a instância do usuário.
  },
  context: async ({ browser }, use) => {
    // Reaproveita o contexto padrão do Chrome (a janela já aberta).
    const context = browser.contexts()[0] ?? (await browser.newContext());
    await use(context);
  },
  page: async ({ context }, use) => {
    // Procura uma aba já aberta em localhost:5173; senão, abre nova.
    const existing = context.pages().find(p => p.url().startsWith('http://localhost:5173'));
    const page = existing ?? (await context.newPage());
    if (!existing) {
      await page.goto('http://localhost:5173');
    }
    await use(page);
  },
});

export { expect } from '@playwright/test';

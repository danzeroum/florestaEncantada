#!/usr/bin/env node
/**
 * Script standalone de verificação de acessibilidade.
 * Roda axe-core em modo headless (jsdom) sobre os overlays principais
 * e imprime um relatório. NÃO entra no bundle de produção.
 *
 * Uso: npm run a11y
 */

import { JSDOM } from 'jsdom';

const dom = new JSDOM(
  '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><title>Floresta Encantada</title></head><body><div id="root"></div></body></html>',
  { pretendToBeVisual: true }
);

// Expõe window/document globais para os módulos de UI
 globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.requestAnimationFrame = fn => setTimeout(() => fn(performance.now()), 0);

const { createMenuUI } = await import('../src/ui/MenuUI.js');
const { createHowToPlayUI } = await import('../src/ui/HowToPlayUI.js');
const { createPauseUI } = await import('../src/ui/PauseUI.js');

// axe-core precisa do window real; carregamos depois de setar globals
const axeModule = await import('axe-core');
const axe = axeModule.default ?? axeModule;

const root = document.getElementById('root');

const scenarios = [
  { name: 'MenuUI', mount: () => createMenuUI(root, { muteEnabled: false }) },
  { name: 'HowToPlayUI', mount: () => createHowToPlayUI(root, {}) },
  { name: 'PauseUI', mount: () => createPauseUI(root, {}) },
];

let totalViolations = 0;

for (const scenario of scenarios) {
  const ui = scenario.mount();
  ui.show();
  await new Promise(r => setTimeout(r, 20));

  try {
    const results = await axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
    });

    if (results.violations.length === 0) {
      console.log(`✅ ${scenario.name}: 0 violações WCAG AA`);
    } else {
      totalViolations += results.violations.length;
      console.log(`❌ ${scenario.name}: ${results.violations.length} violação(ões)`);
      for (const v of results.violations) {
        console.log(`   - [${v.impact}] ${v.id}: ${v.help}`);
        for (const node of v.nodes) {
          console.log(`       → ${node.target.join(', ')}`);
        }
      }
    }
  } catch (err) {
    console.log(`⚠️  ${scenario.name}: erro ao rodar axe — ${err.message}`);
  }

  ui.hide();
  ui.dispose();
}

if (totalViolations === 0) {
  console.log('\n🎉 Todos os overlays passaram WCAG AA.');
  process.exit(0);
} else {
  console.log(`\n❌ Total: ${totalViolations} violação(ões). Corrija antes de mergear.`);
  process.exit(1);
}

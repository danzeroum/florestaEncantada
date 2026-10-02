/**
 * Tela "Como Jogar": controles por ícones, sem texto.
 * Mostra setas, espaço e uma animação CSS do esquilo pulando.
 */

const BACK_ICON_SVG = `
  <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true" focusable="false">
    <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

// Bloco de teclas: um ícone quadrado representando a tecla
function keyCap(symbol) {
  return `<span class="howto__key" aria-hidden="true">${symbol}</span>`;
}

const ARROW_LEFT = keyCap('←');
const ARROW_RIGHT = keyCap('→');
const ARROW_UP = keyCap('↑');
const KEY_A = keyCap('A');
const KEY_D = keyCap('D');
const KEY_W = keyCap('W');
const KEY_SPACE = keyCap('␣');

const SQUIRREL_SVG = `
  <svg viewBox="0 0 64 64" width="72" height="72" aria-hidden="true" focusable="false">
    <ellipse cx="28" cy="40" rx="14" ry="12" fill="#FFB300" />
    <rect x="32" y="20" width="14" height="12" rx="3" fill="#FFA726" />
    <circle cx="44" cy="26" r="2" fill="#FFFFFF" />
    <path d="M14 40 Q6 30 12 22 Q16 28 18 34" fill="#795548" />
  </svg>
`;

const NUT_SVG = `
  <svg viewBox="0 0 24 24" width="36" height="36" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="10" fill="#FF5252" />
    <circle cx="9" cy="9" r="3" fill="#fff" opacity="0.6" />
  </svg>
`;

/**
 * Cria o overlay "Como Jogar".
 *
 * @param {HTMLElement} root
 * @param {{ onBack?:()=>void }} [options]
 * @returns {{ show:()=>void, hide:()=>void, dispose:()=>void, isVisible:()=>boolean }}
 */
export function createHowToPlayUI(root, options = {}) {
  if (!root) throw new Error('HowToPlayUI: root é obrigatório');

  const onBack = options.onBack ?? (() => {});

  const overlay = document.createElement('div');
  overlay.className = 'howto';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Como jogar');
  overlay.hidden = true;

  const inner = document.createElement('div');
  inner.className = 'howto__inner';

  // ── Linha 1: mover ──
  const rowMove = document.createElement('div');
  rowMove.className = 'howto__row';
  rowMove.innerHTML = `
    <div class="howto__keys">${ARROW_LEFT}${ARROW_RIGHT}<span class="howto__or">/</span>${KEY_A}${KEY_D}</div>
    <div class="howto__action howto__action--move">${SQUIRREL_SVG}</div>
  `;

  // ── Linha 2: pular ──
  const rowJump = document.createElement('div');
  rowJump.className = 'howto__row';
  rowJump.innerHTML = `
    <div class="howto__keys">${ARROW_UP}<span class="howto__or">/</span>${KEY_W}<span class="howto__or">/</span>${KEY_SPACE}</div>
    <div class="howto__action howto__action--jump">${SQUIRREL_SVG}</div>
  `;

  // ── Linha 3: coletar ──
  const rowCollect = document.createElement('div');
  rowCollect.className = 'howto__row';
  rowCollect.innerHTML = `
    <div class="howto__keys">${NUT_SVG}</div>
    <div class="howto__action howto__action--collect">${SQUIRREL_SVG}</div>
  `;

  // ── Botão voltar ──
  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'howto__back';
  backBtn.setAttribute('aria-label', 'Voltar ao menu');
  backBtn.innerHTML = BACK_ICON_SVG;
  backBtn.addEventListener('click', () => onBack());

  inner.appendChild(rowMove);
  inner.appendChild(rowJump);
  inner.appendChild(rowCollect);
  inner.appendChild(backBtn);
  overlay.appendChild(inner);
  root.appendChild(overlay);

  function show() {
    overlay.hidden = false;
    requestAnimationFrame(() => backBtn.focus());
  }

  function hide() {
    overlay.hidden = true;
  }

  function dispose() {
    overlay.remove();
  }

  function isVisible() {
    return !overlay.hidden;
  }

  return { show, hide, dispose, isVisible };
}

/**
 * Tela de pausa: Resume, Restart, Quit.
 * Todos os botões são SVGs sem texto, com aria-label.
 */

const RESUME_ICON_SVG = `
  <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true" focusable="false">
    <path d="M8 5v14l11-7z" fill="currentColor" />
  </svg>
`;

const RESTART_ICON_SVG = `
  <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true" focusable="false">
    <path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" fill="currentColor" />
  </svg>
`;

const QUIT_ICON_SVG = `
  <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true" focusable="false">
    <path d="M12 3l9 8h-3v9h-4v-6h-4v6H6v-9H3l9-8z" fill="currentColor" />
  </svg>
`;

/**
 * Cria o overlay de pausa.
 *
 * @param {HTMLElement} root
 * @param {{ onResume?:()=>void, onRestart?:()=>void, onQuit?:()=>void }} [options]
 * @returns {{ show:()=>void, hide:()=>void, dispose:()=>void, isVisible:()=>boolean }}
 */
export function createPauseUI(root, options = {}) {
  if (!root) throw new Error('PauseUI: root é obrigatório');

  const onResume = options.onResume ?? (() => {});
  const onRestart = options.onRestart ?? (() => {});
  const onQuit = options.onQuit ?? (() => {});

  const overlay = document.createElement('div');
  overlay.className = 'pause';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Jogo pausado');
  overlay.hidden = true;

  const inner = document.createElement('div');
  inner.className = 'pause__inner';

  function makeButton({ className, label, innerHTML, onClick }) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `pause__btn ${className}`;
    btn.setAttribute('aria-label', label);
    btn.innerHTML = innerHTML;
    btn.addEventListener('click', onClick);
    return btn;
  }

  const resumeBtn = makeButton({
    className: 'pause__btn--resume',
    label: 'Retomar jogo',
    innerHTML: RESUME_ICON_SVG,
    onClick: () => onResume(),
  });

  const restartBtn = makeButton({
    className: 'pause__btn--restart',
    label: 'Reiniciar fase',
    innerHTML: RESTART_ICON_SVG,
    onClick: () => onRestart(),
  });

  const quitBtn = makeButton({
    className: 'pause__btn--quit',
    label: 'Sair para o menu',
    innerHTML: QUIT_ICON_SVG,
    onClick: () => onQuit(),
  });

  inner.appendChild(resumeBtn);
  inner.appendChild(restartBtn);
  inner.appendChild(quitBtn);
  overlay.appendChild(inner);
  root.appendChild(overlay);

  function show() {
    overlay.hidden = false;
    requestAnimationFrame(() => resumeBtn.focus());
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

/**
 * Menu inicial: Play, Como Jogar, Mute (desabilitado até Fase 5).
 * Todos os botões são SVGs sem texto, com aria-label para leitores de tela.
 */

const PLAY_ICON_SVG = `
  <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true" focusable="false">
    <path d="M8 5v14l11-7z" fill="currentColor" />
  </svg>
`;

const INFO_ICON_SVG = `
  <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" />
    <circle cx="12" cy="8" r="1.4" fill="currentColor" />
    <rect x="11" y="11" width="2" height="7" rx="1" fill="currentColor" />
  </svg>
`;

const SOUND_ON_ICON_SVG = `
  <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true" focusable="false">
    <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
    <path d="M16 8c1.5 1 2.5 2.5 2.5 4S17.5 15 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M18 5.5c2.5 1.7 4 4 4 6.5s-1.5 4.8-4 6.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
  </svg>
`;

const MAP_ICON_SVG = `
  <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true" focusable="false">
    <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
  </svg>
`;

const SOUND_OFF_ICON_SVG = `
  <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true" focusable="false">
    <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
    <path d="M16 9l6 6M22 9l-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  </svg>
`;

/**
 * Cria o overlay do menu.
 *
 * @param {HTMLElement} root
 * @param {{ onPlay?:()=>void, onHowToPlay?:()=>void, onToggleMute?:()=>void, muteEnabled?:boolean, muted?:boolean }} [options]
 * @returns {{ show:()=>void, hide:()=>void, dispose:()=>void, isVisible:()=>boolean }}
 */
export function createMenuUI(root, options = {}) {
  if (!root) throw new Error('MenuUI: root é obrigatório');

  const onPlay = options.onPlay ?? (() => {});
  const onHowToPlay = options.onHowToPlay ?? (() => {});
  const onOpenMap = options.onOpenMap ?? (() => {});
  const onToggleMute = options.onToggleMute ?? (() => {});
  const muteEnabled = options.muteEnabled === true;

  const overlay = document.createElement('div');
  overlay.className = 'menu';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Menu principal');
  overlay.hidden = true;

  const inner = document.createElement('div');
  inner.className = 'menu__inner';

  function makeButton({ className, label, innerHTML, onClick, disabled = false }) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `menu__btn ${className}`;
    btn.setAttribute('aria-label', label);
    btn.innerHTML = innerHTML;
    if (disabled) {
      btn.setAttribute('aria-disabled', 'true');
      btn.disabled = true;
    } else {
      btn.addEventListener('click', onClick);
    }
    return btn;
  }

  const playBtn = makeButton({
    className: 'menu__btn--play',
    label: 'Iniciar jogo',
    innerHTML: PLAY_ICON_SVG,
    onClick: () => onPlay(),
  });

  const howToBtn = makeButton({
    className: 'menu__btn--info',
    label: 'Como jogar',
    innerHTML: INFO_ICON_SVG,
    onClick: () => onHowToPlay(),
  });

  const mapBtn = makeButton({
    className: 'menu__btn--map',
    label: 'Mapa de fases',
    innerHTML: MAP_ICON_SVG,
    onClick: () => onOpenMap(),
  });

  const muteBtn = makeButton({
    className: 'menu__btn--mute',
    label: muteEnabled ? 'Ligar/desligar som' : 'Som ainda não disponível',
    innerHTML: options.muted ? SOUND_OFF_ICON_SVG : SOUND_ON_ICON_SVG,
    onClick: () => onToggleMute(),
    disabled: !muteEnabled,
  });

  let muted = options.muted === true;

  function setMuted(value) {
    muted = value === true;
    muteBtn.innerHTML = muted ? SOUND_OFF_ICON_SVG : SOUND_ON_ICON_SVG;
    muteBtn.setAttribute('aria-label', muted ? 'Ligar som' : 'Desligar som');
  }

  inner.appendChild(playBtn);
  inner.appendChild(mapBtn);
  inner.appendChild(howToBtn);
  inner.appendChild(muteBtn);
  overlay.appendChild(inner);
  root.appendChild(overlay);

  function show() {
    overlay.hidden = false;
    // Foco inicial no Play
    requestAnimationFrame(() => playBtn.focus());
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

  return { show, hide, dispose, isVisible, setMuted };
}

/**
 * HUD de pontuação: número grande + ícone SVG de noz.
 * Overlay HTML sobre o canvas — sem texto complexo.
 */

const NUT_ICON_SVG = `
  <svg viewBox="0 0 24 24" width="36" height="36" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="10" fill="#FF5252" />
    <circle cx="9" cy="9" r="3" fill="#fff" opacity="0.6" />
  </svg>
`;

const REPLAY_ICON_SVG = `
  <svg viewBox="0 0 24 24" width="48" height="48" aria-hidden="true" focusable="false">
    <path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" fill="currentColor" />
  </svg>
`;

/**
 * Cria o HUD no container informado.
 * @param {HTMLElement} root
 * @param {{ onReplay?:()=>void }} [options]
 * @returns {{ setScore:(n:number,total:number)=>void, showVictory:()=>void, hideVictory:()=>void, reset:()=>void, dispose:()=>void }}
 */
export function createHUD(root, options = {}) {
  if (!root) throw new Error('HUD: root é obrigatório');

  const onReplay = options.onReplay ?? (() => {});

  // ── Container do HUD ──
  const container = document.createElement('div');
  container.className = 'hud';
  container.setAttribute('role', 'status');
  container.setAttribute('aria-live', 'polite');

  const iconWrap = document.createElement('span');
  iconWrap.className = 'hud__icon';
  iconWrap.innerHTML = NUT_ICON_SVG;

  const counter = document.createElement('span');
  counter.className = 'hud__counter';
  counter.textContent = '0 / 0';

  container.appendChild(iconWrap);
  container.appendChild(counter);

  // ── Overlay de vitória (escondido por padrão) ──
  const victory = document.createElement('div');
  victory.className = 'victory';
  victory.setAttribute('role', 'dialog');
  victory.setAttribute('aria-modal', 'true');
  victory.setAttribute('aria-label', 'Você conseguiu!');
  victory.hidden = true;

  const victoryIcon = document.createElement('div');
  victoryIcon.className = 'victory__icon';
  victoryIcon.innerHTML = NUT_ICON_SVG;

  const replayBtn = document.createElement('button');
  replayBtn.className = 'victory__replay';
  replayBtn.setAttribute('aria-label', 'Jogar de novo');
  replayBtn.innerHTML = REPLAY_ICON_SVG;
  replayBtn.addEventListener('click', () => {
    hideVictory();
    onReplay();
  });

  victory.appendChild(victoryIcon);
  victory.appendChild(replayBtn);

  root.appendChild(container);
  root.appendChild(victory);

  function setScore(score, total) {
    counter.textContent = `${score} / ${total}`;
    // Animação de "pulinho" no número
    counter.classList.remove('hud__counter--bump');
    // Força reflow para reiniciar a animação CSS
    void counter.offsetWidth;
    counter.classList.add('hud__counter--bump');
  }

  function showVictory() {
    victory.hidden = false;
    // Foco no botão replay para acessibilidade de teclado
    replayBtn.focus();
  }

  function hideVictory() {
    victory.hidden = true;
  }

  function reset() {
    hideVictory();
    counter.textContent = '0 / 0';
  }

  function dispose() {
    container.remove();
    victory.remove();
  }

  return { setScore, showVictory, hideVictory, reset, dispose };
}

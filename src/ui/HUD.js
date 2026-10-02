/**
 * HUD: pontuação (nozes) + vidas (corações) + tela de vitória + tela de game over.
 * Tudo em overlay HTML, sem texto complexo.
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

const HEART_FULL_SVG = `
  <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">
    <path d="M12 21s-7-4.5-9.5-9C.8 9 2.4 5.5 5.8 5.5c2 0 3.3 1.1 4.2 2.2C10.9 6.6 12.2 5.5 14.2 5.5c3.4 0 5 3.5 3.3 6.5C19 16.5 12 21 12 21z" fill="#FF5252" stroke="#fff" stroke-width="1.2" />
  </svg>
`;

const HEART_EMPTY_SVG = `
  <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">
    <path d="M12 21s-7-4.5-9.5-9C.8 9 2.4 5.5 5.8 5.5c2 0 3.3 1.1 4.2 2.2C10.9 6.6 12.2 5.5 14.2 5.5c3.4 0 5 3.5 3.3 6.5C19 16.5 12 21 12 21z" fill="#BDBDBD" stroke="#fff" stroke-width="1.2" opacity="0.5" />
  </svg>
`;

/**
 * Cria o HUD no container informado.
 * @param {HTMLElement} root
 * @param {{ onReplay?:()=>void }} [options]
 */
export function createHUD(root, options = {}) {
  if (!root) throw new Error('HUD: root é obrigatório');

  const onReplay = options.onReplay ?? (() => {});

  // ── Container ──
  const container = document.createElement('div');
  container.className = 'hud';

  const nutsGroup = document.createElement('div');
  nutsGroup.className = 'hud__group';
  nutsGroup.setAttribute('role', 'status');
  nutsGroup.setAttribute('aria-live', 'polite');

  const iconWrap = document.createElement('span');
  iconWrap.className = 'hud__icon';
  iconWrap.innerHTML = NUT_ICON_SVG;

  const counter = document.createElement('span');
  counter.className = 'hud__counter';
  counter.textContent = '0 / 0';

  nutsGroup.appendChild(iconWrap);
  nutsGroup.appendChild(counter);

  const livesGroup = document.createElement('div');
  livesGroup.className = 'hud__lives';
  livesGroup.setAttribute('role', 'status');
  livesGroup.setAttribute('aria-label', 'Vidas restantes');

  container.appendChild(nutsGroup);
  container.appendChild(livesGroup);

  // ── Overlay de vitória ──
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

  // ── Overlay de game over ──
  const gameOver = document.createElement('div');
  gameOver.className = 'gameover';
  gameOver.setAttribute('role', 'dialog');
  gameOver.setAttribute('aria-modal', 'true');
  gameOver.setAttribute('aria-label', 'Fim de jogo');
  gameOver.hidden = true;

  const gameOverIcon = document.createElement('div');
  gameOverIcon.className = 'gameover__icon';
  gameOverIcon.innerHTML = HEART_EMPTY_SVG;

  const retryBtn = document.createElement('button');
  retryBtn.className = 'gameover__retry';
  retryBtn.setAttribute('aria-label', 'Tentar de novo');
  retryBtn.innerHTML = REPLAY_ICON_SVG;
  retryBtn.addEventListener('click', () => {
    hideGameOver();
    onReplay();
  });

  gameOver.appendChild(gameOverIcon);
  gameOver.appendChild(retryBtn);

  root.appendChild(container);
  root.appendChild(victory);
  root.appendChild(gameOver);

  function setScore(score, total) {
    counter.textContent = `${score} / ${total}`;
    counter.classList.remove('hud__counter--bump');
    void counter.offsetWidth;
    counter.classList.add('hud__counter--bump');
  }

  function setLives(lives, total) {
    livesGroup.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const heart = document.createElement('span');
      heart.className = 'hud__heart';
      heart.innerHTML = i < lives ? HEART_FULL_SVG : HEART_EMPTY_SVG;
      livesGroup.appendChild(heart);
    }
  }

  function showVictory() {
    victory.hidden = false;
    replayBtn.focus();
  }

  function hideVictory() {
    victory.hidden = true;
  }

  function showGameOver() {
    gameOver.hidden = false;
    retryBtn.focus();
  }

  function hideGameOver() {
    gameOver.hidden = true;
  }

  function reset() {
    hideVictory();
    hideGameOver();
    counter.textContent = '0 / 0';
    livesGroup.innerHTML = '';
  }

  function dispose() {
    container.remove();
    victory.remove();
    gameOver.remove();
  }

  return {
    setScore,
    setLives,
    showVictory,
    hideVictory,
    showGameOver,
    hideGameOver,
    reset,
    dispose,
  };
}

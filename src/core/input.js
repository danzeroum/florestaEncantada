/**
 * Entrada unificada — teclado + toque → ações de jogo.
 * Abstrai o dispositivo do jogador: o loop só vê `getInputState()`.
 */

export const ACTIONS = {
  LEFT: 'left',
  RIGHT: 'right',
  JUMP: 'jump',
  CROUCH: 'crouch',
};

const KEY_MAP = {
  ArrowLeft: ACTIONS.LEFT,
  a: ACTIONS.LEFT,
  A: ACTIONS.LEFT,
  ArrowRight: ACTIONS.RIGHT,
  d: ACTIONS.RIGHT,
  D: ACTIONS.RIGHT,
  ArrowUp: ACTIONS.JUMP,
  w: ACTIONS.JUMP,
  W: ACTIONS.JUMP,
  ' ': ACTIONS.JUMP,
  ArrowDown: ACTIONS.CROUCH,
  s: ACTIONS.CROUCH,
  S: ACTIONS.CROUCH,
};

const state = {
  [ACTIONS.LEFT]: false,
  [ACTIONS.RIGHT]: false,
  [ACTIONS.JUMP]: false,
  [ACTIONS.CROUCH]: false,
};

let isSetup = false;
let boundKeyDown = null;
let boundKeyUp = null;
let boundBlur = null;
let swipeStartX = 0;
let swipeStartY = 0;
let boundTouchStart = null;
let boundTouchEnd = null;

const SWIPE_THRESHOLD = 30;

function onKeyDown(event) {
  const action = KEY_MAP[event.key];
  if (!action) return;
  state[action] = true;
  // Evita scroll da página com setas/espaço
  if (event.key === ' ' || event.key.startsWith('Arrow')) {
    event.preventDefault();
  }
}

function onKeyUp(event) {
  const action = KEY_MAP[event.key];
  if (!action) return;
  state[action] = false;
}

function onBlur() {
  // Se a janela perde foco, zera tudo (evita tecla "presa")
  for (const key of Object.keys(state)) state[key] = false;
}

function onTouchStart(event) {
  const touch = event.changedTouches[0];
  swipeStartX = touch.clientX;
  swipeStartY = touch.clientY;
}

function onTouchEnd(event) {
  const touch = event.changedTouches[0];
  const dx = touch.clientX - swipeStartX;
  const dy = touch.clientY - swipeStartY;

  if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return;

  if (Math.abs(dx) > Math.abs(dy)) {
    // Swipe horizontal
    if (dx > 0) state[ACTIONS.RIGHT] = true;
    else state[ACTIONS.LEFT] = true;
    // Solta após breve delay para virar "toque"
    setTimeout(() => {
      state[ACTIONS.LEFT] = false;
      state[ACTIONS.RIGHT] = false;
    }, 200);
  } else if (dy < 0) {
    // Swipe para cima = pulo
    state[ACTIONS.JUMP] = true;
    setTimeout(() => {
      state[ACTIONS.JUMP] = false;
    }, 120);
  }
}

/**
 * Anexa os listeners de teclado e toque. Idempotente.
 */
export function setupInput() {
  if (isSetup) return;
  isSetup = true;

  boundKeyDown = onKeyDown;
  boundKeyUp = onKeyUp;
  boundBlur = onBlur;
  boundTouchStart = onTouchStart;
  boundTouchEnd = onTouchEnd;

  window.addEventListener('keydown', boundKeyDown);
  window.addEventListener('keyup', boundKeyUp);
  window.addEventListener('blur', boundBlur);
  window.addEventListener('touchstart', boundTouchStart, { passive: true });
  window.addEventListener('touchend', boundTouchEnd, { passive: true });
}

/**
 * Remove os listeners (útil para testes).
 */
export function disposeInput() {
  if (!isSetup) return;
  isSetup = false;
  window.removeEventListener('keydown', boundKeyDown);
  window.removeEventListener('keyup', boundKeyUp);
  window.removeEventListener('blur', boundBlur);
  window.removeEventListener('touchstart', boundTouchStart);
  window.removeEventListener('touchend', boundTouchEnd);
  for (const key of Object.keys(state)) state[key] = false;
}

/**
 * Retorna uma cópia do estado atual (imutável para o chamador).
 * @returns {{left:boolean,right:boolean,jump:boolean,crouch:boolean}}
 */
export function getInputState() {
  return { ...state };
}

/**
 * Força o reset do estado (usado em testes e no reinício de fase).
 */
export function resetInput() {
  for (const key of Object.keys(state)) state[key] = false;
}

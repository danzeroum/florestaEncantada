/**
 * Máquina de estados pura do jogo.
 * Sem acoplamento com Three.js nem DOM — 100% testável em Node.
 */

export const STATES = {
  MENU: 'menu',
  HOW_TO_PLAY: 'howToPlay',
  RUNNING: 'running',
  PAUSED: 'paused',
  VICTORY: 'victory',
  GAME_OVER: 'gameOver',
};

const VALID = new Set(Object.values(STATES));

/**
 * @param {string} [initial=STATES.MENU]
 * @returns {{
 *   get:()=>string,
 *   set:(newState:string)=>string,
 *   is:(state:string)=>boolean,
 *   onChange:(fn:(next:string, prev:string)=>void)=>()=>void,
 *   offChange:(fn:(next:string, prev:string)=>void)=>void,
 *   reset:()=>string
 * }}
 */
export function createGameState(initial = STATES.MENU) {
  if (!VALID.has(initial)) {
    throw new Error(`Estado inicial inválido: ${initial}`);
  }

  let current = initial;
  const listeners = new Set();

  function notify(next, prev) {
    for (const fn of listeners) fn(next, prev);
  }

  return {
    get() {
      return current;
    },
    set(newState) {
      if (!VALID.has(newState)) {
        throw new Error(`Estado inválido: ${newState}`);
      }
      if (newState === current) return current;
      const prev = current;
      current = newState;
      notify(current, prev);
      return current;
    },
    is(state) {
      return current === state;
    },
    onChange(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    offChange(fn) {
      listeners.delete(fn);
    },
    reset() {
      return this.set(initial);
    },
  };
}

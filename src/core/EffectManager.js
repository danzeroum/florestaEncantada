/**
 * EffectManager — gerencia efeitos ativos (power-ups) com timers.
 * Puro, sem Three.js, testável em Node.
 *
 * Escudo é especial: não tem timer, dura até absorver 1 hit.
 */

import { POWERUP_TYPES, POWERUP_DURATIONS } from './PowerUp.js';

/**
 * @returns {{
 *   activate:(type:string)=>void,
 *   isActive:(type:string)=>boolean,
 *   getTimeLeft:(type:string)=>number,
 *   consumeShield:()=>boolean,
 *   update:(delta:number)=>void,
 *   clear:()=>void,
 *   getActive:()=>string[]
 * }}
 */
export function createEffectManager() {
  // Map<type, timeLeft> — mas escudo usa Infinity até consumir
  const active = new Map();

  return {
    activate(type) {
      if (!POWERUP_DURATIONS[type]) return;

      if (type === POWERUP_TYPES.SHIELD) {
        // Escudo é binário (1 hit)
        active.set(type, Infinity);
      } else {
        // Reativa com tempo cheio mesmo se já estiver ativo
        active.set(type, POWERUP_DURATIONS[type]);
      }
    },

    isActive(type) {
      return active.has(type);
    },

    getTimeLeft(type) {
      if (!active.has(type)) return 0;
      const t = active.get(type);
      return t === Infinity ? Infinity : t;
    },

    /**
     * Consome o escudo (ao levar um hit).
     * @returns {boolean} true se havia escudo e foi consumido
     */
    consumeShield() {
      if (!active.has(POWERUP_TYPES.SHIELD)) return false;
      active.delete(POWERUP_TYPES.SHIELD);
      return true;
    },

    update(delta) {
      const expired = [];
      for (const [type, time] of active.entries()) {
        if (time === Infinity) continue;
        const next = time - delta;
        if (next <= 0) {
          expired.push(type);
        } else {
          active.set(type, next);
        }
      }
      for (const type of expired) active.delete(type);
    },

    clear() {
      active.clear();
    },

    getActive() {
      return [...active.keys()];
    },
  };
}

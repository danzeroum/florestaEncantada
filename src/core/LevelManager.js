/**
 * Gerencia a progressão pelas fases.
 * Fonte de verdade: `src/data/phases/index.js` (array de phase-XX).
 */

import { PHASES } from '../data/phases/index.js';

/**
 * @returns {{
 *   getCurrent:()=>({ index:number, phase:any, isLast:boolean, total:number }),
 *   next:()=>boolean,
 *   reset:()=>void,
 *   getTotal:()=>number
 * }}
 */
export function createLevelManager() {
  let index = 0;

  return {
    getCurrent() {
      return {
        index,
        phase: PHASES[index],
        layout: PHASES[index].layout,
        isLast: index === PHASES.length - 1,
        total: PHASES.length,
      };
    },
    next() {
      if (index >= PHASES.length - 1) return false;
      index += 1;
      return true;
    },
    reset() {
      index = 0;
    },
    getTotal() {
      return PHASES.length;
    },
  };
}

/**
 * Layout da fase: lista de nozes com tipo e posição.
 * Z fixo em 0 (trilho lateral — decisão de design aprovada).
 */

import { NUT_TYPES } from './Nut.js';

// 10 nozes intercalando tipos; espaçamento evita sobreposição com troncos (X=5 e X=10).
const LAYOUT = [
  { type: NUT_TYPES.SPHERE, x: 2, z: 0 },
  { type: NUT_TYPES.CONE, x: 3.5, z: 0 },
  { type: NUT_TYPES.CUBE, x: 7, z: 0 },
  { type: NUT_TYPES.SPHERE, x: 8.5, z: 0 },
  { type: NUT_TYPES.CONE, x: 12, z: 0 },
  { type: NUT_TYPES.CUBE, x: 14, z: 0 },
  { type: NUT_TYPES.SPHERE, x: 16, z: 0 },
  { type: NUT_TYPES.CONE, x: 18, z: 0 },
  { type: NUT_TYPES.CUBE, x: 20, z: 0 },
  { type: NUT_TYPES.SPHERE, x: 22, z: 0 },
];

/**
 * Retorna uma cópia do layout (evita mutação compartilhada).
 * @returns {Array<{type:string,x:number,z:number}>}
 */
export function createLevel() {
  return LAYOUT.map(item => ({ ...item }));
}

export const LEVEL_TOTAL = LAYOUT.length;

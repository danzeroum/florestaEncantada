/**
 * Layout da fase: lista de nozes + lista de obstáculos.
 * Z fixo em 0 (trilho lateral — decisão de design aprovada).
 *
 * Design (após teste com usuário):
 *  - Troncos (X=5, X=10) são obstáculos de plataforma — não tiram vida.
 *  - Inimigos (toca-toca, cogumelo) só aparecem a partir de X=14 — a criança
 *    tem ~3 segundos de movimento livre para se familiarizar antes do perigo.
 *  - Espaçamento de pelo menos 6 unidades entre inimigos.
 *  - Ciclo lento e previsível (2s on / 2s off) para dar tempo de observar.
 */

import { NUT_TYPES } from './Nut.js';

export const OBSTACLE_TYPES = {
  LOG: 'log',
  MOLE_HOLE: 'moleHole',
  MUSHROOM: 'mushroom',
};

const OBSTACLE_LAYOUT = [
  { type: OBSTACLE_TYPES.LOG, x: 5, z: 0 },
  { type: OBSTACLE_TYPES.LOG, x: 10, z: 0 },
  { type: OBSTACLE_TYPES.MOLE_HOLE, x: 16, z: 0 },
  { type: OBSTACLE_TYPES.MUSHROOM, x: 22, z: 0 },
];

const NUT_LAYOUT = [
  { type: NUT_TYPES.SPHERE, x: 2, z: 0 },
  { type: NUT_TYPES.CONE, x: 3.5, z: 0 },
  { type: NUT_TYPES.CUBE, x: 7, z: 0 },
  { type: NUT_TYPES.SPHERE, x: 8.5, z: 0 },
  { type: NUT_TYPES.CONE, x: 12, z: 0 },
  { type: NUT_TYPES.CUBE, x: 14, z: 0 },
  { type: NUT_TYPES.SPHERE, x: 18, z: 0 },
  { type: NUT_TYPES.CONE, x: 20, z: 0 },
  { type: NUT_TYPES.CUBE, x: 24, z: 0 },
  { type: NUT_TYPES.SPHERE, x: 26, z: 0 },
];

/**
 * Retorna cópias do layout (evita mutação compartilhada).
 * @returns {{ obstacles: Array<{type:string,x:number,z:number}>, nuts: Array<{type:string,x:number,z:number}> }}
 */
export function createLevel() {
  return {
    obstacles: OBSTACLE_LAYOUT.map(o => ({ ...o })),
    nuts: NUT_LAYOUT.map(n => ({ ...n })),
  };
}

export const LEVEL_TOTAL_NUTS = NUT_LAYOUT.length;

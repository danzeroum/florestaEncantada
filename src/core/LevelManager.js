/**
 * Gerencia as fases do jogo: 2 layouts com dificuldade progressiva.
 *
 * Fase 1 — só troncos (aprendizado, sem dano).
 * Fase 2 — todos os obstáculos (troncos + toca-toca + cogumelo), mais nozes.
 */

import { NUT_TYPES } from './Nut.js';
import { OBSTACLE_TYPES } from './Level.js';

const PHASE_1 = {
  obstacles: [
    { type: OBSTACLE_TYPES.LOG, x: 5, z: 0 },
    { type: OBSTACLE_TYPES.LOG, x: 13, z: 0 },
    { type: OBSTACLE_TYPES.LOG, x: 21, z: 0 },
  ],
  nuts: [
    { type: NUT_TYPES.SPHERE, x: 2, z: 0 },
    { type: NUT_TYPES.CONE, x: 3.5, z: 0 },
    { type: NUT_TYPES.CUBE, x: 7, z: 0 },
    { type: NUT_TYPES.SPHERE, x: 9, z: 0 },
    { type: NUT_TYPES.CONE, x: 11, z: 0 },
    { type: NUT_TYPES.CUBE, x: 15, z: 0 },
    { type: NUT_TYPES.SPHERE, x: 17, z: 0 },
    { type: NUT_TYPES.CONE, x: 19, z: 0 },
    { type: NUT_TYPES.CUBE, x: 23, z: 0 },
    { type: NUT_TYPES.SPHERE, x: 25, z: 0 },
  ],
};

const PHASE_2 = {
  obstacles: [
    { type: OBSTACLE_TYPES.LOG, x: 4, z: 0 },
    { type: OBSTACLE_TYPES.MOLE_HOLE, x: 10, z: 0 },
    { type: OBSTACLE_TYPES.MUSHROOM, x: 16, z: 0 },
    { type: OBSTACLE_TYPES.LOG, x: 20, z: 0 },
    { type: OBSTACLE_TYPES.MOLE_HOLE, x: 25, z: 0 },
    { type: OBSTACLE_TYPES.MUSHROOM, x: 30, z: 0 },
  ],
  nuts: [
    { type: NUT_TYPES.SPHERE, x: 2, z: 0 },
    { type: NUT_TYPES.CONE, x: 3, z: 0 },
    { type: NUT_TYPES.CUBE, x: 6, z: 0 },
    { type: NUT_TYPES.SPHERE, x: 8, z: 0 },
    { type: NUT_TYPES.CONE, x: 12, z: 0 },
    { type: NUT_TYPES.CUBE, x: 14, z: 0 },
    { type: NUT_TYPES.SPHERE, x: 18, z: 0 },
    { type: NUT_TYPES.CONE, x: 22, z: 0 },
    { type: NUT_TYPES.CUBE, x: 23, z: 0 },
    { type: NUT_TYPES.SPHERE, x: 27, z: 0 },
    { type: NUT_TYPES.CONE, x: 28, z: 0 },
    { type: NUT_TYPES.CUBE, x: 32, z: 0 },
  ],
};

const PHASES = [PHASE_1, PHASE_2];

/**
 * Cria o gerenciador de fases.
 * @returns {{
 *   getCurrent:()=>({index:number, layout:any, isLast:boolean, total:number}),
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
        layout: PHASES[index],
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

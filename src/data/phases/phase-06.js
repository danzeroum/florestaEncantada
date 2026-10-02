/**
 * Fase 6 — Rio: azul claro, obstáculos esparsos em "ilhas" (mais espaço entre eles).
 */

export default {
  id: 6,
  name: 'rio',
  theme: { sky: 0x4fc3f7, ground: 0x26a69a, ambient: 0.75 },
  layout: {
    obstacles: [
      { type: 'log', x: 5, z: 0 },
      { type: 'mushroom', x: 11, z: 0 },
      { type: 'log', x: 17, z: 0 },
      { type: 'moleHole', x: 23, z: 0 },
      { type: 'mushroom', x: 29, z: 0 },
      { type: 'log', x: 35, z: 0 },
    ],
    nuts: [
      { type: 'sphere', x: 2, z: 0 },
      { type: 'cone', x: 3, z: 0 },
      { type: 'cube', x: 7, z: 0 },
      { type: 'sphere', x: 9, z: 0 },
      { type: 'cone', x: 13, z: 0 },
      { type: 'cube', x: 15, z: 0 },
      { type: 'sphere', x: 19, z: 0 },
      { type: 'cone', x: 21, z: 0 },
      { type: 'cube', x: 25, z: 0 },
      { type: 'sphere', x: 27, z: 0 },
      { type: 'cone', x: 31, z: 0 },
      { type: 'cube', x: 33, z: 0 },
      { type: 'sphere', x: 37, z: 0 },
      { type: 'cone', x: 39, z: 0 },
    ],
  },
  winCondition: { type: 'collect_all' },
};

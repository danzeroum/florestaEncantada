/**
 * Fase 4 — Outono: chão alaranjado, mais troncos próximos.
 */

export default {
  id: 4,
  name: 'outono',
  theme: { sky: 0xffcc80, ground: 0xbf6b1f, ambient: 0.65 },
  layout: {
    speed: 1.05,
    obstacles: [
      { type: 'log', x: 4, z: 0 },
      { type: 'log', x: 7.5, z: 0 },
      { type: 'moleHole', x: 11, z: 0 },
      { type: 'log', x: 14, z: 0 },
      { type: 'log', x: 17.5, z: 0 },
      { type: 'mushroom', x: 21, z: 0 },
      { type: 'moleHole', x: 25, z: 0 },
      { type: 'log', x: 29, z: 0 },
    ],
    nuts: [
      { type: 'sphere', x: 2, z: 0 },
      { type: 'cone', x: 3, z: 0 },
      { type: 'cube', x: 6, z: 0 },
      { type: 'sphere', x: 9, z: 0 },
      { type: 'cone', x: 12, z: 0 },
      { type: 'cube', x: 13.5, z: 0 },
      { type: 'sphere', x: 16, z: 0 },
      { type: 'cone', x: 19, z: 0 },
      { type: 'cube', x: 20, z: 0 },
      { type: 'sphere', x: 23, z: 0 },
      { type: 'cone', x: 24, z: 0 },
      { type: 'cube', x: 27, z: 0 },
      { type: 'sphere', x: 31, z: 0 },
      { type: 'cone', x: 33, z: 0 },
    ],
  },
  winCondition: { type: 'collect_all' },
};

/**
 * Fase 8 — Tempestade: cinza escuro, muitos inimigos hostis.
 */

export default {
  id: 8,
  name: 'tempestade',
  theme: { sky: 0x37474f, ground: 0x455a64, ambient: 0.45 },
  layout: {
    obstacles: [
      { type: 'moleHole', x: 4, z: 0 },
      { type: 'mushroom', x: 7.5, z: 0 },
      { type: 'moleHole', x: 11, z: 0 },
      { type: 'mushroom', x: 14.5, z: 0 },
      { type: 'log', x: 18, z: 0 },
      { type: 'moleHole', x: 21, z: 0 },
      { type: 'mushroom', x: 24.5, z: 0 },
      { type: 'moleHole', x: 28, z: 0 },
      { type: 'mushroom', x: 31.5, z: 0 },
      { type: 'log', x: 35, z: 0 },
    ],
    nuts: [
      { type: 'sphere', x: 2, z: 0 },
      { type: 'cone', x: 5.5, z: 0 },
      { type: 'cube', x: 9, z: 0 },
      { type: 'sphere', x: 13, z: 0 },
      { type: 'cone', x: 16, z: 0 },
      { type: 'cube', x: 19.5, z: 0 },
      { type: 'sphere', x: 23, z: 0 },
      { type: 'cone', x: 26, z: 0 },
      { type: 'cube', x: 30, z: 0 },
      { type: 'sphere', x: 33, z: 0 },
      { type: 'cone', x: 37, z: 0 },
      { type: 'cube', x: 39, z: 0 },
    ],
  },
  winCondition: { type: 'collect_all' },
};

/**
 * Fase 9 — Inverno: branco gélido, muitos obstáculos de todos os tipos.
 */

export default {
  id: 9,
  name: 'inverno',
  theme: { sky: 0xb3e5fc, ground: 0xcfd8dc, ambient: 0.85 },
  layout: {
    obstacles: [
      { type: 'log', x: 4, z: 0 },
      { type: 'mushroom', x: 8, z: 0 },
      { type: 'moleHole', x: 12, z: 0 },
      { type: 'log', x: 15.5, z: 0 },
      { type: 'mushroom', x: 19, z: 0 },
      { type: 'moleHole', x: 23, z: 0 },
      { type: 'log', x: 26.5, z: 0 },
      { type: 'mushroom', x: 30, z: 0 },
      { type: 'moleHole', x: 33.5, z: 0 },
      { type: 'log', x: 37, z: 0 },
    ],
    nuts: [
      { type: 'cube', x: 2, z: 0 },
      { type: 'sphere', x: 5.5, z: 0 },
      { type: 'cone', x: 9.5, z: 0 },
      { type: 'cube', x: 13.5, z: 0 },
      { type: 'sphere', x: 17, z: 0 },
      { type: 'cone', x: 21, z: 0 },
      { type: 'cube', x: 24.5, z: 0 },
      { type: 'sphere', x: 28, z: 0 },
      { type: 'cone', x: 31.5, z: 0 },
      { type: 'cube', x: 35, z: 0 },
      { type: 'sphere', x: 39, z: 0 },
      { type: 'cone', x: 41, z: 0 },
    ],
  },
  winCondition: { type: 'collect_all' },
};

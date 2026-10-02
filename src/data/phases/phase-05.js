/**
 * Fase 5 — Caverna: cinza escuro, layout apertado com obstáculos próximos.
 */

export default {
  id: 5,
  name: 'caverna',
  theme: { sky: 0x37474f, ground: 0x546e7a, ambient: 0.5 },
  layout: {
    speed: 1.1,
    obstacles: [
      { type: 'moleHole', x: 4, z: 0 },
      { type: 'mushroom', x: 8, z: 0 },
      { type: 'log', x: 12, z: 0 },
      { type: 'moleHole', x: 16, z: 0 },
      { type: 'log', x: 19, z: 0 },
      { type: 'mushroom', x: 23, z: 0 },
      { type: 'moleHole', x: 27, z: 0 },
      { type: 'log', x: 31, z: 0 },
      { type: 'mushroom', x: 35, z: 0 },
    ],
    nuts: [
      { type: 'cube', x: 2, z: 0 },
      { type: 'sphere', x: 3, z: 0 },
      { type: 'cone', x: 6, z: 0 },
      { type: 'cube', x: 10, z: 0 },
      { type: 'sphere', x: 14, z: 0 },
      { type: 'cone', x: 17, z: 0 },
      { type: 'cube', x: 21, z: 0 },
      { type: 'sphere', x: 25, z: 0 },
      { type: 'cone', x: 29, z: 0 },
      { type: 'cube', x: 33, z: 0 },
      { type: 'sphere', x: 37, z: 0 },
    ],
    powerUps: [{ type: 'shield', x: 18, z: 0 }],
  },
  winCondition: { type: 'collect_all' },
};

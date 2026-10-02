/**
 * Fase 10 — Céu: nível final com muitos obstáculos e nozes.
 */

export default {
  id: 10,
  name: 'ceu',
  theme: { sky: 0x81d4fa, ground: 0x90caf9, ambient: 0.85 },
  layout: {
    obstacles: [
      { type: 'mushroom', x: 4, z: 0 },
      { type: 'log', x: 7.5, z: 0 },
      { type: 'moleHole', x: 11, z: 0 },
      { type: 'mushroom', x: 14.5, z: 0 },
      { type: 'log', x: 18, z: 0 },
      { type: 'moleHole', x: 21.5, z: 0 },
      { type: 'mushroom', x: 25, z: 0 },
      { type: 'log', x: 28.5, z: 0 },
      { type: 'moleHole', x: 32, z: 0 },
      { type: 'mushroom', x: 35.5, z: 0 },
      { type: 'log', x: 39, z: 0 },
      { type: 'mushroom', x: 42, z: 0 },
    ],
    nuts: [
      { type: 'sphere', x: 2, z: 0 },
      { type: 'cone', x: 3, z: 0 },
      { type: 'cube', x: 6, z: 0 },
      { type: 'sphere', x: 9.5, z: 0 },
      { type: 'cone', x: 13, z: 0 },
      { type: 'cube', x: 16.5, z: 0 },
      { type: 'sphere', x: 20, z: 0 },
      { type: 'cone', x: 23.5, z: 0 },
      { type: 'cube', x: 27, z: 0 },
      { type: 'sphere', x: 30.5, z: 0 },
      { type: 'cone', x: 34, z: 0 },
      { type: 'cube', x: 37, z: 0 },
      { type: 'sphere', x: 40.5, z: 0 },
      { type: 'cone', x: 43, z: 0 },
      { type: 'cube', x: 45, z: 0 },
    ],
  },
  winCondition: { type: 'collect_all' },
};

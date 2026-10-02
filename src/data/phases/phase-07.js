/**
 * Fase 7 — Nevoeiro: cinza claro, muitos obstáculos intercalados.
 */

export default {
  id: 7,
  name: 'nevoeiro',
  theme: { sky: 0xb0bec5, ground: 0x78909c, ambient: 0.6 },
  layout: {
    speed: 1.15,
    obstacles: [
      { type: 'log', x: 3.5, z: 0 },
      { type: 'moleHole', x: 7, z: 0 },
      { type: 'mushroom', x: 10, z: 0 },
      { type: 'log', x: 13, z: 0 },
      { type: 'moleHole', x: 16.5, z: 0 },
      { type: 'mushroom', x: 20, z: 0 },
      { type: 'log', x: 23, z: 0 },
      { type: 'moleHole', x: 26.5, z: 0 },
      { type: 'mushroom', x: 30, z: 0 },
      { type: 'log', x: 33, z: 0 },
    ],
    nuts: [
      { type: 'cube', x: 2, z: 0 },
      { type: 'sphere', x: 5, z: 0 },
      { type: 'cone', x: 8.5, z: 0 },
      { type: 'cube', x: 11.5, z: 0 },
      { type: 'sphere', x: 15, z: 0 },
      { type: 'cone', x: 18, z: 0 },
      { type: 'cube', x: 21.5, z: 0 },
      { type: 'sphere', x: 25, z: 0 },
      { type: 'cone', x: 28, z: 0 },
      { type: 'cube', x: 31.5, z: 0 },
      { type: 'sphere', x: 35, z: 0 },
    ],
  },
  winCondition: { type: 'collect_all' },
};

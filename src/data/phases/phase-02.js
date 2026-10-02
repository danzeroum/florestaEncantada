/**
 * Fase 2 — Todos os tipos de obstáculo, 12 nozes.
 */

export default {
  id: 2,
  name: 'tarde',
  theme: {
    sky: 0x81d4fa,
    ground: 0x66bb6a,
    ambient: 0.65,
  },
  layout: {
    obstacles: [
      { type: 'log', x: 4, z: 0 },
      { type: 'moleHole', x: 10, z: 0 },
      { type: 'mushroom', x: 16, z: 0 },
      { type: 'log', x: 20, z: 0 },
      { type: 'moleHole', x: 25, z: 0 },
      { type: 'mushroom', x: 30, z: 0 },
    ],
    nuts: [
      { type: 'sphere', x: 2, z: 0 },
      { type: 'cone', x: 3, z: 0 },
      { type: 'cube', x: 6, z: 0 },
      { type: 'sphere', x: 8, z: 0 },
      { type: 'cone', x: 12, z: 0 },
      { type: 'cube', x: 14, z: 0 },
      { type: 'sphere', x: 18, z: 0 },
      { type: 'cone', x: 22, z: 0 },
      { type: 'cube', x: 23, z: 0 },
      { type: 'sphere', x: 27, z: 0 },
      { type: 'cone', x: 28, z: 0 },
      { type: 'cube', x: 32, z: 0 },
    ],
  },
  winCondition: { type: 'collect_all' },
};

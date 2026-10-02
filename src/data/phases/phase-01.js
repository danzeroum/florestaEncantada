/**
 * Fase 1 — Aprendizado: só troncos, espaçamento generoso, 10 nozes.
 */

export default {
  id: 1,
  name: 'manha',
  theme: {
    sky: 0xb3e5fc,
    ground: 0x4caf50,
    ambient: 0.7,
  },
  layout: {
    obstacles: [
      { type: 'log', x: 5, z: 0 },
      { type: 'log', x: 13, z: 0 },
      { type: 'log', x: 21, z: 0 },
    ],
    nuts: [
      { type: 'sphere', x: 2, z: 0 },
      { type: 'cone', x: 3.5, z: 0 },
      { type: 'cube', x: 7, z: 0 },
      { type: 'sphere', x: 9, z: 0 },
      { type: 'cone', x: 11, z: 0 },
      { type: 'cube', x: 15, z: 0 },
      { type: 'sphere', x: 17, z: 0 },
      { type: 'cone', x: 19, z: 0 },
      { type: 'cube', x: 23, z: 0 },
      { type: 'sphere', x: 25, z: 0 },
    ],
    powerUps: [{ type: 'magnet', x: 3, z: 0 }],
  },
  winCondition: { type: 'collect_all' },
};

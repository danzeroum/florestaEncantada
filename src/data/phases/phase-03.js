/**
 * Fase 3 — Noite: céu escuro, toca-toca mais frequente, mais nozes.
 * A criança já conhece os 3 obstáculos; agora testa timing sob pouca luz.
 */

export default {
  id: 3,
  name: 'noite',
  theme: {
    sky: 0x1a237e,       // azul muito escuro (quase preto)
    ground: 0x2e7d32,    // verde escuro
    ambient: 0.45,       // menos luz ambiente
  },
  layout: {
    speed: 1.05,
    obstacles: [
      { type: 'log', x: 4, z: 0 },
      { type: 'moleHole', x: 9, z: 0 },
      { type: 'log', x: 14, z: 0 },
      { type: 'mushroom', x: 19, z: 0 },
      { type: 'moleHole', x: 24, z: 0 },
      { type: 'log', x: 29, z: 0 },
      { type: 'mushroom', x: 34, z: 0 },
    ],
    nuts: [
      { type: 'sphere', x: 2, z: 0 },
      { type: 'cone', x: 3, z: 0 },
      { type: 'cube', x: 6, z: 0 },
      { type: 'sphere', x: 7.5, z: 0 },
      { type: 'cone', x: 11, z: 0 },
      { type: 'cube', x: 12.5, z: 0 },
      { type: 'sphere', x: 16, z: 0 },
      { type: 'cone', x: 17.5, z: 0 },
      { type: 'cube', x: 21, z: 0 },
      { type: 'sphere', x: 22.5, z: 0 },
      { type: 'cone', x: 26, z: 0 },
      { type: 'cube', x: 27.5, z: 0 },
      { type: 'sphere', x: 31, z: 0 },
      { type: 'cone', x: 36, z: 0 },
    ],
    powerUps: [{ type: 'magnet', x: 20, z: 0 }],
  },
  winCondition: { type: 'collect_all' },
};

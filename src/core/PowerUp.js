import * as THREE from 'three';

/**
 * Power-ups coletáveis.
 * Cada tipo tem cor + forma distintas (acessibilidade daltonismo).
 */

export const POWERUP_TYPES = {
  MAGNET: 'magnet',
  SHIELD: 'shield',
  SLOW_MO: 'slowMo',
  DOUBLE: 'double',
};

export const POWERUP_DURATIONS = {
  [POWERUP_TYPES.MAGNET]: 8,
  [POWERUP_TYPES.SHIELD]: Infinity, // 1 hit, não é por tempo
  [POWERUP_TYPES.SLOW_MO]: 5,
  [POWERUP_TYPES.DOUBLE]: 10,
};

const SPECS = {
  [POWERUP_TYPES.MAGNET]: {
    // Forma: ferradura (torus aberto) — vermelho vibrante
    color: 0xe91e63,
    yOffset: 0.6,
    geometry: () =>
      new THREE.TorusGeometry(0.3, 0.12, 8, 12, Math.PI * 1.4),
    rotate: { x: 0, y: 0, z: Math.PI / 2 },
    collider: { width: 1.0, height: 1.0, depth: 1.0 },
  },
  [POWERUP_TYPES.SHIELD]: {
    // Forma: escudo (cone achatado) — azul claro
    color: 0x03a9f4,
    yOffset: 0.55,
    geometry: () => new THREE.ConeGeometry(0.35, 0.7, 5),
    rotate: { x: Math.PI, y: 0, z: 0 },
    collider: { width: 1.0, height: 1.0, depth: 1.0 },
  },
  [POWERUP_TYPES.SLOW_MO]: {
    // Forma: ampulheta (dois cones unidos) — roxo
    color: 0x9c27b0,
    yOffset: 0.6,
    geometry: () => new THREE.OctahedronGeometry(0.4, 0),
    rotate: { x: 0, y: 0, z: 0 },
    collider: { width: 1.0, height: 1.0, depth: 1.0 },
  },
  [POWERUP_TYPES.DOUBLE]: {
    // Forma: cubo duplo (dois cubos sobrepostos) — amarelo dourado
    color: 0xffc107,
    yOffset: 0.55,
    geometry: () => new THREE.BoxGeometry(0.5, 0.5, 0.5),
    rotate: { x: Math.PI / 4, y: Math.PI / 4, z: 0 },
    collider: { width: 1.0, height: 1.0, depth: 1.0 },
  },
};

const BASE_Y = 0.5;

/**
 * Cria um power-up no cenário.
 *
 * @param {THREE.Scene} scene
 * @param {string} type um dos POWERUP_TYPES
 * @param {number} x
 * @param {number} z
 * @returns {{ mesh:THREE.Mesh, position:{x,y,z}, collider:{width,height,depth}, type:string, collected:boolean }}
 */
export function createPowerUp(scene, type, x, z) {
  const spec = SPECS[type];
  if (!spec) throw new Error(`Tipo de power-up desconhecido: ${type}`);

  const material = new THREE.MeshStandardMaterial({
    color: spec.color,
    roughness: 0.3,
    metalness: 0.4,
    emissive: spec.color,
    emissiveIntensity: 0.25,
  });
  const mesh = new THREE.Mesh(spec.geometry(), material);
  mesh.name = `powerup-${type}`;
  mesh.position.set(x, spec.yOffset + BASE_Y, z);
  mesh.rotation.set(spec.rotate.x, spec.rotate.y, spec.rotate.z);
  scene.add(mesh);

  return {
    mesh,
    position: { x, y: BASE_Y, z },
    collider: spec.collider,
    type,
    collected: false,
  };
}

/**
 * Marca um power-up como coletado e o remove da cena.
 * @param {THREE.Scene} scene
 * @param {any} powerUp
 * @returns {boolean} true se foi coletado agora; false se já estava coletado
 */
export function collectPowerUp(scene, powerUp) {
  if (powerUp.collected) return false;
  powerUp.collected = true;
  scene.remove(powerUp.mesh);
  powerUp.mesh.geometry?.dispose?.();
  powerUp.mesh.material?.dispose?.();
  return true;
}

/**
 * Retorna a duração (em segundos) do efeito do power-up.
 * @param {string} type
 * @returns {number}
 */
export function getDuration(type) {
  return POWERUP_DURATIONS[type] ?? 0;
}

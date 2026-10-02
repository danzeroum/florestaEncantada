import * as THREE from 'three';

/**
 * Nozes coletáveis — 3 tipos com cor + forma distintas (acessibilidade daltonismo).
 * Z=0 (trilho lateral).
 */

export const NUT_TYPES = {
  SPHERE: 'sphere',
  CONE: 'cone',
  CUBE: 'cube',
};

const TYPE_SPEC = {
  [NUT_TYPES.SPHERE]: {
    color: 0xff5252,
    geometry: () => new THREE.SphereGeometry(0.35, 14, 10),
    collider: { width: 0.8, height: 0.8, depth: 0.8 },
    yOffset: 0.4,
  },
  [NUT_TYPES.CONE]: {
    color: 0x29b6f6,
    geometry: () => new THREE.ConeGeometry(0.35, 0.7, 12),
    collider: { width: 0.8, height: 0.9, depth: 0.8 },
    yOffset: 0.4,
  },
  [NUT_TYPES.CUBE]: {
    color: 0x66bb6a,
    geometry: () => new THREE.BoxGeometry(0.6, 0.6, 0.6),
    collider: { width: 0.7, height: 0.7, depth: 0.7 },
    yOffset: 0.35,
  },
};

const BASE_Y = 0.4;

/**
 * Cria uma noz coletável.
 *
 * @param {THREE.Scene} scene
 * @param {string} type uma das NUT_TYPES
 * @param {number} x
 * @param {number} z
 * @returns {{ mesh:THREE.Mesh, position:{x,y,z}, collider:{width,height,depth}, type:string, collected:boolean }}
 */
export function createNut(scene, type, x, z) {
  const spec = TYPE_SPEC[type];
  if (!spec) {
    throw new Error(`Tipo de noz desconhecido: ${type}`);
  }

  const material = new THREE.MeshStandardMaterial({
    color: spec.color,
    roughness: 0.4,
    metalness: 0.1,
  });
  const mesh = new THREE.Mesh(spec.geometry(), material);
  mesh.name = `nut-${type}`;
  mesh.position.set(x, spec.yOffset + BASE_Y, z);
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
 * Remove a noz da cena e marca como coletada.
 * @param {THREE.Scene} scene
 * @param {{ mesh:THREE.Mesh, collected:boolean }} nut
 */
export function collectNut(scene, nut) {
  if (nut.collected) return false;
  nut.collected = true;
  scene.remove(nut.mesh);
  nut.mesh.geometry?.dispose?.();
  nut.mesh.material?.dispose?.();
  return true;
}

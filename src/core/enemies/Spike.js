import * as THREE from 'three';
import { GROUND_Y } from '../physics.js';

/**
 * Espinho — obstáculo estático e hostil. Menor que o tronco,
 * mas sempre hostil. Testa precisão do pulo.
 */

const SPIKE_COLOR = 0x424242;
const SPIKE_RADIUS = 0.25;
const SPIKE_HEIGHT = 0.7;

/**
 * @param {THREE.Scene} scene
 * @param {number} x
 * @param {number} z
 */
export function createSpikeObstacle(scene, x, z) {
  const group = new THREE.Group();
  group.name = 'spike';

  // Base (cilindro baixo)
  const baseGeo = new THREE.CylinderGeometry(SPIKE_RADIUS + 0.05, SPIKE_RADIUS + 0.05, 0.1, 8);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x616161 });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.set(x, GROUND_Y + 0.05, z);
  group.add(base);

  // Espinhos pontudos (cones)
  const spikeGeo = new THREE.ConeGeometry(0.08, 0.5, 5);
  const spikeMat = new THREE.MeshStandardMaterial({ color: SPIKE_COLOR, roughness: 0.4, metalness: 0.3 });

  const positions = [
    { x: x, z: z },
    { x: x + 0.15, z: z + 0.15 },
    { x: x - 0.15, z: z + 0.15 },
    { x: x + 0.15, z: z - 0.15 },
  ];
  for (const p of positions) {
    const s = new THREE.Mesh(spikeGeo, spikeMat);
    s.position.set(p.x, GROUND_Y + 0.35, p.z);
    group.add(s);
  }

  scene.add(group);

  return {
    mesh: group,
    position: { x, y: GROUND_Y, z },
    collider: { width: SPIKE_RADIUS * 2 + 0.2, height: SPIKE_HEIGHT, depth: SPIKE_RADIUS * 2 + 0.2 },
    hostile: true,
  };
}

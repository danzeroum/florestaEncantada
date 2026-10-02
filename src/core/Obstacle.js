import * as THREE from 'three';
import { GROUND_Y } from './physics.js';

const LOG_RADIUS = 0.5;
const LOG_HEIGHT = 2.2;
const LOG_COLOR = 0x795548;

/**
 * Cria um tronco deitado como obstáculo.
 *
 * @param {THREE.Scene} scene
 * @param {number} x
 * @param {number} z
 * @returns {{ mesh:THREE.Mesh, position:{x:number,y:number,z:number}, collider:{radius:number,height:number} }}
 */
export function createLogObstacle(scene, x, z) {
  const geometry = new THREE.CylinderGeometry(LOG_RADIUS, LOG_RADIUS, LOG_HEIGHT, 12);
  const material = new THREE.MeshStandardMaterial({ color: LOG_COLOR, roughness: 0.7 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'log';
  mesh.rotation.x = Math.PI / 2;
  mesh.position.set(x, LOG_RADIUS, z);
  scene.add(mesh);

  return {
    mesh,
    position: { x, y: GROUND_Y, z },
    collider: { radius: LOG_RADIUS, height: LOG_HEIGHT },
  };
}

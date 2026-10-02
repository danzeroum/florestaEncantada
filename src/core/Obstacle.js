import * as THREE from 'three';
import { GROUND_Y } from './physics.js';

const LOG_RADIUS = 0.5;
const LOG_LENGTH = 2.2;
const LOG_COLOR = 0x795548;

// O tronco está deitado no eixo Z (rotation.x = π/2).
// Extensões reais: X = diâmetro, Y = diâmetro, Z = comprimento.
const LOG_WIDTH = LOG_RADIUS * 2; // 1.0
const LOG_HEIGHT = LOG_RADIUS * 2; // 1.0
const LOG_DEPTH = LOG_LENGTH; // 2.2

/**
 * Cria um tronco deitado como obstáculo.
 *
 * @param {THREE.Scene} scene
 * @param {number} x
 * @param {number} z
 * @returns {{ mesh:THREE.Mesh, position:{x:number,y:number,z:number}, collider:{width:number,height:number,depth:number} }}
 */
export function createLogObstacle(scene, x, z) {
  const geometry = new THREE.CylinderGeometry(LOG_RADIUS, LOG_RADIUS, LOG_LENGTH, 12);
  const material = new THREE.MeshStandardMaterial({ color: LOG_COLOR, roughness: 0.7 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'log';
  mesh.rotation.x = Math.PI / 2;
  mesh.position.set(x, LOG_RADIUS, z);
  scene.add(mesh);

  return {
    mesh,
    position: { x, y: GROUND_Y, z },
    collider: { width: LOG_WIDTH, height: LOG_HEIGHT, depth: LOG_DEPTH },
  };
}

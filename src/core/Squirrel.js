import * as THREE from 'three';
import { GROUND_Y } from './physics.js';

const CORPO_COLOR = 0xffb300;
const CABECA_COLOR = 0xffa726;
const RABO_COLOR = 0x795548;
const OLHO_COLOR = 0xffffff;

export const SQUIRREL_WIDTH = 1.2;
export const SQUIRREL_HEIGHT = 1.4;
export const SQUIRREL_DEPTH = 1.2;

/**
 * Cria o esquilo geométrico (placeholder até glTF licenciado).
 * Retorna um `PlayerState` com mesh, position, velocity e collider.
 *
 * @param {THREE.Scene} scene
 * @returns {import('./physics.js').PlayerState}
 */
export function createSquirrel(scene) {
  const group = new THREE.Group();
  group.name = 'squirrel';

  const matBody = new THREE.MeshStandardMaterial({ color: CORPO_COLOR, roughness: 0.6 });
  const matHead = new THREE.MeshStandardMaterial({ color: CABECA_COLOR, roughness: 0.6 });
  const matTail = new THREE.MeshStandardMaterial({ color: RABO_COLOR, roughness: 0.8 });
  const matEye = new THREE.MeshStandardMaterial({ color: OLHO_COLOR, roughness: 0.2 });

  // Corpo
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 12), matBody);
  body.position.set(0, 0.6, 0);
  group.add(body);

  // Cabeça
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.5, 0.5), matHead);
  head.position.set(0.35, 1.15, 0);
  group.add(head);

  // Rabo
  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 0.9, 8), matTail);
  tail.position.set(-0.7, 0.8, 0.15);
  tail.rotation.z = Math.PI / 4;
  group.add(tail);

  // Olhos
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), matEye);
  eyeL.position.set(0.55, 1.25, 0.15);
  group.add(eyeL);

  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), matEye);
  eyeR.position.set(0.55, 1.25, -0.15);
  group.add(eyeR);

  // Orelhas
  const earGeo = new THREE.ConeGeometry(0.1, 0.22, 6);
  const earL = new THREE.Mesh(earGeo, matHead);
  earL.position.set(0.18, 1.42, 0.22);
  group.add(earL);

  const earR = new THREE.Mesh(earGeo, matHead);
  earR.position.set(0.18, 1.42, -0.22);
  group.add(earR);

  scene.add(group);

  return {
    mesh: group,
    position: { x: 0, y: GROUND_Y, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    onGround: true,
    collider: { width: SQUIRREL_WIDTH, height: SQUIRREL_HEIGHT, depth: SQUIRREL_DEPTH },
  };
}

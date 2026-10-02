import * as THREE from 'three';
import { GROUND_Y } from '../physics.js';

/**
 * Pássaro — voa em Y oscilante, sempre hostil.
 * A criança precisa pular no timing certo para passar por baixo
 * ou esperar o pássaro subir.
 */

const BIRD_BODY_COLOR = 0x1976d2;
const BIRD_BEAK_COLOR = 0xffa726;
const BIRD_WING_COLOR = 0x1565c0;

const BIRD_RADIUS = 0.35;
const BIRD_HEIGHT = 0.5;
const BIRD_BASE_Y = 1.6;
const BIRD_AMPLITUDE = 0.6;
const BIRD_PERIOD = 2.2;

/**
 * @param {THREE.Scene} scene
 * @param {number} x
 * @param {number} z
 * @param {{ speed?:number }} [options]
 */
export function createBirdObstacle(scene, x, z, options = {}) {
  const speed = options.speed ?? 1;

  const group = new THREE.Group();
  group.name = 'bird';

  // Corpo (esfera alongada)
  const bodyGeo = new THREE.SphereGeometry(BIRD_RADIUS, 12, 10);
  bodyGeo.scale(1.4, 1, 1);
  const bodyMat = new THREE.MeshStandardMaterial({ color: BIRD_BODY_COLOR, roughness: 0.5 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.set(x, BIRD_BASE_Y, z);
  group.add(body);

  // Bico (cone apontando +X)
  const beakGeo = new THREE.ConeGeometry(0.08, 0.18, 6);
  const beakMat = new THREE.MeshStandardMaterial({ color: BIRD_BEAK_COLOR });
  const beak = new THREE.Mesh(beakGeo, beakMat);
  beak.rotation.z = -Math.PI / 2;
  beak.position.set(x + 0.5, BIRD_BASE_Y, z);
  group.add(beak);

  // Asa (esfera achatada)
  const wingGeo = new THREE.SphereGeometry(0.25, 8, 6);
  wingGeo.scale(1, 0.3, 1);
  const wingMat = new THREE.MeshStandardMaterial({ color: BIRD_WING_COLOR });
  const wing = new THREE.Mesh(wingGeo, wingMat);
  wing.position.set(x, BIRD_BASE_Y - 0.05, z + 0.25);
  group.add(wing);

  // Olho
  const eyeGeo = new THREE.SphereGeometry(0.05, 6, 6);
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const eye = new THREE.Mesh(eyeGeo, eyeMat);
  eye.position.set(x + 0.4, BIRD_BASE_Y + 0.1, z + 0.15);
  group.add(eye);

  scene.add(group);

  let elapsed = 0;

  function update(delta) {
    elapsed += delta * speed;
    const t = (elapsed / BIRD_PERIOD) * Math.PI * 2;
    const offsetY = Math.sin(t) * BIRD_AMPLITUDE;

    body.position.y = BIRD_BASE_Y + offsetY;
    beak.position.y = BIRD_BASE_Y + offsetY;
    wing.position.y = BIRD_BASE_Y - 0.05 + offsetY;
    eye.position.y = BIRD_BASE_Y + 0.1 + offsetY;
  }

  function isActive() {
    return true;
  }

  return {
    mesh: group,
    position: { x, y: GROUND_Y, z },
    collider: { width: BIRD_RADIUS * 2, height: BIRD_HEIGHT, depth: BIRD_RADIUS * 2 },
    hostile: true,
    update,
    isActive,
  };
}

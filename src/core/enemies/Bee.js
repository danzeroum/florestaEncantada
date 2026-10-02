import * as THREE from 'three';
import { GROUND_Y } from '../physics.js';

/**
 * Abelha — voa em vai-e-volta horizontal (X), na altura média.
 * Sempre hostil. Cobre uma faixa em X para o jogador ter que esperar o timing.
 */

const BEE_BODY_COLOR = 0xffc107;
const BEE_STRIPE_COLOR = 0x212121;
const BEE_WING_COLOR = 0xe1f5fe;

const BEE_RADIUS = 0.25;
const BEE_HEIGHT = 0.4;
const BEE_Y = 1.2;
const BEE_RANGE = 1.8;
const BEE_PERIOD = 1.4;

/**
 * @param {THREE.Scene} scene
 * @param {number} x
 * @param {number} z
 * @param {{ speed?:number }} [options]
 */
export function createBeeObstacle(scene, x, z, options = {}) {
  const speed = options.speed ?? 1;

  const group = new THREE.Group();
  group.name = 'bee';

  // Corpo (esfera)
  const bodyGeo = new THREE.SphereGeometry(BEE_RADIUS, 10, 8);
  bodyGeo.scale(1.2, 1, 1);
  const bodyMat = new THREE.MeshStandardMaterial({ color: BEE_BODY_COLOR, roughness: 0.4 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.set(x, BEE_Y, z);
  group.add(body);

  // Faixas pretas
  const stripeGeo = new THREE.TorusGeometry(BEE_RADIUS * 0.95, 0.04, 6, 12);
  const stripeMat = new THREE.MeshStandardMaterial({ color: BEE_STRIPE_COLOR });
  const stripe1 = new THREE.Mesh(stripeGeo, stripeMat);
  stripe1.rotation.y = Math.PI / 2;
  stripe1.position.set(x, BEE_Y, z);
  group.add(stripe1);

  // Asas
  const wingGeo = new THREE.SphereGeometry(0.14, 6, 4);
  wingGeo.scale(1, 0.3, 0.6);
  const wingMat = new THREE.MeshStandardMaterial({
    color: BEE_WING_COLOR,
    transparent: true,
    opacity: 0.7,
  });
  const wingL = new THREE.Mesh(wingGeo, wingMat);
  wingL.position.set(x - 0.1, BEE_Y + 0.2, z + 0.15);
  group.add(wingL);
  const wingR = new THREE.Mesh(wingGeo, wingMat);
  wingR.position.set(x - 0.1, BEE_Y + 0.2, z - 0.15);
  group.add(wingR);

  scene.add(group);

  let elapsed = 0;
  let currentX = x;

  function update(delta) {
    elapsed += delta * speed;
    const t = (elapsed / BEE_PERIOD) * Math.PI * 2;
    currentX = x + Math.sin(t) * BEE_RANGE;

    body.position.x = currentX;
    stripe1.position.x = currentX;
    wingL.position.x = currentX - 0.1;
    wingR.position.x = currentX - 0.1;

    // Vibração das asas (rapidamente)
    const wingBeat = Math.sin(elapsed * 30) * 0.05;
    wingL.position.y = BEE_Y + 0.2 + wingBeat;
    wingR.position.y = BEE_Y + 0.2 + wingBeat;
  }

  return {
    mesh: group,
    get position() {
      return { x: currentX, y: GROUND_Y, z };
    },
    collider: { width: BEE_RADIUS * 2, height: BEE_HEIGHT, depth: BEE_RADIUS * 2 },
    hostile: true,
    update,
  };
}

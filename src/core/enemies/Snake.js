import * as THREE from 'three';
import { GROUND_Y } from '../physics.js';

/**
 * Cobra — anda no chão, persegue o jogador lentamente dentro de um raio.
 * Sempre hostil. Desafia o jogador a não ficar parado.
 */

const SNAKE_BODY_COLOR = 0x2e7d32;
const SNAKE_HEAD_COLOR = 0x1b5e20;
const SNAKE_EYE_COLOR = 0xffeb3b;

const SNAKE_RADIUS = 0.3;
const SNAKE_HEIGHT = 0.35;
const SNAKE_CHASE_RADIUS = 4;
const SNAKE_CHASE_SPEED = 1.2;
const SNAKE_HOME_SPEED = 0.4;

/**
 * @param {THREE.Scene} scene
 * @param {number} x
 * @param {number} z
 * @param {{ speed?:number }} [options]
 */
export function createSnakeObstacle(scene, x, z, options = {}) {
  const speed = options.speed ?? 1;

  const group = new THREE.Group();
  group.name = 'snake';

  // Corpo: 3 esferas em sequência
  const bodyMat = new THREE.MeshStandardMaterial({ color: SNAKE_BODY_COLOR, roughness: 0.6 });
  const bodyGeo = new THREE.SphereGeometry(SNAKE_RADIUS, 10, 8);
  const bodies = [];
  for (let i = 0; i < 3; i++) {
    const b = new THREE.Mesh(bodyGeo, bodyMat);
    b.position.set(x - i * 0.35, GROUND_Y + SNAKE_HEIGHT / 2, z);
    bodies.push(b);
    group.add(b);
  }

  // Cabeça (maior)
  const headGeo = new THREE.SphereGeometry(SNAKE_RADIUS * 1.2, 10, 8);
  const headMat = new THREE.MeshStandardMaterial({ color: SNAKE_HEAD_COLOR, roughness: 0.5 });
  const head = new THREE.Mesh(headGeo, headMat);
  head.position.set(x + 0.4, GROUND_Y + SNAKE_HEIGHT / 2, z);
  group.add(head);

  // Olhos
  const eyeGeo = new THREE.SphereGeometry(0.05, 6, 6);
  const eyeMat = new THREE.MeshStandardMaterial({ color: SNAKE_EYE_COLOR });
  const eye = new THREE.Mesh(eyeGeo, eyeMat);
  eye.position.set(x + 0.55, GROUND_Y + SNAKE_HEIGHT / 2 + 0.1, z + 0.15);
  group.add(eye);

  scene.add(group);

  let currentX = x;
  let dir = -1; // -1 = andando para trás, 1 = perseguindo

  function update(delta, context = {}) {
    const { playerX } = context;
    const dt = delta * speed;

    if (typeof playerX === 'number') {
      const dx = playerX - currentX;
      const dist = Math.abs(dx);

      if (dist < SNAKE_CHASE_RADIUS && dist > 0.1) {
        // Persegue
        dir = Math.sign(dx);
        const move = Math.min(dist, SNAKE_CHASE_SPEED * dt);
        currentX += dir * move;
      } else {
        // Volta para casa devagar
        const homeDx = x - currentX;
        if (Math.abs(homeDx) > 0.05) {
          const move = Math.min(Math.abs(homeDx), SNAKE_HOME_SPEED * dt);
          currentX += Math.sign(homeDx) * move;
        }
      }
    }

    // Atualiza posições visuais
    head.position.x = currentX + 0.4;
    eye.position.x = currentX + 0.55;
    for (let i = 0; i < 3; i++) {
      bodies[i].position.x = currentX - i * 0.35;
    }
  }

  return {
    mesh: group,
    // A colisão precisa acompanhar a cabeça
    get position() {
      return { x: currentX, y: GROUND_Y, z };
    },
    collider: { width: SNAKE_RADIUS * 2, height: SNAKE_HEIGHT, depth: SNAKE_RADIUS * 2 },
    hostile: true,
    update,
  };
}

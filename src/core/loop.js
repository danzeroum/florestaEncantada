import * as THREE from 'three';
import { getInputState, ACTIONS } from './input.js';
import {
  applyGravity,
  checkCollision,
  resolveCollision,
  JUMP_VELOCITY,
  JUMP_COOLDOWN,
} from './physics.js';

const MOVE_SPEED = 5;
const CAMERA_LERP = 0.08;

let lastTimestamp = performance.now();

/**
 * Loop principal da Fase 1.
 * @param {{ scene:THREE.Scene, camera:THREE.PerspectiveCamera, renderer:THREE.WebGLRenderer, player:any, obstacles:any[] }} sceneData
 */
export function startLoop(sceneData) {
  const { scene, camera, renderer, player, obstacles } = sceneData;
  const cameraOffset = new THREE.Vector3(0, 14, 22);
  const cameraTarget = new THREE.Vector3();
  const lerpTarget = new THREE.Vector3();
  let jumpCooldown = 0;

  function animate(timestamp) {
    const delta = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
    lastTimestamp = timestamp;

    // ── 1. Input ──
    const input = getInputState();

    // ── 2. Movimento XZ ──
    if (input[ACTIONS.LEFT]) player.position.x -= MOVE_SPEED * delta;
    if (input[ACTIONS.RIGHT]) player.position.x += MOVE_SPEED * delta;

    // ── 3. Pulo (com cooldown) ──
    if (jumpCooldown > 0) jumpCooldown -= delta;
    if (input[ACTIONS.JUMP] && player.onGround && jumpCooldown <= 0) {
      player.velocity.y = JUMP_VELOCITY;
      player.onGround = false;
      jumpCooldown = JUMP_COOLDOWN;
    }

    // ── 4. Gravidade ──
    applyGravity(player, delta);

    // ── 5. Colisão com obstáculos ──
    for (const obstacle of obstacles) {
      if (checkCollision(player, obstacle)) {
        const push = resolveCollision(player, obstacle);
        player.position.x += push.x;
        player.position.z += push.z;
      }
    }

    // ── 6. Atualiza mesh ──
    player.mesh.position.set(player.position.x, player.position.y, player.position.z);

    // ── 7. Câmera segue com lerp ──
    cameraTarget.set(
      player.position.x,
      player.position.y + 1,
      player.position.z
    );
    lerpTarget.copy(cameraTarget).add(cameraOffset);
    camera.position.lerp(lerpTarget, CAMERA_LERP);
    camera.lookAt(cameraTarget);

    // ── 8. Render ──
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

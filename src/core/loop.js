import * as THREE from 'three';
import { getInputState, ACTIONS } from './input.js';
import {
  applyGravity,
  checkCollision,
  resolveCollision,
  JUMP_VELOCITY,
  JUMP_COOLDOWN,
} from './physics.js';
import { collectNut } from './Nut.js';
import { createScoreManager } from './ScoreManager.js';

const MOVE_SPEED = 5;
const CAMERA_LERP = 0.08;

const NUT_COLORS = {
  sphere: 0xff5252,
  cone: 0x29b6f6,
  cube: 0x66bb6a,
};

/**
 * Loop principal da Fase 2.
 * Retorna um handle com `stop()` para cancelar o loop (usado no replay).
 *
 * @param {{ scene:THREE.Scene, camera:THREE.PerspectiveCamera, renderer:THREE.WebGLRenderer, player:any, obstacles:any[], nuts:any[], particles:any, hud?:any }} sceneData
 * @returns {{ stop:()=>void, scoreManager:any }}
 */
export function startLoop(sceneData) {
  const { scene, camera, renderer, player, obstacles, nuts, particles, hud } = sceneData;
  const cameraOffset = new THREE.Vector3(0, 14, 22);
  const cameraTarget = new THREE.Vector3();
  const lerpTarget = new THREE.Vector3();

  const scoreManager = createScoreManager(nuts.length);
  let jumpCooldown = 0;
  let victoryShown = false;
  let running = true;
  let rafId = 0;
  let lastTimestamp = performance.now();

  if (hud) hud.setScore(0, nuts.length);

  function animate(timestamp) {
    if (!running) return;

    const delta = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
    lastTimestamp = timestamp;

    const input = getInputState();

    // ── 1. Movimento X ──
    if (input[ACTIONS.LEFT]) player.position.x -= MOVE_SPEED * delta;
    if (input[ACTIONS.RIGHT]) player.position.x += MOVE_SPEED * delta;

    // ── 2. Pulo ──
    if (jumpCooldown > 0) jumpCooldown -= delta;
    if (input[ACTIONS.JUMP] && player.onGround && jumpCooldown <= 0) {
      player.velocity.y = JUMP_VELOCITY;
      player.onGround = false;
      jumpCooldown = JUMP_COOLDOWN;
    }

    // ── 3. Gravidade ──
    applyGravity(player, delta);

    // ── 4. Colisão com obstáculos ──
    for (const obstacle of obstacles) {
      if (checkCollision(player, obstacle)) {
        const push = resolveCollision(player, obstacle);
        player.position.x += push.x;
        player.position.z += push.z;
      }
    }

    // ── 5. Coleta de nozes ──
    for (const nut of nuts) {
      if (nut.collected) continue;
      if (checkCollision(player, nut)) {
        if (collectNut(scene, nut)) {
          const score = scoreManager.increment();
          if (hud) hud.setScore(score, scoreManager.getTotal());
          particles.explode(
            nut.position.x,
            nut.position.y + 0.6,
            nut.position.z,
            NUT_COLORS[nut.type] ?? 0xffffff
          );
        }
      }
    }

    // ── 6. Partículas ──
    particles.update(delta);

    // ── 7. Mesh do player ──
    player.mesh.position.set(player.position.x, player.position.y, player.position.z);

    // ── 8. Câmera ──
    cameraTarget.set(player.position.x, player.position.y + 1, player.position.z);
    lerpTarget.copy(cameraTarget).add(cameraOffset);
    camera.position.lerp(lerpTarget, CAMERA_LERP);
    camera.lookAt(cameraTarget);

    // ── 9. Vitória ──
    if (!victoryShown && scoreManager.isVictory()) {
      victoryShown = true;
      if (hud) hud.showVictory();
    }

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  }

  rafId = requestAnimationFrame(animate);

  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
  }

  return { stop, scoreManager };
}

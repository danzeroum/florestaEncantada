import * as THREE from 'three';
import { getInputState, ACTIONS } from './input.js';
import {
  applyGravity,
  checkCollision,
  resolveCollision,
  JUMP_VELOCITY,
  JUMP_COOLDOWN,
  GROUND_Y,
} from './physics.js';
import { collectNut } from './Nut.js';
import { collectPowerUp } from './PowerUp.js';
import { createScoreManager } from './ScoreManager.js';
import { SFX } from './AudioManager.js';
import { POWERUP_TYPES } from './PowerUp.js';

const MOVE_SPEED = 5;
const CAMERA_LERP = 0.08;
const INVULNERABILITY_TIME = 1.0; // segundos de invulnerabilidade após perder vida
const TRIP_DURATION = 0.4;
const MAGNET_RADIUS = 4;
const MAGNET_ATTRACT_SPEED = 8;
const SLOW_MO_FACTOR = 0.5;

const NUT_COLORS = {
  sphere: 0xff5252,
  cone: 0x29b6f6,
  cube: 0x66bb6a,
};

/**
 * Loop principal da Fase 3.1 (com vidas).
 * Retorna handle com `stop()` para cancelar o loop.
 *
 * @param {{ scene:THREE.Scene, camera:THREE.PerspectiveCamera, renderer:THREE.WebGLRenderer, player:any, obstacles:any[], nuts:any[], particles:any, hud?:any, lifeManager?:any }} sceneData
 * @returns {{ stop:()=>void, scoreManager:any }}
 */
export function startLoop(sceneData) {
  const {
    scene,
    camera,
    renderer,
    player,
    obstacles,
    nuts,
    powerUps = [],
    particles,
    hud,
    lifeManager,
    onPhaseComplete,
    audio,
    effects,
  } = sceneData;
  const cameraOffset = new THREE.Vector3(0, 14, 22);
  const cameraTarget = new THREE.Vector3();
  const lerpTarget = new THREE.Vector3();

  const scoreManager = createScoreManager(nuts.length);
  let jumpCooldown = 0;
  let victoryShown = false;
  let running = true;
  let rafId = 0;
  let lastTimestamp = performance.now();

  let invulnerability = 0;
  let tripTimer = 0;

  if (hud) {
    hud.setScore(0, nuts.length);
    if (lifeManager) hud.setLives(lifeManager.getLives(), lifeManager.getLives());
  }

  function resetPlayerPosition() {
    player.position.x = 0;
    player.position.y = GROUND_Y;
    player.position.z = 0;
    player.velocity.x = 0;
    player.velocity.y = 0;
    player.velocity.z = 0;
    player.onGround = true;
  }

  function tripAnimation() {
    player.mesh.scale.set(1.2, 0.7, 1.2);
    tripTimer = TRIP_DURATION;
  }

  function onObstacleHit() {
    if (invulnerability > 0) return;

    // Escudo absorve o hit sem custo de vida
    if (effects && effects.consumeShield()) {
      invulnerability = INVULNERABILITY_TIME;
      return;
    }

    if (audio) audio.play(SFX.LOSE_LIFE);
    lifeManager.loseLife();
    invulnerability = INVULNERABILITY_TIME;

    if (hud && lifeManager) {
      hud.setLives(lifeManager.getLives(), 3);
    }

    resetPlayerPosition();
    tripAnimation();
  }

  function animate(timestamp) {
    if (!running) return;

    const delta = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
    lastTimestamp = timestamp;

    if (invulnerability > 0) invulnerability -= delta;
    if (tripTimer > 0) {
      tripTimer -= delta;
      if (tripTimer <= 0) player.mesh.scale.set(1, 1, 1);
    }

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
      if (audio) audio.play(SFX.JUMP);
    }

    // ── 2.5. Efeitos (power-ups) ──
    if (effects) effects.update(delta);
    const isDouble = effects?.isActive(POWERUP_TYPES.DOUBLE) === true;
    const isMagnet = effects?.isActive(POWERUP_TYPES.MAGNET) === true;
    const isSlowMo = effects?.isActive(POWERUP_TYPES.SLOW_MO) === true;
    const worldDelta = isSlowMo ? delta * SLOW_MO_FACTOR : delta;

    // ── 3. Gravidade ──
    applyGravity(player, delta);

    // ── 4. Colisão com obstáculos (perde vida) ──
    for (const obstacle of obstacles) {
      if (checkCollision(player, obstacle)) {
        // Empurra para fora para não ficar preso
        const push = resolveCollision(player, obstacle);
        player.position.x += push.x;
        player.position.z += push.z;

        // Só tira vida se o obstáculo for hostil E estiver ativo.
        // Troncos são "hostile: false" (obstáculo de plataforma, sem dano).
        const active = typeof obstacle.isActive === 'function' ? obstacle.isActive() : true;
        const hostile = obstacle.hostile === true;
        if (active && hostile) onObstacleHit();
      }
    }

    // ── 5a. Ímã atrai nozes próximas ──
    if (isMagnet) {
      for (const nut of nuts) {
        if (nut.collected) continue;
        const dx = player.position.x - nut.position.x;
        const dz = player.position.z - nut.position.z;
        const dist = Math.hypot(dx, dz);
        if (dist > 0 && dist < MAGNET_RADIUS) {
          const moveAmount = Math.min(dist, MAGNET_ATTRACT_SPEED * delta);
          const nx = dx / dist;
          const nz = dz / dist;
          const newX = nut.position.x + nx * moveAmount;
          const newZ = nut.position.z + nz * moveAmount;
          nut.position.x = newX;
          nut.position.z = newZ;
          // Atualiza mesh visualmente (mantém yOffset)
          nut.mesh.position.x = newX;
          nut.mesh.position.z = newZ;
        }
      }
    }

    // ── 5b. Coleta de nozes ──
    for (const nut of nuts) {
      if (nut.collected) continue;
      if (checkCollision(player, nut)) {
        if (collectNut(scene, nut)) {
          // Duplicador: incrementa 2× se ativo
          let score = scoreManager.increment();
          if (isDouble) score = scoreManager.increment();
          if (audio) audio.play(SFX.COLLECT);
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

    // ── 5c. Coleta de power-ups ──
    for (const pu of powerUps) {
      if (pu.collected) continue;
      if (checkCollision(player, pu)) {
        if (collectPowerUp(scene, pu)) {
          if (effects) effects.activate(pu.type);
          if (hud && hud.showBuff) hud.showBuff(pu.type);
          particles.explode(
            pu.position.x,
            pu.position.y + 0.8,
            pu.position.z,
            0xffffff
          );
        }
      }
    }

    // ── 6. Partículas ──
    particles.update(delta);

    // ── 7. Obstáculos animados (slow-mo afeta SÓ eles, não o player) ──
    for (const obstacle of obstacles) {
      if (typeof obstacle.update === 'function') obstacle.update(worldDelta);
    }

    // ── 8. Mesh do player ──
    player.mesh.position.set(player.position.x, player.position.y, player.position.z);

    // ── 9. Câmera ──
    cameraTarget.set(player.position.x, player.position.y + 1, player.position.z);
    lerpTarget.copy(cameraTarget).add(cameraOffset);
    camera.position.lerp(lerpTarget, CAMERA_LERP);
    camera.lookAt(cameraTarget);

    // ── 10. Vitória ──
    if (!victoryShown && scoreManager.isVictory()) {
      victoryShown = true;
      running = false;
      if (audio) audio.play(SFX.VICTORY);
      if (typeof onPhaseComplete === 'function') onPhaseComplete();
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

/**
 * Física AABB caseira — sem engine externa.
 * Zero dependência de Three.js: puro JS, testável em Node.
 *
 * Convenção de collider: extensões TOTAIS por eixo, com `position.y` sendo a BASE.
 *   - baseY = position.y
 *   - topY  = position.y + collider.height
 *
 * @typedef {{x:number,y:number,z:number}} Vec3
 * @typedef {{width:number,height:number,depth:number}} Collider
 * @typedef {{position:Vec3, collider:Collider}} Box
 */

export const GRAVITY = -18;
export const GROUND_Y = 0;
export const JUMP_VELOCITY = 7.5;
export const JUMP_COOLDOWN = 0.3;

/**
 * Verifica colisão AABB entre duas caixas.
 * `position` é a base (pé) do objeto; `height` sobe a partir dela.
 *
 * @param {Box} a
 * @param {Box} b
 * @returns {boolean}
 */
export function checkCollision(a, b) {
  const dx = Math.abs(a.position.x - b.position.x);
  const dz = Math.abs(a.position.z - b.position.z);

  const overlapX = dx < (a.collider.width + b.collider.width) / 2;
  const overlapZ = dz < (a.collider.depth + b.collider.depth) / 2;

  const aBase = a.position.y;
  const aTop = a.position.y + a.collider.height;
  const bBase = b.position.y;
  const bTop = b.position.y + b.collider.height;

  const overlapY = aBase < bTop && aTop > bBase;

  return overlapX && overlapY && overlapZ;
}

/**
 * Aplica gravidade e resolve colisão com o chão.
 * Muta `velocity.y` e `position.y` do estado. Seta `onGround`.
 *
 * @param {{position:Vec3, velocity:Vec3, onGround:boolean}} state
 * @param {number} deltaTime em segundos
 */
export function applyGravity(state, deltaTime) {
  state.velocity.y += GRAVITY * deltaTime;
  state.position.y += state.velocity.y * deltaTime;

  if (state.position.y <= GROUND_Y) {
    state.position.y = GROUND_Y;
    state.velocity.y = 0;
    state.onGround = true;
  } else {
    state.onGround = false;
  }
}

/**
 * Calcula o vetor de resolução (push-out) entre dois colliders sobrepostos.
 * Empurra no eixo de MENOR penetração (X ou Z) — evita empurrar "errado"
 * quando o player está ao lado de um obstáculo mais profundo em Z.
 *
 * @param {Box} player
 * @param {Box} obstacle
 * @returns {{x:number, z:number}}
 */
export function resolveCollision(player, obstacle) {
  const dx = player.position.x - obstacle.position.x;
  const dz = player.position.z - obstacle.position.z;

  const halfW = (player.collider.width + obstacle.collider.width) / 2;
  const halfD = (player.collider.depth + obstacle.collider.depth) / 2;

  const overlapX = halfW - Math.abs(dx);
  const overlapZ = halfD - Math.abs(dz);

  if (overlapX <= 0 || overlapZ <= 0) {
    return { x: 0, z: 0 };
  }

  const MARGIN = 0.05;

  if (overlapX < overlapZ) {
    const sign = dx === 0 ? 1 : Math.sign(dx);
    return { x: sign * (overlapX + MARGIN), z: 0 };
  }

  const sign = dz === 0 ? 1 : Math.sign(dz);
  return { x: 0, z: sign * (overlapZ + MARGIN) };
}

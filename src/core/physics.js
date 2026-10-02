/**
 * Física AABB caseira — sem engine externa.
 * Zero dependência de Three.js: puro JS, testável em Node.
 */

export const GRAVITY = -18;
export const GROUND_Y = 0;
export const JUMP_VELOCITY = 7.5;
export const JUMP_COOLDOWN = 0.3;

/**
 * Verifica colisão AABB simplificada (caixas alinhadas nos eixos).
 * Considera `position` como centro e `collider` como { radius, height }.
 *
 * @param {{position:{x:number,y:number,z:number}, collider:{radius:number,height:number}}} a
 * @param {{position:{x:number,y:number,z:number}, collider:{radius:number,height:number}}} b
 * @returns {boolean}
 */
export function checkCollision(a, b) {
  const dx = Math.abs(a.position.x - b.position.x);
  const dy = Math.abs(a.position.y - b.position.y);
  const dz = Math.abs(a.position.z - b.position.z);

  const overlapX = dx < a.collider.radius + b.collider.radius;
  const overlapZ = dz < a.collider.radius + b.collider.radius;
  const overlapY = dy < (a.collider.height + b.collider.height) / 2;

  return overlapX && overlapZ && overlapY;
}

/**
 * Aplica gravidade e resolve colisão com o chão.
 * Muta `velocity.y` e `position.y` do estado. Seta `onGround`.
 *
 * @param {{position:{x:number,y:number,z:number}, velocity:{x:number,y:number,z:number}, onGround:boolean}} state
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
 * Retorna o deslocamento a aplicar no player para sair do obstáculo.
 * Empurra apenas no eixo X (jogo é de plataforma lateral).
 *
 * @param {{position:{x:number,z:number}, collider:{radius:number}}} player
 * @param {{position:{x:number,z:number}, collider:{radius:number}}} obstacle
 * @returns {{x:number, z:number}}
 */
export function resolveCollision(player, obstacle) {
  const dx = player.position.x - obstacle.position.x;
  const dz = player.position.z - obstacle.position.z;
  const minDist = player.collider.radius + obstacle.collider.radius;
  const dist = Math.hypot(dx, dz);

  if (dist >= minDist || dist === 0) {
    return { x: 0, z: 0 };
  }

  const overlap = minDist - dist;
  const nx = dx / dist;
  const nz = dz / dist;

  return { x: nx * (overlap + 0.05), z: nz * (overlap + 0.05) };
}

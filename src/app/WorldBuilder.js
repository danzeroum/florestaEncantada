/**
 * WorldBuilder — cria, destrói e reseta o conteúdo visual de uma fase.
 * Isola a manipulação da cena de Three.js do fluxo do jogo.
 */

import { createNut } from '../core/Nut.js';
import {
  createLogObstacle,
  createMoleHoleObstacle,
  createMushroomObstacle,
} from '../core/Obstacle.js';

/**
 * @typedef {{ position:any, velocity:any, onGround:boolean, mesh:any }} Player
 * @typedef {{ scene:any, player:Player, obstacles:any[], nuts:any[] }} WorldRefs
 */

/**
 * @param {string} type
 * @param {any} scene
 * @param {number} x
 * @param {number} z
 */
export function createObstacle(type, scene, x, z) {
  switch (type) {
    case 'log':
      return createLogObstacle(scene, x, z);
    case 'moleHole':
      return createMoleHoleObstacle(scene, x, z);
    case 'mushroom':
      return createMushroomObstacle(scene, x, z);
    default:
      throw new Error(`Tipo de obstáculo desconhecido: ${type}`);
  }
}

/**
 * Remove um mesh da cena e libera GPU/memória.
 * Suporta tanto Mesh simples quanto Group (chama traverse).
 * @param {any} mesh
 */
export function disposeMesh(mesh) {
  if (!mesh) return;
  if (mesh.parent) mesh.parent.remove(mesh);
  mesh.traverse?.(child => {
    child.geometry?.dispose?.();
    child.material?.dispose?.();
  });
  mesh.geometry?.dispose?.();
  mesh.material?.dispose?.();
}

/**
 * Reposiciona o jogador no início da fase.
 * @param {Player} player
 */
export function resetPlayer(player) {
  player.position.x = 0;
  player.position.y = 0;
  player.position.z = 0;
  player.velocity.x = 0;
  player.velocity.y = 0;
  player.velocity.z = 0;
  player.onGround = true;
  player.mesh.position.set(0, 0, 0);
  player.mesh.scale.set(1, 1, 1);
}

/**
 * Reconstrói as nozes e obstáculos da cena a partir de um layout.
 * Limpa tudo antes (dispose) para não vazar memória entre fases.
 *
 * @param {WorldRefs} refs
 * @param {{ obstacles:Array, nuts:Array }} layout
 */
export function rebuildWorld(refs, layout) {
  const { scene, obstacles, nuts } = refs;

  for (const nut of nuts) disposeMesh(nut.mesh);
  nuts.length = 0;
  for (const item of layout.nuts) {
    nuts.push(createNut(scene, item.type, item.x, item.z));
  }

  for (const obstacle of obstacles) disposeMesh(obstacle.mesh);
  obstacles.length = 0;
  for (const item of layout.obstacles) {
    obstacles.push(createObstacle(item.type, scene, item.x, item.z));
  }
}

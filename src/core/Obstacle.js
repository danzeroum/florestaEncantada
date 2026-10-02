import * as THREE from 'three';
import { GROUND_Y } from './physics.js';

const LOG_RADIUS = 0.5;
const LOG_LENGTH = 2.2;
const LOG_COLOR = 0x795548;

// O tronco está deitado no eixo Z (rotation.x = π/2).
const LOG_WIDTH = LOG_RADIUS * 2;
const LOG_HEIGHT = LOG_RADIUS * 2;
const LOG_DEPTH = LOG_LENGTH;

/**
 * Toca-toca: aparece e desaparece em ciclo previsível.
 * Hostil apenas quando visível.
 */
const MOLE_CYCLE_ON = 2.0; // segundos visível
const MOLE_CYCLE_OFF = 2.0; // segundos oculto
const MOLE_RADIUS = 0.35;
const MOLE_HEIGHT = 0.9;
const MOLE_COLOR = 0x8d6e63;

/**
 * Cogumelo saltitante: sobe e desce em ciclo senoidal.
 * Hostil sempre.
 */
const MUSHROOM_PERIOD = 2.0; // segundos por ciclo completo
const MUSHROOM_MAX_Y = 1.8;
const MUSHROOM_RADIUS = 0.35;
const MUSHROOM_HEIGHT = 0.7;
const MUSHROOM_COLOR = 0xe57373;
const MUSHROOM_SPOT_COLOR = 0xffffff;

/**
 * Cria um tronco deitado (obstáculo de plataforma, não hostil).
 *
 * @param {THREE.Scene} scene
 * @param {number} x
 * @param {number} z
 */
export function createLogObstacle(scene, x, z) {
  const geometry = new THREE.CylinderGeometry(LOG_RADIUS, LOG_RADIUS, LOG_LENGTH, 12);
  const material = new THREE.MeshStandardMaterial({ color: LOG_COLOR, roughness: 0.7 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'log';
  mesh.rotation.x = Math.PI / 2;
  mesh.position.set(x, LOG_RADIUS, z);
  scene.add(mesh);

  return {
    mesh,
    position: { x, y: GROUND_Y, z },
    collider: { width: LOG_WIDTH, height: LOG_HEIGHT, depth: LOG_DEPTH },
    hostile: false,
  };
}

/**
 * Toca-toca: brota do chão, fica visível por MOLE_CYCLE_ON segundos,
 * depois desaparece por MOLE_CYCLE_OFF. Hostil apenas quando visível.
 *
 * @param {THREE.Scene} scene
 * @param {number} x
 * @param {number} z
 */
/**
 * @param {THREE.Scene} scene
 * @param {number} x
 * @param {number} z
 * @param {{ speed?:number }} [options] speed=1 é o default; >1 acelera o ciclo
 */
export function createMoleHoleObstacle(scene, x, z, options = {}) {
  const speed = options.speed ?? 1;
  const group = new THREE.Group();
  group.name = 'moleHole';

  // Base do buraco (anel escuro no chão)
  const holeGeo = new THREE.CylinderGeometry(MOLE_RADIUS + 0.15, MOLE_RADIUS + 0.15, 0.08, 16);
  const holeMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.9 });
  const hole = new THREE.Mesh(holeGeo, holeMat);
  hole.position.set(x, 0.04, z);
  group.add(hole);

  // Corpo do toca-toca (esfera achatada que sobe do buraco)
  const bodyGeo = new THREE.SphereGeometry(MOLE_RADIUS, 12, 10);
  const bodyMat = new THREE.MeshStandardMaterial({ color: MOLE_COLOR, roughness: 0.6 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.set(x, GROUND_Y, z);
  body.scale.set(1, 1.1, 1);
  group.add(body);

  // Olhos simples
  const eyeGeo = new THREE.SphereGeometry(0.06, 6, 6);
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(x + 0.35, GROUND_Y + 0.15, z + 0.08);
  group.add(eyeL);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(x + 0.35, GROUND_Y + 0.15, z - 0.08);
  group.add(eyeR);

  scene.add(group);

  let elapsed = 0;
  let visible = true;

  function update(delta) {
    elapsed += delta * speed;
    const cycle = MOLE_CYCLE_ON + MOLE_CYCLE_OFF;
    const phase = elapsed % cycle;
    visible = phase < MOLE_CYCLE_ON;

    // Anima a subida/descida do corpo + olhos
    const targetY = visible ? GROUND_Y + MOLE_HEIGHT * 0.5 : GROUND_Y - MOLE_HEIGHT;
    const lerpSpeed = 6;
    body.position.y += (targetY - body.position.y) * Math.min(1, lerpSpeed * delta);
    const eyeTargetY = visible ? GROUND_Y + MOLE_HEIGHT * 0.65 : GROUND_Y - MOLE_HEIGHT;
    eyeL.position.y += (eyeTargetY - eyeL.position.y) * Math.min(1, lerpSpeed * delta);
    eyeR.position.y += (eyeTargetY - eyeR.position.y) * Math.min(1, lerpSpeed * delta);
  }

  function isActive() {
    return visible;
  }

  return {
    mesh: group,
    position: { x, y: GROUND_Y, z },
    collider: { width: MOLE_RADIUS * 2, height: MOLE_HEIGHT, depth: MOLE_RADIUS * 2 },
    hostile: true,
    update,
    isActive,
  };
}

/**
 * Cogumelo saltitante: sobe até MUSHROOM_MAX_Y e volta ao chão, em ciclo senoidal.
 * Hostil sempre (encostar a qualquer momento tira vida).
 *
 * @param {THREE.Scene} scene
 * @param {number} x
 * @param {number} z
 */
/**
 * @param {THREE.Scene} scene
 * @param {number} x
 * @param {number} z
 * @param {{ speed?:number }} [options] speed=1 é o default; >1 acelera o salto
 */
export function createMushroomObstacle(scene, x, z, options = {}) {
  const speed = options.speed ?? 1;
  const group = new THREE.Group();
  group.name = 'mushroom';

  // Talo
  const stemGeo = new THREE.CylinderGeometry(0.15, 0.18, 0.35, 10);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0xfff8e1, roughness: 0.8 });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.set(x, GROUND_Y + 0.175, z);
  group.add(stem);

  // Chapéu (esfera achatada)
  const capGeo = new THREE.SphereGeometry(MUSHROOM_RADIUS, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2);
  const capMat = new THREE.MeshStandardMaterial({ color: MUSHROOM_COLOR, roughness: 0.5 });
  const cap = new THREE.Mesh(capGeo, capMat);
  cap.position.set(x, GROUND_Y + 0.35, z);
  group.add(cap);

  // Bolinhas brancas no chapéu
  const spotGeo = new THREE.SphereGeometry(0.06, 6, 6);
  const spotMat = new THREE.MeshStandardMaterial({ color: MUSHROOM_SPOT_COLOR });
  const spots = [
    { x: x + 0.15, y: GROUND_Y + 0.5, z },
    { x: x - 0.1, y: GROUND_Y + 0.45, z: z + 0.15 },
    { x: x - 0.05, y: GROUND_Y + 0.48, z: z - 0.15 },
  ];
  const spotMeshes = spots.map(s => {
    const m = new THREE.Mesh(spotGeo, spotMat);
    m.position.set(s.x, s.y, s.z);
    group.add(m);
    return m;
  });

  scene.add(group);

  let elapsed = 0;

  const SPOT_BASE_OFFSETS = [0.15, 0.1, 0.13];

  function update(delta) {
    elapsed += delta * speed;
    const t = (elapsed / MUSHROOM_PERIOD) * Math.PI * 2;
    const baseOffset = (Math.sin(t) * 0.5 + 0.5) * MUSHROOM_MAX_Y;

    stem.position.y = GROUND_Y + 0.175 + baseOffset;
    cap.position.y = GROUND_Y + 0.35 + baseOffset;
    spotMeshes.forEach((m, i) => {
      m.position.y = GROUND_Y + 0.35 + SPOT_BASE_OFFSETS[i] + baseOffset;
    });
  }

  return {
    mesh: group,
    position: { x, y: GROUND_Y, z },
    collider: { width: MUSHROOM_RADIUS * 2, height: MUSHROOM_HEIGHT, depth: MUSHROOM_RADIUS * 2 },
    hostile: true,
    update,
  };
}

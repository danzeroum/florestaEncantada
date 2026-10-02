import * as THREE from 'three';
import { createSquirrel } from './Squirrel.js';
import { createLogObstacle } from './Obstacle.js';
import { createNut, NUT_TYPES } from './Nut.js';
import { createLevel } from './Level.js';
import { createParticleSystem } from './ParticleSystem.js';

/**
 * Monta a cena da Fase 2: chão, céu, luzes, esquilo, troncos,
 * nozes coletáveis e sistema de partículas.
 */
export function createScene() {
  // ── Cena ──
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xb3e5fc);

  // ── Céu ──
  const skyGeo = new THREE.SphereGeometry(100, 32, 16);
  const skyMat = new THREE.MeshBasicMaterial({ color: 0xb3e5fc, side: THREE.BackSide });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  sky.name = 'sky';
  scene.add(sky);

  // ── Câmera ──
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 14, 22);
  camera.lookAt(0, 1, 0);

  // ── Luzes ──
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight.position.set(15, 35, 25);
  scene.add(dirLight);

  // ── Chão ──
  const groundGeo = new THREE.PlaneGeometry(40, 40);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x4caf50, roughness: 0.9 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.name = 'ground';
  scene.add(ground);

  // ── Player ──
  const player = createSquirrel(scene);

  // ── Obstáculos ──
  const obstacles = [createLogObstacle(scene, 5, 0), createLogObstacle(scene, 10, 0)];

  // ── Nozes ──
  const nuts = createLevel().map(n => createNut(scene, n.type, n.x, n.z));

  // ── Partículas ──
  const particles = createParticleSystem(scene);

  // ── Renderer ──
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = false;

  return { scene, camera, renderer, player, obstacles, nuts, particles };
}

export { NUT_TYPES };

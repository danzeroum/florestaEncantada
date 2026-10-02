import * as THREE from 'three';
import { createSquirrel } from './Squirrel.js';
import { createParticleSystem } from './ParticleSystem.js';

/**
 * Cria a cena base (céu, câmera, luzes, chão, player, partículas).
 * Obstáculos e nozes são criados pelo WorldBuilder, a partir do layout da fase.
 *
 * Aplica o tema da fase se fornecido (cores de céu, chão, intensidade de luz).
 *
 * @param {{ sky?:number, ground?:number, ambient?:number }} [theme]
 */
export function createScene(theme = {}) {
  const skyColor = theme.sky ?? 0xb3e5fc;
  const groundColor = theme.ground ?? 0x4caf50;
  const ambientIntensity = theme.ambient ?? 0.7;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(skyColor);

  // ── Céu (esfera vista de dentro) ──
  const skyGeo = new THREE.SphereGeometry(100, 32, 16);
  const skyMat = new THREE.MeshBasicMaterial({ color: skyColor, side: THREE.BackSide });
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
  const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity);
  ambientLight.name = 'ambientLight';
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight.position.set(15, 35, 25);
  scene.add(dirLight);

  // ── Chão ──
  const groundGeo = new THREE.PlaneGeometry(100, 40);
  const groundMat = new THREE.MeshStandardMaterial({ color: groundColor, roughness: 0.9 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.name = 'ground';
  scene.add(ground);

  // ── Player ──
  const player = createSquirrel(scene);

  // ── Partículas ──
  const particles = createParticleSystem(scene);

  // ── Renderer ──
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = false;

  /**
   * Aplica um tema à cena já montada (usado ao trocar de fase).
   * @param {{ sky?:number, ground?:number, ambient?:number }} nextTheme
   */
  function applyTheme(nextTheme = {}) {
    if (nextTheme.sky !== undefined) {
      scene.background.set(nextTheme.sky);
      sky.material.color.set(nextTheme.sky);
    }
    if (nextTheme.ground !== undefined) {
      ground.material.color.set(nextTheme.ground);
    }
    if (nextTheme.ambient !== undefined) {
      ambientLight.intensity = nextTheme.ambient;
    }
  }

  // Arrays mutáveis — WorldBuilder preenche e limpa
  const obstacles = [];
  const nuts = [];

  return {
    scene,
    camera,
    renderer,
    player,
    obstacles,
    nuts,
    particles,
    applyTheme,
  };
}

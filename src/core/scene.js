import * as THREE from 'three';

/**
 * Cria a cena base com cubo girando (smoke test da Fase 0).
 * Retorna todos os objetos para o loop animar.
 */
export function createScene() {
  // ── Cena ──
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#8bc34a');
  scene.fog = new THREE.Fog('#8bc34a', 40, 80);

  // ── Câmera isométrica (~45°) ──
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(10, 12, 20);
  camera.lookAt(0, 0, 0);

  // ── Luz ambiente suave ──
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // ── Luz direcional (sol) ──
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(20, 40, 30);
  dirLight.castShadow = false;
  scene.add(dirLight);

  // ── Chão (grama) ──
  const groundGeometry = new THREE.PlaneGeometry(40, 40);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x4caf50,
    roughness: 0.9,
    metalness: 0.1,
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.position.set(0, 0, 0);
  ground.rotation.x = -Math.PI / 2;
  ground.name = 'ground';
  scene.add(ground);

  // ── Cubo girando (placeholder do esquilo) ──
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffb300,
    roughness: 0.3,
    metalness: 0.2,
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 1, 0);
  cube.castShadow = false;
  cube.name = 'player-placeholder';
  scene.add(cube);

  // ── Renderer ──
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = false;

  // ── Label DOM (texto sobre o cubo) ──
  const label = document.createElement('div');
  label.textContent = '🌱 Floresta Encantada — smoke test';

  return { scene, camera, renderer, cube, label };
}

import './styles.css';
import { createScene } from './core/scene.js';
import { setupInput } from './core/input.js';
import { startLoop } from './core/loop.js';
import { createHUD } from './ui/HUD.js';
import { createNut } from './core/Nut.js';
import { createLifeManager } from './core/LifeManager.js';

const root = document.getElementById('root');
if (!root) {
  throw new Error('#root não encontrado no index.html');
}

const INITIAL_LIVES = 3;

const { scene, camera, renderer, player, obstacles, nuts, particles } = createScene();
root.appendChild(renderer.domElement);
setupInput();

let currentLoop = null;
let hud = null;
let lifeManager = null;

const STARTING_NUT_LAYOUT = nuts.map(n => ({
  type: n.type,
  x: n.position.x,
  z: n.position.z,
}));

function resetPlayer() {
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

function rebuildNuts() {
  for (const nut of nuts) {
    if (nut.mesh && nut.mesh.parent) {
      nut.mesh.parent.remove(nut.mesh);
    }
    nut.mesh?.geometry?.dispose?.();
    nut.mesh?.material?.dispose?.();
  }
  nuts.length = 0;
  for (const item of STARTING_NUT_LAYOUT) {
    nuts.push(createNut(scene, item.type, item.x, item.z));
  }
}

function onGameOver() {
  if (currentLoop) {
    currentLoop.stop();
    currentLoop = null;
  }
  if (hud) hud.showGameOver();
}

function startGame() {
  if (currentLoop) {
    currentLoop.stop();
    currentLoop = null;
  }

  resetPlayer();
  rebuildNuts();

  if (hud) hud.dispose();
  hud = createHUD(root, { onReplay: startGame });

  if (!lifeManager) {
    lifeManager = createLifeManager(INITIAL_LIVES, undefined, onGameOver);
  } else {
    lifeManager.reset();
  }

  hud.setScore(0, nuts.length);
  hud.setLives(lifeManager.getLives(), INITIAL_LIVES);

  currentLoop = startLoop({
    scene,
    camera,
    renderer,
    player,
    obstacles,
    nuts,
    particles,
    hud,
    lifeManager,
  });
}

startGame();

function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', onResize);

import './styles.css';
import { createScene } from './core/scene.js';
import { setupInput } from './core/input.js';
import { startLoop } from './core/loop.js';
import { createHUD } from './ui/HUD.js';
import { createMenuUI } from './ui/MenuUI.js';
import { createHowToPlayUI } from './ui/HowToPlayUI.js';
import { createPauseUI } from './ui/PauseUI.js';
import { createNut } from './core/Nut.js';
import {
  createLogObstacle,
  createMoleHoleObstacle,
  createMushroomObstacle,
} from './core/Obstacle.js';
import { OBSTACLE_TYPES } from './core/Level.js';
import { createLevelManager } from './core/LevelManager.js';
import { createLifeManager } from './core/LifeManager.js';
import { createGameState, STATES } from './state/GameState.js';

const root = document.getElementById('root');
if (!root) {
  throw new Error('#root não encontrado no index.html');
}

const INITIAL_LIVES = 3;

const { scene, camera, renderer, player, obstacles, nuts, particles } = createScene();
root.appendChild(renderer.domElement);
setupInput();

const gameState = createGameState(STATES.MENU);
const levelManager = createLevelManager();

let currentLoop = null;
let hud = null;
let lifeManager = null;
let menu = null;
let howTo = null;
let pause = null;

function createObstacle(type, x, z) {
  switch (type) {
    case OBSTACLE_TYPES.LOG:
      return createLogObstacle(scene, x, z);
    case OBSTACLE_TYPES.MOLE_HOLE:
      return createMoleHoleObstacle(scene, x, z);
    case OBSTACLE_TYPES.MUSHROOM:
      return createMushroomObstacle(scene, x, z);
    default:
      throw new Error(`Tipo de obstáculo desconhecido: ${type}`);
  }
}

function disposeMesh(mesh) {
  if (!mesh) return;
  if (mesh.parent) mesh.parent.remove(mesh);
  mesh.traverse?.(child => {
    child.geometry?.dispose?.();
    child.material?.dispose?.();
  });
  mesh.geometry?.dispose?.();
  mesh.material?.dispose?.();
}

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

function rebuildWorld() {
  const { layout } = levelManager.getCurrent();

  for (const nut of nuts) disposeMesh(nut.mesh);
  nuts.length = 0;
  for (const item of layout.nuts) {
    nuts.push(createNut(scene, item.type, item.x, item.z));
  }

  for (const obstacle of obstacles) disposeMesh(obstacle.mesh);
  obstacles.length = 0;
  for (const item of layout.obstacles) {
    obstacles.push(createObstacle(item.type, item.x, item.z));
  }
}

function stopLoop() {
  if (currentLoop) {
    currentLoop.stop();
    currentLoop = null;
  }
}

function onGameOver() {
  stopLoop();
  gameState.set(STATES.GAME_OVER);
  if (hud) hud.showGameOver();
}

function loadPhase() {
  stopLoop();
  resetPlayer();
  rebuildWorld();

  if (lifeManager) lifeManager.reset();
  if (hud) {
    hud.setLives(lifeManager.getLives(), INITIAL_LIVES);
    hud.setScore(0, nuts.length);
  }

  gameState.set(STATES.RUNNING);

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
    onPhaseComplete,
  });
}

function onPhaseComplete() {
  stopLoop();
  gameState.set(STATES.VICTORY);
  const info = levelManager.getCurrent();
  if (hud) {
    hud.showVictory({
      isLast: info.isLast,
      onNext: info.isLast ? undefined : goToNextPhase,
    });
  }
}

function goToNextPhase() {
  if (levelManager.next()) {
    loadPhase();
  } else {
    startNewGame();
  }
}

function startNewGame() {
  levelManager.reset();
  lifeManager = lifeManager ?? createLifeManager(INITIAL_LIVES, undefined, onGameOver);
  lifeManager.reset();

  if (hud) hud.dispose();
  hud = createHUD(root, { onReplay: startNewGame });

  loadPhase();
}

function showMenu() {
  stopLoop();
  if (hud) {
    hud.hideVictory();
    hud.hideGameOver();
  }
  gameState.set(STATES.MENU);
  menu.show();
}

function showPause() {
  if (!gameState.is(STATES.RUNNING)) return;
  gameState.set(STATES.PAUSED);
  stopLoop();
  pause.show();
}

function hidePauseAndResume() {
  pause.hide();
  if (gameState.is(STATES.PAUSED)) {
    gameState.set(STATES.RUNNING);
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
      onPhaseComplete,
    });
  }
}

function quitToMenu() {
  pause.hide();
  showMenu();
}

// ── Instancia UIs ──

menu = createMenuUI(root, {
  onPlay: () => {
    menu.hide();
    startNewGame();
  },
  onHowToPlay: () => {
    menu.hide();
    gameState.set(STATES.HOW_TO_PLAY);
    howTo.show();
  },
  muteEnabled: false,
});

howTo = createHowToPlayUI(root, {
  onBack: () => {
    howTo.hide();
    showMenu();
  },
});

pause = createPauseUI(root, {
  onResume: hidePauseAndResume,
  onRestart: () => {
    pause.hide();
    loadPhase();
  },
  onQuit: quitToMenu,
});

// ── ESC pausa/despausa ──

window.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;

  if (gameState.is(STATES.RUNNING)) {
    event.preventDefault();
    showPause();
  } else if (gameState.is(STATES.PAUSED)) {
    event.preventDefault();
    hidePauseAndResume();
  } else if (gameState.is(STATES.HOW_TO_PLAY)) {
    event.preventDefault();
    howTo.hide();
    showMenu();
  }
});

showMenu();

function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', onResize);

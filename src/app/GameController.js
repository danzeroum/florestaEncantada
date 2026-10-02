/**
 * GameController — orquestra o fluxo de jogo.
 * Responsável por: iniciar partida, carregar fase, transitar entre
 * menu/pausa/vitória/game over, e manter o loop de render sincronizado
 * com o estado (GameState).
 *
 * Não conhece Three.js diretamente — recebe tudo por injeção de dependências.
 */

import { startLoop } from '../core/loop.js';
import { createLifeManager } from '../core/LifeManager.js';
import { createHUD } from '../ui/HUD.js';
import { resetPlayer, rebuildWorld } from './WorldBuilder.js';
import { focusGameCanvas } from '../utils/focus.js';
import { STATES } from '../state/GameState.js';

const INITIAL_LIVES = 3;

/**
 * @param {{
 *   root: HTMLElement,
 *   scene: any, camera: any, renderer: any, player: any,
 *   obstacles: any[], nuts: any[], particles: any,
 *   gameState: any, levelManager: any, audio: any,
 *   menu: any, howTo: any, pause: any
 * }} deps
 */
export function createGameController(deps) {
  const {
    root,
    scene,
    camera,
    renderer,
    player,
    obstacles,
    nuts,
    particles,
    gameState,
    levelManager,
    audio,
    menu,
    howTo,
    pause,
  } = deps;

  let currentLoop = null;
  let hud = null;
  let lifeManager = null;

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

  function buildLoop() {
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
      audio,
    });
  }

  function loadPhase() {
    stopLoop();
    resetPlayer(player);

    const { layout } = levelManager.getCurrent();
    rebuildWorld({ scene, obstacles, nuts }, layout);

    if (lifeManager) lifeManager.reset();
    if (hud) {
      hud.setLives(lifeManager.getLives(), INITIAL_LIVES);
      hud.setScore(0, nuts.length);
    }

    gameState.set(STATES.RUNNING);
    buildLoop();
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
    focusGameCanvas(renderer.domElement);
    if (gameState.is(STATES.PAUSED)) {
      gameState.set(STATES.RUNNING);
      buildLoop();
    }
  }

  function quitToMenu() {
    pause.hide();
    showMenu();
  }

  function handleEscape() {
    if (gameState.is(STATES.RUNNING)) {
      showPause();
      return true;
    }
    if (gameState.is(STATES.PAUSED)) {
      hidePauseAndResume();
      return true;
    }
    if (gameState.is(STATES.HOW_TO_PLAY)) {
      howTo.hide();
      showMenu();
      return true;
    }
    return false;
  }

  return {
    startNewGame,
    loadPhase,
    showMenu,
    showPause,
    hidePauseAndResume,
    quitToMenu,
    goToNextPhase,
    handleEscape,
    stopLoop,
    getHud: () => hud,
  };
}

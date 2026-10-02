/**
 * App — bootstrap do jogo.
 * Monta a cena, instancia as UIs, cria o GameController e conecta tudo.
 */

import { createScene } from '../core/scene.js';
import { setupInput } from '../core/input.js';
import { PHASES } from '../data/phases/index.js';
import { createMenuUI } from '../ui/MenuUI.js';
import { createHowToPlayUI } from '../ui/HowToPlayUI.js';
import { createPauseUI } from '../ui/PauseUI.js';
import { createLevelMapUI } from '../ui/LevelMapUI.js';
import { createAudioManager } from '../core/AudioManager.js';
import { createProgressManager } from '../core/ProgressManager.js';
import { createGameState, STATES } from '../state/GameState.js';
import { createLevelManager } from '../core/LevelManager.js';
import { installErrorBoundary } from './ErrorBoundary.js';
import { createGameController } from './GameController.js';
import { focusGameCanvas } from '../utils/focus.js';

/**
 * Inicia o jogo no elemento root informado.
 * @param {HTMLElement} root
 * @returns {{ dispose:()=>void }}
 */
export function startApp(root) {
  if (!root) throw new Error('App: root é obrigatório');

  const errorBoundary = installErrorBoundary(root);

  // Cria a cena com o tema da primeira fase
  const firstTheme = PHASES[0]?.theme ?? {};
  const { scene, camera, renderer, player, obstacles, nuts, particles, applyTheme } =
    createScene(firstTheme);
  root.appendChild(renderer.domElement);
  errorBoundary.attachCanvas(renderer.domElement);
  setupInput();

  const gameState = createGameState(STATES.MENU);
  const levelManager = createLevelManager();
  const audio = createAudioManager();
  const progressManager = createProgressManager(levelManager.getTotal());

  // UIs são criadas com referências aos callbacks do controller.
  // Como o controller é criado depois, usamos um proxy que resolve no primeiro uso.
  let controller = null;

  const menu = createMenuUI(root, {
    onPlay: () => {
      audio.unlock();
      menu.hide();
      focusGameCanvas(renderer.domElement);
      controller.startNewGame();
    },
    onHowToPlay: () => {
      menu.hide();
      gameState.set(STATES.HOW_TO_PLAY);
      howTo.show();
    },
    onOpenMap: () => {
      menu.hide();
      levelMap.show(progressManager);
    },
    onToggleMute: () => {
      audio.unlock();
      audio.setMuted(!audio.isMuted());
      menu.setMuted(audio.isMuted());
    },
    muteEnabled: true,
  });

  const howTo = createHowToPlayUI(root, {
    onBack: () => {
      howTo.hide();
      controller.showMenu();
      focusGameCanvas(renderer.domElement);
    },
  });

  const pause = createPauseUI(root, {
    onResume: () => controller.hidePauseAndResume(),
    onRestart: () => {
      pause.hide();
      controller.loadPhase();
    },
    onQuit: () => controller.quitToMenu(),
  });

  const levelMap = createLevelMapUI(root, {
    totalPhases: levelManager.getTotal(),
    onSelect: index => controller.selectPhase(index),
    onBack: () => {
      levelMap.hide();
      controller.showMenu();
      focusGameCanvas(renderer.domElement);
    },
  });

  controller = createGameController({
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
    levelMap,
    applyTheme,
    progressManager,
  });

  // Desbloqueia o áudio no primeiro gesto (regra dos navegadores)
  function unlockAudioOnce() {
    audio.unlock();
    window.removeEventListener('pointerdown', unlockAudioOnce);
    window.removeEventListener('keydown', unlockAudioOnce);
  }
  window.addEventListener('pointerdown', unlockAudioOnce);
  window.addEventListener('keydown', unlockAudioOnce);

  // ESC pausa/despausa
  function onKeyDown(event) {
    if (event.key !== 'Escape') return;
    if (controller.handleEscape()) event.preventDefault();
  }
  window.addEventListener('keydown', onKeyDown);

  // Resize
  function onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  controller.showMenu();

  function dispose() {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('pointerdown', unlockAudioOnce);
    window.removeEventListener('keydown', unlockAudioOnce);
    controller.stopLoop();
    menu.dispose();
    howTo.dispose();
    pause.dispose();
    errorBoundary.dispose();
    audio.dispose();
  }

  return { dispose };
}

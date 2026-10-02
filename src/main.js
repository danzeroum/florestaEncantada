import './styles.css';
import { createScene } from './core/scene.js';
import { setupInput } from './core/input.js';
import { startLoop } from './core/loop.js';
import { createHUD } from './ui/HUD.js';
import { createNut } from './core/Nut.js';

const root = document.getElementById('root');
if (!root) {
  throw new Error('#root não encontrado no index.html');
}

const { scene, camera, renderer, player, obstacles, nuts, particles } = createScene();
root.appendChild(renderer.domElement);
setupInput();

// Estado de execução — permite cancelar o loop anterior no replay
let currentLoop = null;
let hud = null;

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
}

function rebuildNuts() {
  // Remove nozes antigas da cena (as que sobraram)
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

function startGame() {
  // Cancela loop anterior (se houver) — evita requestAnimationFrame acumulado
  if (currentLoop) {
    currentLoop.stop();
    currentLoop = null;
  }

  resetPlayer();
  rebuildNuts();

  // Recria HUD do zero para esconder vitória e zerar contador
  if (hud) hud.dispose();
  hud = createHUD(root, { onReplay: startGame });

  currentLoop = startLoop({
    scene,
    camera,
    renderer,
    player,
    obstacles,
    nuts,
    particles,
    hud,
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

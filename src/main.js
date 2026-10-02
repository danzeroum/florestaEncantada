import './styles.css';
import { createScene } from './core/scene.js';
import { setupInput } from './core/input.js';
import { startLoop } from './core/loop.js';

// ── Monta a cena no #root ──
const root = document.getElementById('root');
if (!root) {
  throw new Error('#root não encontrado no index.html');
}

const { scene, camera, renderer, player, obstacles } = createScene();
root.appendChild(renderer.domElement);

// ── Setup de input ──
setupInput();

// ── Inicia o loop ──
startLoop({ scene, camera, renderer, player, obstacles });

// ── Resize responsivo ──
function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', onResize);

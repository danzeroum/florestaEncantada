import './styles.css';
import { createScene } from './core/scene.js';
import { startLoop } from './core/loop.js';

// ── Monta a cena no #root ──
const root = document.getElementById('root');
if (!root) {
  throw new Error('#root não encontrado no index.html');
}

const { scene, camera, renderer, cube, label } = createScene();
root.appendChild(renderer.domElement);

// ── Label visual (smoke test) ──
label.id = 'cube-label';
root.appendChild(label);

// ── Inicia o loop de animação ──
startLoop(scene, camera, renderer, cube);

// ── Resize responsivo ──
function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', onResize);

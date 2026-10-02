let lastTimestamp = performance.now();

/**
 * Loop de animação principal.
 * @param {import('three').Scene} scene
 * @param {import('three').Camera} camera
 * @param {import('three').WebGLRenderer} renderer
 * @param {import('three').Mesh} cube
 */
export function startLoop(scene, camera, renderer, cube) {
  function animate(timestamp) {
    const delta = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    cube.rotation.y += delta * 1.2;
    cube.rotation.x = Math.sin(timestamp / 1000) * 0.15;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

import * as THREE from 'three';

const POOL_SIZE = 60;
const PARTICLES_PER_BURST = 12;
const PARTICLE_LIFETIME = 0.6;
const PARTICLE_SPEED = 3.5;

/**
 * Sistema de partículas com pool fixo (sem alocação em runtime).
 *
 * @param {THREE.Scene} scene
 * @returns {{ explode:(x:number,y:number,z:number,color:number)=>void, update:(delta:number)=>void, dispose:()=>void, _debug:()=>({active:number, pool:number}) }}
 */
export function createParticleSystem(scene) {
  const positions = new Float32Array(POOL_SIZE * 3);
  const colors = new Float32Array(POOL_SIZE * 3);
  const velocities = new Float32Array(POOL_SIZE * 3);
  const ages = new Float32Array(POOL_SIZE).fill(Infinity);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.18,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  points.name = 'particles';
  points.frustumCulled = false;
  scene.add(points);

  for (let i = 0; i < POOL_SIZE; i++) {
    positions[i * 3 + 1] = -1000;
  }
  geometry.attributes.position.needsUpdate = true;

  let cursor = 0;

  function explode(x, y, z, color) {
    const c = new THREE.Color(color);
    let spawned = 0;

    for (let i = 0; i < POOL_SIZE && spawned < PARTICLES_PER_BURST; i++) {
      const idx = (cursor + i) % POOL_SIZE;
      if (ages[idx] !== Infinity) continue;

      positions[idx * 3] = x;
      positions[idx * 3 + 1] = y;
      positions[idx * 3 + 2] = z;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = PARTICLE_SPEED * (0.6 + Math.random() * 0.6);
      velocities[idx * 3] = Math.cos(theta) * Math.sin(phi) * speed;
      velocities[idx * 3 + 1] = Math.cos(phi) * speed + 1.5;
      velocities[idx * 3 + 2] = Math.sin(theta) * Math.sin(phi) * speed;

      colors[idx * 3] = c.r;
      colors[idx * 3 + 1] = c.g;
      colors[idx * 3 + 2] = c.b;

      ages[idx] = 0;
      spawned++;
    }

    cursor = (cursor + PARTICLES_PER_BURST) % POOL_SIZE;
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
  }

  function update(delta) {
    let anyActive = false;

    for (let i = 0; i < POOL_SIZE; i++) {
      if (ages[i] === Infinity) continue;

      ages[i] += delta;
      if (ages[i] >= PARTICLE_LIFETIME) {
        ages[i] = Infinity;
        positions[i * 3 + 1] = -1000;
        continue;
      }

      velocities[i * 3 + 1] -= 9.8 * delta;
      positions[i * 3] += velocities[i * 3] * delta;
      positions[i * 3 + 1] += velocities[i * 3 + 1] * delta;
      positions[i * 3 + 2] += velocities[i * 3 + 2] * delta;
      anyActive = true;
    }

    if (anyActive) {
      geometry.attributes.position.needsUpdate = true;
    }
  }

  function dispose() {
    scene.remove(points);
    geometry.dispose();
    material.dispose();
  }

  function _debug() {
    let active = 0;
    for (let i = 0; i < POOL_SIZE; i++) {
      if (ages[i] !== Infinity) active++;
    }
    return { active, pool: POOL_SIZE };
  }

  return { explode, update, dispose, _debug };
}

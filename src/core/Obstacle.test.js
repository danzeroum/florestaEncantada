import { describe, it, expect, vi } from 'vitest';

vi.mock('three', () => {
  class Mesh {
    constructor(geometry, material) {
      this.geometry = geometry;
      this.material = material;
      this.position = { set: vi.fn() };
      this.rotation = { x: 0, y: 0, z: 0 };
      this.name = '';
    }
  }
  class CylinderGeometry {}
  class MeshStandardMaterial {
    constructor(opts) {
      Object.assign(this, opts);
    }
  }
  return { Mesh, CylinderGeometry, MeshStandardMaterial };
});

import { createLogObstacle } from './Obstacle.js';

describe('createLogObstacle', () => {
  const fakeScene = () => ({ add: vi.fn() });

  it('adds log mesh to scene', () => {
    const scene = fakeScene();
    createLogObstacle(scene, 5, 0);
    expect(scene.add).toHaveBeenCalledOnce();
  });

  it('positions log at given x and z', () => {
    const obstacle = createLogObstacle(fakeScene(), 7, -3);
    expect(obstacle.position.x).toBe(7);
    expect(obstacle.position.z).toBe(-3);
  });

  it('rotates log to lie down (rotation.x = PI/2)', () => {
    const obstacle = createLogObstacle(fakeScene(), 0, 0);
    expect(obstacle.mesh.rotation.x).toBeCloseTo(Math.PI / 2, 5);
  });

  it('has collider with expected dimensions', () => {
    const obstacle = createLogObstacle(fakeScene(), 0, 0);
    expect(obstacle.collider.radius).toBe(0.5);
    expect(obstacle.collider.height).toBe(2.2);
  });
});

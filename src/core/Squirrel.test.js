import { describe, it, expect, vi } from 'vitest';

// Mock mínimo do THREE antes de importar o módulo
vi.mock('three', () => {
  class Group {
    constructor() {
      this.children = [];
      this.position = { set: vi.fn() };
      this.name = '';
    }
    add(child) {
      this.children.push(child);
    }
  }
  class Mesh {
    constructor(geometry, material) {
      this.geometry = geometry;
      this.material = material;
      this.position = { set: vi.fn() };
      this.rotation = { x: 0, y: 0, z: 0 };
    }
  }
  class SphereGeometry {}
  class BoxGeometry {}
  class CylinderGeometry {}
  class ConeGeometry {}
  class MeshStandardMaterial {
    constructor(opts) {
      Object.assign(this, opts);
    }
  }
  return {
    Group,
    Mesh,
    SphereGeometry,
    BoxGeometry,
    CylinderGeometry,
    ConeGeometry,
    MeshStandardMaterial,
  };
});

import { createSquirrel, SQUIRREL_RADIUS, SQUIRREL_HEIGHT } from './Squirrel.js';

describe('createSquirrel', () => {
  const fakeScene = () => ({ add: vi.fn() });

  it('adds squirrel group to scene', () => {
    const scene = fakeScene();
    createSquirrel(scene);
    expect(scene.add).toHaveBeenCalledOnce();
  });

  it('returns state with position at ground level', () => {
    const player = createSquirrel(fakeScene());
    expect(player.position).toEqual({ x: 0, y: 0, z: 0 });
    expect(player.velocity).toEqual({ x: 0, y: 0, z: 0 });
    expect(player.onGround).toBe(true);
  });

  it('has collider with expected radius and height', () => {
    const player = createSquirrel(fakeScene());
    expect(player.collider.radius).toBe(SQUIRREL_RADIUS);
    expect(player.collider.height).toBe(SQUIRREL_HEIGHT);
  });

  it('mesh has all 7 body parts', () => {
    const player = createSquirrel(fakeScene());
    // corpo + cabeça + rabo + 2 olhos + 2 orelhas = 7
    expect(player.mesh.children.length).toBe(7);
  });
});

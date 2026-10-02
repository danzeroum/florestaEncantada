import { describe, it, expect, vi } from 'vitest';

vi.mock('three', () => {
  class Mesh {
    constructor(_geometry, _material) {
      this.geometry = { dispose: vi.fn() };
      this.material = { dispose: vi.fn() };
      this.position = { set: vi.fn() };
      this.parent = null;
      this.name = '';
    }
  }
  class SphereGeometry {}
  class ConeGeometry {}
  class BoxGeometry {}
  class MeshStandardMaterial {
    constructor(opts) {
      Object.assign(this, opts);
    }
  }
  return { Mesh, SphereGeometry, ConeGeometry, BoxGeometry, MeshStandardMaterial };
});

import { createNut, collectNut, NUT_TYPES } from './Nut.js';

describe('createNut', () => {
  const fakeScene = () => ({ add: vi.fn(), remove: vi.fn() });

  it('creates a nut of each type without error', () => {
    for (const type of Object.values(NUT_TYPES)) {
      expect(() => createNut(fakeScene(), type, 0, 0)).not.toThrow();
    }
  });

  it('throws on unknown type', () => {
    expect(() => createNut(fakeScene(), 'banana', 0, 0)).toThrow();
  });

  it('adds nut to scene', () => {
    const scene = fakeScene();
    createNut(scene, NUT_TYPES.SPHERE, 1, 0);
    expect(scene.add).toHaveBeenCalledOnce();
  });

  it('starts uncollected with correct collider', () => {
    const nut = createNut(fakeScene(), NUT_TYPES.SPHERE, 5, 0);
    expect(nut.collected).toBe(false);
    expect(nut.position.x).toBe(5);
    expect(nut.collider.width).toBeGreaterThan(0);
    expect(nut.collider.height).toBeGreaterThan(0);
    expect(nut.collider.depth).toBeGreaterThan(0);
  });
});

describe('collectNut', () => {
  const fakeScene = () => ({ add: vi.fn(), remove: vi.fn() });

  it('marks nut as collected and removes from scene', () => {
    const scene = fakeScene();
    const nut = createNut(scene, NUT_TYPES.CONE, 2, 0);
    const ok = collectNut(scene, nut);
    expect(ok).toBe(true);
    expect(nut.collected).toBe(true);
    expect(scene.remove).toHaveBeenCalledWith(nut.mesh);
  });

  it('returns false when already collected (no double-collect)', () => {
    const scene = fakeScene();
    const nut = createNut(scene, NUT_TYPES.CUBE, 3, 0);
    collectNut(scene, nut);
    const ok = collectNut(scene, nut);
    expect(ok).toBe(false);
    expect(scene.remove).toHaveBeenCalledOnce();
  });
});

import { describe, it, expect, vi } from 'vitest';

vi.mock('three', () => {
  class BufferAttribute {
    constructor(array) {
      this.array = array;
      this.needsUpdate = false;
    }
  }
  class BufferGeometry {
    constructor() {
      this.attributes = {};
    }
    setAttribute(name, attr) {
      this.attributes[name] = attr;
    }
    dispose() {}
  }
  class PointsMaterial {
    constructor(opts) {
      Object.assign(this, opts);
    }
    dispose() {}
  }
  class Points {
    constructor(geometry, material) {
      this.geometry = geometry;
      this.material = material;
      this.name = '';
      this.frustumCulled = true;
    }
  }
  class Color {
    constructor(hex) {
      this.hex = hex;
      this.r = 0.5;
      this.g = 0.5;
      this.b = 0.5;
    }
  }
  return { BufferAttribute, BufferGeometry, PointsMaterial, Points, Color };
});

import { createParticleSystem } from './ParticleSystem.js';

describe('createParticleSystem', () => {
  const fakeScene = () => ({ add: vi.fn(), remove: vi.fn() });

  it('adds a Points object to the scene', () => {
    const scene = fakeScene();
    createParticleSystem(scene);
    expect(scene.add).toHaveBeenCalledOnce();
  });

  it('starts with zero active particles', () => {
    const ps = createParticleSystem(fakeScene());
    expect(ps._debug().active).toBe(0);
    expect(ps._debug().pool).toBeGreaterThan(0);
  });

  it('explode activates particles', () => {
    const ps = createParticleSystem(fakeScene());
    ps.explode(0, 1, 0, 0xff5252);
    expect(ps._debug().active).toBe(12);
  });

  it('particles decay after lifetime', () => {
    const ps = createParticleSystem(fakeScene());
    ps.explode(0, 1, 0, 0xff5252);
    ps.update(0.3);
    expect(ps._debug().active).toBe(12);
    ps.update(0.5); // total 0.8 > 0.6
    expect(ps._debug().active).toBe(0);
  });

  it('reuses pool across multiple explosions', () => {
    const ps = createParticleSystem(fakeScene());
    for (let i = 0; i < 5; i++) ps.explode(i, 1, 0, 0x29b6f6);
    expect(ps._debug().active).toBe(60); // pool esgotado
  });

  it('dispose removes from scene', () => {
    const scene = fakeScene();
    const ps = createParticleSystem(scene);
    ps.dispose();
    expect(scene.remove).toHaveBeenCalledOnce();
  });
});

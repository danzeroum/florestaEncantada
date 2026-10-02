import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../core/Nut.js', () => ({
  createNut: vi.fn((scene, type, x, z) => ({
    mesh: { type, x, z, parent: null, dispose: vi.fn() },
    type,
    position: { x, y: 0, z },
    collider: { width: 1, height: 1, depth: 1 },
    collected: false,
  })),
}));

vi.mock('../core/Obstacle.js', () => ({
  createLogObstacle: vi.fn((scene, x, z) => ({
    mesh: { kind: 'log', x, z, parent: null },
    position: { x, y: 0, z },
    collider: { width: 1, height: 1, depth: 2.2 },
    hostile: false,
  })),
  createMoleHoleObstacle: vi.fn((scene, x, z) => ({
    mesh: { kind: 'moleHole', x, z, parent: null },
    position: { x, y: 0, z },
    collider: { width: 1, height: 1, depth: 1 },
    hostile: true,
  })),
  createMushroomObstacle: vi.fn((scene, x, z) => ({
    mesh: { kind: 'mushroom', x, z, parent: null },
    position: { x, y: 0, z },
    collider: { width: 1, height: 1, depth: 1 },
    hostile: true,
  })),
}));

import {
  createObstacle,
  disposeMesh,
  resetPlayer,
  rebuildWorld,
} from './WorldBuilder.js';

function makeScene() {
  return { add: vi.fn(), remove: vi.fn() };
}

function makeRefs() {
  return {
    scene: makeScene(),
    player: {
      position: { x: 5, y: 3, z: 2 },
      velocity: { x: 1, y: -1, z: 0.5 },
      onGround: false,
      mesh: { position: { set: vi.fn() }, scale: { set: vi.fn() } },
    },
    obstacles: [],
    nuts: [],
  };
}

describe('createObstacle', () => {
  it('creates a log for type "log"', () => {
    const o = createObstacle('log', makeScene(), 1, 0);
    expect(o.mesh.kind).toBe('log');
  });

  it('creates a moleHole for type "moleHole"', () => {
    const o = createObstacle('moleHole', makeScene(), 1, 0);
    expect(o.mesh.kind).toBe('moleHole');
  });

  it('creates a mushroom for type "mushroom"', () => {
    const o = createObstacle('mushroom', makeScene(), 1, 0);
    expect(o.mesh.kind).toBe('mushroom');
  });

  it('throws on unknown type', () => {
    expect(() => createObstacle('banana', makeScene(), 0, 0)).toThrow();
  });
});

describe('disposeMesh', () => {
  it('removes mesh from parent and disposes geometry/material', () => {
    const parent = { remove: vi.fn() };
    const geo = { dispose: vi.fn() };
    const mat = { dispose: vi.fn() };
    const mesh = { parent, geometry: geo, material: mat };

    disposeMesh(mesh);
    expect(parent.remove).toHaveBeenCalledWith(mesh);
    expect(geo.dispose).toHaveBeenCalledOnce();
    expect(mat.dispose).toHaveBeenCalledOnce();
  });

  it('does nothing on null/undefined', () => {
    expect(() => disposeMesh(null)).not.toThrow();
    expect(() => disposeMesh(undefined)).not.toThrow();
  });

  it('handles Group with traverse', () => {
    const childGeo = { dispose: vi.fn() };
    const childMat = { dispose: vi.fn() };
    const child = { geometry: childGeo, material: childMat };
    const group = {
      parent: { remove: vi.fn() },
      traverse: fn => fn(child),
    };

    disposeMesh(group);
    expect(childGeo.dispose).toHaveBeenCalledOnce();
    expect(childMat.dispose).toHaveBeenCalledOnce();
  });
});

describe('resetPlayer', () => {
  it('resets position, velocity, onGround and mesh', () => {
    const refs = makeRefs();
    resetPlayer(refs.player);
    expect(refs.player.position).toEqual({ x: 0, y: 0, z: 0 });
    expect(refs.player.velocity).toEqual({ x: 0, y: 0, z: 0 });
    expect(refs.player.onGround).toBe(true);
    expect(refs.player.mesh.position.set).toHaveBeenCalledWith(0, 0, 0);
    expect(refs.player.mesh.scale.set).toHaveBeenCalledWith(1, 1, 1);
  });
});

describe('rebuildWorld', () => {
  let refs;

  beforeEach(() => {
    refs = makeRefs();
  });

  it('creates nuts and obstacles from layout', () => {
    rebuildWorld(refs, {
      obstacles: [
        { type: 'log', x: 5, z: 0 },
        { type: 'mushroom', x: 10, z: 0 },
      ],
      nuts: [
        { type: 'sphere', x: 2, z: 0 },
        { type: 'cone', x: 3, z: 0 },
      ],
    });
    expect(refs.obstacles.length).toBe(2);
    expect(refs.nuts.length).toBe(2);
    expect(refs.obstacles[0].mesh.kind).toBe('log');
    expect(refs.obstacles[1].mesh.kind).toBe('mushroom');
  });

  it('clears previous content before building new', () => {
    refs.obstacles.push({ mesh: { kind: 'old-log', parent: { remove: vi.fn() } } });
    refs.nuts.push({ mesh: { kind: 'old-nut', parent: { remove: vi.fn() } } });

    rebuildWorld(refs, {
      obstacles: [{ type: 'log', x: 1, z: 0 }],
      nuts: [{ type: 'sphere', x: 1, z: 0 }],
    });

    expect(refs.obstacles.length).toBe(1);
    expect(refs.nuts.length).toBe(1);
    expect(refs.obstacles[0].mesh.kind).toBe('log');
  });
});

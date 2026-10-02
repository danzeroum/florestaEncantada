import { describe, it, expect, vi } from 'vitest';

vi.mock('three', () => {
  class Group {
    constructor() {
      this.children = [];
      this.position = { x: 0, y: 0, z: 0, set: vi.fn() };
      this.name = '';
    }
    add(child) {
      this.children.push(child);
    }
  }
  class Mesh {
    constructor(geometry, material) {
      this.geometry = { dispose: vi.fn(), scale: vi.fn() };
      this.material = { dispose: vi.fn() };
      this.position = { x: 0, y: 0, z: 0, set: vi.fn() };
      this.rotation = { x: 0, y: 0, z: 0 };
    }
  }
  class SphereGeometry { scale() {} }
  class ConeGeometry {}
  class CylinderGeometry {}
  class TorusGeometry {}
  class MeshStandardMaterial {
    constructor(opts = {}) {
      Object.assign(this, opts);
    }
    dispose() {}
  }
  return { Group, Mesh, SphereGeometry, ConeGeometry, CylinderGeometry, TorusGeometry, MeshStandardMaterial };
});

import { createBirdObstacle } from './Bird.js';
import { createSnakeObstacle } from './Snake.js';
import { createSpikeObstacle } from './Spike.js';
import { createBeeObstacle } from './Bee.js';

function fakeScene() {
  return { add: vi.fn(), remove: vi.fn() };
}

describe('Bird', () => {
  it('creates with hostile=true', () => {
    const bird = createBirdObstacle(fakeScene(), 5, 0);
    expect(bird.hostile).toBe(true);
  });

  it('has update function', () => {
    const bird = createBirdObstacle(fakeScene(), 5, 0);
    expect(typeof bird.update).toBe('function');
    expect(() => bird.update(0.016)).not.toThrow();
  });

  it('accepts speed option', () => {
    const bird = createBirdObstacle(fakeScene(), 5, 0, { speed: 1.5 });
    expect(() => bird.update(0.016)).not.toThrow();
  });

  it('has valid collider', () => {
    const bird = createBirdObstacle(fakeScene(), 5, 0);
    expect(bird.collider.width).toBeGreaterThan(0);
    expect(bird.collider.height).toBeGreaterThan(0);
    expect(bird.collider.depth).toBeGreaterThan(0);
  });
});

describe('Snake', () => {
  it('creates with hostile=true', () => {
    const snake = createSnakeObstacle(fakeScene(), 5, 0);
    expect(snake.hostile).toBe(true);
  });

  it('chases player when within radius', () => {
    const snake = createSnakeObstacle(fakeScene(), 5, 0);
    const initialX = snake.position.x;
    // player na mesma direção (à direita) dentro do raio de perseguição
    snake.update(1.0, { playerX: 7 });
    expect(snake.position.x).toBeGreaterThan(initialX);
  });

  it('returns home when player is far away', () => {
    const snake = createSnakeObstacle(fakeScene(), 5, 0);
    // Move ela primeiro
    snake.update(1.0, { playerX: 7 });
    const movedX = snake.position.x;
    // Agora player longe
    snake.update(2.0, { playerX: 100 });
    expect(snake.position.x).toBeLessThan(movedX);
  });

  it('handles update without context gracefully', () => {
    const snake = createSnakeObstacle(fakeScene(), 5, 0);
    expect(() => snake.update(0.016)).not.toThrow();
  });
});

describe('Spike', () => {
  it('creates with hostile=true and no update', () => {
    const spike = createSpikeObstacle(fakeScene(), 5, 0);
    expect(spike.hostile).toBe(true);
    expect(spike.update).toBeUndefined();
  });

  it('has valid collider', () => {
    const spike = createSpikeObstacle(fakeScene(), 5, 0);
    expect(spike.collider.width).toBeGreaterThan(0);
    expect(spike.collider.height).toBeGreaterThan(0);
  });
});

describe('Bee', () => {
  it('creates with hostile=true', () => {
    const bee = createBeeObstacle(fakeScene(), 5, 0);
    expect(bee.hostile).toBe(true);
  });

  it('oscillates horizontally around its x', () => {
    const bee = createBeeObstacle(fakeScene(), 5, 0);
    bee.update(0.25);
    const pos1 = bee.position.x;
    bee.update(0.25);
    const pos2 = bee.position.x;
    // Deve se mover
    expect(pos1).not.toBe(pos2);
    // Deve estar dentro do range
    expect(Math.abs(pos1 - 5)).toBeLessThanOrEqual(1.81);
  });

  it('accepts speed option', () => {
    const bee = createBeeObstacle(fakeScene(), 5, 0, { speed: 2 });
    expect(() => bee.update(0.016)).not.toThrow();
  });
});

import { describe, it, expect } from 'vitest';
import { createLevelManager } from './LevelManager.js';
import { OBSTACLE_TYPES } from './Level.js';

describe('createLevelManager', () => {
  it('starts on phase 1 (index 0)', () => {
    const lm = createLevelManager();
    expect(lm.getCurrent().index).toBe(0);
    expect(lm.getTotal()).toBe(2);
  });

  it('phase 1 has only logs (no hostile enemies)', () => {
    const lm = createLevelManager();
    const layout = lm.getCurrent().layout;
    for (const o of layout.obstacles) {
      expect(o.type).toBe(OBSTACLE_TYPES.LOG);
    }
  });

  it('phase 2 has at least one of each obstacle type', () => {
    const lm = createLevelManager();
    lm.next();
    const layout = lm.getCurrent().layout;
    const types = layout.obstacles.map(o => o.type);
    expect(types).toContain(OBSTACLE_TYPES.LOG);
    expect(types).toContain(OBSTACLE_TYPES.MOLE_HOLE);
    expect(types).toContain(OBSTACLE_TYPES.MUSHROOM);
  });

  it('phase 2 has more obstacles than phase 1', () => {
    const lm = createLevelManager();
    const phase1 = lm.getCurrent().layout.obstacles.length;
    lm.next();
    const phase2 = lm.getCurrent().layout.obstacles.length;
    expect(phase2).toBeGreaterThan(phase1);
  });

  it('phase 1 is not last; phase 2 is last', () => {
    const lm = createLevelManager();
    expect(lm.getCurrent().isLast).toBe(false);
    lm.next();
    expect(lm.getCurrent().isLast).toBe(true);
  });

  it('next() returns true on success and false on last phase', () => {
    const lm = createLevelManager();
    expect(lm.next()).toBe(true);
    expect(lm.next()).toBe(false); // já está na última
  });

  it('reset returns to phase 1', () => {
    const lm = createLevelManager();
    lm.next();
    expect(lm.getCurrent().index).toBe(1);
    lm.reset();
    expect(lm.getCurrent().index).toBe(0);
  });
});

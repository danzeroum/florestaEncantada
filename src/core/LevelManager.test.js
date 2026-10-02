import { describe, it, expect } from 'vitest';
import { createLevelManager } from './LevelManager.js';
import { PHASES } from '../data/phases/index.js';

describe('createLevelManager', () => {
  const TOTAL = PHASES.length;

  it('starts on phase 1 (index 0)', () => {
    const lm = createLevelManager();
    expect(lm.getCurrent().index).toBe(0);
    expect(lm.getTotal()).toBe(TOTAL);
  });

  it('phase 1 has only logs (tutorial, no hostile enemies)', () => {
    const lm = createLevelManager();
    const { layout } = lm.getCurrent();
    for (const o of layout.obstacles) {
      expect(o.type).toBe('log');
    }
  });

  it('phase 2 has at least one of each obstacle type', () => {
    const lm = createLevelManager();
    lm.next();
    const { layout } = lm.getCurrent();
    const types = layout.obstacles.map(o => o.type);
    expect(types).toContain('log');
    expect(types).toContain('moleHole');
    expect(types).toContain('mushroom');
  });

  it('first phase is not last; final phase is last', () => {
    const lm = createLevelManager();
    expect(lm.getCurrent().isLast).toBe(false);

    while (lm.next()) {
      // avança até a última
    }
    expect(lm.getCurrent().isLast).toBe(true);
    expect(lm.getCurrent().index).toBe(TOTAL - 1);
  });

  it('next() returns true until the last phase, then false', () => {
    const lm = createLevelManager();
    let advances = 0;
    while (lm.next()) advances++;
    expect(advances).toBe(TOTAL - 1);
    expect(lm.next()).toBe(false); // já está na última
  });

  it('reset returns to phase 1', () => {
    const lm = createLevelManager();
    lm.next();
    lm.next();
    expect(lm.getCurrent().index).toBe(Math.min(2, TOTAL - 1));
    lm.reset();
    expect(lm.getCurrent().index).toBe(0);
  });

  it('every phase has a valid theme with sky/ground/ambient', () => {
    for (const phase of PHASES) {
      expect(phase.theme).toBeDefined();
      expect(typeof phase.theme.sky).toBe('number');
      expect(typeof phase.theme.ground).toBe('number');
      expect(typeof phase.theme.ambient).toBe('number');
    }
  });

  it('every phase has at least one nut', () => {
    for (const phase of PHASES) {
      expect(phase.layout.nuts.length).toBeGreaterThan(0);
    }
  });
});

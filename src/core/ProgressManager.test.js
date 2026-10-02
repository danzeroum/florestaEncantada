import { describe, it, expect } from 'vitest';
import { createProgressManager } from './ProgressManager.js';

describe('createProgressManager', () => {
  it('throws on invalid totalPhases', () => {
    expect(() => createProgressManager(0)).toThrow();
    expect(() => createProgressManager(-1)).toThrow();
    expect(() => createProgressManager(1.5)).toThrow();
  });

  it('starts with phase 0 unlocked and nothing completed', () => {
    const pm = createProgressManager(10);
    expect(pm.isUnlocked(0)).toBe(true);
    expect(pm.isUnlocked(1)).toBe(false);
    expect(pm.getCompletedCount()).toBe(0);
    expect(pm.getMaxUnlocked()).toBe(0);
  });

  it('completing phase 0 unlocks phase 1', () => {
    const pm = createProgressManager(10);
    pm.complete(0);
    expect(pm.isCompleted(0)).toBe(true);
    expect(pm.isUnlocked(1)).toBe(true);
    expect(pm.getMaxUnlocked()).toBe(1);
  });

  it('completing sequentially unlocks in order', () => {
    const pm = createProgressManager(10);
    for (let i = 0; i < 5; i++) pm.complete(i);
    expect(pm.getMaxUnlocked()).toBe(5);
    expect(pm.getCompletedCount()).toBe(5);
    expect(pm.isUnlocked(5)).toBe(true);
    expect(pm.isUnlocked(6)).toBe(false);
  });

  it('completing the same phase twice does not double-count', () => {
    const pm = createProgressManager(10);
    pm.complete(0);
    pm.complete(0);
    expect(pm.getCompletedCount()).toBe(1);
  });

  it('cannot unlock beyond last phase', () => {
    const pm = createProgressManager(3);
    pm.complete(0);
    pm.complete(1);
    pm.complete(2);
    expect(pm.getMaxUnlocked()).toBe(2);
    expect(pm.isCompleted(2)).toBe(true);
  });

  it('completing out-of-order does not unlock intermediate', () => {
    const pm = createProgressManager(10);
    pm.complete(5);
    expect(pm.isCompleted(5)).toBe(true);
    expect(pm.getMaxUnlocked()).toBe(0);
  });

  it('ignores out-of-range index', () => {
    const pm = createProgressManager(5);
    expect(() => pm.complete(-1)).not.toThrow();
    expect(() => pm.complete(99)).not.toThrow();
    expect(pm.getCompletedCount()).toBe(0);
  });

  it('reset clears everything', () => {
    const pm = createProgressManager(10);
    pm.complete(0);
    pm.complete(1);
    pm.reset();
    expect(pm.getCompletedCount()).toBe(0);
    expect(pm.getMaxUnlocked()).toBe(0);
  });

  it('toJSON returns completed sorted', () => {
    const pm = createProgressManager(10);
    pm.complete(0);
    pm.complete(1);
    const j = pm.toJSON();
    expect(j.completed).toEqual([0, 1]);
    expect(j.maxUnlocked).toBe(2);
    expect(j.total).toBe(10);
  });
});

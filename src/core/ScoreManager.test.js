import { describe, it, expect } from 'vitest';
import { createScoreManager } from './ScoreManager.js';

describe('createScoreManager', () => {
  it('throws on invalid total', () => {
    expect(() => createScoreManager(0)).toThrow();
    expect(() => createScoreManager(-1)).toThrow();
    expect(() => createScoreManager(NaN)).toThrow();
  });

  it('starts at zero with correct total', () => {
    const sm = createScoreManager(10);
    expect(sm.getScore()).toBe(0);
    expect(sm.getTotal()).toBe(10);
    expect(sm.isVictory()).toBe(false);
  });

  it('increment increases score by exactly 1', () => {
    const sm = createScoreManager(10);
    sm.increment();
    expect(sm.getScore()).toBe(1);
    sm.increment();
    expect(sm.getScore()).toBe(2);
  });

  it('never exceeds total even with extra increments', () => {
    const sm = createScoreManager(3);
    for (let i = 0; i < 10; i++) sm.increment();
    expect(sm.getScore()).toBe(3);
  });

  it('isVictory returns true when score equals total', () => {
    const sm = createScoreManager(2);
    sm.increment();
    expect(sm.isVictory()).toBe(false);
    sm.increment();
    expect(sm.isVictory()).toBe(true);
  });

  it('reset zeroes the score', () => {
    const sm = createScoreManager(5);
    sm.increment();
    sm.increment();
    sm.reset();
    expect(sm.getScore()).toBe(0);
    expect(sm.isVictory()).toBe(false);
  });
});

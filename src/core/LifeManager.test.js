import { describe, it, expect, vi } from 'vitest';
import { createLifeManager } from './LifeManager.js';

describe('createLifeManager', () => {
  it('starts with initial lives', () => {
    const lm = createLifeManager(3);
    expect(lm.getLives()).toBe(3);
    expect(lm.isDead()).toBe(false);
  });

  it('throws on invalid initialLives', () => {
    expect(() => createLifeManager(0)).toThrow();
    expect(() => createLifeManager(-1)).toThrow();
    expect(() => createLifeManager(1.5)).toThrow();
  });

  it('loseLife decrements lives by 1', () => {
    const lm = createLifeManager(3);
    lm.loseLife();
    expect(lm.getLives()).toBe(2);
    lm.loseLife();
    expect(lm.getLives()).toBe(1);
  });

  it('calls onLifeLost with the new count each time', () => {
    const onLifeLost = vi.fn();
    const lm = createLifeManager(3, onLifeLost);
    lm.loseLife();
    expect(onLifeLost).toHaveBeenCalledWith(2);
    lm.loseLife();
    expect(onLifeLost).toHaveBeenCalledWith(1);
  });

  it('calls onDeath when lives hit 0', () => {
    const onDeath = vi.fn();
    const lm = createLifeManager(2, undefined, onDeath);
    lm.loseLife();
    expect(onDeath).not.toHaveBeenCalled();
    lm.loseLife();
    expect(onDeath).toHaveBeenCalledOnce();
    expect(lm.isDead()).toBe(true);
  });

  it('does not go below 0 and does not re-fire onDeath', () => {
    const onDeath = vi.fn();
    const lm = createLifeManager(1, undefined, onDeath);
    lm.loseLife();
    lm.loseLife();
    lm.loseLife();
    expect(lm.getLives()).toBe(0);
    expect(onDeath).toHaveBeenCalledOnce();
  });

  it('reset restores lives and clears dead flag', () => {
    const lm = createLifeManager(2);
    lm.loseLife();
    lm.loseLife();
    expect(lm.isDead()).toBe(true);
    lm.reset();
    expect(lm.getLives()).toBe(2);
    expect(lm.isDead()).toBe(false);
  });
});

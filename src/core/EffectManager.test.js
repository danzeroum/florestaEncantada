import { describe, it, expect } from 'vitest';
import { createEffectManager } from './EffectManager.js';
import { POWERUP_TYPES } from './PowerUp.js';

describe('createEffectManager', () => {
  it('starts with nothing active', () => {
    const em = createEffectManager();
    expect(em.getActive()).toEqual([]);
    expect(em.isActive(POWERUP_TYPES.MAGNET)).toBe(false);
  });

  it('activate adds an effect with its duration', () => {
    const em = createEffectManager();
    em.activate(POWERUP_TYPES.MAGNET);
    expect(em.isActive(POWERUP_TYPES.MAGNET)).toBe(true);
    expect(em.getTimeLeft(POWERUP_TYPES.MAGNET)).toBe(8);
  });

  it('update decrements active timers', () => {
    const em = createEffectManager();
    em.activate(POWERUP_TYPES.MAGNET);
    em.update(3);
    expect(em.getTimeLeft(POWERUP_TYPES.MAGNET)).toBe(5);
  });

  it('effect expires when timer hits zero', () => {
    const em = createEffectManager();
    em.activate(POWERUP_TYPES.SLOW_MO);
    em.update(5);
    expect(em.isActive(POWERUP_TYPES.SLOW_MO)).toBe(false);
  });

  it('shield is permanent until consumed', () => {
    const em = createEffectManager();
    em.activate(POWERUP_TYPES.SHIELD);
    em.update(100);
    expect(em.isActive(POWERUP_TYPES.SHIELD)).toBe(true);
    expect(em.getTimeLeft(POWERUP_TYPES.SHIELD)).toBe(Infinity);
  });

  it('consumeShield returns true once, then false', () => {
    const em = createEffectManager();
    em.activate(POWERUP_TYPES.SHIELD);
    expect(em.consumeShield()).toBe(true);
    expect(em.consumeShield()).toBe(false);
    expect(em.isActive(POWERUP_TYPES.SHIELD)).toBe(false);
  });

  it('reactivating refreshes the timer', () => {
    const em = createEffectManager();
    em.activate(POWERUP_TYPES.MAGNET);
    em.update(5);
    expect(em.getTimeLeft(POWERUP_TYPES.MAGNET)).toBe(3);
    em.activate(POWERUP_TYPES.MAGNET);
    expect(em.getTimeLeft(POWERUP_TYPES.MAGNET)).toBe(8);
  });

  it('ignores unknown type', () => {
    const em = createEffectManager();
    em.activate('banana');
    expect(em.getActive()).toEqual([]);
  });

  it('clear removes all effects', () => {
    const em = createEffectManager();
    em.activate(POWERUP_TYPES.MAGNET);
    em.activate(POWERUP_TYPES.SHIELD);
    em.clear();
    expect(em.getActive()).toEqual([]);
  });

  it('multiple effects run independently', () => {
    const em = createEffectManager();
    em.activate(POWERUP_TYPES.MAGNET); // 8s
    em.activate(POWERUP_TYPES.SLOW_MO); // 5s
    em.update(6);
    expect(em.isActive(POWERUP_TYPES.MAGNET)).toBe(true);
    expect(em.isActive(POWERUP_TYPES.SLOW_MO)).toBe(false);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { createGameState, STATES } from './GameState.js';

describe('createGameState', () => {
  it('starts with MENU by default', () => {
    const gs = createGameState();
    expect(gs.get()).toBe(STATES.MENU);
  });

  it('accepts a valid custom initial state', () => {
    const gs = createGameState(STATES.RUNNING);
    expect(gs.get()).toBe(STATES.RUNNING);
  });

  it('throws on invalid initial state', () => {
    expect(() => createGameState('banana')).toThrow();
  });

  it('set changes the state', () => {
    const gs = createGameState();
    gs.set(STATES.RUNNING);
    expect(gs.get()).toBe(STATES.RUNNING);
  });

  it('set throws on invalid state', () => {
    const gs = createGameState();
    expect(() => gs.set('banana')).toThrow();
  });

  it('set to the same state does NOT notify listeners', () => {
    const gs = createGameState(STATES.RUNNING);
    const fn = vi.fn();
    gs.onChange(fn);
    gs.set(STATES.RUNNING);
    expect(fn).not.toHaveBeenCalled();
  });

  it('onChange notifies with (next, prev)', () => {
    const gs = createGameState();
    const fn = vi.fn();
    gs.onChange(fn);
    gs.set(STATES.RUNNING);
    expect(fn).toHaveBeenCalledWith(STATES.RUNNING, STATES.MENU);
  });

  it('onChange returns an unsubscribe function', () => {
    const gs = createGameState();
    const fn = vi.fn();
    const off = gs.onChange(fn);
    off();
    gs.set(STATES.RUNNING);
    expect(fn).not.toHaveBeenCalled();
  });

  it('offChange removes a specific listener', () => {
    const gs = createGameState();
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    gs.onChange(fn1);
    gs.onChange(fn2);
    gs.offChange(fn1);
    gs.set(STATES.RUNNING);
    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledOnce();
  });

  it('is returns true for current state', () => {
    const gs = createGameState(STATES.PAUSED);
    expect(gs.is(STATES.PAUSED)).toBe(true);
    expect(gs.is(STATES.RUNNING)).toBe(false);
  });

  it('reset returns to initial state and notifies', () => {
    const gs = createGameState(STATES.MENU);
    const fn = vi.fn();
    gs.onChange(fn);
    gs.set(STATES.RUNNING);
    gs.reset();
    expect(gs.get()).toBe(STATES.MENU);
    expect(fn).toHaveBeenLastCalledWith(STATES.MENU, STATES.RUNNING);
  });
});

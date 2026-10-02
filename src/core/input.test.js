import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  setupInput,
  disposeInput,
  getInputState,
  resetInput,
  ACTIONS,
} from './input.js';

describe('input', () => {
  beforeEach(() => {
    resetInput();
    setupInput();
  });

  afterEach(() => {
    disposeInput();
  });

  it('getInputState returns LEFT=true when ArrowLeft pressed', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(getInputState()[ACTIONS.LEFT]).toBe(true);
  });

  it('getInputState returns LEFT=false when released', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
    expect(getInputState()[ACTIONS.LEFT]).toBe(false);
  });

  it('handles WASD and arrows simultaneously (D + ArrowRight)', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(getInputState()[ACTIONS.RIGHT]).toBe(true);
  });

  it('handles D + W combination (right + jump)', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }));
    const s = getInputState();
    expect(s[ACTIONS.RIGHT]).toBe(true);
    expect(s[ACTIONS.JUMP]).toBe(true);
  });

  it('space triggers JUMP', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(getInputState()[ACTIONS.JUMP]).toBe(true);
  });

  it('getInputState returns a copy (immutability)', () => {
    const a = getInputState();
    a[ACTIONS.LEFT] = true;
    const b = getInputState();
    expect(b[ACTIONS.LEFT]).toBe(false);
  });

  it('blur resets all keys', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    window.dispatchEvent(new Event('blur'));
    expect(getInputState()[ACTIONS.LEFT]).toBe(false);
  });
});

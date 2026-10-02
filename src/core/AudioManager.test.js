import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createAudioManager, SFX } from './AudioManager.js';

/**
 * Mock mínimo do AudioContext para testar sem navegador de verdade.
 */
function makeMockAudioContext() {
  const created = { oscillators: [], gains: [], resumed: 0, closed: 0 };

  const ctx = {
    currentTime: 0,
    state: 'running',
    destination: {},
    resume() {
      created.resumed += 1;
      this.state = 'running';
      return Promise.resolve();
    },
    close() {
      created.closed += 1;
      return Promise.resolve();
    },
    createOscillator() {
      const osc = {
        type: 'sine',
        frequency: {
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      };
      created.oscillators.push(osc);
      return osc;
    },
    createGain() {
      const gain = {
        gain: {
          setValueAtTime: vi.fn(),
          linearRampToValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
      };
      created.gains.push(gain);
      return gain;
    },
  };

  return { ctx, created };
}

describe('AudioManager', () => {
  let mock;

  beforeEach(() => {
    mock = makeMockAudioContext();
    globalThis.window = {
      AudioContext: function () {
        return mock.ctx;
      },
    };
  });

  afterEach(() => {
    delete globalThis.window;
  });

  it('starts unmuted', () => {
    const am = createAudioManager();
    expect(am.isMuted()).toBe(false);
  });

  it('play(COLLECT) creates an oscillator and gain', () => {
    const am = createAudioManager();
    am.play(SFX.COLLECT);
    expect(mock.created.oscillators.length).toBe(1);
    expect(mock.created.gains.length).toBe(1);
  });

  it('play(JUMP) creates one oscillator', () => {
    const am = createAudioManager();
    am.play(SFX.JUMP);
    expect(mock.created.oscillators.length).toBe(1);
  });

  it('play(VICTORY) creates an arpeggio of 3 oscillators', () => {
    const am = createAudioManager();
    am.play(SFX.VICTORY);
    expect(mock.created.oscillators.length).toBe(3);
  });

  it('muted manager does NOT play', () => {
    const am = createAudioManager();
    am.setMuted(true);
    am.play(SFX.COLLECT);
    expect(mock.created.oscillators.length).toBe(0);
  });

  it('unmute resumes playing', () => {
    const am = createAudioManager();
    am.setMuted(true);
    am.play(SFX.COLLECT);
    am.setMuted(false);
    am.play(SFX.COLLECT);
    expect(mock.created.oscillators.length).toBe(1);
  });

  it('play(unknown) does nothing', () => {
    const am = createAudioManager();
    am.play('banana');
    expect(mock.created.oscillators.length).toBe(0);
  });

  it('unlock() resumes suspended context', () => {
    const am = createAudioManager();
    mock.ctx.state = 'suspended';
    am.unlock();
    expect(mock.created.resumed).toBe(1);
  });

  it('dispose() closes the context', () => {
    const am = createAudioManager();
    am.play(SFX.COLLECT);
    am.dispose();
    expect(mock.created.closed).toBe(1);
  });

  it('handles missing AudioContext gracefully (no throw)', () => {
    delete globalThis.window.AudioContext;
    const am = createAudioManager();
    expect(() => am.play(SFX.COLLECT)).not.toThrow();
    expect(() => am.unlock()).not.toThrow();
  });
});

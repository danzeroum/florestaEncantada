import { describe, it, expect } from 'vitest';
import {
  checkCollision,
  applyGravity,
  resolveCollision,
  GRAVITY,
  GROUND_Y,
} from './physics.js';

describe('checkCollision', () => {
  const box = (x, y, z, r = 0.5, h = 1) => ({
    position: { x, y, z },
    collider: { radius: r, height: h },
  });

  it('returns false when no overlap', () => {
    expect(checkCollision(box(0, 0, 0), box(10, 0, 0))).toBe(false);
  });

  it('returns true when overlapping', () => {
    expect(checkCollision(box(0, 0, 0), box(0.5, 0, 0))).toBe(true);
  });

  it('returns false when Y mismatch', () => {
    expect(checkCollision(box(0, 0, 0), box(0, 50, 0))).toBe(false);
  });

  it('returns false when Z mismatch', () => {
    expect(checkCollision(box(0, 0, 0), box(0, 0, 50))).toBe(false);
  });
});

describe('applyGravity', () => {
  const makeState = (y = 0, vy = 0, onGround = true) => ({
    position: { x: 0, y, z: 0 },
    velocity: { x: 0, y: vy, z: 0 },
    onGround,
  });

  it('sets onGround=true when hits ground', () => {
    const s = makeState(0.1, -1, false);
    applyGravity(s, 1);
    expect(s.position.y).toBe(GROUND_Y);
    expect(s.onGround).toBe(true);
    expect(s.velocity.y).toBe(0);
  });

  it('keeps onGround=true when already on ground', () => {
    const s = makeState(0, 0, true);
    applyGravity(s, 0.016);
    expect(s.position.y).toBe(GROUND_Y);
    expect(s.onGround).toBe(true);
  });

  it('accelerates downward (GRAVITY constant)', () => {
    const s = makeState(10, 0, false);
    applyGravity(s, 0.1);
    expect(s.velocity.y).toBeCloseTo(GRAVITY * 0.1, 5);
    expect(s.position.y).toBeLessThan(10);
    expect(s.onGround).toBe(false);
  });
});

describe('resolveCollision', () => {
  const box = (x, z, r = 0.5) => ({ position: { x, z }, collider: { radius: r } });

  it('returns zero when not colliding', () => {
    const push = resolveCollision(box(0, 0), box(10, 0));
    expect(push.x).toBe(0);
    expect(push.z).toBe(0);
  });

  it('pushes player away from obstacle', () => {
    const push = resolveCollision(box(0.2, 0), box(0, 0));
    expect(push.x).toBeGreaterThan(0);
  });

  it('pushes in opposite direction when player is on the other side', () => {
    const push = resolveCollision(box(-0.2, 0), box(0, 0));
    expect(push.x).toBeLessThan(0);
  });
});

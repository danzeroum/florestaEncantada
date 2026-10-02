import { describe, it, expect } from 'vitest';
import {
  checkCollision,
  applyGravity,
  resolveCollision,
  GRAVITY,
  GROUND_Y,
} from './physics.js';

// Helper: cria caixa com `position.y` sendo a BASE.
const box = (x, y, z, width = 1, height = 1, depth = 1) => ({
  position: { x, y, z },
  collider: { width, height, depth },
});

describe('checkCollision', () => {
  it('returns false when no overlap', () => {
    expect(checkCollision(box(0, 0, 0), box(10, 0, 0))).toBe(false);
  });

  it('returns true when overlapping on all axes', () => {
    expect(checkCollision(box(0, 0, 0), box(0.3, 0, 0))).toBe(true);
  });

  it('returns false when X distance exceeds half-widths', () => {
    expect(checkCollision(box(0, 0, 0), box(5, 0, 0))).toBe(false);
  });

  it('returns false when Z distance exceeds half-depths', () => {
    expect(checkCollision(box(0, 0, 0), box(0, 0, 50))).toBe(false);
  });

  it('returns false when one box is fully above the other (jump over)', () => {
    // Player em y=5 (pulando alto), obstáculo em y=0 com height=1
    // Player base=5, top=6; obstáculo base=0, top=1 → sem overlap em Y
    expect(checkCollision(box(0, 5, 0), box(0, 0, 0))).toBe(false);
  });

  it('returns true when boxes touch vertically', () => {
    // Player base=0.5, top=1.5; obstáculo base=0, top=1 → overlap parcial em Y
    expect(checkCollision(box(0, 0.5, 0), box(0, 0, 0))).toBe(true);
  });

  it('returns false when boxes are stacked (one exactly above the other)', () => {
    // Player base=1, top=2; obstáculo base=0, top=1 → tocam mas não sobrepõem
    expect(checkCollision(box(0, 1, 0), box(0, 0, 0))).toBe(false);
  });

  it('handles different-sized boxes correctly', () => {
    // Player width=1.2, obstáculo width=1.0 → half = 1.1
    // distância 1.05 < 1.1 → colidem
    const player = box(0, 0, 0, 1.2, 1.4, 1.2);
    const obstacle = box(1.05, 0, 0, 1.0, 1.0, 2.2);
    expect(checkCollision(player, obstacle)).toBe(true);
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
  it('returns zero when not colliding', () => {
    const push = resolveCollision(box(0, 0, 0), box(10, 0, 0));
    expect(push.x).toBe(0);
    expect(push.z).toBe(0);
  });

  it('pushes player in +X when slightly to the right of obstacle', () => {
    const push = resolveCollision(box(0.4, 0, 0), box(0, 0, 0));
    expect(push.x).toBeGreaterThan(0);
    expect(push.z).toBe(0);
  });

  it('pushes player in -X when slightly to the left of obstacle', () => {
    const push = resolveCollision(box(-0.4, 0, 0), box(0, 0, 0));
    expect(push.x).toBeLessThan(0);
    expect(push.z).toBe(0);
  });

  it('pushes on Z axis when penetration in Z is smaller', () => {
    // Player levemente sobreposto em ambos os eixos, mas mais em X que em Z
    // X: dist=0.3, halfW=1.0 → overlapX=0.7
    // Z: dist=0.8, halfD=1.0 → overlapZ=0.2 (menor)
    const push = resolveCollision(box(0.3, 0, 0.8), box(0, 0, 0));
    expect(push.z).toBeGreaterThan(0);
    expect(push.x).toBe(0);
  });
});

import { describe, it, expect } from 'vitest';
import { createLevel, LEVEL_TOTAL_NUTS, OBSTACLE_TYPES } from './Level.js';
import { NUT_TYPES } from './Nut.js';

describe('createLevel', () => {
  it('returns an object with obstacles and nuts arrays', () => {
    const level = createLevel();
    expect(Array.isArray(level.obstacles)).toBe(true);
    expect(Array.isArray(level.nuts)).toBe(true);
  });

  it('returns 10 nuts', () => {
    expect(createLevel().nuts.length).toBe(10);
    expect(LEVEL_TOTAL_NUTS).toBe(10);
  });

  it('all nuts have valid type', () => {
    const valid = Object.values(NUT_TYPES);
    for (const n of createLevel().nuts) {
      expect(valid).toContain(n.type);
    }
  });

  it('all nuts are on the XZ rail (z = 0)', () => {
    for (const n of createLevel().nuts) {
      expect(n.z).toBe(0);
    }
  });

  it('includes at least one of each nut type', () => {
    const types = createLevel().nuts.map(n => n.type);
    expect(types).toContain(NUT_TYPES.SPHERE);
    expect(types).toContain(NUT_TYPES.CONE);
    expect(types).toContain(NUT_TYPES.CUBE);
  });

  it('obstacles include only valid types', () => {
    const valid = Object.values(OBSTACLE_TYPES);
    for (const o of createLevel().obstacles) {
      expect(valid).toContain(o.type);
    }
  });

  it('obstacles are on the XZ rail (z = 0)', () => {
    for (const o of createLevel().obstacles) {
      expect(o.z).toBe(0);
    }
  });

  it('hostile enemies are placed at X >= 14 (learning space at the start)', () => {
    const hostileTypes = [OBSTACLE_TYPES.MOLE_HOLE, OBSTACLE_TYPES.MUSHROOM];
    const hostiles = createLevel().obstacles.filter(o => hostileTypes.includes(o.type));
    expect(hostiles.length).toBeGreaterThan(0);
    for (const h of hostiles) {
      expect(h.x).toBeGreaterThanOrEqual(14);
    }
  });

  it('returns a fresh copy each call (no shared mutation)', () => {
    const a = createLevel();
    a.nuts[0].x = 999;
    a.obstacles[0].x = 999;
    const b = createLevel();
    expect(b.nuts[0].x).not.toBe(999);
    expect(b.obstacles[0].x).not.toBe(999);
  });
});

import { describe, it, expect } from 'vitest';
import { createLevel, LEVEL_TOTAL } from './Level.js';
import { NUT_TYPES } from './Nut.js';

describe('createLevel', () => {
  it('returns 10 nuts', () => {
    expect(createLevel().length).toBe(10);
    expect(LEVEL_TOTAL).toBe(10);
  });

  it('all nuts have valid type', () => {
    const valid = Object.values(NUT_TYPES);
    for (const n of createLevel()) {
      expect(valid).toContain(n.type);
    }
  });

  it('all nuts are on the XZ rail (z = 0)', () => {
    for (const n of createLevel()) {
      expect(n.z).toBe(0);
    }
  });

  it('returns a fresh copy each call (no shared mutation)', () => {
    const a = createLevel();
    a[0].x = 999;
    const b = createLevel();
    expect(b[0].x).not.toBe(999);
  });

  it('includes at least one of each nut type', () => {
    const types = createLevel().map(n => n.type);
    expect(types).toContain(NUT_TYPES.SPHERE);
    expect(types).toContain(NUT_TYPES.CONE);
    expect(types).toContain(NUT_TYPES.CUBE);
  });
});

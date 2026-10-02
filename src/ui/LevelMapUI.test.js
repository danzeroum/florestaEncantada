import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createLevelMapUI } from './LevelMapUI.js';
import { createProgressManager } from '../core/ProgressManager.js';

describe('createLevelMapUI', () => {
  let root;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  afterEach(() => {
    root.remove();
  });

  it('renders 10 cells by default', () => {
    const ui = createLevelMapUI(root);
    expect(root.querySelectorAll('.levelmap__cell').length).toBe(10);
    ui.dispose();
  });

  it('renders N cells when totalPhases=5', () => {
    const ui = createLevelMapUI(root, { totalPhases: 5 });
    expect(root.querySelectorAll('.levelmap__cell').length).toBe(5);
    ui.dispose();
  });

  it('starts hidden and show() reveals it', () => {
    const ui = createLevelMapUI(root);
    const pm = createProgressManager(10);
    expect(ui.isVisible()).toBe(false);
    ui.show(pm);
    expect(ui.isVisible()).toBe(true);
    ui.dispose();
  });

  it('phase 0 is unlocked, others locked initially', () => {
    const pm = createProgressManager(10);
    const ui = createLevelMapUI(root, { totalPhases: 10 });
    ui.show(pm);

    const cells = root.querySelectorAll('.levelmap__cell');
    expect(cells[0].disabled).toBe(false);
    expect(cells[1].disabled).toBe(true);
    expect(cells[9].disabled).toBe(true);
    ui.dispose();
  });

  it('after completing phase 0, phase 1 unlocks and cell 0 shows star', () => {
    const pm = createProgressManager(10);
    pm.complete(0);
    const ui = createLevelMapUI(root, { totalPhases: 10 });
    ui.show(pm);

    const cells = root.querySelectorAll('.levelmap__cell');
    expect(cells[0].classList.contains('levelmap__cell--completed')).toBe(true);
    expect(cells[0].querySelector('.levelmap__star').innerHTML).toContain('<svg');
    expect(cells[1].disabled).toBe(false);
    expect(cells[2].disabled).toBe(true);
    ui.dispose();
  });

  it('clicking an unlocked cell calls onSelect with its index', () => {
    const onSelect = vi.fn();
    const pm = createProgressManager(10);
    const ui = createLevelMapUI(root, { totalPhases: 10, onSelect });
    ui.show(pm);

    root.querySelectorAll('.levelmap__cell')[0].click();
    expect(onSelect).toHaveBeenCalledWith(0);
    ui.dispose();
  });

  it('clicking a locked cell does NOT call onSelect', () => {
    const onSelect = vi.fn();
    const pm = createProgressManager(10);
    const ui = createLevelMapUI(root, { totalPhases: 10, onSelect });
    ui.show(pm);

    root.querySelectorAll('.levelmap__cell')[5].click();
    expect(onSelect).not.toHaveBeenCalled();
    ui.dispose();
  });

  it('back button calls onBack', () => {
    const onBack = vi.fn();
    const ui = createLevelMapUI(root, { onBack });
    const pm = createProgressManager(10);
    ui.show(pm);

    root.querySelector('.levelmap__back').click();
    expect(onBack).toHaveBeenCalledOnce();
    ui.dispose();
  });

  it('all cells have aria-label', () => {
    const ui = createLevelMapUI(root, { totalPhases: 3 });
    const cells = root.querySelectorAll('.levelmap__cell');
    for (const c of cells) {
      expect(c.getAttribute('aria-label')).toBeTruthy();
    }
    ui.dispose();
  });

  it('dispose removes overlay', () => {
    const ui = createLevelMapUI(root);
    ui.dispose();
    expect(root.querySelector('.levelmap')).toBeNull();
  });
});

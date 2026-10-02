import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createPauseUI } from './PauseUI.js';

describe('createPauseUI', () => {
  let root;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  afterEach(() => {
    root.remove();
  });

  it('starts hidden and show() reveals it', () => {
    const ui = createPauseUI(root);
    expect(ui.isVisible()).toBe(false);
    ui.show();
    expect(ui.isVisible()).toBe(true);
    ui.dispose();
  });

  it('has 3 buttons (Resume, Restart, Quit)', () => {
    const ui = createPauseUI(root);
    expect(root.querySelectorAll('button').length).toBe(3);
    ui.dispose();
  });

  it('calls onResume when Resume is clicked', () => {
    const onResume = vi.fn();
    const ui = createPauseUI(root, { onResume });
    root.querySelector('.pause__btn--resume').click();
    expect(onResume).toHaveBeenCalledOnce();
    ui.dispose();
  });

  it('calls onRestart when Restart is clicked', () => {
    const onRestart = vi.fn();
    const ui = createPauseUI(root, { onRestart });
    root.querySelector('.pause__btn--restart').click();
    expect(onRestart).toHaveBeenCalledOnce();
    ui.dispose();
  });

  it('calls onQuit when Quit is clicked', () => {
    const onQuit = vi.fn();
    const ui = createPauseUI(root, { onQuit });
    root.querySelector('.pause__btn--quit').click();
    expect(onQuit).toHaveBeenCalledOnce();
    ui.dispose();
  });

  it('all buttons have aria-label', () => {
    const ui = createPauseUI(root);
    const btns = root.querySelectorAll('button');
    for (const b of btns) {
      expect(b.getAttribute('aria-label')).toBeTruthy();
    }
    ui.dispose();
  });
});

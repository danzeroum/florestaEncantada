import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMenuUI } from './MenuUI.js';

describe('createMenuUI', () => {
  let root;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  afterEach(() => {
    root.remove();
  });

  it('creates 3 buttons (Play, HowTo, Mute)', () => {
    const ui = createMenuUI(root);
    expect(root.querySelectorAll('button').length).toBe(3);
    ui.dispose();
  });

  it('starts hidden and show() reveals it', () => {
    const ui = createMenuUI(root);
    expect(ui.isVisible()).toBe(false);
    ui.show();
    expect(ui.isVisible()).toBe(true);
    ui.dispose();
  });

  it('hide() hides it again', () => {
    const ui = createMenuUI(root);
    ui.show();
    ui.hide();
    expect(ui.isVisible()).toBe(false);
    ui.dispose();
  });

  it('calls onPlay when Play is clicked', () => {
    const onPlay = vi.fn();
    const ui = createMenuUI(root, { onPlay });
    root.querySelector('.menu__btn--play').click();
    expect(onPlay).toHaveBeenCalledOnce();
    ui.dispose();
  });

  it('calls onHowToPlay when Info is clicked', () => {
    const onHowToPlay = vi.fn();
    const ui = createMenuUI(root, { onHowToPlay });
    root.querySelector('.menu__btn--info').click();
    expect(onHowToPlay).toHaveBeenCalledOnce();
    ui.dispose();
  });

  it('mute button is disabled when muteEnabled=false', () => {
    const ui = createMenuUI(root, { muteEnabled: false });
    const muteBtn = root.querySelector('.menu__btn--mute');
    expect(muteBtn.disabled).toBe(true);
    expect(muteBtn.getAttribute('aria-disabled')).toBe('true');
    ui.dispose();
  });

  it('mute button is enabled and calls onToggleMute when muteEnabled=true', () => {
    const onToggleMute = vi.fn();
    const ui = createMenuUI(root, { muteEnabled: true, onToggleMute });
    const muteBtn = root.querySelector('.menu__btn--mute');
    expect(muteBtn.disabled).toBe(false);
    muteBtn.click();
    expect(onToggleMute).toHaveBeenCalledOnce();
    ui.dispose();
  });

  it('all buttons have aria-label', () => {
    const ui = createMenuUI(root);
    const btns = root.querySelectorAll('button');
    for (const b of btns) {
      expect(b.getAttribute('aria-label')).toBeTruthy();
    }
    ui.dispose();
  });

  it('dispose() removes overlay from DOM', () => {
    const ui = createMenuUI(root);
    ui.dispose();
    expect(root.querySelector('.menu')).toBeNull();
  });
});

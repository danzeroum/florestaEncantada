import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createHowToPlayUI } from './HowToPlayUI.js';

describe('createHowToPlayUI', () => {
  let root;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  afterEach(() => {
    root.remove();
  });

  it('starts hidden and show() reveals it', () => {
    const ui = createHowToPlayUI(root);
    expect(ui.isVisible()).toBe(false);
    ui.show();
    expect(ui.isVisible()).toBe(true);
    ui.dispose();
  });

  it('has a back button with aria-label "Voltar ao menu"', () => {
    const ui = createHowToPlayUI(root);
    const back = root.querySelector('.howto__back');
    expect(back).not.toBeNull();
    expect(back.getAttribute('aria-label')).toBe('Voltar ao menu');
    ui.dispose();
  });

  it('calls onBack when back button clicked', () => {
    const onBack = vi.fn();
    const ui = createHowToPlayUI(root, { onBack });
    root.querySelector('.howto__back').click();
    expect(onBack).toHaveBeenCalledOnce();
    ui.dispose();
  });

  it('renders 3 rows (move, jump, collect)', () => {
    const ui = createHowToPlayUI(root);
    expect(root.querySelectorAll('.howto__row').length).toBe(3);
    ui.dispose();
  });

  it('contains key symbols and squirrel SVG (no plain text)', () => {
    const ui = createHowToPlayUI(root);
    const html = root.innerHTML;
    expect(html).toContain('howto__key');
    expect(html).toContain('<svg');
    ui.dispose();
  });
});

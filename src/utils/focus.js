/**
 * Utilitários de gerenciamento de foco para overlays.
 */

/**
 * Devolve o foco para o canvas do jogo (ou para o primeiro
 * elemento focável disponível).
 *
 * @param {HTMLElement} [fallback] elemento alternativo se não houver canvas
 */
export function focusGameCanvas(fallback) {
  const canvas = document.querySelector('#root canvas');
  const target = canvas ?? fallback ?? document.body;
  if (document.activeElement !== target) {
    // torna o canvas focável programaticamente
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
    }
    target.focus({ preventScroll: true });
  }
}

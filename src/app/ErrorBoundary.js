/**
 * Error boundary global: captura falhas de WebGL e erros não tratados,
 * e mostra uma tela amigável (sem texto complexo) em vez de tela preta.
 */

const ERROR_ICON_SVG = `
  <svg viewBox="0 0 24 24" width="120" height="120" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="10" fill="none" stroke="#FF5252" stroke-width="2.5" />
    <rect x="11" y="7" width="2" height="8" rx="1" fill="#FF5252" />
    <circle cx="12" cy="17.5" r="1.4" fill="#FF5252" />
  </svg>
`;

const RELOAD_ICON_SVG = `
  <svg viewBox="0 0 24 24" width="48" height="48" aria-hidden="true" focusable="false">
    <path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" fill="currentColor" />
  </svg>
`;

/**
 * Instala listeners globais e mostra tela de erro quando algo falha.
 *
 * @param {HTMLElement} root
 * @param {() => void} [onReload]
 * @returns {{ trigger:(error:Error)=>void, dispose:()=>void }}
 */
export function installErrorBoundary(root, onReload = () => window.location.reload()) {
  if (!root) throw new Error('ErrorBoundary: root é obrigatório');

  let shown = false;

  const overlay = document.createElement('div');
  overlay.className = 'error-boundary';
  overlay.setAttribute('role', 'alertdialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Ocorreu um erro. Recarregue a página.');
  overlay.hidden = true;

  const inner = document.createElement('div');
  inner.className = 'error-boundary__inner';
  inner.innerHTML = ERROR_ICON_SVG;

  const reloadBtn = document.createElement('button');
  reloadBtn.type = 'button';
  reloadBtn.className = 'error-boundary__reload';
  reloadBtn.setAttribute('aria-label', 'Recarregar');
  reloadBtn.innerHTML = RELOAD_ICON_SVG;
  reloadBtn.addEventListener('click', () => onReload());

  inner.appendChild(reloadBtn);
  overlay.appendChild(inner);
  root.appendChild(overlay);

  function trigger(error) {
    if (shown) return;
    shown = true;
    overlay.hidden = false;
    requestAnimationFrame(() => reloadBtn.focus());
    // Log para diagnóstico (não envia para lugar nenhum)
    console.error('[ErrorBoundary]', error);
  }

  function onUnhandledRejection(event) {
    trigger(event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
  }

  function onError(event) {
    trigger(event.error ?? new Error(event.message));
  }

  function onWebGLContextLost(event) {
    event.preventDefault?.();
    trigger(new Error('WebGL context lost'));
  }

  window.addEventListener('unhandledrejection', onUnhandledRejection);
  window.addEventListener('error', onError);

  // Detecta perda de contexto WebGL no canvas (adicionado depois que o canvas existe)
  function attachCanvas(canvas) {
    if (!canvas) return;
    canvas.addEventListener('webglcontextlost', onWebGLContextLost, false);
  }

  function dispose() {
    window.removeEventListener('unhandledrejection', onUnhandledRejection);
    window.removeEventListener('error', onError);
    overlay.remove();
  }

  return { trigger, dispose, attachCanvas };
}

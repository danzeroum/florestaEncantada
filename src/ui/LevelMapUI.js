/**
 * LevelMapUI — grade 5×2 com ícones das fases.
 * Estados: completada (estrela verde), atual (pulsando), bloqueada (cinza).
 * Sem texto — só números e ícones.
 */

const BACK_ICON_SVG = `
  <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true" focusable="false">
    <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

const STAR_SVG = `
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
    <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" fill="#FFEB3B" stroke="#FBC02D" stroke-width="1" />
  </svg>
`;

/**
 * @param {HTMLElement} root
 * @param {{ onSelect?:(index:number)=>void, onBack?:()=>void, totalPhases?:number }} [options]
 * @returns {{ show:(progressManager:any)=>void, hide:()=>void, dispose:()=>void, isVisible:()=>boolean }}
 */
export function createLevelMapUI(root, options = {}) {
  if (!root) throw new Error('LevelMapUI: root é obrigatório');

  const onSelect = options.onSelect ?? (() => {});
  const onBack = options.onBack ?? (() => {});
  const totalPhases = options.totalPhases ?? 10;

  const overlay = document.createElement('div');
  overlay.className = 'levelmap';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Mapa de fases');
  overlay.hidden = true;

  const inner = document.createElement('div');
  inner.className = 'levelmap__inner';

  const grid = document.createElement('div');
  grid.className = 'levelmap__grid';

  const cells = [];
  for (let i = 0; i < totalPhases; i++) {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'levelmap__cell';
    cell.setAttribute('aria-label', `Fase ${i + 1}`);
    cell.innerHTML = `
      <span class="levelmap__number">${i + 1}</span>
      <span class="levelmap__star"></span>
    `;
    cell.addEventListener('click', () => {
      if (cell.disabled) return;
      onSelect(i);
    });
    grid.appendChild(cell);
    cells.push(cell);
  }

  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'levelmap__back';
  backBtn.setAttribute('aria-label', 'Voltar ao menu');
  backBtn.innerHTML = BACK_ICON_SVG;
  backBtn.addEventListener('click', () => onBack());

  inner.appendChild(grid);
  inner.appendChild(backBtn);
  overlay.appendChild(inner);
  root.appendChild(overlay);

  /**
   * Atualiza o estado visual de cada célula com base no ProgressManager.
   * @param {any} progress
   */
  function render(progress) {
    for (let i = 0; i < totalPhases; i++) {
      const cell = cells[i];
      const isCompleted = progress.isCompleted(i);
      const isUnlocked = progress.isUnlocked(i);

      cell.classList.toggle('levelmap__cell--completed', isCompleted);
      cell.classList.toggle('levelmap__cell--locked', !isUnlocked);
      cell.classList.toggle('levelmap__cell--current', isUnlocked && !isCompleted);

      cell.disabled = !isUnlocked;
      cell.querySelector('.levelmap__star').innerHTML = isCompleted ? STAR_SVG : '';
    }
  }

  function show(progress) {
    render(progress);
    overlay.hidden = false;
    // Foco na primeira célula desbloqueada não-completada (ou na última completada)
    const focusIdx = cells.findIndex(c => !c.disabled && !c.classList.contains('levelmap__cell--completed'));
    const fallback = cells.findIndex(c => !c.disabled);
    const target = cells[focusIdx >= 0 ? focusIdx : fallback];
    if (target) requestAnimationFrame(() => target.focus());
  }

  function hide() {
    overlay.hidden = true;
  }

  function dispose() {
    overlay.remove();
  }

  function isVisible() {
    return !overlay.hidden;
  }

  return { show, hide, dispose, isVisible };
}

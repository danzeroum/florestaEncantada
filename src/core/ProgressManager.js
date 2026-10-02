/**
 * ProgressManager — rastreia o progresso do jogador na sessão atual.
 *
 * Requisito de privacidade: NADA é persistido em localStorage/sessionStorage.
 * Ao fechar a aba, o progresso é perdido (intencional).
 */

/**
 * @param {number} totalPhases
 * @returns {{
 *   complete:(index:number)=>void,
 *   isCompleted:(index:number)=>boolean,
 *   isUnlocked:(index:number)=>boolean,
 *   getMaxUnlocked:()=>number,
 *   getCompletedCount:()=>number,
 *   reset:()=>void,
 *   toJSON:()=>({completed:number[], maxUnlocked:number, total:number})
 * }}
 */
export function createProgressManager(totalPhases) {
  if (!Number.isInteger(totalPhases) || totalPhases < 1) {
    throw new Error(`totalPhases inválido: ${totalPhases}`);
  }

  const completed = new Set();
  let maxUnlocked = 0;

  return {
    complete(index) {
      if (index < 0 || index >= totalPhases) return;
      completed.add(index);
      // A próxima fase é desbloqueada ao completar a atual
      if (index === maxUnlocked && maxUnlocked < totalPhases - 1) {
        maxUnlocked += 1;
      }
    },
    isCompleted(index) {
      return completed.has(index);
    },
    isUnlocked(index) {
      return index <= maxUnlocked;
    },
    getMaxUnlocked() {
      return maxUnlocked;
    },
    getCompletedCount() {
      return completed.size;
    },
    reset() {
      completed.clear();
      maxUnlocked = 0;
    },
    toJSON() {
      return {
        completed: [...completed].sort((a, b) => a - b),
        maxUnlocked,
        total: totalPhases,
      };
    },
  };
}

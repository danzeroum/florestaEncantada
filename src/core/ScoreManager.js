/**
 * Pontuação da fase: coletadas / total, com condição de vitória.
 */

/**
 * @param {number} total número de nozes da fase
 * @returns {{ increment:()=>number, getScore:()=>number, getTotal:()=>number, isVictory:()=>boolean, reset:()=>void }}
 */
export function createScoreManager(total) {
  if (!Number.isFinite(total) || total < 1) {
    throw new Error(`total inválido: ${total}`);
  }

  let score = 0;

  return {
    increment() {
      if (score < total) score += 1;
      return score;
    },
    getScore() {
      return score;
    },
    getTotal() {
      return total;
    },
    isVictory() {
      return score >= total;
    },
    reset() {
      score = 0;
    },
  };
}

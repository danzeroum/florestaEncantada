/**
 * Gerenciador de vidas — 3 por padrão.
 * Chama `onLifeLost(livesLeft)` a cada perda e `onDeath()` quando zera.
 */

/**
 * @param {number} [initialLives=3]
 * @param {(livesLeft:number)=>void} [onLifeLost]
 * @param {()=>void} [onDeath]
 * @returns {{ loseLife:()=>number, getLives:()=>number, isDead:()=>boolean, reset:()=>void }}
 */
export function createLifeManager(initialLives = 3, onLifeLost = () => {}, onDeath = () => {}) {
  if (!Number.isInteger(initialLives) || initialLives < 1) {
    throw new Error(`initialLives inválido: ${initialLives}`);
  }

  let lives = initialLives;
  let dead = false;

  return {
    loseLife() {
      if (dead) return 0;
      lives -= 1;
      onLifeLost(lives);
      if (lives <= 0) {
        dead = true;
        onDeath();
      }
      return lives;
    },
    getLives() {
      return lives;
    },
    isDead() {
      return dead;
    },
    reset() {
      lives = initialLives;
      dead = false;
    },
  };
}

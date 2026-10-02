/**
 * Áudio sintetizado via Web Audio API.
 * Zero arquivos externos, zero dependências, zero licença.
 *
 * Autoplay dos navegadores: o AudioContext só é criado/resumido
 * após o primeiro gesto do usuário (clique/toque/tecla).
 */

export const SFX = {
  COLLECT: 'collect',
  JUMP: 'jump',
  LOSE_LIFE: 'loseLife',
  VICTORY: 'victory',
  GAME_OVER: 'gameOver',
};

// Definições dos sons — cada um é uma pequena receita de osciladores.
// frequency: Hz inicial; endFreq: Hz final (glissando); duration: segundos;
// type: forma de onda; volume: ganho máximo; harmonics: nº de camadas.
const SFX_RECIPES = {
  [SFX.COLLECT]: {
    frequency: 660,
    endFreq: 1320,
    duration: 0.18,
    type: 'triangle',
    volume: 0.25,
  },
  [SFX.JUMP]: {
    frequency: 220,
    endFreq: 660,
    duration: 0.15,
    type: 'square',
    volume: 0.18,
  },
  [SFX.LOSE_LIFE]: {
    frequency: 440,
    endFreq: 110,
    duration: 0.35,
    type: 'sawtooth',
    volume: 0.22,
  },
  [SFX.VICTORY]: {
    // Arpejo: 3 notas curtas
    arpeggio: [523, 659, 784],
    noteDuration: 0.14,
    type: 'triangle',
    volume: 0.22,
  },
  [SFX.GAME_OVER]: {
    frequency: 330,
    endFreq: 80,
    duration: 0.7,
    type: 'sawtooth',
    volume: 0.22,
  },
};

/**
 * @returns {{
 *   unlock:()=>void,
 *   play:(name:string)=>void,
 *   setMuted:(m:boolean)=>void,
 *   isMuted:()=>boolean,
 *   dispose:()=>void
 * }}
 */
export function createAudioManager() {
  let ctx = null;
  let muted = false;

  function ensureContext() {
    if (ctx) return ctx;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    return ctx;
  }

  function unlock() {
    const c = ensureContext();
    if (c && c.state === 'suspended') c.resume();
  }

  function playTone({ frequency, endFreq, duration, type, volume, startAt }) {
    const c = ensureContext();
    if (!c) return;
    const t0 = startAt ?? c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, t0);
    if (endFreq && endFreq !== frequency) {
      osc.frequency.exponentialRampToValueAtTime(endFreq, t0 + duration);
    }

    // Envelope: ataque rápido + decaimento exponencial (evita cliques)
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(volume, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

    osc.connect(gain);
    gain.connect(c.destination);

    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  function play(name) {
    if (muted) return;
    const recipe = SFX_RECIPES[name];
    if (!recipe) return;

    const c = ensureContext();
    if (!c) return;
    if (c.state === 'suspended') c.resume();

    if (recipe.arpeggio) {
      const base = c.currentTime;
      recipe.arpeggio.forEach((freq, i) => {
        playTone({
          frequency: freq,
          duration: recipe.noteDuration,
          type: recipe.type,
          volume: recipe.volume,
          startAt: base + i * recipe.noteDuration,
        });
      });
      return;
    }

    playTone(recipe);
  }

  function setMuted(value) {
    muted = value === true;
  }

  function isMuted() {
    return muted;
  }

  function dispose() {
    if (ctx) {
      try {
        ctx.close();
      } catch {
        // ignora erro ao fechar contexto já fechado
      }
      ctx = null;
    }
  }

  return { unlock, play, setMuted, isMuted, dispose };
}

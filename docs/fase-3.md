# Fase 3 — Progressão, Vidas e Obstáculos Diversificados

> **Objetivo:** Transformar o protótipo em um **jogo com progressão real**: 2 fases sequenciais, 3 vidas por fase, 3 tipos de obstáculo com comportamentos distintos, tela de morte e tela de fim de fase — tudo sem texto, 100% visual.

> **Status:** dividida em 3 sub-fases para entrega incremental:
> - **3.1** — Sistema de vidas (3 corações), animação de tropeço, tela de game over ✅
> - **3.2** — Obstáculos animados (toca-toca + cogumelo saltitante) — pendente
> - **3.3** — 2 fases + LevelManager + tela de "próxima fase" — pendente

---

## 1. Decisão de design (revisada após teste com usuário)

### Classificação dos obstáculos

| Tipo | Comportamento | Hostil? | Visual |
|---|---|---|---|
| **Log** (tronco) | Estático | ❌ **Não** (plataforma) | Marrom, cilindro deitado |
| **MoleHole** (toca-toca) | Aparece/desaparece em ciclo (2s on / 1s off) | ✅ Sim (inimigo) | Buraco no chão com borda de terra |
| **Mushroom** (cogumelo) | Salta periodicamente (Y = base + sin) | ✅ Sim (inimigo) | Vermelho com bolinhas brancas, menor que o tronco |

> **Por que o tronco não tira vida?**
> Punir com dano um obstáculo **estático e previsível** gera frustração sem aprendizado em crianças de 8 anos — a criança encosta de novo e não entende o que errou.
> Apenas **criaturas vivas** (toca-toca, cogumelo) são hostis; o dano faz sentido narrativamente e o comportamento é **dinâmico** (a criança precisa observar timing).
> O tronco atua como **tutorial de obstáculo de plataforma**: bloqueia, você pula ou desvia, sem punição.

---

## 2. Módulos e Contratos

### 2.1 `core/LifeManager.js` — Sistema de Vidas

```js
export function createLifeManager(initialLives = 3, onLifeLost, onDeath)
// → { loseLife, getLives, isDead, reset }
```

**Regras:**
- `loseLife()` decrementa; chama `onLifeLost(livesLeft)`
- Ao chegar a 0 → chama `onDeath()` (uma única vez)
- `reset()` restaura `initialLives` e limpa flag `dead`
- **Não** reinicia score (responsabilidade externa)

### 2.2 `core/Obstacle.js` — 3 Tipos

```js
export function createLogObstacle(scene, x, z)      // hostile: false
export function createMoleHoleObstacle(scene, x, z) // hostile: true, isActive, update
export function createMushroomObstacle(scene, x, z) // hostile: true, update
```

**Contrato `Obstacle`:**

```js
{
  mesh: THREE.Mesh | THREE.Group,
  position: {x, y, z},
  collider: {width, height, depth},  // extensões totais por eixo
  hostile: boolean,                  // true = tira vida ao colidir
  update: (deltaTime) => void,       // opcional; presente em obstáculos animados
  isActive: () => boolean            // opcional; false = não colide (ex: moleHole oculto)
}
```

**Regra do loop:** só chama `onObstacleHit()` quando `hostile === true` E (`isActive` ausente OU `isActive() === true`).

### 2.3 `core/LevelManager.js` — Fases (3.3)

```js
export function createLevelManager(layouts, onPhaseComplete, onGameOver)
// → { startPhase, getCurrentPhase, getScore, isLastPhase, reset }
```

**Layouts sugeridos:**

```js
// Fase 1 — iniciante (só troncos, espaçamento generoso)
const PHASE_1 = {
  obstacles: [
    { type: 'log', x: 5, z: 0 },
    { type: 'log', x: 13, z: 0 },
    { type: 'log', x: 20, z: 0 },
  ],
  nuts: [/* 10 nozes */],
};

// Fase 2 — avançada (todos os tipos, timing apertado)
const PHASE_2 = {
  obstacles: [
    { type: 'log', x: 4, z: 0 },
    { type: 'moleHole', x: 9, z: 0 },
    { type: 'mushroom', x: 14, z: 0 },
    { type: 'log', x: 18, z: 0 },
    { type: 'moleHole', x: 22, z: 0 },
    { type: 'mushroom', x: 26, z: 0 },
  ],
  nuts: [/* 12 nozes */],
};
```

### 2.4 `ui/HUD.js` — Atualizado

Já inclui `setLives(lives, total)`, `showGameOver()`, `hideGameOver()`.

### 2.5 `core/loop.js` — Integração

Chama `lifeManager.loseLife()` apenas quando o obstáculo colidido é hostil e ativo.
Faz animação de tropeço (`scale = 1.2 × 0.7 × 1.2` por 0.4s) e dá **1s de invulnerabilidade** após perder vida.

---

## 3. Acessibilidade

| Requisito | Implementação |
|---|---|
| Cores + formas para daltonismo | Nozes com forma+cor distintas |
| Navegação por teclado | Tab → botão replay/retry → Enter |
| Contraste WCAG AA | Coração vermelho (`#FF5252`) vs overlay preto ≈ 5.7:1 ✅ |
| Sem texto | Ícones SVG para vidas, vitória, replay |

---

## 4. Critérios de Aceitação

### 4.1 Funcionais

- [x] Colidir com obstáculo **hostil** perde 1 vida (tronco não perde)
- [x] Ao perder 3 vidas → tela de game over
- [x] Tela de game over com botão replay
- [x] Botão replay reinicia posição e vidas
- [ ] Fase 1 completa → tela "Próxima fase" (3.3)
- [ ] Fase 2 completa → tela "Jogar de novo" (3.3)
- [ ] MoleHole aparece/desaparece em ciclo (3.2)
- [ ] Mushroom salta periodicamente (3.2)
- [ ] FPS ≥ 45 (desktop), ≥ 40 (throttling 4×)

### 4.2 Não-funcionais

- [x] Bundle `dist/` ≤ 3 MB (atual: ~125 KB gzip)
- [x] Sem `console.log` no build
- [x] Lint limpo

---

## 5. Testes

### Unitários (Vitest) — implementados

- `LifeManager.test.js` — 7 testes (lose, callbacks, limite, reset)
- `Obstacle.test.js` — 5 testes (incluindo `hostile: false` do tronco)

### Pendentes (3.2 / 3.3)

- MoleHole ciclo / Mushroom oscilação
- LevelManager carregamento de fase
- E2E Playwright

---

## 6. Histórico de commits

- `926b7a1` — feat: fase 3.1 — sistema de vidas (3 corações), animação de tropeço e tela de game over
- `78019a7` — fix: tronco deixa de tirar vida — obstáculo de plataforma, não inimigo

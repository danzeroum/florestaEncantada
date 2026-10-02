# Fase 2 — Coleta e Pontuação

> **Objetivo:** Entregar o loop de recompensa: mover → coletar noz → pontuação aumenta → partículas → vitória ao coletar 10 nozes.

---

## 1. Decisões de design (aprovadas)

| # | Decisão | Escolha |
|---|---|---|
| 1 | Controle | **Trilho em X** (Z=0 fixo). Sem 4 direções. |
| 2 | Vitória | **Coletar 10 nozes** → tela de vitória |
| 3 | Colisão com obstáculo | Apenas parede (sem vidas — Fase 3) |

---

## 2. Módulos e Contratos

### 2.1 `core/Nut.js`

```js
export const NUT_TYPES = { SPHERE: 'sphere', CONE: 'cone', CUBE: 'cube' };
export function createNut(scene, type, x, z)  // → { mesh, position, collider, type, collected }
```

**3 tipos com cor + forma distintas (acessibilidade daltonismo):**

| Tipo | Cor | Forma | Collider |
|---|---|---|---|
| `SPHERE` | `#FF5252` vermelho | esfera | `{width:0.8,height:0.8,depth:0.8}` |
| `CONE` | `#29B6F6` azul | cone | `{width:0.8,height:0.9,depth:0.8}` |
| `CUBE` | `#66BB6A` verde | cubo | `{width:0.7,height:0.7,depth:0.7}` |

### 2.2 `core/ScoreManager.js`

```js
export function createScoreManager(total)  // → { increment, getScore, getTotal, isVictory, reset }
```

**Regras:**
- `increment()` só incrementa até `total` (idempotente acima disso)
- `isVictory()` retorna `true` quando `score >= total`
- `reset()` zera o score (usado ao reiniciar)

### 2.3 `core/ParticleSystem.js`

```js
export function createParticleSystem(scene)  // → { explode(x,y,z,color), update(delta), dispose() }
```

**Regras:**
- Usa `THREE.Points` (sem dependência externa)
- Pool de partículas (reuso, sem alocar por explosão)
- `update(delta)` anima decaimento
- `explode()` posiciona no ponto e ativa 12 partículas

### 2.4 `ui/HUD.js` (overlay HTML)

```js
export function createHUD(root)  // → { setScore(n, total), showVictory() }
```

**Regras:**
- Sem texto complexo: número grande + ícone SVG de noz
- Ao atingir total: mostra tela de vitória com botão replay (ícone)
- Totalmente acessível por teclado (foco visível)

### 2.5 `core/Level.js`

```js
export function createLevel()  // → [{ type, x, z }, ...]  (10 nozes)
```

**Layout:** 10 nozes ao longo do trilho em Z=0, intercalando tipos, com espaçamento de ~4 unidades (após o primeiro tronco em X=5): X = 2, 3, 7, 8, 12, 14, 16, 18, 20, 22.

---

## 3. Acessibilidade

- Toda noz tem **forma + cor** distintas (daltonismo)
- HUD com contraste WCAG AA (número branco sobre fundo escuro semitransparente)
- Navegação por teclado no botão replay

---

## 4. Critérios de Aceitação

- [ ] Coletar noz incrementa score exatamente 1
- [ ] HUD atualiza imediatamente
- [ ] Partículas aparecem ao coletar e decaem
- [ ] Ao atingir 10/10, tela de vitória aparece
- [ ] Sem texto complexo no HUD (só ícone + números)
- [ ] FPS ≥ 45 (desktop), ≥ 40 (throttling 4×)
- [ ] Nozes distinguíveis por forma + cor

---

## 5. Testes

### Unitários (Vitest)
- `Nut.test.js` — criação dos 3 tipos, colisão, marcação `collected`
- `ScoreManager.test.js` — increment, limite no total, vitória, reset
- `ParticleSystem.test.js` — explode ativa partículas, update decai, reuso do pool
- `Level.test.js` — 10 nozes, tipos válidos, posições Z=0

### E2E (Playwright — Fase 6)
- Coletar 10 nozes → vitória
- HUD atualiza a cada coleta
- Reinício limpa estado

---

## 6. Fora de escopo (fases futuras)

- Áudio (Fase 5)
- Vidas / obstáculos móveis (Fase 3)
- Múltiplas fases (Fase 3)

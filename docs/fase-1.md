# Fase 1 — Jogabilidade Mínima (Core Gameplay)

> **Objetivo:** Entregar um protótipo **jogável e testável** com o loop core completo: personagem controlável + física + obstáculo + câmera + controles teclado/toque. Zero UI textual. 100% navegável por teclado.

---

## 1. Visão Geral do Sistema

```
┌─────────────────────────────────────────────────────┐
│                    FASE 1 — MVP                     │
├─────────────────────────────────────────────────────┤
│  ┌──────────┐    ┌──────────┐    ┌─────────────┐   │
│  │  INPUT   │───▶│  STATE   │───▶│  PHYSICS    │   │
│  │ (teclado │    │ (player, │    │ (gravity,   │   │
│  │  + toque)│    │ obstácu- │    │  collision) │   │
│  └──────────┘    │ los)     │    └─────────────┘   │
│       │          │          │          │           │
│       ▼          ▼          ▼          ▼           │
│  ┌──────────────────────────────────────────┐       │
│  │           RENDER (Three.js)              │       │
│  │  - Câmera isométrica seguindo player     │       │
│  │  - Esquilo geométrico + tronco           │       │
│  │  - Chão (grama) + céu (gradiente)        │       │
│  └──────────────────────────────────────────┘       │
│  ┌──────────────────────────────────────────┐       │
│  │           LABEL (HTML overlay)           │       │
│  └──────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
```

---

## 2. Módulos e Contratos de API

### 2.1 `core/input.js` — Entrada Unificada

**Responsabilidade:** Mapear eventos de teclado e toque para **ações de jogo** (não para teclas). Abstrai o dispositivo do jogador.

```js
export const ACTIONS = { LEFT: 'left', RIGHT: 'right', JUMP: 'jump', CROUCH: 'crouch' };
export function setupInput(options)          // attach listeners ONCE
export function getInputState()              // returns { [action]: boolean }
export function disposeInput()               // remove listeners (para testes)
```

**Contrato:**

| Ação | Teclas | Toque |
|---|---|---|
| `LEFT` | ← / A | Swipe para esquerda |
| `RIGHT` | → / D | Swipe para direita |
| `JUMP` | ↑ / W / Espaço | Botão pular (overlay) + swipe para cima |
| `CROUCH` | S | — (não implementar na Fase 1) |

**Regras obrigatórias:**
- `getInputState()` retorna **cópia** do estado (imutabilidade)
- `setupInput()` é idempotente
- `preventDefault()` em teclas/toque para evitar scroll
- Sem bloqueio de múltiplas teclas (D+W deve funcionar)

### 2.2 `core/physics.js` — Física AABB Caseira

```js
export const GRAVITY = -18;
export const GROUND_Y = 0;
export const JUMP_VELOCITY = 7.5;
export const JUMP_COOLDOWN = 0.3;
export function checkCollision(a, b)          // { position, collider } × { position, collider }
export function applyGravity(state, deltaTime) // muta velocity.y e position.y
```

**Regras de colisão (AABB simplificado no plano XZ):**

```js
const overlapX = Math.abs(a.position.x - b.position.x) < a.collider.radius + b.collider.radius;
const overlapZ = Math.abs(a.position.z - b.position.z) < a.collider.radius + b.collider.radius;
const overlapY = Math.abs(a.position.y - b.position.y) < a.collider.height + b.collider.height;
return overlapX && overlapZ && overlapY;
```

### 2.3 `core/Squirrel.js` — Personagem Controlável

```js
export function createSquirrel(scene) // → PlayerState
```

**Composição geométrica:**

| Parte | Tipo | Cor | Posição relativa |
|---|---|---|---|
| Corpo | Sphere | `0xffb300` | (0, 0.6, 0) |
| Cabeça | Box | `0xffa726` | (0.35, 1.15, 0) |
| Rabo | Cylinder | `0x795548` | (-0.7, 0.8, 0.15) |
| Olhos ×2 | Sphere | `0xffffff` | (0.55, 1.25, ±0.15) |
| Orelhas ×2 | Cone | `0xffa726` | (0.18, 1.42, ±0.22) |

**Regras:** `THREE.Group`; `collider.radius = 0.6`, `height = 1.4`; sem PBR.

### 2.4 `core/Obstacle.js` — Obstáculo (Tronco)

```js
export function createLogObstacle(scene, x, z)
```

| Propriedade | Valor |
|---|---|
| Geometria | Cylinder (raio: 0.5, altura: 2.2) |
| Material | `color: 0x795548`, `roughness: 0.7` |
| Rotação | `rotation.x = π/2` |
| Collider | `radius: 0.5`, `height: 2.2` |

### 2.5 `core/scene.js` — Montagem da Cena

**Câmera:**

| Propriedade | Valor |
|---|---|
| Tipo | `PerspectiveCamera(60, aspect, 0.1, 1000)` |
| Posição | `(0, 14, 22)` |
| Alvo | `(player.position.x, player.position.y + 1, player.position.z)` |
| Comportamento | Lerp suave |

**Luzes:** Ambient `0.7`, Directional `0.9` em `(15, 35, 25)`.

**Chão e céu:** chão `PlaneGeometry(40, 40)` `0x4caf50`; céu `SphereGeometry(100, 32, 16)` `MeshBasicMaterial(side: BackSide, color: 0xb3e5fc)`.

### 2.6 `core/loop.js` — Loop de Animação e Game Logic

```js
export function startLoop(sceneData) // { scene, camera, renderer, player, obstacles, label }
```

**Ciclo:** input → movimento XZ → pulo (cooldown) → gravidade → colisão → atualiza mesh → câmera lerp → render → rAF.

**Colisão-resposta:** empurrar player para fora (normal × overlap + 0.05 margem).

### 2.7 `main.js` — Bootstrap

```js
startLoop({ scene, camera, renderer, player, obstacles: [log], label });
```

---

## 3. Paleta de Cores e Acessibilidade

### 3.1 Paleta WCAG AA (fundo verde `#4caf50`)

| Elemento | HEX | Contraste | Observação |
|---|---|---|---|
| Esquilo | `#FFB300` | 3.7:1 ✅ | Corpo principal |
| Tronco | `#795548` | 1.6:1 ⚠️ | Não precisa contraste alto |
| Chão | `#4caf50` | — | Base |
| Céu | `#b3e5fc` | — | Fundo |

### 3.2 Daltonismo — regra de design para Fase 2

> **Toda noz coletável deve ter distinção por FORMA + COR.**

| Noz | Cor | Forma |
|---|---|---|
| Noz 1 | `#FF5252` | Esfera |
| Noz 2 | `#29B6F6` | Cone |
| Noz 3 | `#66BB6A` | Cubo |

---

## 4. Critérios de Aceitação — Fase 1

### 4.1 Funcionais

| # | Critério | Como validar |
|---|---|---|
| 1 | Personagem move com ←/→ e A/D | Playwright: verificar `player.position.x` |
| 2 | Pulo funciona com espaço/W/↑ e respeita cooldown | Teste unitário |
| 3 | Colisão com tronco impede passagem | Teste unitário |
| 4 | Player não fica preso em colisão | Manual |
| 5 | Câmera segue com lerp suave | Manual |
| 6 | FPS ≥ 55 em desktop | DevTools Performance |
| 7 | FPS ≥ 40 em throttling 4× | DevTools CPU throttling |
| 8 | Roda em Chrome, Firefox, Safari | 3 navegadores |
| 9 | Sem erros no console | DevTools Console |

### 4.2 Não-funcionais

| # | Critério | Meta |
|---|---|---|
| 10 | Bundle `dist/` | ≤ 2.5 MB |
| 11 | Sem dependências > 100 KB além do Three.js | source-map-explorer |
| 12 | ESLint limpo | 0 warnings/errors |
| 13 | Sem `console.log` em produção | ESLint `no-console` |

---

## 5. Testes Unitários (Vitest)

### `core/physics.test.js`

- `checkCollision` false quando sem overlap
- `checkCollision` true quando sobreposto
- `checkCollision` false quando Y mismatch
- `applyGravity` seta `onGround=true` ao tocar o chão
- `applyGravity` mantém `onGround=true` no chão
- `applyGravity` acelera para baixo (GRAVITY)

### `core/input.test.js`

- `getInputState` retorna LEFT=true ao pressionar ←
- `getInputState` retorna LEFT=false ao soltar ←
- `getInputState` lida com WASD + arrows simultâneos
- `getInputState` previne double jump via cooldown

---

## 6. Testes E2E (Playwright)

| Teste | Passos |
|---|---|
| Mover para direita | `D` 1s → `player.position.x` aumenta |
| Mover para esquerda | `A` 1s → `player.position.x` diminui |
| Pular e cair | Espaço → sobe → cai → `onGround = true` |
| Colidir com tronco | posição para antes do collider |
| Pular sobre tronco | atravessar sem colidir |
| Câmera segue | player longe → câmera acompanha |

---

## 7. Performance

| Métrica | Ferramenta | Meta |
|---|---|---|
| FPS desktop | DevTools Performance | ≥ 55 fps |
| FPS mobile fraco | CPU throttling 4× | ≥ 40 fps |
| Bundle | `npm run build` | ≤ 2.5 MB |
| Carregamento 2G | Network 50 kbps | ≤ 8s |
| Memory leak | DevTools Memory ×5 | sem crescimento |

---

## 8. Entregáveis da Fase 1

| Arquivo | Responsabilidade |
|---|---|
| `core/input.js` | Entrada unificada |
| `core/physics.js` | Gravidade + colisão AABB |
| `core/Squirrel.js` | Mesh composto + estado |
| `core/Obstacle.js` | Tronco + collider |
| `core/scene.js` | Cena (atualizado) |
| `core/loop.js` | Loop (atualizado) |
| `core/input.test.js` | Testes unitários |
| `core/physics.test.js` | Testes unitários |
| `e2e/fase1.spec.js` | Playwright |
| `docs/fase-1.md` | Este documento |

---

## 9. Próximos Passos

| Fase | Objetivo |
|---|---|
| **Fase 2** | Coleta de nozes + pontuação + partículas + áudio |
| **Fase 3** | 2 fases + vidas + tela de fim + replay |
| **Fase 4** | UI completa + axe-core |

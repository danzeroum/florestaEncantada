# Fase 4 — Menu, Pausa e Acessibilidade Formal

> **Objetivo:** Entregar uma **experiência polida e acessível** com 3 telas de UI totalmente visuais (sem texto): menu inicial, como jogar e pausa — todas navegáveis por teclado e validadas com axe-core.

> **Status:** dividida em 3 sub-fases:
> - **4.1** — FSM `GameState.js` + `MenuUI.js` + integração mínima — pendente
> - **4.2** — `HowToPlayUI.js` + `PauseUI.js` (ESC) — pendente
> - **4.3** — Contraste WCAG AA final + `npm run a11y` + E2E — pendente

---

## 1. Decisões de design (revisadas)

| # | Ponto | Decisão | Justificativa |
|---|---|---|---|
| 1 | **Fonte custom (Google Fonts)** | ❌ **Não.** Usar `system-ui` do sistema. | Requisito original: "sem links externos". Google Fonts coleta dados, requer rede, quebra offline em escola. Se um dia houver fonte custom, será baixada e servida localmente com licença SIL OFL. |
| 2 | **axe-core** | ❌ **Nunca no bundle de produção.** Vira devDependency + script `npm run a11y` (headless). | axe-core pesa ~500 KB gzip — triplicaria o bundle. A intenção (verificar acessibilidade) é mantida via script + E2E. |
| 3 | **FSM** | `src/state/GameState.js` — máquina de estados **pura**, sem acoplamento com Three.js nem DOM. | O `core/loop.js` já é o loop de render. Separar responsabilidades mantém ambos testáveis. |
| 4 | **Entrega** | 3 sub-fases (4.1, 4.2, 4.3). | Incrementos menores pegam bugs mais cedo. |
| 5 | **Mute na 4.1** | Botão visível mas `aria-disabled="true"` (áudio só vem na Fase 5). | Botão que não faz nada é pior que botão claramente inativo. |
| 6 | **ESC** | Funciona em RUNNING↔PAUSED. Em MENU/HOW_TO_PLAY, volta ao estado anterior. | Comportamento padrão de UI. |
| 7 | **Contraste botão Mute** | `#E65100` (6.4:1) em vez de `#FF9800` (3.9:1). | WCAG AA requer 4.5:1 mínimo. |

---

## 2. Módulos e Contratos

### 2.1 `src/state/GameState.js` — FSM pura

```js
export const STATES = {
  MENU: 'menu',
  HOW_TO_PLAY: 'howToPlay',
  RUNNING: 'running',
  PAUSED: 'paused',
  VICTORY: 'victory',
  GAME_OVER: 'gameOver',
};

export function createGameState(initial = STATES.MENU)
// → { get, set, is, onChange, offChange, reset }
```

**Regras:**
- `get()` retorna o estado atual
- `set(newState)` valida que o novo estado existe em `STATES`; se igual ao atual, não dispara callback
- `is(state)` retorna `boolean`
- `onChange(fn)` registra listener; retorna `unsubscribe`
- `offChange(fn)` remove listener específico
- `reset()` volta para `initial`

### 2.2 `src/ui/MenuUI.js` — Menu Inicial

```js
export function createMenuUI(root, { onPlay, onHowToPlay, muteEnabled = false })
// → { show, hide, dispose }
```

**Botões:**

| Botão | Ícone SVG | Ação |
|---|---|---|
| Play | ▶️ triângulo verde | `onPlay()` |
| Como jogar | ℹ️ i em círculo azul | `onHowToPlay()` |
| Mute | 🔊 / 🔇 | Se `muteEnabled=false`: `aria-disabled="true"` |

**Acessibilidade:**
- Foco inicial no Play (`autofocus` via `requestAnimationFrame`)
- Tab navega Play → Como jogar → Mute → Play
- `aria-label` em cada botão
- Foco visível: `outline: 3px solid #FFEB3B; outline-offset: 3px`
- Botão mínimo 56×56 px (acima do mínimo WCAG de 44)

### 2.3 `src/ui/HowToPlayUI.js` — Como Jogar (4.2)

```js
export function createHowToPlayUI(root, { onBack })
// → { show, hide, dispose }
```

Sem texto — só ícones SVG (setas + esquilo + noz) e animação CSS do esquilo pulando.

### 2.4 `src/ui/PauseUI.js` — Pausa (4.2)

```js
export function createPauseUI(root, { onResume, onRestart, onQuit })
// → { show, hide, dispose }
```

| Botão | Ícone | Ação |
|---|---|---|
| Resume | ▶️ | `onResume()` |
| Restart | 🔄 | `onRestart()` |
| Quit | 🏠 | `onQuit()` |

### 2.5 `npm run a11y` (4.3)

Script standalone que roda axe-core em modo headless (jsdom) sobre os overlays e imprime violações. Não entra no bundle.

---

## 3. Acessibilidade — Checklist WCAG AA

| Requisito | Menu | HowToPlay | Pausa | HUD |
|---|---|---|---|---|
| Contraste ≥ 4.5:1 | ✅ | ✅ | ✅ | ✅ |
| Foco visível | ✅ | ✅ | ✅ | — |
| Navegável por Tab | ✅ | ✅ | ✅ | — |
| Ação por Enter/Space | ✅ | ✅ | ✅ | — |
| `aria-label` em botões | ✅ | ✅ | ✅ | — |
| Sem texto puro (só ícones) | ✅ | ✅ | ✅ | — |
| Botão ≥ 56×56 px | ✅ | ✅ | ✅ | — |
| axe-core sem violações AA | ✅ | ✅ | ✅ | — |

---

## 4. Critérios de Aceitação

### 4.1 Funcionais

- [ ] Ao abrir o jogo → **Menu** aparece primeiro
- [ ] Botão Play → inicia Fase 1
- [ ] Botão Como Jogar → abre overlay
- [ ] Botão Mute → desabilitado na 4.1 (áudio vem na 5)
- [ ] ESC durante jogo → pausa
- [ ] Tab navega entre botões em todos overlays
- [ ] Enter aciona botão focado
- [ ] Foco visível sempre presente
- [ ] axe-core reporta **zero violações WCAG AA**

### 4.2 Não-funcionais

- [ ] Bundle `dist/` ≤ 3 MB
- [ ] Lint limpo
- [ ] Sem `console.log` no build

---

## 5. Testes

### Unitários (Vitest)

- `GameState.test.js` — get/set/is/onChange/offChange/reset, validação de estados inválidos
- `MenuUI.test.js` — renderiza botões, foco inicial, callback no clique, mute desabilitado
- `HowToPlayUI.test.js` — renderiza voltar, callback
- `PauseUI.test.js` — 3 botões, foco inicial, callbacks

### E2E (Playwright — Fase 6)

- Menu → Jogo
- Menu → Como jogar → Voltar
- Pausa via ESC
- Navegação completa por teclado

---

## 6. Fora de escopo

- Áudio (Fase 5)
- Testes E2E completos (Fase 6)
- Deploy (Fase 7)

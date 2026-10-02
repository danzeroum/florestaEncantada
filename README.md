# 🌳 Floresta Encantada — Jogo 3D no Navegador

> Jogo 3D educativo para crianças de 8 anos. Controle um esquilo na Floresta Mágica, colete nozes e desvie de obstáculos — tudo rodando direto no navegador, sem instalação.

## Características

- 🎮 **Simples de jogar:** 2 teclas + pulo. Zero texto complexo — só ícones.
- 🌈 **Acessível por design:** nozes distinguíveis por **forma + cor** (daltonismo); navegação 100% por teclado; contraste WCAG AA.
- 🔒 **Ambiente seguro:** sem coleta de dados, sem anúncios, sem links externos, sem `localStorage`.
- 📦 **Bundle enxuto:** ~127 KB gzip total (Three.js + app + CSS).
- ⚡ **Roda em Chromebooks, tablets e notebooks de escola.**

## Stack

- **Renderização 3D:** [Three.js](https://threejs.org/) (r170+)
- **Build:** [Vite](https://vitejs.dev/) 8+ (Rolldown)
- **Lint/Format:** ESLint 10 (flat config) + Prettier 3
- **Testes unitários:** Vitest + jsdom
- **Acessibilidade:** axe-core (dev + CI, nunca no bundle)
- **Deploy:** `deploy.sh` parametrizado via `.env` para VPS

## Pré-requisitos

- Node.js `>=18`
- npm `>=9`

## Setup local

```bash
git clone https://github.com/danzeroum/florestaEncantada.git
cd florestaEncantada
npm install
npm run dev
```

Abra http://localhost:5173 no navegador.

## Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Modo desenvolvimento (hot reload) |
| `npm run build` | Gera build otimizado em `dist/` |
| `npm run preview` | Serve o build localmente |
| `npm run lint` | Linting (ESLint) |
| `npm run format` | Formata com Prettier |
| `npm test` | Roda testes unitários (Vitest) |
| `npm run test:watch` | Testes em modo watch |
| `npm run test:coverage` | Testes com cobertura |
| `npm run a11y` | Verifica acessibilidade WCAG AA nos overlays (axe-core headless) |
| `npx playwright test` | Roda testes E2E (requer Chrome com debug port) |
| `./deploy.sh` | Deploy para VPS (requer `.env` configurado) |

### Rodando testes E2E

Os testes E2E usam `playwright-core` **conectando a um Chrome existente via CDP** — nenhum browser é baixado (~340 MB economizados). Para rodar:

```bash
# 1. Suba o servidor dev
npm run dev

# 2. Em outro terminal, abra um Chrome com debug port
google-chrome --remote-debugging-port=9222 --user-data-dir="/tmp/chrome_session"

# 3. Rode os testes E2E
npx playwright test
```

Se você já tem um Chrome aberto com `--remote-debugging-port=9222`, o Playwright se conecta a ele diretamente — sem abrir janela nova. Os testes reaproveitam a aba que já está em `http://localhost:5173`.

## Status do projeto

- [x] **Fase 0** — Fundação (Vite + Three.js + ESLint + smoke test)
- [x] **Fase 1** — Jogabilidade mínima (esquilo, tronco, física AABB, input teclado/toque, câmera com lerp)
- [x] **Fase 2** — Coleta de nozes, pontuação, partículas, HUD
- [x] **Fase 3** — Vidas, 2 fases, toca-toca, cogumelo saltitante, game over, replay
- [x] **Fase 4** — Menu, Como Jogar, pausa (ESC), acessibilidade WCAG AA
- [ ] **Fase 5** — Áudio (música + efeitos) + botão mute funcional
- [ ] **Fase 6** — Testes E2E (Playwright) + usabilidade com crianças reais
- [ ] **Fase 7** — Deploy (VPS + GitHub Pages) + CI/CD (GitHub Actions)

## Controles

| Ação | Teclado | Toque |
|---|---|---|
| Mover esquerda | ← / A | Swipe esquerda |
| Mover direita | → / D | Swipe direita |
| Pular | ↑ / W / Espaço | Swipe cima |
| Pausar / retomar | ESC | — |
| Navegar UI | Tab / Shift+Tab | Toque direto |
| Confirmar | Enter / Espaço | Toque direto |

## Acessibilidade

Este projeto foi projetado para ser acessível a crianças com **daltonismo**, **baixa visão** e **dificuldade motora leve**:

| Requisito | Implementação |
|---|---|
| **Daltonismo** | Nozes com **forma + cor** distintas (esfera vermelha, cone azul, cubo verde). Nenhuma informação depende só de cor. |
| **Contraste WCAG AA** | Botões com contraste ≥ 4.5:1 sobre fundo. Validado com axe-core. |
| **Navegação por teclado** | 100% dos botões acessíveis via Tab + Enter. Foco visível (outline amarelo 3px). |
| **Alvo mínimo** | Botões ≥ 56×56 px (WCAG 2.5.5 pede 44×44). |
| **Sem texto complexo** | Instruções por ícones SVG + animações. |
| **Sem animações >2Hz** | Todas as animações são lentas e suaves. |
| **Leitor de tela** | Todos os botões têm `aria-label` descritivo. |

Para rodar a verificação automaticamente:

```bash
npm run a11y
```

## Estrutura do projeto

```
src/
├── core/          # Lógica de jogo pura (física, obstáculos, pontuação)
├── state/         # Máquina de estados (menu, running, paused, ...)
├── ui/            # Overlays HTML (menu, pausa, HUD, como jogar)
├── main.js        # Bootstrap e integração
└── styles.css     # CSS modular
```

## Privacidade

- ❌ Sem coleta de dados pessoais
- ❌ Sem `localStorage` / `sessionStorage`
- ❌ Sem analytics, cookies ou rastreamento
- ❌ Sem anúncios ou links externos
- ❌ Sem CDN externo (fontes do sistema, assets locais)

## Documentação das fases

- [Fase 1 — Especificação técnica](./docs/fase-1.md)
- [Fase 2 — Especificação técnica](./docs/fase-2.md)
- [Fase 3 — Especificação técnica](./docs/fase-3.md)
- [Fase 4 — Especificação técnica](./docs/fase-4.md)

## Licença

MIT — veja [LICENSE](./LICENSE).

# 🌳 Floresta Encantada — Jogo 3D no Navegador

> Jogo 3D educativo para crianças de 8 anos. Controle um esquilo na Floresta Mágica, colete nozes coloridas e evite obstáculos amigáveis — tudo rodando direto no navegador.

## Stack

- **Renderização 3D:** [Three.js](https://threejs.org/) (r170+)
- **Build:** [Vite](https://vitejs.dev/) 5+
- **Lint/Format:** ESLint 9 (flat config) + Prettier
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
| `npm run lint` | Linting (ESLint + Prettier) |
| `npm run format` | Formata com Prettier |
| `./deploy.sh` | Deploy para VPS (requer `.env` configurado) |

## Status do projeto

- [x] **Fase 0** — Fundação (Vite + Three.js + ESLint + smoke test)
- [x] **Fase 1** — Jogabilidade mínima (esquilo, tronco, física AABB, input teclado/toque, câmera com lerp)
- [ ] **Fase 2** — Coleta de nozes, pontuação, partículas
- [ ] **Fase 3** — 2 fases, vidas, tela de fim, replay
- [ ] **Fase 4** — UI completa (menu, pausa) + acessibilidade formal (axe-core)
- [ ] **Fase 5** — Áudio (música + efeitos) + mute
- [ ] **Fase 6** — Testes E2E (Playwright) + usabilidade com crianças
- [ ] **Fase 7** — Deploy (VPS + GitHub Pages) + CI/CD

## Controles (Fase 1)

| Ação | Teclado | Toque |
|---|---|---|
| Mover esquerda | ← / A | Swipe esquerda |
| Mover direita | → / D | Swipe direita |
| Pular | ↑ / W / Espaço | Swipe cima |

## Documentação

- [Fase 1 — Especificação técnica](./docs/fase-1.md)

## Licença

MIT — veja [LICENSE](./LICENSE).

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

- [x] **Fase 0** — Fundação (Vite + Three.js + cubo girando — smoke test)
- [ ] **Fase 1** — Core 3D (cena, câmera isométrica, personagem)
- [ ] **Fase 2** — Controles e física AABB
- [ ] **Fase 3** — Nozes, pontuação, áudio, partículas
- [ ] **Fase 4** — Obstáculos, fases, progressão
- [ ] **Fase 5** — UI, som e acessibilidade final
- [ ] **Fase 6** — Deploy e teste final em campo

## Licença

MIT — veja [LICENSE](./LICENSE).

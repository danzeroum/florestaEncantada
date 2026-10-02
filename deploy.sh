#!/usr/bin/env bash
set -euo pipefail

# ── Carregar variáveis do .env se existir ──
if [[ -f .env ]]; then
  # shellcheck disable=SC2046
  export $(grep -v '^#' .env | xargs)
fi

: "${VPS_USER:?Defina VPS_USER no .env}"
: "${VPS_HOST:?Defina VPS_HOST no .env}"
: "${VPS_DEPLOY_PATH:?Defina VPS_DEPLOY_PATH no .env}"
VPS_PORT="${VPS_PORT:-22}"

# ── Build otimizado ──
echo "🏗️  Gerando build otimizado..."
npm run build
echo "✅ Build concluído"

# ── Deploy via rsync ──
echo "🚀 Deployando para ${VPS_USER}@${VPS_HOST}:${VPS_DEPLOY_PATH}"
rsync -avz --delete -e "ssh -p ${VPS_PORT}" ./dist/ "${VPS_USER}@${VPS_HOST}:${VPS_DEPLOY_PATH}/"

# ── Reload do Nginx ──
echo "🔄 Recarregando Nginx na VPS"
ssh -p "${VPS_PORT}" "${VPS_USER}@${VPS_HOST}" "sudo systemctl reload nginx"

echo "🎉 Deploy concluído!"

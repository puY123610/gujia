#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

copy_env_if_missing() {
  local source_file="$1"
  local target_file="$2"

  if [ -f "$source_file" ] && [ ! -f "$target_file" ]; then
    cp "$source_file" "$target_file"
    echo "[created] ${target_file#$ROOT_DIR/}"
  elif [ -f "$target_file" ]; then
    echo "[skip] ${target_file#$ROOT_DIR/} already exists"
  fi
}

bash "$ROOT_DIR/scripts/check-env.sh"

copy_env_if_missing "$ROOT_DIR/backend/pet-nestjs/.env.example" "$ROOT_DIR/backend/pet-nestjs/.env"
copy_env_if_missing "$ROOT_DIR/frontend/pet-uniapp/.env.example" "$ROOT_DIR/frontend/pet-uniapp/.env"
copy_env_if_missing "$ROOT_DIR/admin/pet-admin/.env.example" "$ROOT_DIR/admin/pet-admin/.env"

if [ "${SKIP_INSTALL:-0}" = "1" ]; then
  echo "[skip] pnpm install because SKIP_INSTALL=1"
else
  pnpm install
fi

echo "Next steps:"
echo "  pnpm services:start"
echo "  pnpm generate:types"
echo "  pnpm dev:backend"
echo "  pnpm dev:frontend:h5"
echo "  pnpm dev:admin"

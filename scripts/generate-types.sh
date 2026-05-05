#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm is required to generate OpenAPI TypeScript types."
  exit 1
fi

mkdir -p "$ROOT_DIR/api-contract/generated-types"

if ! pnpm --dir "$ROOT_DIR/api-contract" run generate; then
  echo "Type generation failed. Run 'pnpm install' from the project root, then retry."
  exit 1
fi

echo "Generated api-contract/generated-types/api-types.ts"

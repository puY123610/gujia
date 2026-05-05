#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FAILURES=0

check_command() {
  local name="$1"
  local command_name="$2"

  if command -v "$command_name" >/dev/null 2>&1; then
    local version_output
    if version_output="$("$command_name" --version 2>&1 | head -n 1)"; then
      echo "[ok] $name: $version_output"
    else
      echo "[failed] $name: command '$command_name --version' failed"
      echo "$version_output"
      FAILURES=$((FAILURES + 1))
    fi
  else
    echo "[missing] $name: command '$command_name' not found"
    FAILURES=$((FAILURES + 1))
  fi
}

check_file() {
  local file_path="$1"

  if [ -f "$ROOT_DIR/$file_path" ]; then
    echo "[ok] file: $file_path"
  else
    echo "[missing] file: $file_path"
    FAILURES=$((FAILURES + 1))
  fi
}

check_dir() {
  local dir_path="$1"

  if [ -d "$ROOT_DIR/$dir_path" ]; then
    echo "[ok] dir: $dir_path"
  else
    echo "[missing] dir: $dir_path"
    FAILURES=$((FAILURES + 1))
  fi
}

echo "Checking pet-platform handoff skeleton..."

check_command "Node.js" "node"
check_command "pnpm" "pnpm"
check_command "Docker" "docker"

if command -v docker >/dev/null 2>&1; then
  if docker compose version >/dev/null 2>&1; then
    echo "[ok] Docker Compose: $(docker compose version | head -n 1)"
  else
    echo "[missing] Docker Compose: docker compose plugin not available"
    FAILURES=$((FAILURES + 1))
  fi
fi

check_file "AGENTE.md"
check_file "README.md"
check_file "package.json"
check_file "pnpm-workspace.yaml"
check_file "api-contract/openapi.yaml"
check_file "deploy/docker-compose.yml"
check_file "backend/pet-nestjs/package.json"
check_file "frontend/pet-uniapp/package.json"
check_file "admin/pet-admin/package.json"

check_dir "backend/pet-nestjs/src/common/guards"
check_dir "frontend/pet-uniapp/src/pages/public"
check_dir "admin/pet-admin/src/views"
check_dir "docs"

(cd "$ROOT_DIR" && node -e '
const fs = require("fs");
const files = [
  "package.json",
  "backend/pet-nestjs/package.json",
  "frontend/pet-uniapp/package.json",
  "admin/pet-admin/package.json",
  "api-contract/package.json",
  "backend/pet-nestjs/tsconfig.json",
  "frontend/pet-uniapp/tsconfig.json",
  "admin/pet-admin/tsconfig.json",
  "frontend/pet-uniapp/src/pages.json",
  "frontend/pet-uniapp/src/manifest.json",
  "api-contract/postman_collection.json"
];
for (const file of files) {
  JSON.parse(fs.readFileSync(file, "utf8"));
}
console.log("[ok] JSON files parse successfully:", files.length);
') || FAILURES=$((FAILURES + 1))

if command -v docker >/dev/null 2>&1; then
  if docker compose -f "$ROOT_DIR/deploy/docker-compose.yml" config >/dev/null; then
    echo "[ok] docker-compose config"
  else
    echo "[failed] docker-compose config"
    FAILURES=$((FAILURES + 1))
  fi
fi

if [ "$FAILURES" -gt 0 ]; then
  echo "Environment check failed: $FAILURES issue(s)."
  exit 1
fi

echo "Environment check passed."

#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$ROOT_DIR/deploy/backups}"
POSTGRES_USER="${POSTGRES_USER:-pet_user}"
POSTGRES_DB="${POSTGRES_DB:-pet_platform}"
BACKUP_FILE="$BACKUP_DIR/pet-platform-$(date +%Y%m%d-%H%M%S).sql"

mkdir -p "$BACKUP_DIR"

docker compose -f "$ROOT_DIR/deploy/docker-compose.yml" exec -T postgresql \
  pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > "$BACKUP_FILE"

echo "Backup created: $BACKUP_FILE"

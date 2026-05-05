#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

bash "$ROOT_DIR/scripts/check-env.sh"

docker compose -f "$ROOT_DIR/deploy/docker-compose.yml" up -d --build
docker compose -f "$ROOT_DIR/deploy/docker-compose.yml" ps

echo "Deployment skeleton started. Verify:"
echo "  curl http://localhost:3000/api"
echo "  curl http://localhost:8080/api"

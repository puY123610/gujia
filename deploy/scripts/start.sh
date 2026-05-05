#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

docker compose -f "$ROOT_DIR/deploy/docker-compose.yml" up -d postgresql redis minio
docker compose -f "$ROOT_DIR/deploy/docker-compose.yml" ps

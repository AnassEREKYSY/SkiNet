#!/usr/bin/env bash
# Deploys (or updates) Skinet on the VM. Called by GitHub Actions over SSH, can also be run by hand:
#   cd ~/skinet && IMAGE_TAG=latest ./deploy.sh
# Expects in the environment: GHCR_USER, GHCR_TOKEN, SQL_PASSWORD, STRIPE_* (optional), IMAGE_TAG.
set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/skinet}"
COMPOSE="docker compose -f $APP_DIR/docker-compose.prod.yml --env-file $APP_DIR/.env"

green() { printf '\033[0;32m%s\033[0m\n' "$*"; }
yellow() { printf '\033[1;33m%s\033[0m\n' "$*"; }
red() { printf '\033[0;31m%s\033[0m\n' "$*"; }

cd "$APP_DIR"

command -v docker >/dev/null || { red "Docker is not installed"; exit 1; }
docker compose version >/dev/null 2>&1 || { red "Docker Compose v2 is not installed"; exit 1; }

# 1. Secrets -> .env (readable by the deploy user only). Existing values are kept when a variable is not provided.
touch .env && chmod 600 .env
set_env() {
  local key="$1" value="${2:-}"
  [ -z "$value" ] && return 0
  # Rewrite without sed so any character in a secret (& | / ...) is kept as is.
  { grep -v "^${key}=" .env || true; printf '%s=%s\n' "$key" "$value"; } > .env.tmp
  mv .env.tmp .env && chmod 600 .env
}
set_env IMAGE_TAG "${IMAGE_TAG:-latest}"
set_env SQL_PASSWORD "${SQL_PASSWORD:-}"
set_env STRIPE_PUBLISHABLE_KEY "${STRIPE_PUBLISHABLE_KEY:-}"
set_env STRIPE_SECRET_KEY "${STRIPE_SECRET_KEY:-}"
set_env STRIPE_WEBHOOK_SECRET "${STRIPE_WEBHOOK_SECRET:-}"
set_env CLIENT_PORT "${CLIENT_PORT:-}"
set_env CLIENT_BIND "${CLIENT_BIND:-}"
grep -q '^SQL_PASSWORD=' .env || { red "SQL_PASSWORD is missing (GitHub secret SKINET_SQL_PASSWORD)"; exit 1; }

# 2. Registry login (images are private on GHCR)
if [ -n "${GHCR_TOKEN:-}" ]; then
  echo "$GHCR_TOKEN" | docker login ghcr.io -u "${GHCR_USER:-anasserekysy}" --password-stdin >/dev/null
fi

# 3. Containers from the previous pipeline (plain `docker run`, not compose) would hold the names and port 4200
for c in skinet-api skinet-client; do
  if docker inspect "$c" >/dev/null 2>&1 && [ -z "$(docker inspect -f '{{ index .Config.Labels "com.docker.compose.project" }}' "$c")" ]; then
    yellow "Removing legacy container $c"
    docker rm -f "$c" >/dev/null
  fi
done

# 4. Pull and (re)start
env_get() { grep "^$1=" .env | tail -n1 | cut -d= -f2- || true; }
green "Pulling images (tag: $(env_get IMAGE_TAG))"
$COMPOSE pull
green "Starting the stack"
$COMPOSE up -d --remove-orphans

# 5. Wait for the API (it migrates and seeds the database on first start)
port="$(env_get CLIENT_PORT)"; port="${port:-4200}"
yellow "Waiting for http://127.0.0.1:${port}/api/health ..."
for i in $(seq 1 40); do
  if curl -fsS "http://127.0.0.1:${port}/api/health" >/dev/null 2>&1; then
    green "Skinet is up (API healthy after ~$((i * 5))s)"
    $COMPOSE ps
    docker image prune -f >/dev/null || true
    exit 0
  fi
  sleep 5
done

red "The API did not become healthy in time. Last API logs:"
docker logs --tail 80 skinet-api || true
$COMPOSE ps
exit 1

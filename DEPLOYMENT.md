# Deploying Skinet to the OVH VM

Every push to `main` runs `.github/workflows/ci-cd.yml`:

1. **build**: `dotnet build` of the solution and `npm run build` of the Angular client.
2. **images**: builds `ghcr.io/anasserekysy/skinet-api` and `skinet-client`, tagged `latest` and with the commit SHA.
3. **deploy**: copies `deploy/docker-compose.prod.yml` and `deploy/deploy.sh` to `~/skinet` on the VM over SSH,
   then runs `deploy.sh`, which writes `~/skinet/.env` from the secrets, pulls the images of that exact commit,
   starts SQL Server, Redis, the API and the client, and waits for `/api/health`.

Only the client container is published, on `127.0.0.1:4200`. It serves the Angular app and proxies `/api` and `/hub`
to the API on the internal Docker network. The VM's `reverse-proxy` container (ports 80/443) reaches
`skinet-client` through the shared `web` Docker network and handles the domain and HTTPS.

## GitHub secrets (Settings > Secrets and variables > Actions)

| Secret | Value |
|---|---|
| `OVH_HOST` | VM IP or hostname (already set if you used it before) |
| `OVH_USER` | SSH user (already set) |
| `SSH_PRIVATE_KEY` | private key allowed on the VM (already set) |
| `GHCR_TOKEN` | GitHub token with `write:packages` and `read:packages` (already set) |
| `SKINET_SQL_PASSWORD` | SQL Server `sa` password: 8+ chars with upper, lower, digit and a symbol. Avoid `$ ; ' " \` |
| `SKINET_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` |
| `SKINET_STRIPE_SECRET_KEY` | `sk_test_...` (same Stripe account as the publishable key) |
| `SKINET_STRIPE_WEBHOOK_SECRET` | `whsec_...` from the webhook endpoint below |

Optional repository **variables**: `SKINET_CLIENT_PORT` (default 4200), `SKINET_CLIENT_BIND`
(default `127.0.0.1`; use `0.0.0.0` only if your reverse proxy runs inside a Docker container).

## One-time setup on the VM

1. DNS: an `A` record `skinet` -> the VM IP (gives `skinet.anasserekysy.com`).
2. Reverse proxy: add `deploy/nginx/skinet.conf` to the `reverse-proxy` container's sites
   (`docker inspect reverse-proxy --format '{{range .Mounts}}{{.Source}} -> {{.Destination}}{{println}}{{end}}'`
   shows the folder), reuse the certificate lines of the marketpulse site, then
   `docker exec reverse-proxy nginx -t && docker exec reverse-proxy nginx -s reload`.
3. Stripe webhook: in the Stripe dashboard (test mode) add an endpoint `https://<domain>/api/payments/webhook`
   listening to `payment_intent.succeeded` and `payment_intent.payment_failed`; put its signing secret in
   `SKINET_STRIPE_WEBHOOK_SECRET`.

## Useful commands on the VM

```bash
cd ~/skinet
docker compose -f docker-compose.prod.yml --env-file .env ps
docker logs -f skinet-api
IMAGE_TAG=latest ./deploy.sh          # redeploy by hand
```

The database lives in the `skinet_sql-data` volume; it survives redeploys. On the first start the API runs the
EF Core migrations and seeds products, delivery methods and the demo users.

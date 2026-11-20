# Danamo deployment

Production runs on the shared VPS as its own Docker Compose project in
`/opt/danamo`, behind the shared Caddy edge. Images are built by GitHub
Actions (`.github/workflows/docker-publish.yml`) and pulled from GHCR.

| File | Where it goes on the VPS |
|---|---|
| `docker-compose.yml` | `/opt/danamo/docker-compose.yml` |
| `.env.example` | copy to `/opt/danamo/.env`, fill in, `chmod 600` |
| `danamo.caddy` | `/opt/caddy-sites/danamo.caddy` (source of truth for Danamo's site block) |
| `danamo-guard.sh` | `/opt/caddy-sites/danamo-guard.sh` |
| `systemd/danamo-edge-guard.{service,timer}` | `/etc/systemd/system/` |

## How the shared edge works on this host

`sms-caddy` (ShuleHQ's container) is the only thing on ports 80/443. Its
config is the single file `/opt/shulehq/Caddyfile`; there is no directory
import. Each tenant therefore:

1. puts its public containers on its own edge network (`danamo-edge-net`) and
   attaches `sms-caddy` to it (`docker network connect`);
2. keeps its site block in `/opt/caddy-sites/<tenant>.caddy` and appends it
   to the shared Caddyfile;
3. reloads Caddy from a staged copy in `/opt/caddy-sites/.state/` (the
   single-file bind mount goes stale when ShuleHQ replaces the file);
4. runs a guard every minute (`danamo-edge-guard.timer`) that re-does 1–3
   after a ShuleHQ deploy wipes them.

## Containers

| Service | Host binding | Notes |
|---|---|---|
| frontend | 127.0.0.1:3001 (smoke tests) | Next.js — public site + admin (by host); Caddy upstream `danamo-frontend:3000` |
| backend | 127.0.0.1:8001 (smoke tests) | FastAPI, 2 workers; Caddy upstream `danamo-backend:8000` |
| postgres | none | volume `danamo_pgdata` |
| redis | none | rate-limit counters only, no persistence |

Uploads (CVs, images) live in the `danamo_uploads` volume
(`/var/lib/docker/volumes/danamo_uploads/_data`).

## First deploy

```bash
cd /opt/danamo
docker compose pull
docker compose up -d postgres redis
docker compose run --rm backend alembic upgrade head
docker compose up -d
docker compose run --rm backend python -m app.cli.create_admin --email <admin email>
curl -fsS http://127.0.0.1:8001/api/v1/health
```

## Edge routing (first time)

```bash
sudo install -m 664 -o deploy -g deploy danamo.caddy /opt/caddy-sites/danamo.caddy
sudo install -m 775 -o deploy -g deploy danamo-guard.sh /opt/caddy-sites/danamo-guard.sh
/opt/caddy-sites/danamo-guard.sh && tail -1 /opt/caddy-sites/danamo-guard.log   # attaches network, appends, validates, reloads
sudo install -m 644 systemd/danamo-edge-guard.* /etc/systemd/system/
sudo systemctl daemon-reload && sudo systemctl enable --now danamo-edge-guard.timer
```

## Update to a new build

```bash
cd /opt/danamo
# optional: pin a build, e.g. IMAGE_TAG=sha-8782070 in .env
docker compose pull
docker compose run --rm backend alembic upgrade head
docker compose up -d
```

Then, from a checkout of this repo (any machine):

```bash
./deploy/warm.sh       # refresh every page's cache; checks sitemap + llms.txt are complete
./deploy/indexnow.sh   # if content changed: ask Bing & co. to re-crawl
```

## Roll back

Set `IMAGE_TAG` in `.env` to the previous `sha-<short>` tag, then
`docker compose up -d`.

## Remove Danamo completely

```bash
sudo systemctl disable --now danamo-edge-guard.timer
sudo rm /etc/systemd/system/danamo-edge-guard.* /opt/caddy-sites/danamo-guard.sh /opt/caddy-sites/danamo.caddy
# remove the Danamo block (from the "── DANAMO TECH" comment to the end of the
# api.danamotech.co.ke block) from /opt/shulehq/Caddyfile, then validate +
# reload from a staged copy as danamo-guard.sh does
docker network disconnect danamo-edge-net sms-caddy
cd /opt/danamo && docker compose down          # add -v ONLY to also delete data
```

## Safety rules on this host

- Only touch `danamo-*` containers, volumes and networks.
- Never edit other tenants' Caddy files or blocks. Danamo only appends its own
  block to the shared Caddyfile (as every tenant does) and owns `danamo.caddy`,
  `danamo-guard.sh` and `danamo-edge-guard.*`.
- Never run `docker system/image/volume prune`.
- Bind only to 127.0.0.1.

## Local production-like run

```bash
cd deploy
cp .env.example .env   # set CONTAINER_PREFIX=danamo-local, local origins, COOKIE_SECURE=false
docker compose -f docker-compose.yml -f docker-compose.build.yml up -d --build
docker compose run --rm backend alembic upgrade head
```

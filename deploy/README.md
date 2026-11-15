# Danamo deployment

Production runs on the shared VPS as its own Docker Compose project in
`/opt/danamo`, behind the shared Caddy edge. Images are built by GitHub
Actions (`.github/workflows/docker-publish.yml`) and pulled from GHCR.

| File | Where it goes on the VPS |
|---|---|
| `docker-compose.yml` | `/opt/danamo/docker-compose.yml` |
| `.env.example` | copy to `/opt/danamo/.env`, fill in, `chmod 600` |
| `danamo.caddy` | `/opt/caddy-sites/danamo.caddy` |

## Containers

| Service | Host binding | Notes |
|---|---|---|
| frontend | 127.0.0.1:3001 | Next.js — public site + admin console (by host) |
| backend | 127.0.0.1:8001 | FastAPI, 2 workers |
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

## Update to a new build

```bash
cd /opt/danamo
# optional: pin a build, e.g. IMAGE_TAG=sha-8782070 in .env
docker compose pull
docker compose run --rm backend alembic upgrade head
docker compose up -d
```

## Roll back

Set `IMAGE_TAG` in `.env` to the previous `sha-<short>` tag, then
`docker compose up -d`.

## Remove Danamo completely

```bash
cd /opt/danamo && docker compose down          # add -v ONLY to also delete data
sudo rm /opt/caddy-sites/danamo.caddy
docker exec sms-caddy caddy reload --config /etc/caddy/Caddyfile   # confirm config path in Phase E
```

## Safety rules on this host

- Only touch `danamo-*` containers, volumes and networks.
- Never edit other tenants' Caddy files; Danamo owns only `danamo.caddy`.
- Never run `docker system/image/volume prune`.
- Bind only to 127.0.0.1.

## Local production-like run

```bash
cd deploy
cp .env.example .env   # set CONTAINER_PREFIX=danamo-local, local origins, COOKIE_SECURE=false
docker compose -f docker-compose.yml -f docker-compose.build.yml up -d --build
docker compose run --rm backend alembic upgrade head
```

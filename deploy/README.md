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
./deploy/cf-purge.sh   # only once Cloudflare proxies the site (see below); needs CF_API_TOKEN + CF_ZONE_ID
./deploy/warm.sh       # refresh every page's cache; checks sitemap + llms.txt are complete
./deploy/indexnow.sh   # if content changed: ask Bing & co. to re-crawl
```

## Cloudflare proxy (speed for visitors in Kenya)

### Why

Measured 2026-11-20. The server itself is fast:

| Path | TTFB |
| --- | --- |
| On the VPS, `curl http://127.0.0.1:3001/` (Next.js, prerendered `/`) | 7–16 ms |
| On the VPS, through Caddy over HTTPS (`--resolve danamotech.co.ke:443:127.0.0.1`) | 40–150 ms |
| From Kenya (wired), public URL | 0.9–1.35 s (TCP connect 0.33–0.54 s, TLS done at 0.72–1.12 s) |
| From a phone in Mombasa (browser) | 3.1 s TTFB, 13.5 s DOMContentLoaded |

The host is not the problem: the load average is about 1 on 4 cores, 4.4 GB RAM
is free, and the shared ShuleHQ Caddy adds well under 150 ms. The time goes on
the network. Round trips from Kenya to the VPS take 170–270 ms (more on mobile
data), and a new visitor needs 3–4 of them (DNS, TCP, TLS, then the request)
before the first byte. Then each JavaScript file crosses the same distance,
which is why DOMContentLoaded is so late on a phone.

Cloudflare has data centres in Mombasa and Nairobi. With the proxy on, TCP and
TLS finish a few milliseconds away from the visitor, cached pages and files are
served from there, and only cache misses travel to the VPS, over a connection
Cloudflare keeps open. Target: TTFB < 600 ms and mobile LCP < 2.5 s.

### What Next.js already tells caches (no app change needed)

| Response | `Cache-Control` from Next.js |
| --- | --- |
| Static pages (`/`, `/services/*`, `/about`, …) | `s-maxage=31536000` (shared caches: 1 year; browsers revalidate) |
| ISR pages (`/projects`, `/blog`, `/careers`) | `s-maxage=60, stale-while-revalidate=…` |
| `/sitemap.xml`, `/robots.txt`, `/favicon.ico`, public images | `public, max-age=0, must-revalidate` |
| `/llms.txt` | `public, max-age=3600` |
| `/_next/static/*` | `public, max-age=31536000, immutable` |
| `/_next/image?…` | `public, max-age=14400, must-revalidate` (`Vary: Accept`) |
| 404s, per-user pages | `private, no-cache, no-store, …` |

So Cloudflare can simply respect the origin. The one consequence: **static
HTML stays at the edge until it is purged**, so `cf-purge.sh` is a required
step after every deploy (see "Update to a new build"). Admin edits to blog
posts, projects and jobs show up within about two minutes without a purge
(ISR, 60 s).

### Settings to click (Cloudflare dashboard → danamotech.co.ke)

Do these **before** turning the proxy on. They have no effect while records are DNS-only.

**SSL/TLS → Overview**
- Encryption mode: **Full (strict)**. Caddy already has valid Let's Encrypt
  certificates for every hostname, so strict validation passes.

**SSL/TLS → Edge Certificates**
- Always Use HTTPS: **Off**. Caddy already redirects HTTP to HTTPS. Leaving it
  off lets Let's Encrypt's HTTP-01 check reach Caddy on port 80 (see
  "Certificates" below).
- HSTS: leave **off** here. Caddy already sends `Strict-Transport-Security`.
- Minimum TLS Version: **1.2**. TLS 1.3: **On**. Automatic HTTPS Rewrites: On.

**Speed → Optimization**
- Protocol optimization: HTTP/2 to origin **On**, HTTP/3 (with QUIC) **On**, 0-RTT **On**.
- Content optimization: Brotli **On**, Rocket Loader **Off** (it rewrites
  script tags and breaks React hydration), Early Hints Off.

**Scrape Shield**
- Email Address Obfuscation: **Off**. It rewrites `mailto:` links in the HTML,
  which then no longer matches what React renders (hydration errors on the
  contact section and footer).

**Security → Bots** (the AI-visibility work depends on these)
- Block AI bots: **Do not block**. AI Labyrinth: **Off**.
- Managed robots.txt: **Off**. It would add `Disallow` rules for AI crawlers
  to our robots.txt.
- Bot Fight Mode: **Off**. It challenges crawlers that Cloudflare has not verified.

**Caching → Configuration**
- Browser Cache TTL: **Respect Existing Headers**.
- Crawler Hints: **On**. This sends IndexNow pings to search engines when cached content changes.

**Caching → Cache Rules**. Create them in this order. Every matching rule
applies, and a later rule overrides an earlier one, so the bypass rule must be **last**.

1. *Next.js static files*
   - Expression: `(http.host eq "danamotech.co.ke" and starts_with(http.request.uri.path, "/_next/static/"))`
   - Eligible for cache. Edge TTL: **Use cache-control header if present, bypass cache if not**. Browser TTL: **Respect origin TTL**.
2. *Optimised and uploaded images*
   - Expression: `(http.host eq "danamotech.co.ke" and (starts_with(http.request.uri.path, "/_next/image") or starts_with(http.request.uri.path, "/uploads/")))`
   - Eligible for cache. Edge TTL: **Use cache-control header if present, bypass cache if not**. Browser TTL: **Respect origin TTL**.
     Cache key: keep the default, which includes the query string (`url`, `w` and `q` select the image).
   - Note: Next.js picks WebP or JPEG from the `Accept` header, and Cloudflare
     ignores that `Vary`. Every browser in use today accepts WebP, so this is safe.
3. *HTML pages (respect Next.js)*
   - Expression:
     ```
     (http.host eq "danamotech.co.ke" and not starts_with(http.request.uri.path, "/_next/") and not starts_with(http.request.uri.path, "/uploads/") and not starts_with(http.request.uri.path, "/api/") and not starts_with(http.request.uri.path, "/.well-known/"))
     ```
   - Eligible for cache. Edge TTL: **Use cache-control header if present, bypass cache if not**.
     Browser TTL: **Respect origin TTL**.
   - The result: static pages are cached until purged, ISR pages for 60 s,
     `no-store` responses (404s) are never cached, and responses that set a
     cookie are not cached.
4. *Bypass Next.js navigation requests* (last)
   - Custom filter expression:
     ```
     (http.host eq "danamotech.co.ke" and (any(http.request.headers.names[*] eq "rsc") or any(http.request.headers.names[*] eq "next-router-prefetch") or any(http.request.headers.names[*] eq "next-router-state-tree") or http.request.uri.query contains "_rsc"))
     ```
   - Cache eligibility: **Bypass cache**.
   - Why: these responses vary on request headers, and Cloudflare ignores
     `Vary`. Caching them could serve raw React data instead of a page.

**API token for `cf-purge.sh`**: My Profile → API Tokens → Create Token →
Custom: permission **Zone → Cache Purge → Purge**, zone resources
**Include → danamotech.co.ke**. Keep it in your password manager. Never commit it.

**DNS** (last step)
- `danamotech.co.ke` (A) and `www`: switch to **Proxied** (orange cloud).
- `admin` and `api`: leave **DNS only** (grey) for now. The API's rate limits
  key on the visitor's IP. Behind the proxy, Caddy would see Cloudflare's IPs
  instead, and visitors sharing a Cloudflare data centre would share one limit.
  Neither host needs edge caching. (Proxying them later needs Caddy
  `trusted_proxies` for Cloudflare's ranges first.)

### Certificates (Caddy HTTP-01) behind the proxy

Danamo's certificates are Let's Encrypt, issued and renewed by the shared
`sms-caddy` through HTTP-01/TLS-ALPN-01. (The ShuleHQ wildcard uses DNS-01
with its own token and is not affected.) Behind the orange cloud:

- **HTTP-01 keeps working**: Let's Encrypt fetches
  `http://danamotech.co.ke/.well-known/acme-challenge/<token>`, Cloudflare
  forwards plain HTTP to Caddy on port 80, and Caddy answers before its HTTPS
  redirect. This needs *Always Use HTTPS* **off**, and none of the cache rules
  above may match `/.well-known/` (rule 3 excludes it).
- **TLS-ALPN-01 stops working**, because Cloudflare terminates TLS. Caddy tries
  the other challenge type when one fails, so renewal still succeeds through
  HTTP-01.
- **Full (strict)** needs the origin certificate to stay valid. Caddy renews
  well before expiry, so it does. The next renewal window for
  danamotech.co.ke opens around **14 January 2027**. Check that it went through:
  `docker logs sms-caddy 2>&1 | grep -i 'danamotech' | grep -i 'obtained\|error'`.
- Fallback if HTTP-01 ever fails behind the proxy: switch the record back to
  DNS only, let Caddy renew, then switch it back on. (A Cloudflare Origin CA certificate would
  remove ACME entirely, but it changes the shared Caddy setup, so only with GO.)

### Verify after switching on

```bash
curl -sI https://danamotech.co.ke/ | grep -iE 'server|cf-cache-status|cache-control'
# 1st: cf-cache-status: MISS (or EXPIRED), 2nd: HIT, server: cloudflare
curl -sI https://danamotech.co.ke/ | grep -i cf-cache-status
# RSC requests must bypass:
curl -s -o /dev/null -D - -H 'RSC: 1' https://danamotech.co.ke/ | grep -iE 'cf-cache-status|location'
# HTTP still reaches Caddy (via: 1.1 Caddy, 308 from Caddy, not a Cloudflare 301):
curl -s -o /dev/null -D - http://danamotech.co.ke/.well-known/acme-challenge/test | grep -iE '^HTTP|via|location'
# AI crawlers still allowed:
curl -s -o /dev/null -w '%{http_code}\n' -A 'GPTBot/1.1' https://danamotech.co.ke/
curl -s https://danamotech.co.ke/robots.txt   # must be unchanged (no Cloudflare-added rules)
./deploy/warm.sh
```

Rollback: switch both records back to DNS only. The change takes effect within a minute, and nothing on the VPS changes.

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

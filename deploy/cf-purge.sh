#!/usr/bin/env bash
# Purge Cloudflare's cache for danamotech.co.ke. Run after every deploy,
# BEFORE warm.sh, once the site is proxied by Cloudflare (orange cloud).
#
# Why: Next.js sends static pages with `s-maxage=31536000`, so Cloudflare
# keeps the HTML for up to a year. Without a purge, visitors would get the
# old HTML pointing at /_next/static files that the new build no longer has.
#
# Needs an API token with only "Zone > Cache Purge" on danamotech.co.ke:
#   CF_API_TOKEN=... CF_ZONE_ID=... ./deploy/cf-purge.sh
# (Zone ID: Cloudflare dashboard > danamotech.co.ke > Overview, right column.)
# Never commit the token.
set -euo pipefail
: "${CF_API_TOKEN:?set CF_API_TOKEN (Zone > Cache Purge)}"
: "${CF_ZONE_ID:?set CF_ZONE_ID}"

resp=$(curl -fsS -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}')

if printf '%s' "$resp" | grep -q '"success":[[:space:]]*true'; then
  echo "Cloudflare cache purged."
else
  echo "Purge failed: $resp" >&2
  exit 1
fi

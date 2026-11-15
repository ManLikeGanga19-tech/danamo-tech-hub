#!/usr/bin/env bash
# Danamo shared-Caddy edge self-healing guard. Installed at
# /opt/caddy-sites/danamo-guard.sh; run every minute by danamo-edge-guard.timer.
#
# A ShuleHQ deploy recreates sms-caddy and rewrites /opt/shulehq/Caddyfile,
# which drops Danamo's network attachment and site block. This re-attaches
# danamo-edge-net and re-appends /opt/caddy-sites/danamo.caddy, then validates
# and reloads Caddy. Idempotent; does nothing when everything is in place.
# Same pattern as usafe-guard.sh (block < 4 KB, so the O_APPEND is atomic;
# reload is validate-gated and uses a staged copy because the single-file bind
# mount /etc/caddy/Caddyfile goes stale when ShuleHQ replaces the file).
set -uo pipefail
CADDY=/opt/shulehq/Caddyfile
SITE=/opt/caddy-sites/danamo.caddy
LOG=/opt/caddy-sites/danamo-guard.log
STATE=/opt/caddy-sites/.state
LOCK="$STATE/danamo-guard.lock"
CANDIDATE="$STATE/danamo-candidate.Caddyfile"
NET=danamo-edge-net
EDGE=sms-caddy
MARKER="api.danamotech.co.ke {"
mkdir -p "$STATE"
exec 9>"$LOCK" || exit 0
flock -n 9 || exit 0
ts(){ date -u +%Y-%m-%dT%H:%M:%SZ; }
healed=0; why=""

if ! docker inspect -f '{{range $k,$v := .NetworkSettings.Networks}}{{$k}} {{end}}' "$EDGE" 2>/dev/null | grep -qw "$NET"; then
  docker network connect "$NET" "$EDGE" 2>/dev/null && { healed=1; why="network "; }
fi
if ! grep -qF "$MARKER" "$CADDY" 2>/dev/null; then
  if [ -r "$SITE" ]; then printf "\n" >> "$CADDY"; cat "$SITE" >> "$CADDY"; healed=1; why="${why}config "; fi
fi
[ "$healed" = 1 ] || exit 0

if [ "$(docker inspect -f '{{.State.Running}}' "$EDGE" 2>/dev/null)" != "true" ]; then
  echo "$(ts) DEFERRED (${why}) — $EDGE not running" >> "$LOG"; exit 0
fi
cp "$CADDY" "$CANDIDATE" 2>/dev/null || { echo "$(ts) STAGE FAILED" >> "$LOG"; exit 0; }
if docker exec "$EDGE" caddy validate --adapter caddyfile --config /etc/caddy/sites/.state/danamo-candidate.Caddyfile >/dev/null 2>&1; then
  if docker exec "$EDGE" caddy reload --adapter caddyfile --config /etc/caddy/sites/.state/danamo-candidate.Caddyfile >/dev/null 2>&1; then
    echo "$(ts) HEALED (${why})" >> "$LOG"
  else
    echo "$(ts) RELOAD FAILED (${why})" >> "$LOG"
  fi
else
  echo "$(ts) VALIDATE FAILED after re-append (${why})" >> "$LOG"
fi

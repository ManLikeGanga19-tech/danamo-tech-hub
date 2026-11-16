#!/usr/bin/env bash
# Tell Bing (and other IndexNow engines: Yandex, Seznam, Naver) that the site's
# pages changed, so they re-crawl now instead of eventually. Bing's index feeds
# ChatGPT search and Microsoft Copilot. Run after a deploy that changes content:
#   ./deploy/indexnow.sh
# The key is public by design: Bing checks it at https://danamotech.co.ke/51519a5b860999424230a46f1ca9f331.txt
set -euo pipefail
HOST="danamotech.co.ke"
KEY="51519a5b860999424230a46f1ca9f331"
URLS=$(curl -fsS "https://$HOST/sitemap.xml" | grep -o '<loc>[^<]*</loc>' | sed 's/<[^>]*>//g')
JSON=$(python3 -c 'import json,sys; print(json.dumps({"host":sys.argv[1],"key":sys.argv[2],"keyLocation":f"https://{sys.argv[1]}/{sys.argv[2]}.txt","urlList":sys.stdin.read().split()}))' "$HOST" "$KEY" <<<"$URLS")
echo "Submitting $(wc -w <<<"$URLS") URLs to IndexNow..."
curl -sS -o /dev/null -w "IndexNow response: %{http_code} (200/202 = accepted)\n" \
  -H "Content-Type: application/json; charset=utf-8" -d "$JSON" https://api.indexnow.org/indexnow

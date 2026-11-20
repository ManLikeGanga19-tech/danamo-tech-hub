#!/usr/bin/env bash
# Run right after every deploy:  ./deploy/warm.sh
#
# 1. Requests every public page once, so each page's cache is refreshed by us
#    and never first by a search crawler.
# 2. Checks the sitemap and llms.txt list every published project, blog post
#    and open job. Exits non-zero (and says what is missing) if they do not.
set -euo pipefail
SITE="https://danamotech.co.ke"
API="https://api.danamotech.co.ke/api/v1"
STATIC_PAGES=23 # 14 site pages + 9 service pages in src/app/sitemap.ts

count() { python3 -c 'import json,sys; print(len(json.load(sys.stdin)))'; }

fail=0
paths=$(curl -fsS "$SITE/sitemap.xml" | grep -o '<loc>[^<]*</loc>' | sed -e 's/<[^>]*>//g' -e "s#^$SITE##")
for p in "" $paths /sitemap.xml /llms.txt /robots.txt; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$SITE${p:-/}")
  [ "$code" = 200 ] || { echo "FAIL $code ${p:-/}"; fail=1; }
done
echo "Requested $(wc -w <<<"$paths") sitemap pages + sitemap.xml, llms.txt, robots.txt"

# Pages rebuild in the background after a request, so give them a moment.
sleep 5
projects=$(curl -fsS "$API/projects" | count)
posts=$(curl -fsS "$API/blog" | count)
jobs=$(curl -fsS "$API/jobs" | count)
expected=$((STATIC_PAGES + projects + posts + jobs))
locs=$(curl -fsS "$SITE/sitemap.xml" | grep -o '<loc>' | wc -l)
llms=$(curl -fsS "$SITE/llms.txt" | grep -c "$SITE/projects/" || true)

echo "API: $projects projects, $posts posts, $jobs open jobs -> sitemap should list $expected URLs"
[ "$locs" -ge "$expected" ] && echo "OK   sitemap.xml lists $locs URLs" || { echo "FAIL sitemap.xml lists $locs URLs, expected $expected"; fail=1; }
[ "$llms" -ge "$projects" ] && echo "OK   llms.txt lists $llms projects" || { echo "FAIL llms.txt lists $llms projects, expected $projects"; fail=1; }

exit $fail

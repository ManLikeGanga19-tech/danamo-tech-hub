# Danamo Tech Hub

Website, admin console and API for **[Danamo Tech](https://danamotech.co.ke)** — a technology
company headquartered in Mombasa, Kenya, founded in 2024 to bridge the technology gap for small
businesses and startups with affordable web, software and digital solutions.

| | URL |
|---|---|
| Public site | https://danamotech.co.ke |
| Admin console | https://admin.danamotech.co.ke |
| API | https://api.danamotech.co.ke/api/v1/health |

## What's in this repo

| Path | What |
|---|---|
| `src/app/(site)/` | Public website (Next.js App Router): services, projects and case studies, careers, webinars, blog, legal pages |
| `src/app/admin/` | Admin console — a separate root layout and theme, served on `admin.` by `src/proxy.ts` |
| `backend/` | FastAPI API: contact and inquiry forms, careers with CV upload, newsletter, webinars, projects, partners, admin auth |
| `deploy/` | Production Docker Compose stack, Caddy site block, edge guard and runbook |
| `.github/workflows/` | Builds and publishes the frontend and backend images to GHCR |

## Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS, Radix UI
- **Backend:** FastAPI, SQLAlchemy 2 (async), Alembic, PostgreSQL 16, Redis (rate limiting)
- **Email:** Resend (transactional confirmations and team notifications)
- **Infrastructure:** Docker Compose behind Caddy (automatic HTTPS), images on GHCR

Security highlights: per-IP rate limiting on every API route (stricter on auth, forms and
uploads), uploads validated by file signature, CVs never publicly served, Argon2 password
hashing, httpOnly `Secure` `SameSite=Strict` admin sessions, and an admin console that is
unreachable from the public domain.

## Local development

```bash
# Database
cd backend && docker compose up -d          # Postgres for development

# API (http://localhost:8000)
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
cp .env.example .env                        # set DATABASE_URL etc.
.venv/bin/alembic upgrade head
.venv/bin/uvicorn app.main:app --reload

# Website + admin (http://localhost:3000, admin at http://admin.localhost:3000)
cd .. && npm install && npm run dev
```

Create an admin account:

```bash
cd backend && .venv/bin/python -m app.cli.create_admin --email you@example.com
```

Checks: `npm run lint`, `npm run typecheck`, `npm run build`.

## Deployment

Every push to `main` builds `ghcr.io/manlikeganga19-tech/danamo-{frontend,backend}` tagged
`sha-<commit>`. Production pins a tag in `/opt/danamo/.env`; see
[deploy/README.md](deploy/README.md) for first deploy, updates, rollback and the shared-edge setup.

## Contact

hello@danamotech.co.ke · Mombasa, Kenya

© Danamo Tech. All rights reserved.

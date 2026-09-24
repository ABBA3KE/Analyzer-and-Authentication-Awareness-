# SecurePoly — Password Strength Analyser & Authentication Awareness System

An educational web application that helps polytechnic students understand password
security, safely analyse password strength, learn authentication best practices,
complete quizzes, and track their cybersecurity awareness over time.

This is an **educational** system. It does not perform password cracking, brute-force
attacks, phishing, or unauthorized access of any kind.

## Features

- **Client-side password strength analyser** — runs entirely in the browser. Passwords
  typed into it are never sent to the server, logged, or stored.
- Authentication awareness modules covering MFA, phishing, credential stuffing, secure
  recovery, and more.
- Pre-test / post-test awareness assessments with progress tracking.
- Interactive quizzes with per-question explanations.
- Student dashboard with module progress, quiz history, and awareness trends.
- Admin panel for managing students, modules, lessons, quizzes, and questions, plus
  aggregate analytics. Admins can never see student passwords or analyser input.
- Secure authentication: Argon2id password hashing, HTTP-only session cookies, rate
  limiting on auth endpoints, generic error messages to prevent user enumeration.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router, Recharts, Lucide icons |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB via Mongoose ODM |
| Validation | Zod |
| Testing | Vitest (unit), Playwright (E2E) |

## Project structure

```
apps/
  api/            Express + Mongoose backend
    src/
      config/     env, MongoDB connection
      controllers/
      middleware/ auth, error handling, rate limiting
      models/     Mongoose schemas (User, LearningModule, Quiz, ...)
      routes/
      services/
      validators/ Zod schemas
      utils/
      seed.ts     development seed data
  web/            React + Vite frontend
    src/
      components/ layout + reusable UI
      hooks/      auth context
      lib/        passwordAnalyzer.ts (client-side only), commonPasswords.ts
      pages/      public / student / admin route pages
      services/   API fetch wrapper
      types/
docs/             architecture, database, API, and security notes
```

## Prerequisites

- Node.js 20+
- A running MongoDB instance (local install, Docker, or a hosted cluster e.g. MongoDB Atlas)

## 1. Install dependencies

From the project root (uses npm workspaces):

```bash
npm install
```

## 2. Configure environment variables

```bash
cp apps/api/.env.example apps/api/.env
```

Edit `apps/api/.env` and set:

- `MONGODB_URI` — your MongoDB connection string
- `JWT_SECRET` — a long random string (e.g. `openssl rand -hex 32`)

If you don't have MongoDB running locally, the quickest option is Docker:

```bash
docker run --name securepoly-mongo -p 27017:27017 -d mongo:7
```

That matches the default `MONGODB_URI` in `.env.example`
(`mongodb://127.0.0.1:27017/psa_db`).

## 3. Seed development data

MongoDB is schemaless, so there's no migration step — just seed:

```bash
npm run db:seed
```

This creates demo accounts (clearly marked as seed/demo data, not real students):

- **Admin:** `admin@localhost.test` / `Admin-Demo-2026!`
- **Student:** `student@localhost.test` / `Student-Demo-2026!`

Plus 8 learning modules (5 lessons each), 10 quiz questions, and sample quiz/assessment
history for the demo student. The script clears existing content collections first, so
it's safe to re-run.

## 4. Run the app

In two terminals:

```bash
npm run dev:api   # http://localhost:4000
npm run dev:web   # http://localhost:5173
```

Open http://localhost:5173. The Vite dev server proxies `/api` requests to the backend
(see `apps/web/vite.config.ts`), so no CORS configuration is needed locally.

## 5. Run tests

```bash
npm test                                   # unit tests (both apps)
npm run test --workspace apps/web          # frontend unit tests only
npm run test --workspace apps/api          # backend unit tests only
npx playwright install                     # first time only
npx playwright test --config apps/web/playwright.config.ts   # E2E (needs both servers + Mongo running)
```

## 6. Production build

```bash
npm run build
```

Builds the API to `apps/api/dist` and the web app to `apps/web/dist`. Serve the web
build with any static host, and run the API with `node apps/api/dist/index.js`
(set `NODE_ENV=production` and real secrets in the environment).

## Security notes

- Password analyser input never leaves the browser — verified by an automated
  Playwright test that inspects every outgoing network request. See
  `apps/web/e2e/critical-flows.spec.ts`.
- Passwords are hashed with Argon2id; plaintext passwords are never stored or logged.
- Admin endpoints require both a valid session and the `ADMIN` role
  (`requireAuth` + `requireAdmin` middleware).
- Auth endpoints are rate-limited to slow brute-force and credential-stuffing attacks.
- All user input is validated with Zod before touching the database.
- The `passwordHash` field is declared `select: false` on the Mongoose `User` schema,
  so it is excluded from every query by default; it must be explicitly requested
  (`.select("+passwordHash")`), which only the login flow does.
- See `docs/security.md` for the full list of security requirements and how each is met.

## Academic documentation

See the `docs/` folder for architecture, database design, API reference, and the
security design notes referenced in this project's write-up.

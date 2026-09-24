# System Architecture

## Problem statement

Polytechnic students frequently reuse weak, predictable passwords and have limited
exposure to authentication security concepts (MFA, phishing, credential stuffing).
This increases the risk of account compromise for academic and personal accounts.

## Aim

To design and implement a web-based system that helps polytechnic students analyse
password strength safely, learn authentication security concepts, and measure their
improvement in cybersecurity awareness.

## Objectives

1. Provide an in-browser password strength analyser that never transmits or stores
   entered passwords.
2. Deliver structured learning modules on password and authentication security.
3. Assess student understanding through pre-test/post-test and topic quizzes.
4. Give students a dashboard to track their own progress.
5. Give administrators tools to manage content and view aggregate (non-identifying,
   password-free) analytics.
6. Implement the system using secure-by-default authentication and data-handling
   practices throughout.

## Functional requirements

- Student registration/login/logout with a hashed-password auth scheme.
- Client-side password analysis with a heuristic 0–100 score and explanations.
- CRUD management of learning modules, lessons, quizzes, and questions (admin).
- Quiz-taking with per-question feedback after submission.
- Pre-test/post-test tracking with score-over-time reporting.
- Role-based routing so students and admins see only their own areas.

## Non-functional requirements

- **Security**: hashed passwords (Argon2id), HTTP-only session cookies, rate limiting,
  input validation, no plaintext secrets in the codebase.
- **Privacy**: password analyser input never leaves the client.
- **Usability**: WCAG 2.1 AA-oriented design — semantic HTML, visible focus states,
  labelled form controls, adequate contrast.
- **Responsiveness**: usable from 360px mobile widths up to 1440px desktop.
- **Maintainability**: typed end-to-end (TypeScript + Zod + Mongoose), clear layer
  separation (routes → controllers → services → Mongoose models).

## High-level architecture

```
┌──────────────────┐        HTTPS (cookies)        ┌──────────────────────┐
│   React SPA       │ ─────────────────────────────▶ │  Express API          │
│  (Vite, Tailwind)  │ ◀───────────────────────────── │  (TypeScript)          │
│                    │                                │                        │
│  passwordAnalyzer  │  (never calls the API)         │  auth / student /      │
│  runs locally      │                                │  admin route groups    │
└──────────────────┘                                └──────────┬─────────────┘
                                                                  │ Mongoose ODM
                                                                  ▼
                                                        ┌──────────────────────┐
                                                        │  MongoDB               │
                                                        └──────────────────────┘
```

The frontend and backend are separate deployable apps (`apps/web`, `apps/api`),
communicating only over the REST API described in `docs/api.md`. The password
analyser (`apps/web/src/lib/passwordAnalyzer.ts`) is a pure, side-effect-free module
with no `fetch` calls — it is deliberately isolated from `services/api.ts` to make
this guarantee easy to audit and to test (see `apps/web/e2e/critical-flows.spec.ts`).

## Evaluation methodology

Because this is an academic project, evaluation should compare pre-test and post-test
`AwarenessAssessment` scores for real students who use the platform over a defined
period, alongside qualitative feedback. No results should be fabricated — the schema
only stores scores that were actually submitted through the assessment flow.

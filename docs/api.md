# API Reference

Base path: `/api`. All authenticated routes require the `psa_session` HTTP-only
cookie set by `/auth/login` or `/auth/register`.

## Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Create a student account |
| POST | `/auth/login` | — | Log in, sets session cookie |
| POST | `/auth/logout` | — | Clears session cookie |
| GET | `/auth/me` | session | Current user + profile |

Registration and login are rate-limited (10 requests / 15 minutes / IP) and return
generic error messages that don't reveal whether an email exists.

## Student (requires `STUDENT` or `ADMIN` session)

| Method | Path | Description |
|---|---|---|
| GET | `/student/profile` | Get own profile |
| PUT | `/student/profile` | Update own profile |
| GET | `/student/modules` | List published modules |
| GET | `/student/modules/:id` | Module detail with lessons + quizzes |
| POST | `/student/modules/:id/progress` | Update own module completion % |
| GET | `/student/quizzes/:id` | Quiz questions (answers withheld) |
| POST | `/student/quizzes/:id/attempt` | Submit answers, get scored result |
| POST | `/student/assessments` | Submit a pre-test/post-test result |
| GET | `/student/progress` | Aggregated dashboard data |

**Never present:** a password-analysis endpoint. The analyser is intentionally
client-only and has no server route.

## Admin (requires `ADMIN` session)

| Method | Path | Description |
|---|---|---|
| GET | `/admin/students` | List/search students (no password data) |
| GET | `/admin/students/:id` | Student detail incl. progress/attempts |
| PATCH | `/admin/students/:id/active` | Activate/deactivate an account |
| GET/POST/PUT/DELETE | `/admin/modules[/:id]` | Module CRUD |
| POST/PUT/DELETE | `/admin/lessons[/:id]` | Lesson CRUD |
| GET/POST/PUT/DELETE | `/admin/quizzes[/:id]` | Quiz CRUD |
| POST/PUT/DELETE | `/admin/questions[/:id]` | Question CRUD |
| GET | `/admin/analytics` | Aggregate platform stats |

All admin routes pass through `requireAuth` then `requireAdmin`; students receive a
403 with a generic "Admins only." message.

## Error format

```json
{ "error": "Human-readable message" }
```

No stack traces, database errors, or internal paths are ever included in responses
(see `apps/api/src/middleware/errorHandler.ts`).

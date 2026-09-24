# Security Design Notes

This maps directly to the security requirements the project was built against.

| Requirement | Implementation |
|---|---|
| Password analyser input never reaches the backend | `passwordAnalyzer.ts` is a pure client module with no network calls; verified by a Playwright test that inspects all outgoing requests |
| Passwords never stored in plaintext | Argon2id hashing (`argon2` package) in `auth.service.ts`; only `passwordHash` is persisted |
| Admins cannot see student passwords | `admin.controller.ts` never selects `passwordHash`; no endpoint returns it |
| Generic auth error messages | `verifyCredentials` throws the same error for unknown email and wrong password |
| Rate limiting on auth | `express-rate-limit` on `/auth/register` and `/auth/login` (10 / 15 min) |
| Role-based access control | `requireAuth` + `requireAdmin` middleware; admin routes 403 for students |
| Input validation | Zod schemas validate every request body before it reaches a controller |
| No sensitive data in logs | Error handler logs only in development, never in production; no password values are ever logged |
| Secure cookies | `httpOnly`, `sameSite: lax`, `secure` in production |
| Secrets via environment variables | `JWT_SECRET`, `DATABASE_URL` read from `.env`, never hardcoded |
| CORS | Restricted to `CLIENT_ORIGIN` with `credentials: true` |
| Security headers | `helmet()` applied globally |
| Password reset tokens | Schema supports single-use, expiring tokens (`PasswordResetToken`); implement the email-delivery flow before production use |

## Composition vs. length

Per NIST-aligned guidance, registration enforces a 10-character minimum but does not
force arbitrary uppercase/symbol rules, since those rules tend to push users toward
predictable substitutions (`P@ssw0rd`) rather than genuinely stronger passwords.

## Testing security properties

- `apps/web/src/lib/__tests__/passwordAnalyzer.test.ts` — unit tests for weak/strong
  detection logic.
- `apps/api/src/__tests__/validators.test.ts` — unit tests for auth validation rules.
- `apps/web/e2e/critical-flows.spec.ts` — end-to-end checks that:
  - analyser input never appears in any outgoing request body,
  - unauthenticated users are redirected away from the student dashboard,
  - a student account cannot open an admin page.

## Known gaps to close before real deployment

- Email delivery for password reset is not wired up (schema and token generation are
  ready; add an email provider and a `/auth/forgot-password` / `/auth/reset-password`
  route pair).
- CSRF protection: cookies use `SameSite=Lax`, which mitigates most CSRF for a
  same-site SPA; add a CSRF token if the frontend and API are ever deployed on
  different top-level domains.
- Add centralized audit logging for admin actions (module/quiz edits, account
  activation changes) before production use.

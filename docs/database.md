# Database Design

Defined as Mongoose schemas under `apps/api/src/models/`. MongoDB is schemaless at
the storage layer, but Mongoose enforces the shapes below at the application layer,
which keeps the same structure and guarantees as the original relational design.

## Collections overview

| Model (collection) | Purpose |
|---|---|
| `User` | Login identity + role (`STUDENT`/`ADMIN`), password hash, embedded `profile` subdocument |
| `LearningModule` | A topic (e.g. "Multi-Factor Authentication") |
| `Lesson` | Content belonging to a module (`moduleId` ref), ordered |
| `Quiz` | Optionally tied to a module (`moduleId` ref); container for questions |
| `Question` | Multiple-choice/true-false question with correct index + explanation |
| `QuizAttempt` | One student's attempt at a quiz; embeds a denormalised snapshot of each answered question so results render without extra joins |
| `ModuleProgress` | Per-student, per-module completion percentage (unique compound index on `[userId, moduleId]`) |
| `AwarenessAssessment` | Pre-test/post-test record with overall score and embedded per-topic responses |
| `PasswordResetToken` | Single-use, expiring token for password resets |
| `SystemSetting` | Key/value store for admin-configurable settings |

## Key relationships

- `User` embeds its `StudentProfile` as a subdocument (`profile` field) rather than a
  separate collection — since it's always 1:1 and always loaded with the user, this
  avoids an unnecessary join.
- `Lesson.moduleId`, `Quiz.moduleId`, `Question.quizId`, `QuizAttempt.{userId,quizId}`,
  `ModuleProgress.{userId,moduleId}`, `AwarenessAssessment.userId` are all
  `ObjectId` references, populated with Mongoose's `.populate()` where the API needs
  the related document (e.g. showing a module's title alongside a student's progress).
- `QuizAttempt.answers` and `AwarenessAssessment.responses` are embedded subdocument
  arrays rather than separate collections (matching the original `QuizAnswer` /
  `AwarenessResponse` tables), since they only ever make sense in the context of their
  parent attempt/assessment.

## Design decisions

- **No plaintext or reversible password storage.** `User.passwordHash` is an Argon2id
  hash with `select: false` on the schema, so ordinary queries never return it — only
  the login flow explicitly opts in with `.select("+passwordHash")`.
- **Passwords entered into the analyser never touch this schema at all** — there is no
  collection for analyser input by design; the analyser has no backend route.
- **No cascading deletes in MongoDB**, so admin delete operations explicitly clean up
  dependents in application code (e.g. deleting a `LearningModule` also removes its
  `Lesson`s, `Quiz`zes, and `ModuleProgress` rows — see `admin.controller.ts`).
- **Indexes** are defined on frequently filtered/joined fields: `User.email`,
  `LearningModule.{isPublished, order}`, `QuizAttempt.{userId, quizId}`, and a unique
  index on `ModuleProgress.{userId, moduleId}` to prevent duplicate progress rows.
- **Timestamps** (`createdAt`/`updatedAt`) are enabled via `{ timestamps: true }` on
  every mutable schema for auditability.
- **Client-facing IDs**: all API responses convert Mongo's `_id` to a plain `id`
  string via a shared `toClient()` helper (`apps/api/src/utils/serialize.ts`), so the
  frontend's data contracts are unaffected by the underlying database choice.

# Task Run: validateParams for :id routes (ObjectId)

## Goal
Add params validation middleware and refactor workout :id routes to use it.

## Acceptance Criteria
- All `/:id` routes validate ObjectId using Zod-based middleware
- Controllers no longer contain duplicate ObjectId validation blocks
- Invalid id returns 400 with `{ error: "Invalid workout id" }` (keep current shape)
- Tests cover invalid id cases
- No new dependencies
- npm audit remains clean

## Evidence
- Tests:
- npm audit:
- Diff summary:
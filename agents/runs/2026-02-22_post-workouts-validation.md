# Task Run: POST /api/workouts – Validation & Hardening

## Date
2026-02-22

---

# 1. Goal

Harden the workout creation endpoint by:

- Ensuring robust server-side validation
- Enforcing user identity from JWT
- Covering failure paths with tests
- Verifying dependency safety (npm audit)

---

# 2. Acceptance Criteria

- Invalid payload returns 400 with structured validation error
- Missing JWT returns 401
- userId is always derived from req.user?.sub
- Valid payload creates workout (201)
- Tests cover negative cases
- npm audit shows no HIGH/CRITICAL vulnerabilities
- No stack traces exposed to client

---

# 3. Current State Analysis

## Strengths
- requireAuth middleware globally applied
- Zod validation for POST and PUT
- ObjectId validation for id routes
- userId filtering enforced in queries

## Identified Improvements
- No param-level validation middleware
- Inconsistent error wording
- updateWorkout allows empty update payload
- Dependency audit not yet documented per task

---

# 4. Architect Decision

## Validation Strategy
- Use existing validateBody middleware
- Keep Zod schemas in /schemas
- Do not introduce new dependencies

## Identity Enforcement
- userId always taken from JWT
- Never accept userId from body

## Error Strategy
- Standardize error responses (Unauthorized, ValidationError, NotFound)

## CIA Impact

Confidentiality: Low  
→ user isolation already enforced.

Integrity: Medium  
→ validation prevents malformed DB documents.

Availability: Low  
→ no heavy processing introduced.

---

# 5. Implementation Changes

- Added/verified Zod validation in POST route
- Confirmed userId enforced in controller
- Confirmed ObjectId validation in GET/PUT/DELETE
- Ensured no stack traces returned

---

# 6. Test Coverage

Negative cases tested:

- Missing title
- Empty exercises
- Invalid reps
- Missing token

Positive case tested:

- Valid workout creation returns 201

Command used:
npm test

Result:
All tests passed.

---

# 7. Dependency & Supply Chain Review

New dependencies added:
None (Zod already in use)

Command:
npm audit --audit-level=high

Result:
0 vulnerabilities found

Assessment:
No known HIGH/CRITICAL issues in direct or transitive dependencies.

---

# 8. Threat Mini-Model

Assets:
- Workout data integrity
- User isolation

Entry Points:
- POST /api/workouts

Threats:
- Malformed payload
- Cross-user data injection
- Excessive payload size

Mitigations:
- Zod validation
- JWT-based user isolation
- express.json payload limit

---

# 9. Definition of Done Verification

✔ Functional requirements met  
✔ Validation implemented  
✔ Tests pass  
✔ Security review performed  
✔ Dependency audit clean  
✔ No critical findings  

Status: Ready for merge
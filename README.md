# CittaSchool Phase 2 QAT — Playwright Deep Tests

Target: `https://demo.cittaschool.com` (production mode, typed sign-in + 123456)

## Quick Start
```bash
npm install
npx playwright install --with-deps chromium firefox webkit
cp .env.example .env   # already filled for seeded accounts
npm run test:smoke     # unauthenticated smoke — no credentials needed
npm test               # full suite (setup -> 6 role projects -> regression)
npx playwright show-report
```

## Projects (playwright.config.ts)
setup → chromium-applicant, chromium-student, chromium-registrar, chromium-lecturer, chromium-bursar, chromium-executive, firefox, webkit, mobile-chrome, mobile-executive

## Suites (tests/)
- 01-smoke.spec.ts
- auth.spec.ts (TC-01..03)  ISS-001,021,015,002
- rbac.spec.ts  NT-01..04
- admissions.spec.ts (TC-04..09)
- finance.spec.ts (TC-10..12)
- courses-registration.spec.ts (TC-13..14)
- lecturer-results.spec.ts (TC-15..16)
- graduation.spec.ts (TC-17..19)
- platform.spec.ts (TC-20..27, performance, a11y)
- security-nt.spec.ts (NT-01..23)
- regression-iss.spec.ts (ISS-001..034)

Evidence per FAIL: Evidence/<test>/*.png + URL + role + expected/actual + audit log.

Do not mark PASS without execution — BLOCKED if site unavailable.

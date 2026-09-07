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

## Results & Evidence (where to find videos, screenshots, reports)

> Run any suite first: `npm run test:smoke` or `npm test` — then open the links below. All evidence is generated locally (gitignored) and also viewable via `npx playwright show-report`.

| What | Local path (click to open after a run) | What’s inside |
|------|----------------------------------------|---------------|
| **HTML Report** (trace + video + screenshots) | [`playwright-report/index.html`](./playwright-report/index.html) — run `npx playwright show-report` | Full report with per-test trace, video (`*.webm`), screenshot, and `test-results/` attachments. Generated on every `npx playwright test`. |
| **Test Results** (raw) | [`test-results/`](./test-results/) — e.g. `test-results/auth.spec.ts-TC-01-chrome-unauth/video.webm`, `test-failed-1.png` | `junit.xml` + `results.json` (for CI), plus per-retry `trace.zip`, `video.webm`, `test-failed-1.png`. Cleared on `npx playwright test` start; keep last run’s `playwright-report/` instead. |
| **Evidence per FAIL** (docx Sec. 8 format) | [`Evidence/`](./Evidence/) — e.g. `Evidence/TC-01-Invalid-verification-code/<timestamp>.png` | Screenshot + `page.html` + `evidence.txt` (URL, role, expected/actual, error, steps) captured via `utils/evidence.ts:1`. Created by every spec that records a FAIL. |
| **Auth States** (6 roles) | [`.auth/`](./.auth/) — `applicant.json`, `student.json`, `registrar.json`, `lecturer.json`, `bursar.json`, `executive.json` | `storageState` from `tests/auth.setup.ts:13` (typed sign-in + `123456` on `https://demo.cittaschool.com`). Used by `playwright.config.ts:5` projects. Never commit `.env` — only `.env.example`. |
| **Videos** | `test-results/**/video.webm` — also embedded in `playwright-report/index.html` | `video: retain-on-failure` per `playwright.config.ts:24`. Watch the exact failure replay. |
| **Screenshots** | `test-results/**/test-failed-1.png` + `Evidence/**/*.png` | `screenshot: only-on-failure` + fullPage captures per `BasePage.ts:1` (`takeEvidence`). |
| **Traces** | `test-results/**/trace.zip` — open via `npx playwright show-trace <path>` | `trace: on-first-retry` — step-by-step DOM + network. |

**Quick view:**
```bash
npx playwright show-report          # opens playwright-report/index.html
npx playwright show-trace test-results/<test>/trace.zip
explorer playwright-report\index.html   # Windows
explorer Evidence\                      # per-FAIL screenshots
```

**Source of truth & decks (committed):**
* Case study: [`CittaSchool_Phase2_QAT_Case_Study-2.docx`](./CittaSchool_Phase2_QAT_Case_Study-2.docx) — Sec. 1–9, TC-01..27, NT-01..23, ISS-001..034
* Test spec: [`messages.txt`](./messages.txt) — 55 objectives + verbatim defect format
* Master deck: [`CittaSchool_Master_Deck_ALL.pptx`](./CittaSchool_Master_Deck_ALL.pptx) — 16 slides (Boss 5 + 3Pager 3 + FRIDAY 4 + Client 4)
* Client handout: [`CLIENT_DEMO_FRIDAY.md`](./CLIENT_DEMO_FRIDAY.md) / internal: [`DEMO_FRIDAY.md`](./DEMO_FRIDAY.md)
* Env template: [`.env.example`](./.env.example) — copy to `.env` (gitignored)
* Repo: <https://github.com/knight-dev01/Playwright-Test-for-Citta-School.git>

> **Tip:** After a run, `playwright-report/index.html` is the single link to share with your boss/client — it contains videos, screenshots, and traces in one page. For `BLOCKED` (site down), attach `Evidence/` + `test-results/` as ZIP.

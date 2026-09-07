# CittaSchool Phase 2 — Suggested Demo Approach (Friday)

**Target:** `https://demo.cittaschool.com` (production, `123456`) — Unity Federal University
**Timebox:** 45 minutes + 15 min Q&A — one laptop, one phone for QR, stable Wi-Fi, fallback video

---

## 1. Pre-Demo (15 min before, Registrar only)

1. **Reset data once** — Registrar → header → `Reset data` → Confirm. Verifies baseline: Adaeze at *screening-not-started*, CSC101 *Draft*, Chinedu *library-blocked*. Note time. Old QRs from before reset must show *Not found* (NT-10).
2. **Check health** — `npm run test:smoke -- --project=chrome-unauth` (3/3). If any 5xx, record `BLOCKED` and switch to fallback video.
3. **Prepare personas** — Tabs ready: Applicant (`applicant`/`Demo2026!`), Student `DU/CSC/23/0001`, Lecturer `lecturer`, Registrar `registrar`, Bursar `bursar`, Executive `executive` — all `123456`. No Quick sign-in visible (ISS-001).
4. **Phone ready** — for QR scans of admission letter / transcript / certificate.

Do NOT reset again mid-demo.

---

## 2. Demo Flow (relay, 30 min — follow the story, not slides)

Follow **one student (Adaeze, JAMB 202611234567AB, UTME 268 → B.Sc. Computer Science)** from admission to graduation. Each handover is explicit.

| Min | Who | What to show (expected) | Retests | Fallback if stuck |
|-----|-----|-------------------------|---------|-------------------|
| 0-3 | **You (intro)** | Login → verification `123456` → show 6 portals are isolated, no role switcher (ISS-021). Paste registrar URL as applicant → *Refused* (NT-01). | TC-01, TC-03 | Show `test-results/tc03*` screenshot |
| 3-8 | **Applicant (T1)** | Screening: JAMB biodata read-only, try edit → blocked (NT-14). Leave declaration unticked → field error (NT-09). Submit → USSD pay → amount visible before Confirm → receipt serial+QR → bell notification. | TC-04 | Skip payment, show receipt PDF from `Evidence/` |
| 8-14 | **Registrar (T2)** | Admission control: change CS cut-off 220→230→220 (audited). Screening & Scores: 105 refused inline, 62 accepted. Recommendations: aggregate `UTME/8 + Post-UTME/2 = 33.5+31=64.5` → rank → `Auto-recommend` (double-click → quota enforced) → manual override with reason “Sports scholarship” → Send to CAPS → duplicate send refused. CAPS import seeded file + unknown JAMB row rejected. | TC-05, TC-06 | Show `playwright-report` for quota |
| 14-18 | **Applicant (T1)** | Accept offer *before* CAPS → unavailable (`awaiting JAMB`). After import → Accept → Card pay (amount) → admission letter PDF → phone QR → *Verified* without login. | TC-07 | If QR fails, show `Verify document` with serial |
| 18-21 | **Registrar (T2)** | Clearance: Query passport → `Generate matric` disabled → Verify all → `DU/CSC/26/xxxx` once, second attempt refused. Note matric for Adaeze’s first login (`Welcome2026!`). | TC-08 | Show matric format |
| 21-24 | **Student Adaeze (new matric)** | First login → forced password change, old temp fails. Course registration blocked → names outstanding invoice + link to Fees (ISS-027). | TC-10 | — |
| 24-27 | **Student + Bursar** | *Student* `Pay now` → exact amount → bank transfer → unique ref/serial receipt → Pay again unavailable (NT-05) → Statement date range. *Bursar* record manual/teller → Pending (not in collections) → Approval queue → approve → Cleared, receipt, audited. | TC-11, TC-12 | Show Bursar collections vs Executive |
| 27-29 | **Registrar** | Programme curriculum → `Add Course` ACC205 (3u, core, 200L, Accounting, prereq ACC101) → duplicate refused → assign lecturer → deactivate → history preserved, not deletable (ISS-034). | TC-13 | — |
| 29-31 | **Student** | Registration: core pre-selected, electives → 12u refused, 30u refused (15-24 server), 16-22 submitted → green `Submitted` + course form PDF → Registrar sees it in oversight. | TC-14 | Show PDF |
| 31-34 | **Lecturer (T3)** | Tiles: Assigned/Pending/Submitted all open (ISS-031). CSC101 entry: CA 85 refused, 0 accepted, ABS disables, blank → banner names student → Excel upload same validation → Submit → read-only. | TC-15 | Show `test-results/tc15*` |
| 34-37 | **Registrar as HOD/Dean/Senate** | Return with comment → lecturer editable. Approve HOD → try Senate while at Dean → refused. Approve Dean → Senate → timeline shows Prof. Eze/Bakare/Senate Committee. *Student* before Senate → “Results pending”, after → GPA/CGPA. Audit viewer shows every save. | TC-16 | — |
| 37-39 | **Student + Registrar** | Transcript: Request → Registrar dispatch → QR phone (no login) → change record ref → *Refused* (NT-03). | TC-17 | — |
| 39-42 | **Registrar + Bursar** | Graduation: ~34 eligible, 3 course-blocked, 3 library-blocked (Chinedu CGPA 4.62) → clear Library → immediately First Class → Excel export → certificate QR → Convocation by faculty. Bursar Graduation fees reconcile. | TC-18 | — |
| 42-45 | **Executive (T5)** | Institutional overview: enrolment, funnel, registration compliance, collections (Adaeze gateway + approved manual only, pending excluded), results pipeline (CSC101 Senate), graduation (Chinedu First Class), exception alerts. Broadcast → T1/T3 notifications arrive. Show phone view. | TC-19 | Use `mobile-executive` project |

---

## 3. Platform & Integrity Checks (if time or Q&A)

* **Reset data gating** — show non-registrar cannot see `Reset data` (TC-24), old transcript QR after reset → *Not found*.
* **Terminology sweep** — search “demo/presenter/storyline” → none in production PDFs (TC-27).
* **Performance** — mention `≤3s` pages / `≤5s` dashboard (TC-26) with evidence timestamps.
* **UI** — breadcrumbs, Back, sidebar highlight, `?` help on every page (ISS-020).

---

## 4. Risk & Contingency

* **Wi-Fi / `demo.cittaschool.com` down** → switch to `playwright-report` (HTML) + `Evidence/` videos (trace `on-first-retry`). Mark affected tests `BLOCKED` with reason, per messages.txt Critical Rule — never invent PASS.
* **Payment gateway sandbox** — use gateway test card, never real transaction. If gateway down, show manual/teller → Pending → Approved flow which is deterministic.
* **Lockout** — do NOT trigger 5 failures live. Show lockout via `test-results/tc02*` screenshot; mention it counts verification codes (ISS-015).
* **Reset is destructive** — do it only once at start; warn client that old QRs invalidate.

---

## 5. Roles & Logistics

* One tester per role (T1..T6), coordinator keeps master checklist + defect log. You act as coordinator + narrator.
* Keep `playwright.config.ts` `BASE_URL` + `.env` prefilled; run `npx playwright test --project=chrome-unauth --reporter=list` smoke before client enters.
* Evidence: every FAIL gets screenshot + URL + role + expected/actual + steps (messages.txt Sec.20). Defects grouped Critical/Major/Minor + Security separately.

---

## 6. Close (2 min)

Show acceptance table (PASS/FAIL/BLOCKED/NOT TESTED) and recommendation: *Ready for client demonstration / Ready with known issues / Requires remediation / Not ready* — based strictly on observed evidence (messages.txt Sec.21-22). Propose next Pass 5 regression after fixes.

**Repo:** `https://github.com/knight-dev01/Playwright-Test-for-Citta-School.git` — 3-page deck at `CittaSchool_Playwright_QAT_3Pager.pptx`.

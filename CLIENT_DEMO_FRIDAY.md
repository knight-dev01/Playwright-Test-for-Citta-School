# Proposed Demo to Client — Friday 12 September (45 min + 15 Q&A)

**For:** Unity Federal University leadership & Registry/Bursary/Academic stakeholders
**Live site:** `https://demo.cittaschool.com` (production, `123456`) — no slides, just your future workspace
**Story:** One student, Adaeze (JAMB 202611234567AB, UTME 268 → B.Sc. Computer Science), from screening to graduation. You can interrupt anytime.

---

## What You Will See (6 blocks, no jargon)

**0–5 min — Welcome & Trust:** Each role opens only its own portal (applicant, registrar, lecturer, bursar, executive). We show the typed sign-in + 6-digit code and prove pasting a registrar link as an applicant is *Refused*.

**5–15 min — Admission & Merit:** Adaeze’s JAMB record (read-only) becomes a ranked offer. You see cut-off rules (e.g., CS 220), quota enforcement (even on double-click), and how CAPS decisions become an admission letter whose QR you scan with your phone — without login.

**15–22 min — Clearance to Matric:** A queried passport blocks the matric number. Once verified, the system creates `DU/CSC/26/xxxx` exactly once. Adaeze logs in with `Welcome2026!` and must change it.

**22–30 min — Fees & Registration:** You see the exact Naira amount *before* you confirm, then an instant receipt with serial & QR. A manual/teller payment stays *Pending* until the Bursary approver clears it — then collections reconcile. Then the 15–24 unit rule and a printable course form.

**30–38 min — Grading & Approvals:** Lecturer tiles open, scores validate (e.g., CA 85 refused, 0 ok, ABS distinct). The sheet locks on submit, then moves `HOD → Dean → Senate`. Students see “pending” until Senate releases — then GPA appears, with every action audited.

**38–45 min — Graduation & Oversight:** Transcript QR without login, a library fine cleared live makes Chinedu (CGPA 4.62) First-Class instantly, and the Vice-Chancellor’s dashboard that reconciles every payment and result. We send a broadcast and it arrives on your phone.

---

## What This Proves to You

* One version of the truth — JAMB → transcript → certificate, QR-verifiable without login
* Rules enforced by server, not by people (quota, 15–24, approval order)
* Money traceable — every receipt has a unique serial & QR; duplicates impossible
* Roles respected — students can’t see registrar pages, lecturers can’t grade unassigned courses
* Executive sees live figures, not exports

---

## We Need From You on Friday

* 5–7 questions after each block — tell us your cut-off, quota & grading weights live, we’ll show the audit
* One phone to scan QRs with us
* Projector + stable Wi-Fi (if it drops, we switch instantly to the recorded evidence pack — same journey, same receipts; no fabricated PASS)

---

## Logistics

* **Pre-demo (15 min before):** We run smoke checks and a single Registrar `Reset data` to restore the baseline (then never again — old QRs become *Not found*).
* **Team:** One lead per role + coordinator narrating; handovers are explicit (T1→T2→T3→T4→T5).
* **Evidence:** Every check logs screenshot + URL + expected/actual per the case study Sec. 8; you get `playwright-report/` and `Evidence/` after.

**Repo & deck:** `github.com/knight-dev01/Playwright-Test-for-Citta-School` — `CittaSchool_Client_Demo_Friday.pptx` (page 4 is this proposal).

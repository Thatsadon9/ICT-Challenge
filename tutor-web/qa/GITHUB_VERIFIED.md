# GitHub / static hosting readiness — 2026-10-26

Scope: publish the tutoring project to the requested GitHub repository and prepare a Vercel static build. No Vercel deployment was requested or performed in this check.

Checks and evidence:

- `node tutor-web/scripts/check.mjs`: passed for 17 lessons, 188 unique questions, all pre-test eligibility/focus rules, 9 executable assessment snippets, 6 coding challenge solutions / 29 cases, and bundled assets.
- `node tutor-web/scripts/build.mjs`: generated 21 static files in root `dist/`. Every generated file was byte-compared with its source.
- Playwright against the generated output, served at `127.0.0.1:8766`: home opened; N1 pre-test rendered all five questions; code lab loaded.
- Real browser Python runner: `print(0)` correctly failed four of the five sum-task cases; the supplied correct solution then passed all five. No page errors or failed asset responses during these flows.
- Mobile viewport 390 × 844: home rendered and page scroll width was 390 px.
- Bundled WebAssembly served as `application/wasm`; official 2026 PDF returned 200; excluded QA progress export returned 404.
- Staged files excluded local progress exports, screenshots, practice folder, portable ZIP, generated output, and environment/credential files. Credential-pattern scan passed.
- Authored staged files passed `git diff --cached --check`; the unmodified bundled SIL font license has one upstream trailing space and was excluded from the whitespace-only check.

Hosting configuration: repository root (`./`), framework Other, build `node tutor-web/scripts/build.mjs`, output `dist`, no install step or environment variables. This verifies local build output, not a live Vercel deployment.

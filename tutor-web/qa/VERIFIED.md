# Verification report

Verified locally on 25 October 2026. Result: ready for local learning. The adaptive upgrade is verified separately in ADAPTIVE_VERIFIED.md; it extends the original checks below.

## Content and runtime

- 17 populated lessons; original 52 questions extended to 188 by the adaptive upgrade; all question/challenge references resolve.
- 6 Python challenges, all 29 supplied solution test cases pass in native Python and in the actual browser worker.
- Bundled runtime and Thai font; no external requests during core browser learning and coding flows.
- JavaScript syntax checks passed for app, content and worker modules.
- Existing-server launcher detection returns the active local URL without starting another instance.

## Desktop browser

- Sequential reading, binary bit toggles, empty-answer disabled state, grading and lesson completion.
- Exact multi-answer set passes; choosing an extra incorrect option fails; retry works.
- Mock exam: deliberate 9/10 score and expected per-domain breakdown; correcting a question later does not alter the submitted exam snapshot.
- Diagnostic draft selections, current question and answered count survive reload; omission confirmation reports 18 missing answers after answering 2 of 20.
- Incorrect questions enter review and leave after correction.
- Cloud ownership, network stepper, zero-denominator metrics and mixed spreadsheet references update as expected.
- Reader font size changes from 15px to 16px through its control.
- Progress export/import succeeds; invalid partial JSON is rejected; last lesson and ungraded choice draft restore after reloading the latest implementation.
- Reset cancellation leaves progress intact.
- Python correct output, wrong output, syntax errors, custom stdin and output, 8-second infinite-loop timeout, stop during initialization, run after cancellation and navigation during a run all behave as intended.
- No uncaught page errors.

## Mobile browser

- Tested 390×844: home, navigation drawer, all 17 lessons, interactive lesson and Python editor.
- Python sum challenge passes all 5 cases through mobile controls.
- No document horizontal overflow on home, lesson or code lab (scroll width equals 390px).
- No uncaught page errors.
- Visual screenshots inspected: desktop home/lesson/code and mobile home/lesson/code. Main pages intentionally scroll vertically.

## Corrections during QA

- Switched Pyodide to a module worker as required by the pinned runtime.
- Fixed live answered-count updates and restored preferences, last lesson and ungraded drafts in imported progress.
- Ignored late messages from terminated workers to preserve cancellation/recovery behavior.

## Practical limits

Runs Python only in the editor. C/Java appear in reading and MCQ lessons. Tests are a learning aid, not a secure competition judge or complete correctness proof. Progress is stored per browser/origin; the export/import feature supports moving it. A local HTTP server is required; the launcher starts it. No public deployment was performed.

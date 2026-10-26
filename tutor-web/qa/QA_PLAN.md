# Verification inventory

## User-visible claims

- Lesson sequence: 17 real lessons, two paths, freely selectable chapters and step completion persisted.
- MCQ: radio vs checkbox, no grading with empty selection, exact-set grading, explanations, retry and review.
- Exams: answer navigation, saved drafts and running timer across reload, submit confirmation for omissions, domain scores, immutable answer snapshot on result page.
- Python: real runtime, custom stdin/output, all supplied solutions, wrong output, syntax error, timeout, stop and recovery; editor drafts survive reload.
- Mini labs: bits, network stages, cloud responsibilities, metrics with zero-denominator handling, relative/mixed spreadsheet references.
- Progress: lesson completion conditions, export/import validation and reset confirmation, font setting, error notes.
- Responsive: desktop home/lesson/exam/lab and mobile home/lesson/lab; no document horizontal overflow; controls readable and reachable.
- Local runtime: no remote requests during core flows; runtime, font and source PDFs bundled.

## Off-happy-path checks

1. Infinite Python loop times out while navigation remains usable, then a correct solution still runs.
2. Stop during execution and navigate away during runtime initialization without a stuck disabled button.
3. Multi-select with extra wrong option fails; retry with exact set passes.
4. Invalid or partial progress JSON is rejected without replacing existing data.
5. Exam submitted with unanswered questions shows confirmation and correct zero scores.

## Evidence

Browser results and screenshots under this directory. Node syntax checks, content references, all Python solution test cases and loopback HTTP checks run separately. UI verification uses persistent Playwright through node_repl.

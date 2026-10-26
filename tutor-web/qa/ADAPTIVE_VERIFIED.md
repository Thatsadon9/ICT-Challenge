# Adaptive urgent preparation — verified 25 October 2026

## Outcome

17 lessons have independent pre-tests (85 original questions) and new transfer checks (51). The existing 52 questions remain optional practice. Urgent order selects 10 core lessons; full path retains all 17. Difficulty and ordering are teaching decisions grounded in the published four-domain scope, not verified exam-frequency estimates.

## Automated content and rules

`node scripts/check.mjs` validates 188 unique questions, references, review-step mappings, five pre-test and three post-test questions per lesson, exactly two core questions per pre-test, and all local runtime assets.

For every lesson: 5/5 passes; 4/5 with a missed core fails; 4/5 with both core questions correct passes; 3/5 fails; extra selections are not partial-credit answers; correct-but-uncertain questions are added to the targeted review. Pre/post IDs and prompts are separate. Nine Python assessment snippets execute to their declared answer. All 29 coding-solution test cases still pass.

## Browser behavior

- First visit opens the pre-test introduction; five questions render with no answer feedback before submission.
- Answer selections, uncertainty flags and timer start persist across reload.
- Missing-answer confirmation reports the correct omission count.
- N1: 4/5 and core 2/2 enables skip; one wrong and one uncertain question select two review sections.
- Skipping records `completionMethod: pretest`, with no fabricated read steps or code-passed status.
- N4: 4/5 and core 1/2 blocks skip and selects exactly one relevant section. The summary-to-transfer route marks only that section read. Three new checks unlock completion without requiring old basic exercises.
- F2: two missed concepts select sections 0 and 1, sequential navigation omits section 2. Urgent mode does not require the optional coding exercise to finish this online-preparation lesson.
- Revisiting pre-test results after transfer checks still shows the immutable first assessment, with a separate study-complete notice.
- Export/import restores pre-test answers, uncertainty, first-result timestamps, targeted mode and skip provenance. Legacy progress remains supported.
- Finishing the urgent path sends the primary CTA to combined practice, rather than automatically requiring supplementary chapters.
- Combined application practice scores all ten correct fixture answers as 10/10 and retains per-domain results.
- Python worker still runs and checks the sum challenge in the updated interface.
- Mobile 390×844: full pre-test interaction, passing/skip control and targeted-review results work with no horizontal page overflow. Desktop and mobile screenshots inspected.
- No uncaught page errors observed.

The eightieth-percent threshold and core-question condition are course policies. MCQ skip does not certify programming performance. The full source bundle remains local and does not publish or synchronize personal answers externally.

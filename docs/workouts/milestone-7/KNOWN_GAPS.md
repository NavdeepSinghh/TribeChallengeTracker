# Milestone 7 Known Gaps

Status date: 2026-07-01

## Release Blockers Still Open

1. `finishWorkoutSession` must be deployed and smoke-tested against production Firebase before release.
2. Firestore emulator allow/deny tests remain the hard gate for M8 social sharing.
3. Real iPhone screenshots are still required for Claude brand review before release.
4. Firebase Storage migration remains required before the 50-exercise expansion.

## M7-Specific Gaps

1. Delete/update mirrored record cleanup UI is not implemented. This should be designed with M8 visibility and social safety.
2. History pagination is not implemented. The first pass reads the latest 12 sessions.
3. Public/private detail visibility is not exposed in a full detail screen yet; M7 shows list-level mirror indicators.
4. Android history mapper has an unchecked cast warning for nested map conversion. Build passes; can be cleaned during M8/M9 polish.

## Not A Gap

PR values are not computed client-side. That is intentional. The UI reads trusted server-written PR documents.

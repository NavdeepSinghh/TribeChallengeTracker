# Milestone 9 Known Gaps

Status date: 2026-07-01

## Blocking For Full M9 Release

1. Claude has not visually approved Batch 5.
2. Firebase Storage bucket upload has not been run.
3. Seed data has not been live-applied.
4. Clients do not yet resolve relative Storage paths to absolute download URLs in production.
5. Thumbnail cards are real WebP files, but they are generated branded cards rather than Lottie still-frame captures.

## Carry-Forward Gaps

1. Full signed-in end-to-end smoke tests still required before release.
2. Real device screenshots still required before release.
3. `OFFICIAL V1` review label should be hidden or stripped before production UI if it feels too internal.

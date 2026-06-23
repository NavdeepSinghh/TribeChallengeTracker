# Play Console Notes: Post Build 32

Running list of user-facing enhancements built after iOS/TestFlight build 32. Use this as the source for the next Google Play Console release notes and App Store/TestFlight notes.

## Release Notes Draft

New Training Journal flow: log full workouts in one session, copy previous gym/run/swim/yoga sessions, add multiple exercises and sets, and view progress in a separate chart flow. Added swim tracking and improved challenge updates/reminders so admins can nudge members to log progress.

## Enhancement Log

### Training Journal Redesign

- Reworked the Training Journal from a vertically growing inline form into a compact Board card with dedicated flows.
- Added a full-session workout builder so users can save a complete workout in one go.
- Added “Use previous” / “Copy” so users can repeat a Pull Day, run, swim, or yoga session and tweak today’s values.
- Added dynamic gym tracking with multiple exercises and add/remove sets beyond the old 3-set limit.
- Moved progress charts into a separate Progress flow instead of showing charts on the logging screen.
- Preserved the existing `trainingSessions` data shape so existing saved sessions remain readable.

### Swim Tracking

- Added swim support to personal training tracking across web, iOS, and Android.
- Tracks distance, duration, stroke/style, location, and pace per 100m where available.

### Challenge Updates And Reminders

- Added challenge update surfaces for admin announcements.
- Added one-tap reminders for admins to nudge members to log progress for the day.
- Added notification plumbing so reminders can become actionable when device permissions and platform setup are complete.

## Verification

- Web production build passed.
- Android debug build passed.
- iOS simulator build passed.

## Notes For Next Submission

- Keep Play Console wording focused on user-visible improvements.
- Avoid mentioning internal implementation details such as Firestore collections, feature flags, or debug build status.
- Before submission, confirm which of these items are included in the exact Android version code being uploaded.

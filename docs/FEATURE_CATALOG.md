# Rise With The Tribe Feature Catalog

This catalog is the contributor-facing map for the Web, native iOS, and native Android apps. Every feature should be built and reviewed against all three platforms unless the feature is explicitly platform-specific.

Repos:

- Web/Capacitor: `/Users/navdeepsmacbook/Documents/TribeChallengeTracker`
- Native iOS: `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS`
- Native Android: `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid`

Primary parity ledger: `FEATURE_PARITY.md`

## Parity Definition

A feature is considered in parity when:

- The same user outcome exists on Web, iOS, and Android.
- Shared Firestore fields and document paths match.
- Platform-specific equivalents are documented, such as HealthKit on iOS and Health Connect on Android.
- Invite links, profile appearance, challenge membership, badges, and leaderboard identity render consistently.
- The release gate passes before deployment.

## Authentication and Onboarding

Purpose: get users signed in and collect basic training preferences.

Shared behavior:

- Google/Firebase authentication.
- New user profile creation in `users/{uid}`.
- Onboarding choices for goal, level, and training frequency.
- Existing users remain compatible if onboarding fields are missing.

Release checks:

- New users can sign in.
- Onboarding saves and does not repeat once complete.
- App opens to the main experience for completed profiles.

## Home Dashboard

Purpose: show the user’s current progress at a glance.

Shared behavior:

- Streak, total points, and days active stats.
- Activity breakdown by type.
- Calendar/history view with activity color cues.
- Challenge stats card that navigates to Challenges.
- Progress sharing entry points.

Release checks:

- Logged activity updates points, streak, days active, and calendar.
- Tapping a historical date shows the day’s recorded activity.
- Empty history states render without crashing.

## Activity Logging

Purpose: manually record daily activity and optionally import wearable activity.

Shared behavior:

- Activity type selection.
- Duration/distance/intensity where applicable.
- Points calculation and day history storage.
- Running list of activities logged in the current session.
- Badge checks after logs.

Platform notes:

- Web can use browser/runtime capabilities and Capacitor when wrapped.
- iOS imports Apple Health workouts and supports HealthKit auto-import.
- Android imports Health Connect activity and supports WorkManager auto-sync.

Release checks:

- Duplicate activity IDs are not double-saved.
- Saving updates Firestore day logs and profile stats.
- Health sync permissions fail gracefully when unavailable.

## Challenges

Purpose: let users create, join, track, share, and leave challenges.

Shared behavior:

- Create challenges from templates or custom configuration.
- Discover public challenges.
- Join by invite code.
- Copy/share full invite links.
- Track daily challenge tasks.
- Store per-day challenge logs under challenge member documents.
- Challenge leaderboard and member stats.
- Leave challenge flow with admin handoff and sole-admin delete.

Firestore contracts:

- `challenges/{challengeId}`
- `challenges/{challengeId}/members/{uid}`
- `challenges/{challengeId}/members/{uid}/dailyLogs/{yyyy-MM-dd}`
- `users/{uid}.joinedChallengeIds`
- `users/{uid}.stats.challengesJoined`
- `users/{uid}.stats.challengesOwned`

Release checks:

- Creating increments owned/joined stats.
- Joining is idempotent and does not double-increment.
- Daily challenge logging is idempotent for the same day.
- Leaving removes membership and updates challenge counts.
- Admin handoff promotes another member when needed.

## Badges

Purpose: reward milestones, streaks, activity mix, challenge progress, and special achievements.

Shared behavior:

- Badge catalog covers streaks, milestones, activity, challenges, and special badges.
- Earned badges show positive visual state.
- Locked badges show locked/unearned state.
- In-progress badges show current/target progress.
- Unlock overlay/notification appears after earning.
- Badge awards are written to Firestore.

Release checks:

- Badge checks run after activity logs and challenge updates.
- Challenge completion/top-rank stats feed finisher/champion badges.
- Existing awarded badges are not re-awarded.

## Leaderboard

Purpose: show personal and challenge-relative performance.

Shared behavior:

- Personal stats summary.
- Activity breakdown bars.
- Challenge leaderboards.
- Profile image/avatar appears consistently.

Release checks:

- Member rows render uploaded photos, avatar fallback, or default rank avatar.
- Challenge score changes reorder leaderboard rows.
- Missing profile appearance fields do not crash older accounts.

## Profile Appearance

Purpose: let users personalize identity across app surfaces.

Shared Firestore fields on `users/{uid}`:

- `profileImageData`
- `avatarEmoji`
- `avatarColor`

Shared behavior:

- Upload photo.
- Choose generated avatar.
- Remove uploaded photo.
- Denormalize appearance fields into joined challenge member documents.

Release checks:

- Uploads are compressed/resized before saving.
- Choosing an avatar clears `profileImageData`.
- Leaderboards update after profile appearance changes.

## Wearable Health Sync

Purpose: reduce manual logging by importing wearable activity.

Shared behavior:

- Manual import button.
- Opt-in automatic sync where the platform supports it.
- Imported activity maps to the same activity log and points model.

Platform notes:

- iOS uses HealthKit and Apple Health/Apple Watch data.
- Android uses Health Connect and can read supported wearable providers through Health Connect.
- Web has parity only when wrapped in a native runtime with supported plugins.

Release checks:

- Permission denial shows a usable message.
- Re-importing the same source activity does not duplicate the log.
- Auto-sync can be toggled off.

## Progress Sharing

Purpose: help users share streaks and progress externally.

Shared behavior:

- Copy progress text.
- WhatsApp share path.
- Generated image/native share path.
- Instagram Story support or native share fallback based on platform capabilities.

Release checks:

- Share text includes points, streak, and days active.
- Generated image is non-empty.
- Missing target apps fall back to a generic share flow.

## Notifications

Purpose: remind users to log consistently.

Shared behavior:

- Reminder setting supports off/morning/evening.
- Native apps use local notifications.
- Web uses browser notifications while the web app is open.

Release checks:

- Permission denial is handled.
- Changing reminder preference cancels old reminders.
- Reboot/background scheduling remains registered on native platforms.

## Deep Links

Purpose: make shared challenge invite links open the correct native flow.

Supported invite links:

- `https://risewiththetribe.app?join=INVITE_CODE`
- `tribechallenge://join?code=INVITE_CODE`

Shared behavior:

- Web hosts native app verification files.
- iOS Universal Links route to the Challenges tab and show the invite join/open card.
- Android App Links route to the Challenges tab and show the invite join/open card.

Release requirements:

- Deploy `/.well-known/apple-app-site-association`.
- Deploy `/.well-known/assetlinks.json` generated with the Play App Signing SHA-256 fingerprint.
- Enable Associated Domains on the Apple Developer App ID.

## Release Safety

Minimum release gate from the web repo:

```bash
npm run release:check
```

Full cross-platform release gate:

```bash
npm run release:check:all
```

The full gate runs:

- Web Jest tests.
- Web production build.
- Static parity/verification contracts.
- iOS simulator build.
- Android debug build.

Before deploying hosting for app links:

```bash
ANDROID_APP_LINK_SHA256="PLAY_APP_SIGNING_SHA256" npm run hosting:release
```

When adding or changing a feature:

1. Update this feature catalog and `FEATURE_PARITY.md`.
2. Add or update release-contract checks in `scripts/verify-release.js` when a shared contract changes.
3. Build or test all impacted platforms.
4. Document any intentional platform-specific behavior.

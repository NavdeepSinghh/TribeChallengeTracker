# Rise With The Tribe Feature Catalog

This catalog is the contributor-facing map for the Web, native iOS, and native Android apps. Every feature should be built and reviewed against all three platforms unless the feature is explicitly platform-specific.

Repos:

- Web/Capacitor: `/Users/navdeepsmacbook/Documents/TribeChallengeTracker`
- Native iOS: `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS`
- Native Android: `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid`

Primary parity ledger: `FEATURE_PARITY.md`

Monetization and engagement roadmap: `docs/MONETIZATION_ROADMAP.md`

Marketing and content operating plan: `docs/MARKETING_CONTENT_STRATEGY.md`

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

Platform notes:

- Android Google Sign-In requires the Firebase Android app, the relevant debug/release SHA-1 fingerprints, and `app/google-services.json`.
- Android builds read the Web OAuth client from `google-services.json` when present, so stale local `google.webClientId` values do not override the Firebase Android config.

Release checks:

- New users can sign in.
- Onboarding saves and does not repeat once complete.
- App opens to the main experience for completed profiles.
- Android emulator sign-in can reach the Google account picker; completing Google re-auth may require user credentials on the emulator.

## Account and Support Surface Index

Account deletion requests, support requests, admin review queues, and copy-only decision replies now live in `docs/feature-catalog/account-support-surfaces.md` so the main feature catalog stays easier to scan while preserving the same support, deletion, marketplace, and no-entitlement contracts.

<!-- include: feature-catalog/account-support-surfaces.md -->

## Tracking Surface Index

Home dashboard and activity logging contracts now live in `docs/feature-catalog/tracking-surfaces.md` so the main feature catalog stays easier to scan while preserving the same points, streak, calendar, activity history, badge-check, and wearable-import boundaries.

<!-- include: feature-catalog/tracking-surfaces.md -->

## Challenge Surface Index

Challenge creation, weekly campaign launches, invite/referral attribution, premium pack metadata, sponsor metadata, and Coach Host branding now live in `docs/feature-catalog/challenge-surfaces.md` so the main feature catalog stays easier to scan while preserving the same challenge engine contracts.

<!-- include: feature-catalog/challenge-surfaces.md -->

## Identity and Progress Surface Index

Badges, leaderboards, and profile appearance now live in `docs/feature-catalog/identity-progress-surfaces.md` so the main feature catalog stays easier to scan while preserving the same badge, leaderboard, avatar, photo, and Instagram handle contracts.

<!-- include: feature-catalog/identity-progress-surfaces.md -->

## Community Growth Surface Index

Feature submissions, referral invite hooks, highlighted UGC, and referral reward copy now live in `docs/feature-catalog/community-growth-surfaces.md` so the main feature catalog can stay easier to scan while preserving the same engagement and growth surface contracts.

<!-- include: feature-catalog/community-growth-surfaces.md -->

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

Future feature candidate:

- Recovery-aware challenge recommendations can use sleep, HRV, resting heart rate, and similar signals only after the app has visible recovery surfaces, explicit opt-in permission, updated store privacy disclosures, and clear copy that this is guidance for challenge fit rather than medical screening, diagnosis, or risk scoring.

## Sharing and Reward Surface Index

Progress sharing, win cards, weekly recaps, and referral reward badges now live in `docs/feature-catalog/sharing-reward-surfaces.md` so the main feature catalog stays easier to scan while preserving the same social-proof, referral, claim, and no-entitlement contracts.

<!-- include: feature-catalog/sharing-reward-surfaces.md -->

## Paid Access and Store Surfaces

Purpose: keep the detailed Tribe Pro entitlement foundation and Store Product Catalog contracts in a focused catalog file while preserving the same release-check surface.

<!-- include: feature-catalog/paid-store-surfaces.md -->

## Monetization and Community Growth

Purpose: grow revenue without weakening trust or habit formation.

Roadmap source:

- `docs/MONETIZATION_ROADMAP.md`

Planned shared behavior:

- Weekly challenge campaign templates that connect Instagram campaigns to app participation. Initial campaign templates and campaign invite copy are implemented.
- Feature submission flow for users who want to be reposted or highlighted. Initial pending-review submissions are implemented.
- User-generated win cards for social proof and Instagram engagement. Initial cross-platform share actions are implemented.
- Referral tracking, reward badges, and reward ladder. Initial 1/5/10 badges plus 1/5/10/25 profile ladder are implemented.
- Tribe Pro subscription entitlements.
- Pro custom weekly and streak goals. Initial cross-platform profile surfaces are implemented.
- Premium challenge packs. Initial 21-Day Reset Pack, Beginner Consistency Plan, 30-Day Discipline Challenge, 75-Day Tribe Mode, 14-Day Comeback Sprint, and 21-Day Event Prep Pack metadata with Pro/pack creation gates are implemented.
- Store product IDs in code: `com.risewiththetribe.pro.monthly`, `com.risewiththetribe.pro.yearly`, `com.risewiththetribe.pack.21_day_reset`, `com.risewiththetribe.pack.summer_shred`, `com.risewiththetribe.pack.beginner_consistency`, `com.risewiththetribe.pack.discipline_30`, `com.risewiththetribe.pack.tribe_mode_75`, `com.risewiththetribe.pack.comeback_14`, and `com.risewiththetribe.pack.event_prep_21`.
- Creator/coach challenge hosting.

Release checks:

- Free users can still log activities, join core challenges, and share progress.
- Paid entitlements are checked consistently on Web, iOS, and Android.
- User-generated content submissions include explicit consent before external reposting.
- Referral rewards count meaningful signups or joins, not only link opens.

## Platform Release Surface Index

Notifications, deep links, and release safety contracts now live in `docs/feature-catalog/platform-release-surfaces.md` so the main feature catalog stays easier to scan while preserving the same reminder, native notification, app-link, Universal Link, hosting, build-gate, and release-check requirements.

<!-- include: feature-catalog/platform-release-surfaces.md -->

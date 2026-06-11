# Store Readiness Guide

Use this guide before every App Store / Google Play release.

## Shared Pre-Release Gate

Run from the web repo:

```bash
nvm use
npm run release:check:all
```

The web repo includes `.nvmrc` with Node 20. Use an LTS Node runtime from 18.x through 22.x before running the gate. Node 24 has been observed to hang while `react-scripts` loads its production webpack config; `npm run build` now fails fast with a runtime guard instead of silently stalling. The build also runs through `scripts/run-react-build-with-timeout.js`, which terminates a React production build after `BUILD_IDLE_TIMEOUT_MS` of no output so release checks fail loudly instead of hanging forever.

To run the full gate and refresh the monetization release audit only after it passes:

```bash
nvm use
npm run release:check:all:audit
```

This verifies:

- Web tests and production build.
- Shared parity/release contracts.
- iOS simulator build via `npm run native:ios:build`.
- Android debug build via `npm run native:android:build`.
- The generated audit in `docs/MONETIZATION_RELEASE_AUDIT.md` can be refreshed only after the full gate passes, without changing the external-store evidence status.

The iOS build command uses a generic simulator destination plus `/private/tmp/TribeChallengeDerivedData` and `/private/tmp/TribeChallengeSPM` so local Xcode cache state does not decide whether the release gate can run.

After App Store / Play credentials are configured, use `docs/STORE_TEST_PURCHASE_RUNBOOK.md` to record the real sandbox/license-test purchase evidence required before any paid-access launch decision.

To inspect the current external store credential and evidence checklist without changing entitlements:

```bash
npm run store:readiness
```

This command reads only local environment variables and the shared product catalog. It reports missing or placeholder App Store / Play validation keys, lists configured product IDs, and prints the required sandbox/license-test evidence matrix. Use `node scripts/check-store-launch-readiness.js --strict` only when credentials are expected to be configured and a missing or placeholder key should fail the check.

For automation or audit tooling, use:

```bash
node scripts/check-store-launch-readiness.js --json
```

The JSON output includes `launchReady`, per-platform readiness, configured products, required evidence cases with accepted result statuses, safe-denial flags for negative tests, and the final decision string.

## Android Google Play Index

Android package, Firebase, Google Sign-In, App Links, and Play Billing validation setup now live in `docs/store-readiness/android-google-play.md` so this store readiness guide stays readable while preserving the same Play release contract.

<!-- include: store-readiness/android-google-play.md -->

## iOS App Store Index

iOS bundle ID, Apple Developer capabilities, Universal Links, and App Store receipt-validation setup now live in `docs/store-readiness/ios-app-store.md` so this store readiness guide stays readable while preserving the same App Store release contract.

<!-- include: store-readiness/ios-app-store.md -->

## Web / Firebase Hosting

Before deploying:

```bash
npm run test:release
npm run release:check
```

Deploy hosting and app-link files:

```bash
npm run hosting:release
```

`hosting:release` requires `ANDROID_APP_LINK_SHA256` so production Android App Links are not deployed with placeholder fingerprints.

## Privacy and Data Safety

The product uses:

- Firebase Authentication account data.
- Firestore profile, activity, challenge, badge, and leaderboard data.
- Uploaded profile images or avatar selections.
- HealthKit / Health Connect activity data when the user opts in.
- Local notification preferences.
- Generated share images/text.
- Account/data deletion request records under `accountDeletionRequests/{uid}` when a user asks support to remove their account data.
- Support request records under `supportRequests` when a user asks for account, billing, bug, safety, or general help.

Store forms should state:

- Activity and health data is used to log progress and calculate points/badges.
- Profile image/avatar and display name may appear in challenge leaderboards.
- Health sync is optional.
- The app is not a medical, telehealth, diagnosis, or treatment service.
- The app does not provide financial services, gambling, government, election, news, tobacco, or COVID tracing features.
- In-app account deletion requests are support-reviewed and do not cancel subscriptions, process refunds, or bypass App Store / Google Play marketplace policy.
- In-app support requests are for follow-up only and do not process refunds, cancel subscriptions, write entitlements, or bypass marketplace policy.
- Subscription management guidance points members to Apple ID subscriptions or Google Play subscriptions first, then restore/sync and support review; it does not cancel subscriptions in-app, process refunds, create purchases, or write entitlements.

## Release Checklist

- `npm run test:release` passes for static release contracts, focused store-readiness CLI, `purchase-entitlements` backend, badges, challenge-templates, campaign-share, profile-share, Weekly Campaign derived-data, monetization-model, engagement-copy, referral-copy, support-billing-copy, creator-partner-copy, build-wrapper, build-runtime guard, release-audit generator, and cross-platform parity suites.
- `npm run release:check:all` passes before store submission.
- `docs/STORE_TEST_PURCHASE_RUNBOOK.md` has been followed for real iOS sandbox and Android license-test evidence.
- Android `google-services.json` is present for local/store builds.
- Android debug/release SHA fingerprints are registered in Firebase.
- Play App Signing SHA-256 is used to deploy `assetlinks.json`.
- Apple App ID has Associated Domains and HealthKit enabled.
- Firebase Hosting has deployed both `.well-known` files.
- Google Play Data Safety form reflects auth/profile/activity/health data use.
- App Store privacy nutrition labels reflect auth/profile/activity/health data use.
- In-app account deletion request flow writes `accountDeletionRequests/{uid}`, admin profiles show the review queue, and the hosted data-deletion page is deployed.
- In-app support request flow writes `supportRequests`, admin profiles show the open support queue, and the hosted support page is deployed.
- App Store / Play Billing products exist for `com.risewiththetribe.pro.monthly`, `com.risewiththetribe.pro.yearly`, `com.risewiththetribe.pack.21_day_reset`, `com.risewiththetribe.pack.summer_shred`, `com.risewiththetribe.pack.beginner_consistency`, `com.risewiththetribe.pack.discipline_30`, `com.risewiththetribe.pack.tribe_mode_75`, `com.risewiththetribe.pack.comeback_14`, and `com.risewiththetribe.pack.event_prep_21` before enabling checkout in production.
- Firebase Functions purchase-validation config is present before expecting paid purchases to unlock Pro.
- `getPurchaseValidationReadiness` returns `validation_configured` before running store test purchases, but paid launch still waits for recorded sandbox/license-test evidence.
- `functions/.env.example` lists every required App Store and Play validation key with placeholders only.
- Invite link opens Challenges join flow on iOS and Android.
- Google Sign-In works on emulator and release-signed build.
- Health sync permission denial is handled gracefully.

# Store Readiness Guide

Use this guide before every App Store / Google Play release.

## Shared Pre-Release Gate

Run from the web repo:

```bash
npm run release:check:all
```

This verifies:

- Web tests and production build.
- Shared parity/release contracts.
- iOS simulator build.
- Android debug build.

## Android Google Play

Package name:

```text
com.risewiththetribe.challengetracker
```

Firebase setup:

1. Firebase Console > Project settings > Your apps.
2. Add/select Android app using the package name above.
3. Add local debug SHA-1 for emulator testing:

```text
2D:07:3A:B0:18:8F:01:E6:28:72:41:B1:86:5F:F9:14:89:19:15:8A
```

4. Add release/upload SHA fingerprints once release signing is configured.
5. Download the updated `google-services.json`.
6. Place it at:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/google-services.json
```

Google sign-in notes:

- A status-code 10 / OAuth error means the app package and signing SHA-1 do not match Firebase/Google Cloud OAuth setup.
- The Android Gradle build reads `BuildConfig.GOOGLE_WEB_CLIENT_ID` from the Web OAuth client in `app/google-services.json` when the file exists.
- Keep `app/google-services.json` current after adding debug, upload, or Play App Signing fingerprints.
- The app shows a visible login-screen error instead of silently returning from Google Sign-In.
- Emulator account selection may still require Google re-auth credentials before the app receives the final Firebase ID token.

Play App Signing:

1. Create the app in Google Play Console.
2. Enable Play App Signing.
3. Get the **Play App Signing SHA-256** from Play Console.
4. Generate and deploy Android App Links:

```bash
ANDROID_APP_LINK_SHA256="PLAY_APP_SIGNING_SHA256" npm run hosting:release
```

Android App Links:

- Manifest already handles `https://risewiththetribe.app?join=...`.
- Domain verification requires `/.well-known/assetlinks.json` generated with the Play App Signing SHA-256.

Play Billing receipt validation:

- Create/choose a Google Cloud service account with access to the Play Developer API.
- Grant the service account access to the app in Play Console.
- Store the service account JSON as a Firebase Functions secret/env value named:

```text
PLAY_DEVELOPER_SERVICE_ACCOUNT_JSON
```

- Store the package name as:

```text
PLAY_PACKAGE_NAME=com.risewiththetribe.challengetracker
```

- Use `functions/.env.example` as the local/deployment template. Keep real service account JSON and private keys outside git.
- Until these values are configured, `verifyPurchase` returns `validation_not_configured` and does not unlock entitlements.
- When all values are configured, `getPurchaseValidationReadiness` returns `validation_configured`; this means the backend can call Google Play, not that paid launch QA has passed.
- Once credentials are configured, `verifyPurchase` calls the Google Play Developer API. Only verified active subscriptions or purchased one-time products unlock access.
- Verified Play purchases are idempotently merged into `users/{uid}.entitlements` and stored as audit-safe records in `purchaseEntitlements`.

## iOS App Store

Bundle ID:

```text
com.risewiththetribe.challengetracker
```

Apple Developer setup:

1. Create/select the App ID with the bundle ID above.
2. Enable Associated Domains.
3. Enable HealthKit.
4. Confirm entitlements include:

```text
applinks:risewiththetribe.app
com.apple.developer.healthkit
```

iOS Universal Links:

- App handles `https://risewiththetribe.app?join=...`.
- Domain verification requires:

```text
https://risewiththetribe.app/.well-known/apple-app-site-association
```

This file is in:

```text
public/.well-known/apple-app-site-association
```

App Store receipt validation:

- Create an App Store Connect API key with access to purchase validation.
- Configure Firebase Functions with:

```text
APP_STORE_ISSUER_ID
APP_STORE_KEY_ID
APP_STORE_PRIVATE_KEY
APP_STORE_BUNDLE_ID=com.risewiththetribe.challengetracker
```

- Use `functions/.env.example` as the local/deployment template. Keep real App Store Connect private keys outside git.
- Until these values are configured, `verifyPurchase` returns `validation_not_configured` and does not unlock entitlements.
- When all values are configured, `getPurchaseValidationReadiness` returns `validation_configured`; this means the backend can call App Store Server API, not that paid launch QA has passed.
- Once credentials are configured, `verifyPurchase` calls the App Store Server API transaction lookup. Only matching bundle ID, product ID, and transaction ID results unlock access.
- Verified App Store purchases are idempotently merged into `users/{uid}.entitlements` and stored as audit-safe records in `purchaseEntitlements`.

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

- `npm run test:release` passes for static release contracts and focused cross-platform parity checks.
- `npm run release:check:all` passes before store submission.
- Android `google-services.json` is present for local/store builds.
- Android debug/release SHA fingerprints are registered in Firebase.
- Play App Signing SHA-256 is used to deploy `assetlinks.json`.
- Apple App ID has Associated Domains and HealthKit enabled.
- Firebase Hosting has deployed both `.well-known` files.
- Google Play Data Safety form reflects auth/profile/activity/health data use.
- App Store privacy nutrition labels reflect auth/profile/activity/health data use.
- In-app account deletion request flow writes `accountDeletionRequests/{uid}`, admin profiles show the review queue, and the hosted data-deletion page is deployed.
- In-app support request flow writes `supportRequests`, admin profiles show the open support queue, and the hosted support page is deployed.
- App Store / Play Billing products exist for `com.risewiththetribe.pro.monthly`, `com.risewiththetribe.pro.yearly`, `com.risewiththetribe.pack.21_day_reset`, and `com.risewiththetribe.pack.summer_shred` before enabling checkout in production.
- Firebase Functions purchase-validation config is present before expecting paid purchases to unlock Pro.
- `functions/.env.example` lists every required App Store and Play validation key with placeholders only.
- Invite link opens Challenges join flow on iOS and Android.
- Google Sign-In works on emulator and release-signed build.
- Health sync permission denial is handled gracefully.

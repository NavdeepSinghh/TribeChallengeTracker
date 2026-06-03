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
- The app now shows a visible login-screen error instead of silently returning from Google Sign-In.

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

## Web / Firebase Hosting

Before deploying:

```bash
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

Store forms should state:

- Activity and health data is used to log progress and calculate points/badges.
- Profile image/avatar and display name may appear in challenge leaderboards.
- Health sync is optional.
- The app is not a medical, telehealth, diagnosis, or treatment service.
- The app does not provide financial services, gambling, government, election, news, tobacco, or COVID tracing features.

## Release Checklist

- `npm run release:check:all` passes.
- Android `google-services.json` is present for local/store builds.
- Android debug/release SHA fingerprints are registered in Firebase.
- Play App Signing SHA-256 is used to deploy `assetlinks.json`.
- Apple App ID has Associated Domains and HealthKit enabled.
- Firebase Hosting has deployed both `.well-known` files.
- Google Play Data Safety form reflects auth/profile/activity/health data use.
- App Store privacy nutrition labels reflect auth/profile/activity/health data use.
- Invite link opens Challenges join flow on iOS and Android.
- Google Sign-In works on emulator and release-signed build.
- Health sync permission denial is handled gracefully.

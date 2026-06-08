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

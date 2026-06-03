# Web/iOS Feature Parity

This file is the shared contract for features that must behave consistently in:

- Web/Capacitor: `/Users/navdeepsmacbook/Documents/TribeChallengeTracker`
- Native iOS: `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS`
- Native Android: `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid`

When adding a feature, update this file first or alongside the implementation.

## Shared Firestore Contracts

### User Profile Appearance

Document: `users/{uid}`

| Field | Type | Meaning |
|---|---|---|
| `profileImageData` | string, optional | Base64 JPEG image data for uploaded profile picture. |
| `avatarEmoji` | string, optional | Emoji avatar fallback when no uploaded photo is present. |
| `avatarColor` | string, optional | Hex color used for avatar background/border. |

Behavior:

- Uploaded photos should be resized/compressed before saving.
- Choosing an avatar clears `profileImageData`.
- Existing users without these fields must still render using rank/default avatar.
- Web and iOS must read/write the same fields.
- Profile appearance updates must also be propagated to joined challenge member docs so leaderboards render without extra per-row profile lookups.
- Challenge member docs should denormalize `profileImageData`, `avatarEmoji`, and `avatarColor` when users create or join challenges.

Current status:

| Platform | Upload Photo | Create Avatar | Remove Photo | Shared Fields |
|---|---:|---:|---:|---:|
| Web | Done | Done | Done | Done |
| iOS | Done | Done | Done | Done |

## Feature Build Checklist

For every new feature:

1. Define shared Firestore fields and legacy compatibility.
2. Implement Web, native iOS, and native Android in the same feature slice using the same backend contracts.
3. Add platform-specific capability notes, such as HealthKit, Apple Developer capabilities, or Meta App IDs.
4. Compile/build and smoke-test all three apps where feasible.
5. Update this parity file with status and remaining caveats.

If a feature is intentionally platform-specific, document the reason and the equivalent parity behavior for the other two platforms before shipping it.

## Platform-Specific Caveats

- Apple Health / Watch sync requires HealthKit entitlement and Apple Developer App ID HealthKit capability.
- Android Health Connect auto-sync requires Health Connect permissions and uses periodic WorkManager background sync.
- Daily reminders use local notifications on native iOS/Android. Web reminders use browser notifications while the web app is open; reliable closed-browser reminders require a push/service-worker backend.
- Direct Instagram Story sharing requires a Meta/Facebook App ID passed as `source_application`.
- WhatsApp Status does not expose a direct public iOS handoff API; use the native share sheet with a generated story image.
- iOS Universal Links require `/.well-known/apple-app-site-association` on the production domain and the Associated Domains capability on the App ID.
- Android App Links require `/.well-known/assetlinks.json` generated with the Google Play App Signing SHA-256 fingerprint.

## Current Cross-Platform Feature Status

| Feature | Web | iOS | Android |
|---|---|---|---|
| Daily log reminders | Browser notification reminder while app is open | Local morning/evening/off reminders | Local morning/evening/off reminders |
| Wearable health sync | Native wrapper only when running via Capacitor | Apple Health manual import + HealthKit auto-import observer | Health Connect manual import + opt-in WorkManager auto-sync |
| Progress sharing | Copy, WhatsApp, generated image/native share fallback | Generated image, copy/share sheet, Instagram Story fallback, WhatsApp Status guidance | Native PNG image share, Instagram Story intent, copy, WhatsApp-targeted share |
| Challenge leaving | Member leave, admin promote, sole-admin delete | Member leave, admin promote, sole-admin delete | Member leave, admin promote, sole-admin delete |
| Challenge invite flow | Invite code lookup, join, full invite link share/copy | Invite code lookup, join, full invite link share/copy | Invite code lookup, join, full invite link share/copy |
| Challenge invite deep links | Web route serves invite links and iOS AASA file | Universal Link handler + custom scheme fallback | App Link handler + custom scheme fallback |
| Challenge daily tracking | Per-day task checklist, points, daily history | Per-day task checklist, points, daily history | Per-day task checklist, points, daily history |
| Challenge badge stats | Completion/top-rank stats feed badge unlocks | Completion/top-rank stats feed badge unlocks | Completion/top-rank stats feed badge unlocks |

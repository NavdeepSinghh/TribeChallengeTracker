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
npm run test:release
```

Full web release gate:

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
- Bounded React build wrapper with `BUILD_IDLE_TIMEOUT_MS` no-output termination.
- Static parity/verification contracts and focused cross-platform parity source checks.
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

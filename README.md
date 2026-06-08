# 🏃 Rise With The Tribe – Challenge Tracker

A mobile-first React app for the @risewiththetribe 30-day fitness challenge.

## Features
- 📅 28-day activity calendar
- 🏆 Live leaderboard
- ⭐ Gamified badges (Yoga Guru, Run Champ, Iron Tribe & more)
- ⌚ Apple Watch / Samsung Galaxy Watch sync (ready for HealthKit/Google Fit integration)
- ✍️ Manual activity logging
- 📤 Progress sharing (Instagram Story, WhatsApp, link)

## Getting Started

```bash
npm install
npm start
```

## Store Link Verification

Challenge invite links use:

```text
https://risewiththetribe.app?join=INVITE_CODE
```

The web app hosts the verification files required by the native store apps:

- iOS Universal Links: `public/.well-known/apple-app-site-association`
- Android App Links: `public/.well-known/assetlinks.json`

Before deploying Android App Links for production, get the **Play App Signing SHA-256 certificate fingerprint** from Google Play Console, then run:

```bash
ANDROID_APP_LINK_SHA256="AA:BB:CC:..." npm run hosting:release
```

Multiple fingerprints can be supplied as a comma-separated list if needed:

```bash
ANDROID_APP_LINK_SHA256="PLAY_SHA256,UPLOAD_SHA256" npm run hosting:release
```

Firebase Hosting serves both files from `/.well-known/*` with `application/json`.

## Feature Documentation and Release Checks

Feature documentation for future contributors lives in:

```text
docs/FEATURE_CATALOG.md
docs/INSTAGRAM_CONTENT_BANK.md
docs/MARKETING_CONTENT_STRATEGY.md
docs/MONETIZATION_RELEASE_AUDIT.md
docs/MONETIZATION_ROADMAP.md
docs/STORE_READINESS.md
docs/STORE_TEST_PURCHASE_RUNBOOK.md
FEATURE_PARITY.md
```

Run the web release gate before deploying:

```bash
nvm use
npm run release:check
```

`npm run test:release` runs the static verifier, the focused store-readiness CLI test, and all focused cross-platform parity suites.

Run the full three-platform gate before store releases:

```bash
nvm use
npm run release:check:all
```

The full gate uses `npm run native:ios:build` with tmp Xcode/SwiftPM paths and `npm run native:android:build` for the Android debug build. Use Node 20 from `.nvmrc`; Node 24 is intentionally rejected before the CRA production build starts.

To run the full gate and refresh the monetization release audit only after it passes:

```bash
nvm use
npm run release:check:all:audit
```

## Project Structure

```
src/
  App.jsx        # Main app component (all tabs + logic)
  index.js       # React entry point
docs/
  FEATURE_CATALOG.md
  INSTAGRAM_CONTENT_BANK.md
  MARKETING_CONTENT_STRATEGY.md
  MONETIZATION_ROADMAP.md
  STORE_READINESS.md
public/
  index.html     # HTML shell
  .well-known/   # Native app link verification files
```

## Roadmap
- [ ] HealthKit integration (Apple Watch sync)
- [ ] Google Fit integration (Samsung/Android sync)
- [ ] Firebase backend for real leaderboard
- [ ] Push notifications for streak reminders
- [ ] React Native mobile app build

## Built for
[@risewiththetribe](https://instagram.com/risewiththetribe) – Melbourne-based social media & content creation.

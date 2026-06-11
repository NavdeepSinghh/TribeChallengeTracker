# Store Test Purchase Runbook

Use this runbook after App Store Connect, Google Play Console, and Firebase Functions purchase-validation credentials are configured. It is the evidence path for the roadmap item "Configure App Store / Play credentials and run real store test purchases."

## Preconditions

- `npm run release:check:all` passes on the release candidate.
- App Store products exist for `com.risewiththetribe.pro.monthly`, `com.risewiththetribe.pro.yearly`, `com.risewiththetribe.pack.21_day_reset`, `com.risewiththetribe.pack.summer_shred`, `com.risewiththetribe.pack.beginner_consistency`, `com.risewiththetribe.pack.discipline_30`, `com.risewiththetribe.pack.tribe_mode_75`, `com.risewiththetribe.pack.comeback_14`, and `com.risewiththetribe.pack.event_prep_21`.
- Play Billing products exist for the same product IDs.
- Firebase Functions has real App Store Server API and Google Play Developer API credentials configured outside git.
- `getPurchaseValidationReadiness` returns `validation_configured` for iOS and Android.
- `npm run store:readiness` reports no missing credential keys; use `node scripts/check-store-launch-readiness.js --strict` when this should fail fast.
- `node scripts/check-store-launch-readiness.js --json` can be attached to internal release notes after confirming it contains no secrets.
- Store tester accounts are not personal production accounts.

## iOS Sandbox Pass

1. Install the release candidate on an iOS simulator or device signed with the App Store product configuration.
2. Sign in with a test user and confirm Pro is not already active.
3. Purchase `com.risewiththetribe.pro.monthly`.
4. Confirm `verifyPurchase` returns a verified result and writes `users/{uid}.entitlements.pro.active`.
5. Restore purchases and confirm the restore path is idempotent.
6. Repeat purchase/restore evidence for `com.risewiththetribe.pack.21_day_reset`, `com.risewiththetribe.pack.summer_shred`, `com.risewiththetribe.pack.beginner_consistency`, `com.risewiththetribe.pack.discipline_30`, `com.risewiththetribe.pack.tribe_mode_75`, `com.risewiththetribe.pack.comeback_14`, and `com.risewiththetribe.pack.event_prep_21`.
7. Run a negative validation using a wrong-account or invalid transaction case and confirm it does not unlock access.

## Android License-Test Pass

1. Install the release candidate from an internal/app-sharing track using a licensed tester account.
2. Sign in with a test user and confirm Pro is not already active.
3. Purchase `com.risewiththetribe.pro.monthly`.
4. Confirm `verifyPurchase` returns a verified result and writes `users/{uid}.entitlements.pro.active`.
5. Restore/sync purchases and confirm the sync path is idempotent.
6. Repeat purchase/restore evidence for `com.risewiththetribe.pack.21_day_reset`, `com.risewiththetribe.pack.summer_shred`, `com.risewiththetribe.pack.beginner_consistency`, `com.risewiththetribe.pack.discipline_30`, `com.risewiththetribe.pack.tribe_mode_75`, `com.risewiththetribe.pack.comeback_14`, and `com.risewiththetribe.pack.event_prep_21`.
7. Run a negative validation using a wrong-account or invalid token case and confirm it does not unlock access.

## Evidence To Record

Record each proof item in the admin Store Test Purchase Evidence Log, not in source control:

- Platform: `ios` or `android`.
- Product ID.
- Test case: `sandbox_purchase`, `restore_sync`, `negative_validation`, or `wrong_account`.
- Result: `verified`, `verified_safe_denial`, `needs_review`, `failed`, or `archived`.
- Evidence note with tester account alias, timestamp, receipt-validation result, Firestore entitlement path checked, restore/sync result, and any support handoff note.

Never paste raw purchase tokens, App Store transaction payloads, Play purchase tokens, private keys, service account JSON, tester passwords, or personal user data into docs, commits, screenshots, or public review notes.

## Minimum Evidence Matrix

Before a paid launch review, the admin Store Test Purchase Evidence Log should contain at least these reviewed proof records:

| Platform | Product | Required test case | Required result |
|---|---|---|---|
| iOS | `com.risewiththetribe.pro.monthly` | `sandbox_purchase` | `verified` |
| iOS | `com.risewiththetribe.pro.monthly` | `restore_sync` | `verified` |
| iOS | `com.risewiththetribe.pack.21_day_reset` | `sandbox_purchase` | `verified` |
| iOS | `com.risewiththetribe.pack.summer_shred` | `sandbox_purchase` | `verified` |
| iOS | `com.risewiththetribe.pack.beginner_consistency` | `sandbox_purchase` | `verified` |
| iOS | `com.risewiththetribe.pack.discipline_30` | `sandbox_purchase` | `verified` |
| iOS | `com.risewiththetribe.pack.tribe_mode_75` | `sandbox_purchase` | `verified` |
| iOS | `com.risewiththetribe.pack.comeback_14` | `sandbox_purchase` | `verified` |
| iOS | `com.risewiththetribe.pack.event_prep_21` | `sandbox_purchase` | `verified` |
| iOS | Any configured product | `negative_validation` or `wrong_account` | `failed` or `verified_safe_denial` |
| Android | `com.risewiththetribe.pro.monthly` | `sandbox_purchase` | `verified` |
| Android | `com.risewiththetribe.pro.monthly` | `restore_sync` | `verified` |
| Android | `com.risewiththetribe.pack.21_day_reset` | `sandbox_purchase` | `verified` |
| Android | `com.risewiththetribe.pack.summer_shred` | `sandbox_purchase` | `verified` |
| Android | `com.risewiththetribe.pack.beginner_consistency` | `sandbox_purchase` | `verified` |
| Android | `com.risewiththetribe.pack.discipline_30` | `sandbox_purchase` | `verified` |
| Android | `com.risewiththetribe.pack.tribe_mode_75` | `sandbox_purchase` | `verified` |
| Android | `com.risewiththetribe.pack.comeback_14` | `sandbox_purchase` | `verified` |
| Android | `com.risewiththetribe.pack.event_prep_21` | `sandbox_purchase` | `verified` |
| Android | Any configured product | `negative_validation` or `wrong_account` | `failed` or `verified_safe_denial` |

For negative cases, the evidence note must say which entitlement path was checked and confirm that no Pro or pack access was unlocked. A negative case can be marked `verified_safe_denial` only when the verification is of the safe denial, not of a purchase unlock.

## Launch Gate

Paid access can move from review mode to final human launch review only when:

- iOS has verified Pro and challenge-pack evidence.
- Android has verified Pro and challenge-pack evidence.
- Restore/sync evidence exists on both platforms.
- Negative validation evidence exists on both platforms.
- Store Test Evidence Decision Reply Kit has no unresolved failed evidence.
- Paid Launch Decision Gate shows all required checks ready.

This runbook does not flip paid access live, write entitlements from client code, process refunds, bypass marketplace policy, or submit store review. It only defines the evidence required before the existing paid launch gate can be trusted.

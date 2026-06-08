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

Release backlog:

- Before App Store release, enroll in the paid Apple Developer Program, restore the `applinks:risewiththetribe.app` Associated Domains entitlement, and confirm the App ID/provisioning profile includes `com.apple.developer.associated-domains`.
- Local device builds may temporarily omit Associated Domains when signed with a Personal Team; Universal Links will not be validated in that mode.

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

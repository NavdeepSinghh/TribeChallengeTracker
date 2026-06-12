## Store Product Catalog

Purpose: keep App Store, Play Billing, web billing, and backend receipt validation aligned before purchases are enabled.

Shared product IDs:

- `com.risewiththetribe.pro.monthly`: monthly Tribe Pro subscription.
- `com.risewiththetribe.pro.yearly`: yearly Tribe Pro subscription.
- `com.risewiththetribe.pack.21_day_reset`: standalone 21-Day Reset Pack purchase candidate.
- `com.risewiththetribe.pack.summer_shred`: standalone 28-Day Summer Shred seasonal pack purchase candidate.
- `com.risewiththetribe.pack.beginner_consistency`: standalone Beginner Consistency Plan purchase candidate.
- `com.risewiththetribe.pack.discipline_30`: standalone 30-Day Discipline Challenge purchase candidate.
- `com.risewiththetribe.pack.tribe_mode_75`: standalone 75-Day Tribe Mode purchase candidate.
- `com.risewiththetribe.pack.comeback_14`: standalone 14-Day Comeback Sprint purchase candidate.
- `com.risewiththetribe.pack.event_prep_21`: standalone 21-Day Event Prep Pack purchase candidate.

Shared behavior:

- Web, iOS, and Android expose the same product identifiers in code.
- Profile checkout UI exists across Web, iOS, and Android.
- iOS has StoreKit service scaffolding for product loading and purchase launch.
- Android has Play Billing service scaffolding for product loading and purchase launch.
- Web has provider-neutral checkout buttons that use the shared catalog and fail clearly until billing is configured.
- Firebase Functions exposes callable `verifyPurchase` as the central verification endpoint.
- The current callable audits attempts and returns `validation_not_configured` until App Store / Play credentials are configured.
- With credentials present, the callable validates App Store transactions and Google Play purchases server-side before writing entitlements.
- The callable response includes `status`, `reason`, `message`, product metadata, required config keys, missing config keys, and the next backend action.
- Verified purchases are applied by the server only, using idempotent `purchaseEntitlements/{purchaseRecordId}` records and shared `users/{uid}.entitlements` fields.
- Profile purchase cards expose "Sync previous purchases" restore actions: iOS uses StoreKit current entitlements, Android uses Play Billing owned purchases, and Web remains provider-neutral until web billing exists.
- Store product parity verification compares backend `PRODUCT_CATALOG`, Web `STORE_PRODUCTS`, iOS `StoreProducts`, Android `StoreProducts`, and Android Play Billing query references before release checks pass.
- Profile purchase cards expose "Request entitlement review" actions that write `entitlementRecoveryRequests/{uid}` with `productCount`, `proActive`, `packCount`, `activePackCount`, `reason`, `status`, `source`, and timestamps for manual support review.
- Entitlement recovery reasons include `restore_sync_failed`, `missing_pro`, `missing_pack`, `account_mismatch`, and `billing_question`.
- Entitlement Recovery Review Queue is admin-only and must not write entitlements, process refunds, cancel subscriptions, create purchases, or bypass marketplace policy.
- Entitlement Recovery Admin Review Updates must only change review status and notes; they must not write entitlements, process refunds, cancel subscriptions, create purchases, or bypass marketplace policy.
- Entitlement Recovery Decision Reply Kit must be copy-only/manual UI and must not write entitlements, process refunds, cancel subscriptions, create purchases, retry charges, collect payment details, bypass App Store or Google Play policy, override marketplace decisions, expose private user data, promise restored access, auto-message users, scrape/store DMs, or pressure members.
- Store Test Purchase Evidence Log writes admin-only `storeTestPurchaseEvidence` records with `platform`, `productId`, `testCase`, `result`, `evidenceNote`, `status`, `source`, and timestamps after real sandbox/license-test QA.
- Store test evidence cases include `sandbox_purchase`, `restore_sync`, `negative_validation`, and `wrong_account`; initial evidence result is `needs_review`.
- Store Test Purchase Evidence Review Updates let admins mark evidence `verified`, `verified_safe_denial`, `needs_review`, `failed`, or `archived` with `reviewNote`, `reviewedBy`, and `reviewedAt` without writing entitlements, creating purchases, processing refunds, bypassing marketplace policy, or marking paid access live.
- Store Test Evidence Decision Reply Kit copies verified, safe-denial, needs-more-evidence, failed, and archived evidence replies without writing entitlements, creating purchases, processing refunds, bypassing marketplace policy, submitting store review, marking paid access live, or claiming sandbox/license-test purchases passed without evidence.
- Store Review Response Review Decision Reply Kit copies approved, waiting, not-ready, and declined reviewer-response replies without submitting store review, exposing private data, sharing secrets, unlocking paid access, writing entitlements, creating purchases, processing refunds, claiming review approval, marking paid access live, tracking, scraping messages, or bypassing marketplace policy.
- Store Test Purchase Evidence Log must not write entitlements, create purchases, process refunds, bypass marketplace policy, or mark paid access live.
- Paid Launch Decision Reply Kit copies ready, hold, blocked, and review-note replies without flipping paid access live, writing entitlements, creating purchases, processing payments/refunds, bypassing marketplace policy, submitting store review, or announcing launch readiness early.
- Paid Launch Decision Review Decision Reply Kit copies approved, waiting, not-ready, and declined paid-launch review replies without flipping paid access live, writing entitlements, creating purchases, processing payments/refunds, cancelling subscriptions, collecting payment details, submitting store review, claiming launch readiness, claiming sandbox proof, tracking, scraping messages, auto-messaging, pressure, or bypassing marketplace policy.
- Admin/creator profile surfaces show a Challenge Pack Launch Kit with copy-ready launch messaging for shared pack product IDs.
- Admin/creator profile surfaces show a Challenge Pack Launch QA Kit with copy-ready store setup, entitlement write, support routing, and launch-language checks for shared pack product IDs.
- Admin/creator profile surfaces show a Challenge Pack Objection Reply Kit with manual replies for paid-pack questions before marketplace validation is complete.
- Web admin/creator profile surfaces show a Challenge Pack Support Triage Kit with manual missing-pack, wrong-account, restore, refund, cancellation, and launch-language support lanes before pack launch copy is used.
- Web admin/creator profile surfaces show a Challenge Pack Store Readiness Script Kit with member-safe requested-pack, marketplace account, restore/sync, support-question, and in-app next-action language before paid pack access is promoted.
- Admin profile surfaces show a Store Credential Setup Kit with App Store Connect, Play Console, Firebase Functions secret, sandbox/test purchase, restore, and Firestore entitlement QA steps.
- Admin profile surfaces show a Subscription Management Guidance Kit with copy-ready App Store / Google Play subscription management, cancellation, restore/sync, and support-boundary guidance.
- Admin profile surfaces show a Billing Support Escalation Kit with copy-ready wrong-account, failed-renewal, duplicate-charge, cancellation-confusion, and missing-entitlement support handoff guidance.
- Admin profile surfaces show a Renewal Recovery Kit with copy-ready failed-renewal, grace-period, lapsed-access, restore/sync, and entitlement-recovery guidance.
- Admin profile surfaces show a Cancellation Feedback Kit with copy-ready learn-only churn prompts tied to first-party monetization signals.
- Admin profile surfaces show a Lapsed Member Winback Kit with free-first comeback challenge prompts tied to campaign, streak, referral, and first-party demand signals.
- Admin profile surfaces show a Store Launch Dry-Run Kit that exports a copy-ready release rehearsal report from launch gate, validation readiness, store-test evidence, entitlement recovery, support queue, policy links, and revenue-path signals.
- Admin profile surfaces show a Store Test Purchase Session Prep Kit with copy-ready sandbox/license-test run checks for validation readiness, product IDs, tester-account handling, restore/sync, negative validation, and evidence notes before real store test evidence is recorded.
- Admin profile surfaces show a Store Evidence Archive Kit with copy-ready sanitized evidence export and JSON audit archive checks for internal release packets before final paid launch review.
- Admin profile surfaces show a Store Evidence Export Template Kit with copy-ready sanitized JSON rows for platform, productId, testCase, result, evidenceNote, reviewNote, and reviewedAt before real sandbox/license-test evidence is reviewed.
- Admin profile surfaces show a Store Demo Account Kit with reviewer-safe demo account notes for App Store / Play review, seeded free-flow guidance, permission explanations, policy links, and paid-access cautions.
- Admin profile surfaces show a Store Screenshot QA Kit with reviewer-safe screenshot and caption prompts for seeded demo data, free challenge flows, policy links, data safety notes, store-test evidence, and paid-launch gate cautions.
- Admin profile surfaces show a Store Review Pack with copy-ready reviewer notes, policy evidence, permission explanations, data safety pointers, support/refund handoff, and paid-access readiness cautions.
- Web admin profile surfaces show a Store Review Resubmission Readiness Kit with policy-fix, reviewer-note, screenshot/caption, demo-account, support-link, and evidence-packet checks after App Review or Play follow-up.
- Firebase Functions exposes callable `getPurchaseValidationReadiness` so admin profile surfaces can check App Store / Play credential readiness without submitting a fake purchase or writing entitlements.
- Product IDs do not unlock features directly.
- Purchase and receipt-validation work must write the shared entitlement fields before gated UI unlocks.

Release checks:

- Store product IDs match `FEATURE_PARITY.md`.
- Store product parity must pass across backend, Web, iOS, Android, and Android Play Billing query references before running external store tests.
- Pro subscription products map to `entitlements.pro`.
- Challenge pack products map to stable `packId` values.
- Missing store products leave the current locked/free UI intact.
- Checkout product buttons render without granting entitlements directly.
- Native purchase services can query products without writing entitlements locally.
- Native purchase services can produce a backend verification payload from completed StoreKit/Play purchases.
- Native purchase restore/sync actions replay owned purchases through `verifyPurchase`; they do not grant access locally.
- Store Launch Readiness must show credential/test-purchase work as pending until external store setup and backend secrets are actually configured.
- Sandbox Purchase Test Plan must cover Pro subscriptions, challenge-pack products, restore/sync, failed validation, duplicate restore, wrong-account checks, and Firestore entitlement verification before paid access is promoted.
- Store Test Purchase Evidence Log must remain admin-only, require real external sandbox/license-test evidence, and record proof without becoming an entitlement or launch-approval switch.
- Challenge Pack Launch Kit must keep store credentials/test purchases marked pending and must not imply paid pack access is live before validation is configured.
- Challenge Pack Launch QA Kit must stay copy-only and must not claim packs are live, quote unconfigured prices, collect payments, create purchases, unlock packs, grant Pro, write entitlements, offer discounts, process refunds, bypass App Store or Google Play policy, submit store review, promise outcomes, imply medical results, auto-message users, scrape/store DMs, add tracking pixels, or pressure users.
- Challenge Pack Objection Reply Kit must not claim packs are live, quote unconfigured prices, collect payments, unlock packs, grant Pro, write entitlements, bypass marketplace policy, scrape/store DMs, add tracking pixels, or pressure users.
- Challenge Pack Support Triage Kit must stay copy-only and must not claim packs are live, quote unconfigured prices, collect payments, create purchases, unlock packs, grant Pro, write entitlements, process refunds, cancel subscriptions, bypass App Store or Google Play policy, expose private support notes, auto-message users, scrape/store DMs, add tracking pixels, or pressure users.
- Challenge Pack Store Readiness Script Kit must stay copy-only and must not unlock packs, create purchases, grant Pro, write entitlements, collect payment details, offer discounts, process refunds, cancel subscriptions, bypass App Store or Google Play policy, submit store review, claim paid packs are live, auto-message users, scrape/store DMs, add tracking pixels, or pressure users.
- Store Credential Setup Kit must stay admin-only and must not claim paid access is live before App Store / Play test purchases validate through `verifyPurchase` and write shared Firestore entitlements.
- Store Test Purchase Runbook must not store raw purchase tokens, private keys, service account JSON, tester passwords, or personal user data in docs, commits, screenshots, or public review notes.
- Subscription Management Guidance Kit must stay copy-only and must not cancel subscriptions in-app, process refunds, create purchases, write entitlements, bypass App Store or Play policy, collect payment details, promise outcomes, imply medical results, or claim paid access is live.
- Billing Support Escalation Kit must stay copy-only and must not cancel subscriptions in-app, process refunds, create purchases, write entitlements, override marketplace decisions, collect payment details, promise outcomes, imply medical results, or mark paid access live.
- Renewal Recovery Kit must stay copy-only and must not retry charges in-app, collect payment details, cancel subscriptions, process refunds, create purchases, write entitlements, override marketplace renewal status, promise restored access, imply medical results, or mark paid access live.
- Cancellation Feedback Kit must stay copy-only and must not block cancellation, retry charges in-app, collect payment details, offer unconfigured discounts, process refunds, create purchases, write entitlements, override marketplace subscription state, promise future pricing, imply medical results, pressure the member to stay, or mark paid access live.
- Lapsed Member Winback Kit must stay copy-only and must not auto-message users, scrape DMs, store inbound replies, add tracking pixels, create attribution records, offer unconfigured discounts, retry charges, collect payment details, create purchases, write entitlements, imply paid access is live, promise outcomes, imply medical results, or pressure members to return.
- Store Test Purchase Session Prep Kit must stay copy-only and must not create fake purchase evidence, store raw purchase tokens, store tester passwords, store private keys, store service account JSON, write entitlements from client code, create purchases outside StoreKit or Play Billing, process refunds, bypass marketplace policy, mark validation complete without credentials, mark paid access live, or submit store review.
- Store Evidence Archive Kit must stay copy-only and must not export raw purchase tokens, transaction IDs, order IDs, tester emails/passwords, private keys, service account JSON, private screenshots, write entitlements, create purchases, process refunds, bypass marketplace policy, flip paid access live, submit store review, or treat archived evidence as final launch approval.
- Store Evidence Export Template Kit must stay copy-only and must not create fake evidence, export raw purchase tokens, transaction IDs, order IDs, tester emails/passwords, private keys, service account JSON, private screenshots, write entitlements, create purchases, process refunds, bypass marketplace policy, flip paid access live, submit store review, or treat template records as verified evidence.
- Store Screenshot QA Kit must stay copy-only and must not submit store review, expose personal user data, expose private submissions, include passwords or secret keys, include purchase tokens, store credentials, store service account JSON, unlock paid access, grant Pro, unlock packs, write entitlements, create purchases, bypass StoreKit or Play Billing, process refunds, collect payment details, claim paid access is live, or claim sandbox/license-test evidence without proof.
- Validation readiness checks must be read-only: they must not create purchase audit attempts, verify fake purchases, or grant Pro / pack entitlements.
- `verifyPurchase` audit docs must never store raw purchase tokens; only token hashes are allowed.
- Verified Pro purchases write `users/{uid}.entitlements.pro.active == true`.
- Verified challenge pack purchases write `users/{uid}.entitlements.packs.{packId}.active == true`.
- The same verified purchase cannot be linked to a different user account.
- Receipt validation remains required before any purchase can unlock Pro or paid packs.

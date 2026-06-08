# Cross-Platform Feature Parity

This file is the shared contract for features that must behave consistently in:

- Web/Capacitor: `/Users/navdeepsmacbook/Documents/TribeChallengeTracker`
- Native iOS: `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS`
- Native Android: `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid`

When adding a feature, update this file first or alongside the implementation.

Product growth and revenue roadmap: `docs/MONETIZATION_ROADMAP.md`

Marketing and content operating plan: `docs/MARKETING_CONTENT_STRATEGY.md`

## Shared Firestore Contracts

### User Profile Appearance

Document: `users/{uid}`

| Field | Type | Meaning |
|---|---|---|
| `profileImageData` | string, optional | Base64 JPEG image data for uploaded profile picture. |
| `avatarEmoji` | string, optional | Emoji avatar fallback when no uploaded photo is present. |
| `avatarColor` | string, optional | Hex color used for avatar background/border. |
| `instagramHandle` | string, optional | Instagram username without `@`, used for share copy and future feature submissions. |

Behavior:

- Uploaded photos should be resized/compressed before saving.
- Choosing an avatar clears `profileImageData`.
- Existing users without these fields must still render using rank/default avatar.
- Web, iOS, and Android must read/write the same fields.
- Profile appearance updates must also be propagated to joined challenge member docs so leaderboards render without extra per-row profile lookups.
- Instagram handles should be normalized without `@`, limited to platform-safe characters, and optional.
- Challenge member docs should denormalize `profileImageData`, `avatarEmoji`, `avatarColor`, and `instagramHandle` when users create or join challenges.

Current status:

| Platform | Upload Photo | Create Avatar | Remove Photo | Instagram Handle | Shared Fields |
|---|---:|---:|---:|---:|---:|
| Web | Done | Done | Done | Done | Done |
| iOS | Done | Done | Done | Done | Done |
| Android | Done | Done | Done | Done | Done |

### Challenge Campaign Metadata

Document: `challenges/{challengeId}`

| Field | Type | Meaning |
|---|---|---|
| `campaignId` | string, optional | Stable campaign identifier for weekly or Instagram-led challenge launches. |
| `campaignLabel` | string, optional | Human-readable label shown on challenge cards, such as Weekly Campaign. |
| `campaignHashtag` | string, optional | Suggested Instagram hashtag for campaign sharing. |
| `campaignCta` | string, optional | Short creator/member prompt for what to post or who to tag. |
| `sponsorName` | string, optional | Human-readable sponsor or partner name for a challenge campaign. |
| `sponsorLabel` | string, optional | Short label for the sponsor block, such as Member Perk. |
| `sponsorPerk` | string, optional | User-facing value or perk copy attached to the campaign. |
| `sponsorUrl` | string, optional | Future partner link destination; empty until reviewed partner flows exist. |
| `isPremium` | boolean, optional | Whether the challenge was created from a premium challenge pack template. |
| `packId` | string, optional | Stable premium pack identifier, such as `21_day_reset`. |
| `packLabel` | string, optional | Human-readable premium pack label shown in UI. |
| `dailyPrompts` | array of strings, optional | Premium pack accountability prompts shown in tracker/detail surfaces. |
| `creatorSpecialty` | string, optional | Denormalized Coach Mode specialty from the creator profile when active Pro Coach Mode is enabled. |
| `creatorBio` | string, optional | Denormalized Coach Mode bio/promise shown on challenge detail surfaces. |
| `creatorCtaUrl` | string, optional | Denormalized creator CTA link for future branded challenge pages. |

Behavior:

- Campaign metadata is optional and existing challenges without these fields must still render normally.
- Campaign templates are ordinary challenge templates with additional metadata, so they can use the same create/join/track/invite backend.
- Invite share copy should include the campaign CTA, hashtag, invite link, and `@risewiththetribe` prompt where appropriate.
- Challenge invite surfaces should offer a generated launch card/image for Instagram and native share sheets.
- Profile surfaces for admins and enabled creators should include a Weekly Campaign Scheduler derived from campaign templates, with copy-ready Instagram cadence text.
- Profile surfaces for admins and enabled creators should include a Weekly Campaign Launch Card Kit derived from this week's campaign template, with copy-ready card headline, design notes, caption draft, hashtag, and consent-safe posting guardrails.
- Profile surfaces for admins and enabled creators should include a Weekly Campaign Preflight Checklist derived from this week's campaign template, manual DM replies, seven-day content cadence, referral copy, consent-reviewed UGC, and first-party review metrics.
- Profile surfaces for admins and enabled creators should include a Weekly Campaign Review Kit derived from campaign reach, referral joins, consent-reviewed UGC, manual DM copy readiness, and share-card usage.
- Profile surfaces for admins and enabled creators should include a Weekly Campaign Storyboard Kit derived from this week's campaign prompt, with manual Reel, Stories, and carousel planning copy.
- Profile surfaces for admins and enabled creators should include a Weekly Campaign Experiment Brief Kit derived from this week's campaign CTA, the recommended manual launch experiment, and first-party app movement signals.
- Profile surfaces for admins and enabled creators should include a Weekly Campaign Countdown Story Kit with manual pre-launch Story frames, countdown sticker copy, and app-first start reminders.
- Profile surfaces for admins and enabled creators should include a Weekly Campaign Start-Day Story Kit with manual launch-day Story frames, sticker copy, and first-log reminders.
- Profile surfaces for admins and enabled creators should include a Weekly Campaign Midweek Check-In Story Kit with manual comeback Story frames, sticker copy, and first-party re-engagement review prompts.
- Profile surfaces for admins and enabled creators should include a Weekly Campaign Weekend Push Story Kit with manual finish-line Story frames, sticker copy, and first-party completion momentum review prompts.
- Profile surfaces for admins and enabled creators should include a Weekly Campaign Completion Recap Story Kit with manual aggregate recap Story frames, Feature Me consent routing, and next-challenge prompts.
- Profile surfaces for admins and enabled creators should include a Weekly Campaign Next-Week Teaser Story Kit with manual next-challenge teaser frames, sticker copy, and first-party launch-angle review prompts.
- Profile surfaces for admins and enabled creators should include a Weekly Campaign Partner Perk Teaser Story Kit with manual perk-interest Story frames, app-first saved-interest routing, and partner-readiness guardrails.
- Profile surfaces for admins and enabled creators should include a Weekly Campaign Story Poll Kit derived from this week's campaign prompt, with manual poll, quiz, and question sticker copy that routes voters back into first-party app actions.
- Profile surfaces for admins and enabled creators should include a Weekly Campaign Poll Review Kit for converting visible Story poll reactions into next content/app CTAs while confirming decisions with first-party app movement.
- Profile surfaces for admins and enabled creators should include a Weekly Campaign Live Q&A Kit with manual Live setup, question lanes, close copy, and app-first follow-up guardrails from audience questions.
- Profile surfaces for admins and enabled creators should include a Weekly Campaign Live Recap Kit with manual post-Live readback, public recap copy, content decisions, and first-party signal review guardrails.
- Profile surfaces for admins and enabled creators should include a Weekly Campaign FAQ Carousel Kit with manual seven-slide carousel outline for repeated audience questions that routes action back into the app.
- Profile surfaces for admins and enabled creators should include a Weekly Campaign Caption Bank Kit with manual Reel, carousel, Story, and pinned-comment caption variants that route followers into first-party app actions.
- Profile surfaces for admins and enabled creators should include a Weekly Campaign Collab Invite Kit with manual creator outreach for collab posts and Story mentions that routes deeper hosting interest into first-party creator review flows.
- Profile surfaces for admins and enabled creators should include a Weekly Campaign Collab Follow-Up Kit with manual yes/post-guidance/paid-hosting/not-ready replies that keep paid creator terms behind Creator / Coach Mode review.
- Profile surfaces for admins and enabled creators should include a Weekly Campaign Collab Safety Checklist with manual consent, claim, private-reply, member-data, and paid-hosting readiness review before creator escalation.
- Profile surfaces for admins and enabled creators should include a Weekly Campaign Collab Recap Kit with manual post-collab review from first-party app movement, consent-cleared submissions, content lessons, and next-collab decisions.
- Profile surfaces for admins and enabled creators should include a Weekly Campaign Collab Renewal Kit with manual repeat-or-pause criteria and Creator / Coach Mode review routing before deeper hosting or paid terms.
- Profile surfaces for admins and enabled creators should include a Weekly Campaign Retention Follow-Up Kit with manual app-first lanes for active, comeback, feature-ready, interest-saved, and support-risk members after a campaign push.
- Profile surfaces for admins and enabled creators should include a Weekly Campaign Re-Invite Kit with manual next-challenge referral prompts for active, comeback, feature-ready, referral-curious, and support-risk members after a campaign push.
- Challenge tracker surfaces show a completion recap after the member completes the challenge duration, with points, completed days, streak, and share copy.
- Public challenge search should match campaign label/hashtag as well as name/tagline/creator.
- Sponsored challenge metadata is optional, seeded on selected templates, preserved when creating challenge documents, and rendered only when `sponsorName` is present.
- Sponsored challenge UI must stay informational until reviewed partner links/reporting exist; no ad tracking or random offer placement is part of this foundation.
- Premium challenge pack templates should use the same create/join/track backend, but creation is gated by `entitlements.pro.active` until store purchase plumbing is configured.
- Premium challenge pack templates can include `dailyPrompts` for extra accountability content; tracker/detail surfaces show them only when the array is present.
- Paid challenge pack template cards show a Pack Value Preview using existing template duration, task count, prompt count, and account unlock state.
- Free users can still create core free templates and public challenges.
- Pro creators with Coach Mode enabled denormalize `creatorSpecialty`, `creatorBio`, and `creatorCtaUrl` onto newly created challenge documents.
- Challenge detail/tracker surfaces render a Coach Host block only when denormalized creator specialty or bio fields are present.
- Pack Value Preview must not create entitlement writes, receipt assumptions, or new backend fields; it is conversion/education UI only.

Current status:

| Platform | Campaign Templates | Campaign Card Labels | Campaign Invite Copy | Launch Card Share | Weekly Scheduler | Premium Pack Gate | Shared Fields |
|---|---:|---:|---:|---:|---:|---:|---:|
| Web | Done | Done | Done | Done | Done | Done | Done |
| iOS | Done | Done | Done | Done | Done | Done | Done |
| Android | Done | Done | Done | Done | Done | Done | Done |

### Feature Submissions

Collection: `featureSubmissions`

| Field | Type | Meaning |
|---|---|---|
| `uid` | string | User who submitted the story. |
| `displayName` | string | Denormalized display name for review. |
| `email` | string | User email for internal follow-up only. |
| `instagramHandle` | string | Denormalized handle used for potential tagging. |
| `profileImageData` | string, optional | Current profile photo for review context. |
| `avatarEmoji` | string, optional | Avatar fallback for review context. |
| `avatarColor` | string, optional | Avatar color fallback for review context. |
| `category` | string | Submission type, such as `streak_win`, `comeback`, or `challenge_completion`. |
| `story` | string | User-submitted story text, capped client-side at 900 chars. |
| `mediaImageData` | string, optional | Compressed JPEG base64 attachment for progress/feature review. |
| `mediaContentType` | string, optional | Initial value `image/jpeg` when media is attached. |
| `consentToFeature` | boolean | User consent to review and potentially feature the submission. |
| `status` | string | Review state. Initial value is `pending`. |
| `source` | string | Platform source: `web`, `ios`, or `android`. |
| `createdAt` | timestamp | Submission time. |
| `reviewNote` | string, optional | Admin manual review note for consent, repost fit, claims safety, and caption context. |
| `reviewedBy` | string, optional | Admin user who last reviewed the submission. |
| `reviewedAt` | timestamp, optional | Review update time. |

Behavior:

- Users must provide consent before submitting.
- Users must provide enough story text for useful review.
- Submissions enter a pending review queue; public posting is not automatic.
- Users can see their most recent submissions and current review status.
- Users can attach one optional compressed progress photo.
- Admin-marked profiles can review pending submissions and set status to `approved`, `featured`, or `declined`.
- Feature Submission Review Notes let admins save manual `reviewNote`, `reviewedBy`, and `reviewedAt` metadata while keeping UGC/content review manual and consent-bound.
- Profile surfaces show a Community Highlights gallery by reading submissions where `status == featured`.
- Firestore rules allow authenticated members to read featured highlights, owners/admins to read private submissions, owners to create consented pending submissions, and admins to perform review updates.
- Community Highlights cards should use the submission media image when present, otherwise the denormalized avatar fallback, and provide repost-ready caption copy that tags `@risewiththetribe`.
- Profile surfaces show a Community Highlight Roundup Kit that copies weekly Instagram roundup text from featured submissions only.
- Profile surfaces show a UGC Consent Reminder Kit that copies a manual repost checklist for consent, review status, attribution, claim safety, and private-detail removal before posting member wins.
- Profile surfaces show an Instagram Weekly Prompt Kit that maps local weekday to a shared posting prompt and copies a caption with current first-party progress stats plus `@risewiththetribe`.
- Admin/creator profile surfaces show an Instagram Content Calendar with the full seven-day cadence and copy export.

Current status:

Community Highlight Roundup Kit copy must use submissions already marked `featured`; it must not auto-post, schedule posts, scrape DMs, export per-user activity, share unreviewed submissions, imply paid access is live, promise outcomes, or imply medical results.
UGC Consent Reminder Kit is copy-only and must not auto-post, schedule posts, scrape DMs, store inbound DMs, export private history, share unreviewed submissions, override consent, edit member claims into outcomes, imply paid access is live, promise outcomes, imply medical results, or pressure users.

| Platform | Submit Story | Consent Gate | Media Attachment | Status History | Community Highlights | Highlight Roundup Kit | Admin Review | Instagram Content Calendar | Shared Firestore Collection |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Web | Done | Done | Done | Done | Done | Done | Done | Done | Done |
| iOS | Done | Done | Done | Done | Done | Done | Done | Done | Done |
| Android | Done | Done | Done | Done | Done | Done | Done | Done | Done |

### Referral Invite Hooks

Challenge invite URLs may include an optional referrer:

```text
https://risewiththetribe.app?join=INVITE_CODE&ref=USER_ID
```

Document: `challenges/{challengeId}/members/{uid}`

| Field | Type | Meaning |
|---|---|---|
| `referredBy` | string, optional | User id from the invite link `ref` parameter, ignored when it equals the joining user. |
| `referralSource` | string, optional | Initial value `invite_link` when a valid referrer is present. |

Document: `users/{referrerUid}`

| Field | Type | Meaning |
|---|---|---|
| `stats.referralJoins` | number | Count of challenge joins attributed to this user's invite links. |

Behavior:

- Invite links generated from the apps should include the current user id as `ref`.
- Deep-link handling should preserve the optional referral until the user joins the challenge.
- Referral hooks track meaningful challenge joins, not link opens.
- Valid referred joins increment the referrer's `stats.referralJoins`.
- Profile surfaces show referral join count.
- Profile surfaces show a reward ladder at 1, 5, 10, and 25 attributed joins.
- Profile surfaces show referral analytics for earned tiers, joins remaining to next tier, and ladder completion.
- Profile surfaces show a Referral Launch Kit with copy-ready next-tier launch checklist, caption draft, manual comment reply, app-link guidance, and first-party join review prompts for Instagram/community sharing.
- Profile surfaces show a Referral Story Sprint Kit with copy-ready Story/Reel invite text for one accountability partner.
- Profile surfaces show a Referral Reward Social Proof Kit with copy-ready Story/carousel celebration text for unlocked referral progress.
- Profile surfaces show a Referral Reward Claim action for the highest unlocked tier.
- Admin profile surfaces show a Referral Reward Review Queue for open `referralRewardClaims`.
- Admin profile surfaces show a Referral Reward Decision Reply Kit with copy-ready approved/waiting/not-ready/declined manual replies for referral reward claims.
- Pro trials and deeper referral analytics are future layers on this contract and are not granted by the claim UI.

Document: `referralRewardClaims/{uid}_{tierTarget}`

| Field | Type | Meaning |
|---|---|---|
| `uid` | string | User requesting referral reward review. |
| `referralJoins` | number | First-party attributed challenge joins at request time. |
| `tierTarget` | number | Claimed tier threshold, one of 1, 5, 10, or 25. |
| `tierLabel` | string | Human label for the tier. |
| `reward` | string | Manual recognition or future perk candidate copy. |
| `status` | string | Initial value `open`; admins review outside profile UI. |
| `reviewNote` | string, optional | Admin note for the latest referral reward review decision. |
| `reviewedBy` | string, optional | Admin display name/email that saved the latest review update. |
| `reviewedAt` | timestamp, optional | Latest admin review update time. |
| `source` | string | Platform that submitted the request. |

Referral Launch Kit copy must use first-party progress and referral tier state only; it must not count link opens, grant rewards, write referral state, create payouts, create affiliate rewards, unlock entitlements, imply paid access is live, promise outcomes, imply medical results, scrape DMs, store inbound replies, add tracking pixels, pressure invites, or claim reward fulfillment before admin review.

Referral Story Sprint Kit copy must use first-party progress and referral tier state only; it must not count link opens, grant rewards, write referral state, create payouts, create affiliate rewards, unlock entitlements, imply paid access is live, promise outcomes, or imply medical results.

Referral Reward Social Proof Kit copy must use first-party referral progress only; it must not grant rewards, write referral state, create payouts, create affiliate rewards, unlock entitlements, imply paid access is live, promise outcomes, imply medical results, or claim fulfillment before admin review.

Referral Reward Decision Reply Kit is copy-only/manual UI and must not grant Pro, write entitlements, unlock challenge packs, create discounts, create payouts, create purchases, create affiliate rewards, write referral state, count link opens, claim fulfillment, promise outcomes, imply medical results, scrape/store DMs or replies, add tracking pixels, auto-message users, or pressure members.

Referral reward claims are request-only. They must not grant Pro, entitlements, discounts, purchases, payouts, affiliate rewards, or paid access from client code.

Current status:

| Platform | Emits `ref` Links | Reads `ref` Links | Stores Join Referral | Referral Count | Referral Analytics | Referral Launch Kit | Referral Story Sprint Kit | Reward Social Proof Kit | Reward Claim |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Web | Done | Done | Done | Done | Done | Done | Done | Done | Done |
| iOS | Done | Done | Done | Done | Done | Done | Done | Done | Done |
| Android | Done | Done | Done | Done | Done | Done | Done | Done | Done |

### Authentication

Shared behavior:

- Web, iOS, and Android use Firebase Authentication.
- Google Sign-In must map to the same Firebase project and create/read profiles from `users/{uid}`.
- New users enter onboarding once, and completed profiles open the main app.

Android configuration:

- Android uses package `com.risewiththetribe.challengetracker`.
- The local debug SHA-1 must be registered on the Firebase Android app for emulator Google Sign-In.
- `app/google-services.json` is intentionally ignored by git and must be present for local/store builds.
- The Android Gradle build reads the Web OAuth client from `google-services.json` for `BuildConfig.GOOGLE_WEB_CLIENT_ID`; stale `local.properties` values should not override the Firebase config when the JSON file exists.

Current status:

| Platform | Firebase Auth | Google Sign-In | Onboarding |
|---|---:|---:|---:|
| Web | Done | Done | Done |
| iOS | Done | Done | Done |
| Android | Done | Configured; final emulator login may require Google re-auth | Done |

### Account Deletion Requests

Collection: `accountDeletionRequests/{uid}`

| Field | Type | Meaning |
|---|---|---|
| `uid` | string | Auth user id requesting deletion; must match the document id. |
| `email` | string | Denormalized email for support follow-up. |
| `displayName` | string | Denormalized display name for support context. |
| `status` | string | Initial value `requested`. |
| `source` | string | Platform source: `web`, `ios`, or `android`. |
| `reviewNote` | string | Admin-only support review note for identity, subscription/refund context, retention obligations, and next action. |
| `reviewedBy` | string | Admin/reviewer display name or email. |
| `requestedAt` | timestamp | Request creation time. |
| `reviewedAt` | timestamp | Latest admin review timestamp. |
| `updatedAt` | timestamp | Latest request update time. |

Mirror field on `users/{uid}`:

| Field | Type | Meaning |
|---|---|---|
| `accountDeletionRequest.status` | string | Current visible request state. Initial value `requested`. |
| `accountDeletionRequest.source` | string | Platform that submitted the request. |
| `accountDeletionRequest.requestedAt` | timestamp | Request creation time. |

Behavior:

- Profile surfaces on Web, iOS, and Android include an Account Deletion Request card near policy/support links.
- Submitting creates or merges `accountDeletionRequests/{uid}` and mirrors the visible status on `users/{uid}.accountDeletionRequest`.
- Admin profile surfaces on Web, iOS, and Android include an Account Deletion Review Queue that lists pending `requested` entries for support follow-up.
- Admin review actions on Web, iOS, and Android can mark requests `verified`, `contacted`, `blocked`, or `closed` with `reviewNote`, `reviewedBy`, and `reviewedAt`, while mirroring the reviewed status on `users/{uid}.accountDeletionRequest`.
- Admin profile surfaces on Web, iOS, and Android include an Account Deletion Decision Reply Kit with copy-ready verified/contacted/blocked/closed support replies.
- The in-app flow records a support-reviewed request only. It must not immediately delete the Firebase Auth account, erase activity/purchase records, cancel subscriptions, process refunds, or bypass App Store / Google Play marketplace policy.
- Firestore rules allow authenticated users to create/update only their own request document with `status == requested`; admins can update review fields/statuses, update only the mirrored accountDeletionRequest field on user docs, and delete request documents as part of support operations.

Current status:

| Platform | Request UI | Writes Request Doc | Mirrors Profile Status | Admin Review Queue | Shared Rules |
|---|---:|---:|---:|---:|---:|
| Web | Done | Done | Done | Done | Done |
| iOS | Done | Done | Done | Done | Done |
| Android | Done | Done | Done | Done | Done |

### Support Requests

Collection: `supportRequests`

| Field | Type | Meaning |
|---|---|---|
| `uid` | string | Auth user id requesting support. |
| `email` | string | Denormalized email for follow-up. |
| `displayName` | string | Denormalized display name for support context. |
| `category` | string | One of `general`, `account`, `billing`, `bug`, or `safety`. |
| `message` | string | User-submitted support message, capped client-side at 1200 chars. |
| `status` | string | Initial value `open`. |
| `reviewNote` | string, optional | Admin follow-up note for the request. |
| `reviewedBy` | string, optional | Admin display name/email that saved the latest review update. |
| `reviewedAt` | timestamp, optional | Latest admin review update time. |
| `source` | string | Platform source: `web`, `ios`, or `android`. |
| `createdAt` | timestamp | Request creation time. |
| `updatedAt` | timestamp | Latest request update time. |

Behavior:

- Profile surfaces on Web, iOS, and Android include a Support Request card near policy/support links.
- Submitting creates a `supportRequests` document for the signed-in user.
- Admin profile surfaces on Web, iOS, and Android include a Support Review Queue that lists open support requests.
- Support Request Admin Review Updates let admins mark support requests `waiting`, `resolved`, or `closed` with `reviewNote`, `reviewedBy`, and `reviewedAt`.
- Admin profile surfaces on Web, iOS, and Android include a Support Decision Reply Kit with copy-ready waiting/resolved/closed/marketplace escalation replies.
- The in-app flow is for follow-up only. It must not process refunds, cancel subscriptions, write entitlements, resolve purchases, or bypass App Store / Google Play marketplace policy.
- Firestore rules allow authenticated users to create their own `open` support requests and admins to read/update/delete requests.

Current status:

| Platform | Request UI | Writes Support Doc | Admin Review Queue | Shared Rules |
|---|---:|---:|---:|---:|
| Web | Done | Done | Done | Done |
| iOS | Done | Done | Done | Done |
| Android | Done | Done | Done | Done |

### Tribe Pro Entitlement

Document: `users/{uid}`

| Field | Type | Meaning |
|---|---|---|
| `entitlements.pro.active` | boolean | Whether the user currently has Tribe Pro access. |
| `entitlements.pro.source` | string, optional | Entitlement source such as `app_store`, `play_billing`, `admin`, or `none`. |
| `entitlements.pro.productId` | string, optional | Store product id when a purchase is attached. |
| `entitlements.pro.expiresAt` | timestamp, optional | Expiry time for renewable/trial entitlements. |
| `goals.weeklyActiveDaysTarget` | number, optional | Pro custom target for active days per week. Defaults to 5. |
| `goals.weeklyPointsTarget` | number, optional | Pro custom target for weekly points. Defaults to 250. |
| `goals.streakTarget` | number, optional | Pro custom target for streak focus. Defaults to 30. |
| `cosmetics.profileFrameId` | string, optional | Pro profile frame id. Supported values: `none`, `ember`, `gold`, `neon`. Defaults to `none`. |
| `sharePreferences.templateId` | string, optional | Progress share template id. Supported values: `classic`, `gold`, `neon`. Defaults to `classic`; `gold` and `neon` require Pro. |
| `creatorProfile.enabled` | boolean, optional | Whether Creator / Coach Mode profile metadata is enabled. Defaults to false and currently requires Pro in client UI. |
| `creatorProfile.specialty` | string, optional | Creator specialty label, max 60 chars. |
| `creatorProfile.bio` | string, optional | Creator/coach bio or challenge promise, max 240 chars. |
| `creatorProfile.ctaUrl` | string, optional | Future branded-page CTA URL, max 160 chars. |
| `creatorProfile.revenueShareInterest` | boolean, optional | Pro creator opt-in signal for future paid hosting / revenue-share beta. Defaults to false. |
| `streakRecovery.lastRecoveredDate` | string, optional | Last `yyyy-MM-dd` date recovered with a Pro streak recovery credit. |
| `proTrialInterest.selectedIds` | array of strings, optional | First-party interest reasons for a future Tribe Pro trial. Allowed ids: `reports`, `challenge_packs`, `creator_tools`. |
| `communityEventInterest.selectedIds` | array of strings, optional | First-party interest signals for future local meetups, milestone merch, studio pop-ups, and finisher moments. Allowed ids: `local_meetup`, `milestone_merch`, `studio_popup`, `finisher_moment`. |

Behavior:

- All platforms must read the same entitlement path before gating future Pro features.
- New web-created users default to `active: false` and `source: none`.
- Current UI can show subscription checkout choices; native purchase flows require configured App Store / Play products and receipt validation before enabling paid access.
- Profile surfaces include a Pro-gated analytics/report preview that unlocks when `entitlements.pro.active == true`.
- Pro analytics reports use shared weekly and monthly score contracts based on activity days, activity points, current streak progress, custom goals, consistency percentage, status label, and next-best-action copy. Monthly scoring uses the last 30 days and scales weekly goals to four-week pace.
- Tribe Pro checkout surfaces include a Pro Value Snapshot using existing weekly score, 30-day active days, challenge points, and a best-fit Pro benefit prompt.
- Tribe Pro checkout surfaces include Pro Trial Interest capture for first-party demand signals before live store products are fully validated.
- Admin profiles show a Pro trial demand summary and Trial Launch Kit by counting saved Pro Trial Interest reasons across user profiles.
- Admin profiles show a Pro Trial Objection Reply Kit that turns aggregate Pro Trial Interest demand into manual replies for Pro questions before store-backed trials are live.
- Admin profiles show a Monetization Launch Board that combines aggregate Pro trial, creator beta, and partner perk demand signals.
- Admin and enabled creator profiles show a Launch Experiment Kit that recommends manual Pro trial, pack-drop, referral sprint, or partner-perk experiments from first-party signal counts.
- Admin and enabled creator profiles show a Launch Experiment Scorecard that scores the recommended test from first-party demand, campaign reach, and community-loop signals.
- Admin and enabled creator profiles show a Release QA Checklist for product IDs, store test purchases, entitlement writes, feature parity docs, and social share checks before monetization or campaign launches.
- Admin and enabled creator profiles show a Launch Retrospective Kit for manual first-party review after campaign pushes using challenge joins, referrals, feature submissions, share-card usage, and entitlement validation.
- Admin and enabled creator profiles show a Revenue Pathway Planner that ranks Pro, paid packs, creator hosting, and partner campaigns from first-party demand, campaign, and referral signals.
- Admin and enabled creator profiles show a Pricing Test Kit that exports safe pricing-language prompts for shared Pro and pack product IDs before store launch.
- Admin and enabled creator profiles show a Founder Member Offer Kit that exports early-member value-validation copy for the free challenge loop before paid access.
- Admin and enabled creator profiles show a Community Ambassador Kit that exports recognition-led referral and challenge-leadership prompts before paid roles or payouts.
- Admin and enabled creator profiles show a Community Event Interest Kit that exports local meetup, milestone merch, studio pop-up, and finisher-moment validation copy from first-party app signals before tickets, orders, venues, partner links, payouts, or event promises exist.
- Admin and enabled creator profiles let members save Community Event Interest options to `users/{uid}.communityEventInterest.selectedIds`, and admin summaries count aggregate first-party event demand only.
- Admin and enabled creator profiles show a Customer Value Checklist that exports free-loop, paid-value, community-proof, and support-readiness checks before charging users.
- Admin profiles show a Support Refund Readiness Kit that exports restore, marketplace refund, entitlement recovery, and escalation handoff copy before paid launch.
- Admin profiles show a Paid Launch Decision Gate that exports go/no-go checks for product IDs, demand, support handoff, receipt-validation credentials, store test evidence coverage, and entitlement QA before paid access is promoted.
- Admin profiles show a Sandbox Purchase Test Plan that exports App Store sandbox, Play license test, restore, backend validation, entitlement QA, and negative-case checks before paid access is promoted.
- Admin profiles show a Store Listing Copy Kit that exports App Store / Play listing title, subtitle, short description, value points, launch positioning, and policy-safe paid-feature cautions.
- Admin profiles show a Store Review Submission Kit that exports App Store / Play reviewer notes, demo-account checklist, permission explanations, support/privacy/data-deletion reminders, and policy-safe paid-access cautions.
- Admin profiles show a Store Review Evidence Pack that exports store-test evidence counts, product IDs, policy/support links, permission notes, validation readiness, and launch gate status for reviewer-safe submission notes.
- Profile surfaces show a Policy and Support Link Hub that opens hosted privacy, terms, support, and account/data deletion resources for users and store reviewers.
- Profile surfaces include a Support Request flow that writes `supportRequests` and admin-only review queues for open requests.
- Profile surfaces include an Account Deletion Request flow that writes `accountDeletionRequests/{uid}` and mirrors `users/{uid}.accountDeletionRequest.status`.
- Admin profiles show a Data Safety Disclosure Kit that exports Play Data Safety and App Privacy disclosure notes for auth, profile content, activity/health data, UGC, purchase verification, notifications, support, and deletion resources.
- Admin profiles show a Campaign Performance Board that aggregates campaign-backed challenge count, active/public/premium/seasonal splits, and member reach.
- Pro feature flags currently gate premium analytics, private challenge creation, and paid challenge pack creation.
- Pro users can save custom weekly active-day, weekly points, and streak targets under `users/{uid}.goals`.
- Free users can see target progress previews, but save/edit actions stay locked.
- Profile surfaces show a Streak Rescue Prompt Kit that copies a pressure-safe restart prompt from current streak, streak target, Pro status, and existing recovery state.
- Profile surfaces show a Comeback Challenge Invite Kit that turns missed-day recovery copy into this week's campaign invite and DM prompt.
- Profile surfaces show a Value Proof Story Kit that turns current app progress, report scores, challenge points, and the weekly campaign prompt into copy-ready Instagram Story proof.
- Profile surfaces show a Story Posting Checklist Kit that bundles the weekly campaign CTA, app proof, comeback prompt, referral action, and consent-cleared highlights into a manual Instagram Story sequence.
- Pro users can save premium profile frames under `users/{uid}.cosmetics.profileFrameId`.
- Profile frame changes propagate `profileFrameId` to joined challenge member docs so challenge avatars render consistently.
- Pro users can save premium progress share templates under `users/{uid}.sharePreferences.templateId`.
- Free users can keep using the default `classic` share template; premium template selection remains locked.
- Pro-only badges use shared ids `pro_weekly_report`, `pro_streak_saver`, and `pro_finisher`; they award only when `entitlements.pro.active == true`.
- Finisher, champion, and Pro finisher badge checks read per-challenge member progress plus daily challenge logs on all platforms, so badges are not dependent on stale profile aggregate counters.
- Seasonal campaign templates use shared IDs `seasonal_summer_shred` and `seasonal_winter_base` across Web, iOS, and Android; Summer Shred is premium-gated and Winter Base is free.
- Paid challenge packs unlock when the user has active Pro or an active pack entitlement at `entitlements.packs.{packId}.active`; this gate is enforced in Web, iOS, and Android challenge creation.
- Profile checkout surfaces on Web, iOS, and Android show specific challenge-pack unlock state instead of treating every pack as only a Pro subscription benefit.
- Pro users can save Creator / Coach Mode metadata under `users/{uid}.creatorProfile` for future hosted/branded challenge surfaces.
- Creator / Coach Mode surfaces include a Pro-gated analytics foundation derived from existing challenge docs: hosted challenges, member reach, active hosted challenges, and private hosted challenges.
- Creator / Coach Mode surfaces include revenue-share readiness metrics for hosted paid-pack challenges and hosted challenges with at least five members, plus a Pro-gated `creatorProfile.revenueShareInterest` beta opt-in.
- Creator / Coach Mode surfaces include a Creator Launch Kit that generates Instagram/community launch copy from the creator profile and next hosted challenge invite code.
- Creator / Coach Mode surfaces include a Creator Challenge Template Draft Kit that exports a reusable hosted challenge template checklist before creating new creator templates or paid-hosting offers.
- Creator / Coach Mode surfaces include a Creator Branded Page Preview Kit that exports a Coach Host block, creator CTA, challenge copy, consent, and no-claims review checklist before hosted challenge promotion.
- Creator / Coach Mode surfaces include a Private Creator Invite Kit that exports invite-only private challenge launch guidance from hosted challenge, private count, member reach, and first-party app movement while keeping paid hosting behind manual review.
- Creator / Coach Mode surfaces include a Creator Hosting Offer Kit that generates a copy-only paid-hosting planning brief from creator focus, hosted challenge reach, revenue-ready signals, beta interest, and the next hosted challenge.
- Creator / Coach Mode surfaces include a Creator Terms Readiness Kit that generates a copy-only responsibilities and guardrails brief for creator conduct, moderation, payout readiness, marketplace alignment, and support handoff before paid hosting.
- Creator / Coach Mode surfaces include a Creator Payout Readiness Kit that generates a copy-only payout provider, tax, identity, refund, support, marketplace, and claim-safety checklist before revenue-share.
- Creator / Coach Mode surfaces include a Creator Hosting Objection Reply Kit that generates manual replies for creator paid-hosting questions before revenue-share, payout operations, store validation, and entitlement QA are complete.
- Creator / Coach Mode surfaces include a Creator Hosting Application action that writes `creatorHostingApplications/{uid}` for manual admin review.
- Admin profiles show a Creator Hosting Application Review Queue for open `creatorHostingApplications`.
- Creator Hosting Application Admin Review Updates let admins set `approved`, `waiting`, `not_ready`, or `declined` plus `reviewNote`, `reviewedBy`, and `reviewedAt` on `creatorHostingApplications` without creating contracts, payouts, purchases, entitlements, revenue-share, or paid-access claims.
- Admin profiles show a Creator Hosting Decision Reply Kit that exports manual approved/waiting/not-ready/declined creator replies without creating contracts, payouts, purchases, entitlements, revenue-share, or paid-access claims.
- Admin profiles show a Creator demand summary by counting enabled creator profiles, future revenue-share beta opt-ins, and creator profiles with branding content.
- Profile surfaces include a Partner Perks foundation for future aligned brand offers without ad/tracking behavior.
- Partner perk interest is saved to `users/{uid}.partnerPerkInterest.selectedIds` with allowed ids: `gear`, `recovery`, and `nutrition`.
- Partner perk interest is a demand signal only; it must not trigger random ads, tracking pixels, or third-party data sharing.
- Eligible partner perks can be submitted with `REQUEST PERK REVIEW` to `partnerPerkClaims/{uid}_{perkId}` for manual review only.
- Admin profiles show `PARTNER PERK CLAIM REVIEW QUEUE` for open `partnerPerkClaims`.
- Profile surfaces show Partner perk claim status history from the signed-in user's `partnerPerkClaims`, including `Review-only claim history from partnerPerkClaims` and `No partner perk claims yet` empty-state copy.
- Profile surfaces include a Partner Campaign Application action that writes `partnerCampaignApplications/{uid}` for manual sponsor-pilot review.
- Admin profiles show a Partner Campaign Application Review Queue for open `partnerCampaignApplications`.
- Admin profiles show a Partner Campaign Decision Reply Kit that exports manual approved/waiting/not-ready/declined sponsor-pilot replies without partner links, tracking pixels, ad targeting, payouts, purchases, entitlements, revenue-share, paid-access claims, third-party data exports, fulfillment promises, or pressure.
- Pro Trial Interest is a demand signal only; it must not grant entitlements, start a purchase, or imply a free trial exists in the stores.
- Pro trial demand summaries are admin-only aggregate counts and must not expose per-user interest lists in the UI.
- Pro Trial Objection Reply Kit is copy-only and must not claim a store-backed trial is live, quote unconfigured prices, collect payments, create purchases, grant Pro, write entitlements, offer discounts, promise founder pricing, imply guaranteed outcomes, imply medical results, scrape DMs, store inbound DMs, add tracking pixels, or pressure users.
- Creator demand summaries are admin-only aggregate counts and must not expose per-user creator opt-ins in the UI.
- Creator Challenge Template Draft Kit is copy-only/manual planning UI and must not create template records, create contracts, collect payments, create purchases, write entitlements, start revenue-share, create payouts, create partner links, add tracking pixels, export private member activity, scrape/store DMs, store inbound replies, promise earnings, imply paid hosting is live, promise outcomes, imply medical results, or pressure creators or members.
- Creator Branded Page Preview Kit is copy-only/manual review UI and must not create branded page records, create contracts, collect payments, create purchases, write entitlements, start revenue-share, add tracking pixels, export private member activity, scrape/store DMs, store inbound replies, promise earnings, imply paid hosting is live, promise outcomes, imply medical results, or pressure creators or members.
- Private Creator Invite Kit is copy-only/manual invite UI and must not auto-message, scrape/store DMs, store inbound replies, count link opens, export private member activity, create contracts, create payouts, start revenue-share, collect payments, create purchases, write entitlements, grant paid access, promise earnings, imply paid hosting is live, promise outcomes, imply medical results, or pressure invitees.
- Creator Hosting Offer Kit is copy-only/manual planning UI and must not create contracts, payouts, purchases, entitlements, or paid-access claims.
- Creator Terms Readiness Kit is copy-only/manual planning UI and must not create contracts, collect payout details, collect tax details, start revenue-share, process payments, create purchases, write entitlements, process refunds, bypass marketplace policy, promise outcomes, imply medical results, or claim paid creator hosting is live.
- Creator Payout Readiness Kit is copy-only/manual planning UI and must not create payouts, collect payout details, collect tax details, create contracts, start revenue-share, process payments, create purchases, write entitlements, process refunds, bypass marketplace policy, promise outcomes, imply medical results, or claim paid creator hosting is live.
- Creator Hosting Objection Reply Kit is copy-only/manual reply UI and must not claim paid creator hosting is live, quote unconfigured prices, collect payments, create purchases, create contracts, collect payout details, collect tax details, start revenue-share, write entitlements, process refunds, bypass marketplace policy, scrape/store DMs, add tracking pixels, or pressure creators.
- Creator Hosting Application is manual review UI and must not create contracts, payouts, purchases, entitlements, revenue-share, or paid-access claims.
- Monetization Launch Board is admin-only and aggregate-only; it must not expose per-user interest details in the UI.
- Launch Experiment Kit is manual/copy-only and must not add tracking pixels, schedule posts, write experiment records, or claim paid access is live before store validation and entitlement QA are complete.
- Launch Experiment Scorecard is read-only/manual planning UI and must not create experiment records, track off-platform behavior, or grant/imply paid access.
- Release QA Checklist is copy-only/manual launch readiness UI and must not write purchases, entitlements, experiments, or off-platform tracking state.
- Launch Retrospective Kit is copy-only/manual review UI and must not write experiments, attribution, off-platform tracking, purchases, or entitlement state.
- Revenue Pathway Planner is copy-only/manual planning UI and must not write purchases, entitlements, partner links, tracking pixels, paid-access claims, or payout promises.
- Pricing Test Kit is copy-only/manual planning UI and must not quote unconfigured prices, collect payments outside approved store flows, grant purchases, write entitlements, offer discounts, or claim paid access is live.
- Founder Member Offer Kit is copy-only/manual planning UI and must not create sales, coupons, lifetime deals, payments, purchases, entitlements, discounts, or founder-pricing promises.
- Community Ambassador Kit is copy-only/manual planning UI and must not create commissions, payouts, paid roles, affiliate links, partner tracking, purchases, entitlements, discounts, or revenue-share promises.
- Community Event Interest Kit is copy-only/manual planning UI and must not sell tickets, collect payments, create orders, promise merch, book venues, create partner links, create payouts, write entitlements, export private member data, add tracking pixels, scrape DMs, imply paid access is live, promise outcomes, imply medical results, or pressure members.
- Community Event Interest capture must sanitize selected ids against the shared allowlist and must not create tickets, orders, payments, merch promises, venues, partner links, payouts, entitlements, private member exports, tracking pixels, or scraped DM records.
- Customer Value Checklist is copy-only/manual planning UI and must not charge users, unlock paid access, promise outcomes, imply medical results, run discounts, write entitlements, or promote paid features as live.
- Streak Rescue Prompt Kit is copy-only and must not award points, create activity logs, spend recovery credits, write entitlements, unlock Pro, imply paid access is live, promise outcomes, imply medical results, or pressure users after missed days.
- Comeback Challenge Invite Kit is copy-only and must not auto-message users, scrape DMs, create challenge joins, create activity logs, spend recovery credits, write referral state, write entitlements, imply paid access is live, promise outcomes, imply medical results, or pressure users after missed days.
- Value Proof Story Kit is copy-only and must not auto-post, scrape DMs, add tracking pixels, export private history, create purchases, grant Pro, write entitlements, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Story Posting Checklist Kit is copy-only and must not auto-post, schedule posts, scrape DMs, store inbound DMs, add tracking pixels, export private history, share unreviewed submissions, create challenge joins, write referral state, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Support Refund Readiness Kit is copy-only/manual planning UI and must not process refunds in-app, override App Store or Play refund policy, write entitlements manually, promise outcomes, imply medical results, or promote paid access as live.
- Paid Launch Decision Gate reads `storeTestPurchaseEvidence` iOS/Android coverage counts, remains copy-only/manual planning UI, and must not flip paid access live, write entitlements, process payments, process refunds, bypass marketplace policy, promise outcomes, imply medical results, or announce launch readiness early.
- Sandbox Purchase Test Plan is copy-only/manual QA UI and must not run live charges, bypass marketplace policy, unlock entitlements from profile UI, write fake purchases, process refunds, promise outcomes, imply medical results, or claim paid access is live.
- Store Listing Copy Kit is copy-only/manual planning UI and must not claim paid access is live, advertise unconfigured prices, promise outcomes, imply medical results, mention refunds outside marketplace policy, unlock entitlements, or submit policy-conflicting copy.
- Store Review Submission Kit is copy-only/manual planning UI and must not submit inaccurate permission claims, provide personal user data in reviewer notes, bypass marketplace purchase review, claim medical or guaranteed fitness outcomes, unlock paid access from client code, or mark the app ready for review before store products, policies, support links, privacy/data deletion flows, and entitlement QA are verified.
- Store Review Evidence Pack is copy-only/manual planning UI and must not submit store review, expose personal user data, unlock paid access, write entitlements, create purchases, process refunds, bypass marketplace policy, mark paid access live, or claim review readiness before evidence, products, credentials, policies, support links, restore flow, and entitlement QA are verified.
- Policy and Support Link Hub must open hosted informational resources only; it must not delete data in-app, process refunds, grant entitlements, collect payments, collect support messages in-app, or imply medical advice.
- Account Deletion Request and Review Queue flows must record and expose support-reviewed requests only; they must not immediately delete the account, erase activity/purchase records, cancel subscriptions, process refunds, or bypass marketplace policy.
- Account Deletion Decision Reply Kit is copy-only/manual UI and must not delete Firebase Auth accounts, erase activity records, erase purchase records, cancel subscriptions, process refunds, write entitlements, bypass App Store or Google Play policy, collect payment details, expose private user data, promise immediate deletion, auto-message users, scrape/store DMs, or pressure members.
- Support Request and Review Queue flows must be follow-up only and must not process refunds, cancel subscriptions, write entitlements, resolve purchases, or bypass marketplace policy.
- Support Decision Reply Kit is copy-only/manual UI and must not process refunds, cancel subscriptions, resolve purchases, write entitlements, delete accounts, erase activity records, collect payment details, bypass App Store or Google Play policy, expose private user data, promise immediate resolution, auto-message users, scrape/store DMs, or pressure members.
- Data Safety Disclosure Kit is copy-only/manual planning UI and must not submit store privacy labels that conflict with current permissions, hide optional health/media collection, imply medical or guaranteed fitness outcomes, claim third-party ad tracking exists, omit purchase verification data, or collect new data without updating privacy, data safety, feature parity docs, and release QA.
- Campaign Performance Board is admin-only and aggregate-only; it must not expose per-user campaign participation details in the UI.
- Weekly Campaign Preflight Checklist is copy-only/manual planning UI and must not schedule posts, auto-post to Instagram, scrape/store DMs, add tracking pixels, export per-user activity, share user content without consent, imply paid access is live, promise outcomes, or imply medical results.
- Weekly Campaign Review Kit is copy-only/manual review UI and must not create attribution records, add tracking pixels, scrape/store Instagram DMs, export per-user activity, share user content without consent, imply paid access is live, promise outcomes, or imply medical results.
- Weekly Campaign Storyboard Kit is copy-only/manual content planning UI and must not auto-post to Instagram, schedule posts from the app, scrape/store DMs, add tracking pixels, export per-user activity, share user content without consent, imply paid access is live, promise outcomes, or imply medical results.
- Weekly Campaign Experiment Brief Kit is copy-only/manual planning UI and must not create experiment records, schedule posts, auto-post to Instagram, add tracking pixels, scrape/store Instagram DMs, export per-user activity, share user content without consent, imply paid access is live, promise outcomes, or imply medical results.
- Weekly Campaign Comment Reply Kit is copy-only/manual public reply UI and must not auto-reply, scrape comments, scrape/store DMs, store inbound comments, add tracking pixels, create attribution records, export per-user activity, share user content without consent, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign Countdown Story Kit is copy-only/manual Story countdown UI and must not auto-post, schedule Stories, scrape Story responses, scrape comments, scrape/store DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Story interactions as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign Start-Day Story Kit is copy-only/manual launch-day Story UI and must not auto-post, schedule Stories, scrape Story responses, scrape comments, scrape/store DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Story reactions as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign Midweek Check-In Story Kit is copy-only/manual comeback Story UI and must not auto-post, schedule Stories, scrape Story responses, scrape comments, scrape/store DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Story reactions as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign Weekend Push Story Kit is copy-only/manual finish-line Story UI and must not auto-post, schedule Stories, scrape Story responses, scrape comments, scrape/store DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Story reactions as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign Completion Recap Story Kit is copy-only/manual aggregate recap Story UI and must not auto-post, schedule Stories, scrape Story responses, scrape comments, scrape/store DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Story reactions as app consent, share private responses, share user wins without Feature Me consent, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign Next-Week Teaser Story Kit is copy-only/manual next-challenge teaser Story UI and must not auto-post, schedule Stories, scrape Story responses, scrape comments, scrape/store DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Story reactions as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign Partner Perk Teaser Story Kit is copy-only/manual partner-interest Story UI and must not auto-post, schedule Stories, scrape Story responses, scrape comments, scrape/store DMs, store Instagram identities, store inbound replies, create attribution records, create affiliate links, create partner payouts, contact partners as if demand is validated, add tracking pixels, export per-user activity, treat Story reactions as app consent, share private responses, imply paid access or perks are live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign Story Poll Kit is copy-only/manual Story sticker planning UI and must not auto-post, scrape Story responses, scrape comments, scrape/store DMs, store inbound replies, add tracking pixels, create attribution records, export per-user activity, treat Instagram votes as app consent, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign Poll Review Kit is copy-only/manual review UI and must not scrape Story responses, store Instagram voter identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Instagram votes as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign Live Q&A Kit is copy-only/manual Live planning UI and must not auto-host, record private replies, scrape comments, scrape/store DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Live questions as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign Live Recap Kit is copy-only/manual Live recap UI and must not auto-post, record private replies, scrape comments, scrape/store DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Live questions as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign FAQ Carousel Kit is copy-only/manual FAQ carousel UI and must not auto-post, schedule posts, scrape comments, scrape/store DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Instagram questions as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign Caption Bank Kit is copy-only/manual caption planning UI and must not auto-post, schedule posts, scrape comments, scrape/store DMs, store inbound replies, create attribution records, add tracking pixels, export per-user activity, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign Collab Invite Kit is copy-only/manual creator outreach UI and must not auto-message, scrape/store DMs, store inbound replies, create contracts, create payouts, promise revenue-share, create affiliate links, add tracking pixels, export per-user activity, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure creators.
- Weekly Campaign Collab Follow-Up Kit is copy-only/manual creator follow-up UI and must not auto-message, scrape/store DMs, store inbound replies, create contracts, create payouts, promise revenue-share, create affiliate links, add tracking pixels, export per-user activity, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure creators.
- Weekly Campaign Collab Safety Checklist is copy-only/manual creator consent and claim review UI and must not auto-message, scrape/store DMs, store inbound replies, create contracts, create payouts, promise revenue-share, create affiliate links, add tracking pixels, export per-user activity, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure creators.
- Weekly Campaign Collab Recap Kit is copy-only/manual creator recap UI and must not scrape posts/comments/DMs, store Instagram identities, store inbound replies, create attribution records, create contracts, create payouts, promise revenue-share, create affiliate links, add tracking pixels, export per-user activity, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure creators.
- Weekly Campaign Collab Renewal Kit is copy-only/manual creator renewal UI and must not auto-message, scrape posts/comments/DMs, store Instagram identities, store inbound replies, create attribution records, create contracts, create payouts, promise revenue-share, create affiliate links, add tracking pixels, export per-user activity, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure creators.
- Weekly Campaign Retention Follow-Up Kit is copy-only/manual post-campaign UI and must not auto-message users, scrape posts/comments/DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, offer discounts, collect payment details, create purchases, write entitlements, imply paid access is live, share private responses, promise outcomes, imply medical results, or pressure members.
- Weekly Campaign Re-Invite Kit is copy-only/manual next-challenge referral UI and must not auto-message users, count link opens, grant rewards, write referral state, create payouts, create affiliate rewards, unlock entitlements, offer discounts, collect payment details, create purchases, scrape posts/comments/DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, imply paid access is live, share private responses, promise outcomes, imply medical results, or pressure members.
- Partner Campaign Activation Kit is copy-only/manual planning UI and must not add partner links, tracking pixels, ad targeting, purchases, entitlements, or paid-access claims.
- Partner Terms Readiness Kit is copy-only/manual planning UI and must not add partner links, tracking pixels, ad targeting, affiliate payouts, commissions, revenue-share, purchases, entitlements, discounts, coupons, third-party data sharing, medical claims, guaranteed outcomes, or paid-access claims.
- Partner Contract Readiness Kit is copy-only/manual planning UI and must not create partner links, tracking pixels, ad targeting, affiliate payouts, commissions, revenue-share, purchases, entitlements, discounts, coupons, third-party data sharing, medical claims, guaranteed outcomes, paid-access claims, or fulfillment promises.
- Partner Campaign Objection Reply Kit is copy-only/manual reply UI and must not claim partner campaigns are live, add partner links, add tracking pixels, use ad targeting, collect payments, create purchases, create affiliate payouts, create commissions, start revenue-share, write entitlements, offer discounts, share third-party data, scrape/store DMs, or pressure users.
- Partner Campaign Application is manual review UI and must not add partner links, tracking pixels, ad targeting, affiliate payouts, purchases, entitlements, revenue-share, or paid-access claims.
- Partner Campaign Application Admin Review Updates let admins set `approved`, `waiting`, `not_ready`, or `declined` plus `reviewNote`, `reviewedBy`, and `reviewedAt` on `partnerCampaignApplications` without adding partner links, tracking pixels, ad targeting, affiliate payouts, purchases, entitlements, revenue-share, or paid-access claims.
- Partner Campaign Decision Reply Kit is copy-only/manual UI and must not create partner links, tracking pixels, ad targeting, affiliate payouts, commissions, coupons, discounts, purchases, entitlements, revenue-share, paid-access claims, third-party data exports, payment collection, fulfillment promises, outcome/medical claims, scraped/stored replies, or pressure partners or members.
- Partner Perk Claim is manual review UI and must not create coupons, partner links, payouts, discounts, purchases, entitlements, or paid-access claims.
- Successful Partner Perk Claim requests show `Partner perk claim sent for manual review` copy.
- Partner Perk Claim Status History is read-only review UI and must not create coupons, partner links, payouts, discounts, purchases, entitlements, or paid-access claims.
- Admin profiles show `PARTNER PERK FULFILLMENT READINESS KIT` with `COPY PERK FULFILLMENT KIT`, backed by `partnerPerkFulfillmentReadinessCopy`, for manual claim-readiness checks before any partner fulfillment exists.
- Partner Perk Fulfillment Readiness Kit is copy-only/manual UI and must not create coupons, partner links, payouts, discounts, purchases, entitlements, affiliate rewards, tracking pixels, ad targeting, third-party data exports, paid-access claims, or fulfillment promises.
- Admin profiles show `PARTNER PERK FULFILLMENT HANDOFF KIT` with `COPY PERK HANDOFF KIT`, backed by `partnerPerkFulfillmentHandoffCopy`, for manual approved-claim handoff notes before any partner fulfillment exists.
- Partner Perk Fulfillment Handoff Kit is copy-only/manual UI and must not create coupons, partner links, payouts, discounts, purchases, entitlements, affiliate rewards, tracking pixels, ad targeting, third-party data exports, paid-access claims, payment collection, fulfillment promises, outcome/medical claims, auto-message users, scrape/store DMs, or pressure members.
- Admin profiles show `PARTNER PERK HANDOFF AUDIT KIT` with `COPY PERK AUDIT KIT`, backed by `partnerPerkHandoffAuditCopy`, for aggregate-only support outcome checks after manual approved-claim handoff.
- Partner Perk Handoff Audit Kit is copy-only/manual UI and must not create coupons, partner links, payouts, discounts, purchases, entitlements, affiliate rewards, tracking pixels, ad targeting, third-party data exports, paid-access claims, payment collection, refunds, fulfillment promises, outcome/medical claims, auto-message users, scrape/store DMs, or pressure members.
- Admin profiles show `PARTNER PERK DECISION REPLY KIT` with `COPY PERK DECISION REPLIES`, backed by `partnerPerkDecisionReplyCopy`, for manual approved/waiting/not-ready/declined claim replies before any partner fulfillment exists.
- Partner Perk Admin Decision Reply Kit is copy-only/manual UI and must not create coupons, partner links, payouts, discounts, purchases, entitlements, affiliate rewards, tracking pixels, ad targeting, third-party data exports, paid-access claims, or fulfillment promises.
- Partner Perk Claim Admin Review Updates let admins set `approved`, `waiting`, `not_ready`, or `declined` plus `reviewNote`, `reviewedBy`, and `reviewedAt` on `partnerPerkClaims` without creating coupons, partner links, payouts, discounts, purchases, entitlements, or paid-access claims.
- Partner perk cards show member eligibility progress from first-party stats only: Gear at 14 active days, Recovery at 7 challenge days, and Fuel at 1 referral join.
- Admin profiles show a first-party partner demand summary by counting saved partner perk interest across user profiles.
- Admin profiles show a Partner Pitch Kit that turns first-party partner demand counts into copy for aligned sponsor outreach.
- Admin profiles show a Partner Campaign Activation Kit that turns first-party perk demand, campaign reach, and referral signals into a copy-only sponsor-backed challenge pilot brief.
- Admin profiles show a Partner Terms Readiness Kit that turns first-party partner demand, campaign reach, and referral signals into a copy-only sponsor-pilot terms brief for partner fit, disclosure, data boundaries, destination review, reporting, and support handoff.
- Admin profiles show a Partner Contract Readiness Kit that turns first-party partner demand, campaign reach, and referral signals into a copy-only contract checklist for partner identity, support ownership, disclosure, fulfillment, privacy, reporting, and destination review.
- Admin profiles show a Partner Campaign Objection Reply Kit that turns first-party partner demand, campaign reach, and referral signals into manual replies for sponsor-pilot questions before partner links, tracking, payouts, purchases, revenue-share, and entitlements exist.
- Admin profiles show a Partner Campaign Decision Reply Kit that turns open partner campaign applications and first-party demand into manual approved/waiting/not-ready/declined replies before partner links, tracking, payouts, purchases, revenue-share, and entitlements exist.
- Partner Campaign Application review queues use first-party saved perk demand, campaign reach, and referral signals only; they must not expose per-user partner interest lists outside the request document/admin queue.
- Pro users can recover yesterday by writing a zero-point `streak_recovery` activity into `users/{uid}/activityLog/{date}`.
- Recovery entries should preserve existing activities on the recovered day and should not award points.
- Non-Pro users can still create public challenges; private challenge writes fall back to public at save time.
- Non-Pro users cannot create challenges from premium pack templates; client UI blocks selection and create services also reject/return nil.
- Free users must retain the core logging, challenge, badge, sharing, and profile experience.
- Non-Pro users must not receive premium badges even if the underlying activity condition is met.

Current status:

| Platform | Reads Shared Entitlement | Profile Status UI | Pro Analytics Report | Custom Goals | Profile Frames | Share Templates | Creator Mode | Private Challenge Gate | Paid Pack Gate | Purchase Flow |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Web | Done | Done | Done | Done | Done | Done | Done | Done | Done | Future |
| iOS | Done | Done | Done | Done | Done | Done | Done | Done | Done | Future App Store IAP |
| Android | Done | Done | Done | Done | Done | Done | Done | Done | Done | Future Play Billing |

### Store Product Catalog

Shared product ids:

| Product | Product ID | Type | Unlocks |
|---|---|---|---|
| Tribe Pro Monthly | `com.risewiththetribe.pro.monthly` | subscription | `entitlements.pro.active` |
| Tribe Pro Yearly | `com.risewiththetribe.pro.yearly` | subscription | `entitlements.pro.active` |
| 21-Day Reset Pack | `com.risewiththetribe.pack.21_day_reset` | challenge pack | `paidChallengePacks` / `packId = 21_day_reset` |
| 28-Day Summer Shred | `com.risewiththetribe.pack.summer_shred` | challenge pack | `paidChallengePacks` / `packId = summer_shred` |

Behavior:

- Product IDs must match across Web billing references, StoreKit products, Play Billing products, backend receipt validation, and entitlement writes.
- Product constants exist in Web, iOS, and Android code so purchase setup can be wired without inventing new IDs.
- iOS has StoreKit product query/purchase service scaffolding, and Android has Play Billing product query/purchase service scaffolding.
- Web has a checkout placeholder service that uses the shared IDs and intentionally fails until a compliant billing provider is selected.
- Firebase Functions now exposes callable `verifyPurchase`, which validates request shape, records an audit attempt, and refuses to unlock entitlements until App Store / Play receipt validation returns a verified result.
- `verifyPurchase` returns a stable readiness payload: `verified`, `entitlementUpdated`, `status`, `reason`, `message`, `productId`, `productKind`, `entitlement`, `validationConfigured`, `missingConfigKeys`, `requiredConfigKeys`, and `nextAction`.
- `verifyPurchase` audits `productKind`, `entitlement`, `packId`, `cadence`, hashed purchase token, validation config status, and missing credential keys in `purchaseVerificationAttempts`.
- Verified purchases are written idempotently to `purchaseEntitlements/{purchaseRecordId}` and then merged into `users/{uid}.entitlements.pro` or `users/{uid}.entitlements.packs.{packId}`.
- A purchase record already linked to a different user must fail with `failed-precondition`.
- Native purchase services can produce a verification payload from a completed purchase result for the backend callable.
- Profile purchase cards include a "Sync previous purchases" restore action. iOS replays StoreKit current entitlements, Android replays Play Billing owned purchases, and Web shows the provider-neutral placeholder until web billing is configured.
- Admin/creator profile surfaces include a Challenge Pack Launch Kit that exports copy for shared pack product IDs while credentials/test purchases remain pending.
- Admin/creator profile surfaces include a Challenge Pack Objection Reply Kit that exports manual replies for paid-pack questions before marketplace validation is complete.
- Admin profile surfaces include a Store Credential Setup Kit that keeps App Store Connect, Play Console, Firebase Functions secrets, sandbox/test purchases, restore QA, and Firestore entitlement verification visible before paid access goes live.
- Store Credential Setup Kit includes a read-only `getPurchaseValidationReadiness` probe across Web, iOS, and Android; it reports missing validation config and must not write purchase audit attempts or entitlements.
- Admin profile surfaces include a Subscription Management Guidance Kit that tells members how to manage/cancel subscriptions through Apple ID subscriptions or Google Play subscriptions, then restore/sync purchases before support review.
- Admin profile surfaces include a Billing Support Escalation Kit that separates wrong-account, failed renewal, duplicate charge, cancellation confusion, and missing-entitlement cases for marketplace-first support handoff.
- Admin profile surfaces include a Renewal Recovery Kit that exports failed-renewal and lapsed-access guidance with restore-first support steps.
- Admin profile surfaces include a Cancellation Feedback Kit that exports learn-only churn prompts without blocking marketplace cancellation.
- Admin profile surfaces include a Lapsed Member Winback Kit that exports free-first comeback challenge prompts using campaign, streak, referral, and first-party demand signals.
- Admin profile surfaces include a Store Launch Dry-Run Kit that exports a copy-only release rehearsal report from launch gate, validation readiness, store-test evidence, entitlement recovery, support queue, policy links, and revenue-path signals.
- Admin profile surfaces include a Store Demo Account Kit that exports reviewer-safe demo account notes for App Store / Play review without storing credentials or exposing real member data.
- Admin profile surfaces include a Store Review Pack that exports reviewer notes, policy evidence, permission explanations, data safety pointers, and support/refund handoff cautions before store submission.
- Product catalog constants do not grant access by themselves; backend entitlement state still controls feature gates.
- Challenge Pack Objection Reply Kit must not claim packs are live, quote unconfigured prices, collect payments, unlock packs, grant Pro, write entitlements, bypass marketplace policy, scrape/store DMs, add tracking pixels, or pressure users.
- Subscription Management Guidance Kit must not cancel subscriptions in-app, process refunds, create purchases, write entitlements, bypass App Store or Play policy, collect payment details, promise outcomes, imply medical results, or claim paid access is live.
- Billing Support Escalation Kit must not cancel subscriptions in-app, process refunds, create purchases, write entitlements, override marketplace decisions, collect payment details, promise outcomes, imply medical results, or mark paid access live.
- Renewal Recovery Kit must not retry charges in-app, collect payment details, cancel subscriptions, process refunds, create purchases, write entitlements, override marketplace renewal status, promise restored access, imply medical results, or mark paid access live.
- Cancellation Feedback Kit must not block cancellation, retry charges in-app, collect payment details, offer unconfigured discounts, process refunds, create purchases, write entitlements, override marketplace subscription state, promise future pricing, imply medical results, pressure the member to stay, or mark paid access live.
- Lapsed Member Winback Kit must not auto-message users, scrape DMs, store inbound replies, add tracking pixels, create attribution records, offer unconfigured discounts, retry charges, collect payment details, create purchases, write entitlements, imply paid access is live, promise outcomes, imply medical results, or pressure members to return.
- Store Launch Dry-Run Kit must not flip paid access live, write entitlements, create purchases, process payments, process refunds, bypass marketplace policy, collect payment details, submit store review, mark validation complete without credentials, claim sandbox/license-test purchases passed without evidence, promise outcomes, imply medical results, add tracking pixels, scrape DMs, or announce launch readiness until the full release dry run passes.
- Store Demo Account Kit must not create accounts from client code, store reviewer passwords in git, expose real user data, grant Pro, unlock packs, write entitlements, create purchases, bypass StoreKit or Play Billing, process refunds, collect payment details, submit store review, claim paid access is live, promise outcomes, imply medical results, add tracking pixels, scrape DMs, or include private credentials in screenshots or public docs.
- Store Review Pack must not submit store review, store reviewer passwords in git, expose personal user data, unlock paid access, grant Pro, unlock packs, write entitlements, create purchases, bypass StoreKit or Play Billing, process refunds, collect payment details, claim paid access is live, mark review readiness without evidence, promise outcomes, imply medical results, add tracking pixels, scrape DMs, or include private credentials in screenshots or public docs.

Current status:

| Platform | Product Constants | Checkout UI | Pack Launch Kit | Credential Setup Kit | Purchase Query | Purchase Start | Verification Hook | Restore Sync | Receipt Validation | Entitlement Write |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Web | Done | Product buttons done; provider pending | Done | Done | Provider pending | Provider pending | Callable client done | Placeholder | Future provider | Server writer ready |
| iOS | Done | Profile StoreKit buttons done | Done | Done | StoreKit service done | StoreKit service done | Payload builder done | StoreKit current entitlements | Server validation wired; credentials required | Server writer ready |
| Android | Done | Profile Play Billing buttons done | Done | Done | Play Billing service done | Play Billing service done | Payload builder done | Play Billing owned purchases | Server validation wired; credentials required | Server writer ready |

## Feature Build Checklist

For every new feature:

1. Define shared Firestore fields and legacy compatibility.
2. Implement Web, native iOS, and native Android in the same feature slice using the same backend contracts.
3. Add platform-specific capability notes, such as HealthKit, Apple Developer capabilities, or Meta App IDs.
4. Compile/build and smoke-test all three apps where feasible.
5. Update this parity file with status and remaining caveats.

If a feature is intentionally platform-specific, document the reason and the equivalent parity behavior for the other two platforms before shipping it.

## Monetization and Engagement Direction

The long-term revenue strategy is documented in `docs/MONETIZATION_ROADMAP.md`.

Priority roadmap:

1. Social growth foundation: Instagram handle, branded sharing, weekly challenge campaigns, and feature submissions.
2. Referral and UGC engine: invite tracking, reward badges, submission review, and community win cards.
3. Tribe Pro subscription: premium analytics, reports, private challenges, custom goals, advanced health insights, and premium share templates.
4. Paid challenge packs: seasonal and outcome-based challenge programs.
5. Creator / coach mode: creator profiles, branded challenges, private invite links, and paid hosting.
6. Brand partnerships: sponsor-backed challenges and member perks.

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
| Authentication/onboarding | Firebase Auth, Google Sign-In, onboarding | Firebase Auth, Google Sign-In, onboarding | Firebase Auth, Google Sign-In, onboarding |
| Profile appearance | Upload photo, avatar, remove photo, shared Firestore fields | Upload photo, avatar, remove photo, shared Firestore fields | Upload photo, avatar, remove photo, shared Firestore fields |
| Daily log reminders | Browser notification reminder while app is open | Local morning/evening/off reminders | Local morning/evening/off reminders |
| Wearable health sync | Native wrapper only when running via Capacitor | Apple Health manual import + HealthKit auto-import observer | Health Connect manual import + opt-in WorkManager auto-sync |
| Progress sharing | Copy, WhatsApp, generated image/native share fallback | Generated image, copy/share sheet, Instagram Story fallback, WhatsApp Status guidance | Native PNG image share, Instagram Story intent, copy, WhatsApp-targeted share |
| User win cards | Profile win card PNG/share copy from live stats | Native win card share action from live stats | Native win card share action from live stats |
| Weekly recap sharing | 7-day recap share copy/card from recent history | 7-day recap share action from recent history | 7-day recap share action from recent history |
| Pro monthly recap sharing | 30-day Pro recap share copy/card from report data | 30-day Pro recap native share action from report data | 30-day Pro recap native share action from report data |
| Feature submissions | Submit story with consent, show recent review statuses | Submit story with consent, show recent review statuses | Submit story with consent, show recent review statuses |
| Community highlights | Featured submission gallery plus repost caption copy | Featured submission gallery plus repost caption copy | Featured submission gallery plus repost caption copy |
| Referral reward badges | 1/5/10 referral-join badges in shared catalog | 1/5/10 referral-join badges in shared catalog | 1/5/10 referral-join badges in shared catalog |
| Referral reward ladder | Profile ladder for 1/5/10/25 referral joins | Profile ladder for 1/5/10/25 referral joins | Profile ladder for 1/5/10/25 referral joins |
| Referral analytics | Earned tiers, joins to next tier, ladder completion | Earned tiers, joins to next tier, ladder completion | Earned tiers, joins to next tier, ladder completion |
| Referral reward claims | User claim action writes `referralRewardClaims`; admins review open claims without granting Pro, entitlements, discounts, or payouts | User claim action writes `referralRewardClaims`; admins review open claims without granting Pro, entitlements, discounts, or payouts | User claim action writes `referralRewardClaims`; admins review open claims without granting Pro, entitlements, discounts, or payouts |
| Referral Reward Admin Review Updates | Admins can mark referral reward claims approved/waiting/not-ready/declined with manual review notes without granting Pro, entitlements, discounts, payouts, purchases, or affiliate rewards | Admins can mark referral reward claims approved/waiting/not-ready/declined with manual review notes without granting Pro, entitlements, discounts, payouts, purchases, or affiliate rewards | Admins can mark referral reward claims approved/waiting/not-ready/declined with manual review notes without granting Pro, entitlements, discounts, payouts, purchases, or affiliate rewards |
| Referral Reward Decision Reply Kit | Admin-only copy-ready approved/waiting/not-ready/declined referral claim replies before Pro grants, entitlements, discounts, payouts, purchases, affiliate rewards, or fulfillment promises exist | Admin-only copy-ready approved/waiting/not-ready/declined referral claim replies before Pro grants, entitlements, discounts, payouts, purchases, affiliate rewards, or fulfillment promises exist | Admin-only copy-ready approved/waiting/not-ready/declined referral claim replies before Pro grants, entitlements, discounts, payouts, purchases, affiliate rewards, or fulfillment promises exist |
| Tribe Pro entitlement foundation | Reads `entitlements.pro`, profile status/benefits, Pro Value Snapshot | Reads `entitlements.pro`, profile status/benefits, Pro Value Snapshot | Reads `entitlements.pro`, profile status/benefits, Pro Value Snapshot |
| Pro analytics report | Entitlement-gated weekly + monthly profile report/preview | Entitlement-gated weekly + monthly profile report/preview | Entitlement-gated weekly + monthly profile report/preview |
| Pro custom goals | Active-day, weekly-points, and streak targets saved under `users/{uid}.goals` | Active-day, weekly-points, and streak targets saved under `users/{uid}.goals` | Active-day, weekly-points, and streak targets saved under `users/{uid}.goals` |
| Pro profile frames | Pro-gated frame picker saved under `users/{uid}.cosmetics`; challenge avatars render `profileFrameId` | Pro-gated frame picker saved under `users/{uid}.cosmetics`; challenge avatars render `profileFrameId` | Pro-gated frame picker saved under `users/{uid}.cosmetics`; challenge avatars render `profileFrameId` |
| Pro share templates | Classic free; Gold/Neon Pro-gated under `users/{uid}.sharePreferences.templateId`; generated card palette changes | Classic free; Gold/Neon Pro-gated under `users/{uid}.sharePreferences.templateId`; generated card palette changes | Classic free; Gold/Neon Pro-gated under `users/{uid}.sharePreferences.templateId`; generated card palette changes |
| Creator / Coach Mode foundation | Pro-gated creator metadata saved under `users/{uid}.creatorProfile` | Pro-gated creator metadata saved under `users/{uid}.creatorProfile` | Pro-gated creator metadata saved under `users/{uid}.creatorProfile` |
| Creator-branded challenges | New Pro Coach Mode challenges denormalize and show creator specialty/bio/link | New Pro Coach Mode challenges denormalize and show creator specialty/bio/link | New Pro Coach Mode challenges denormalize and show creator specialty/bio/link |
| Creator analytics foundation | Pro-gated hosted challenge metrics from joined challenge docs | Pro-gated hosted challenge metrics from joined challenge docs | Pro-gated hosted challenge metrics from joined challenge docs |
| Creator revenue-share readiness | Pro-gated opt-in plus paid-pack/ready hosted challenge metrics | Pro-gated opt-in plus paid-pack/ready hosted challenge metrics | Pro-gated opt-in plus paid-pack/ready hosted challenge metrics |
| Creator launch kit | Pro Coach Mode launch copy from hosted challenge + invite link | Pro Coach Mode launch copy from hosted challenge + invite link | Pro Coach Mode launch copy from hosted challenge + invite link |
| Creator Challenge Template Draft Kit | Pro Coach Mode reusable hosted challenge template draft checklist, copy-only | Pro Coach Mode reusable hosted challenge template draft checklist, copy-only | Pro Coach Mode reusable hosted challenge template draft checklist, copy-only |
| Creator Branded Page Preview Kit | Pro Coach Mode Coach Host page review checklist, copy-only | Pro Coach Mode Coach Host page review checklist, copy-only | Pro Coach Mode Coach Host page review checklist, copy-only |
| Private Creator Invite Kit | Pro Coach Mode private challenge invite-only launch guidance, copy-only | Pro Coach Mode private challenge invite-only launch guidance, copy-only | Pro Coach Mode private challenge invite-only launch guidance, copy-only |
| Creator Hosting Offer Kit | Pro Coach Mode paid-hosting planning brief, copy-only | Pro Coach Mode paid-hosting planning brief, copy-only | Pro Coach Mode paid-hosting planning brief, copy-only |
| Creator Terms Readiness Kit | Pro Coach Mode creator responsibilities and payout-readiness brief, copy-only | Pro Coach Mode creator responsibilities and payout-readiness brief, copy-only | Pro Coach Mode creator responsibilities and payout-readiness brief, copy-only |
| Creator Payout Readiness Kit | Pro Coach Mode payout provider, tax, identity, refund, support, marketplace, and claim-safety checklist, copy-only | Pro Coach Mode payout provider, tax, identity, refund, support, marketplace, and claim-safety checklist, copy-only | Pro Coach Mode payout provider, tax, identity, refund, support, marketplace, and claim-safety checklist, copy-only |
| Creator Hosting Objection Reply Kit | Pro Coach Mode manual creator reply kit, copy-only | Pro Coach Mode manual creator reply kit, copy-only | Pro Coach Mode manual creator reply kit, copy-only |
| Creator Hosting Application | Review-only creator application writes `creatorHostingApplications/{uid}`; admins see open queue without contracts, payouts, purchases, entitlements, or paid claims | Review-only creator application writes `creatorHostingApplications/{uid}`; admins see open queue without contracts, payouts, purchases, entitlements, or paid claims | Review-only creator application writes `creatorHostingApplications/{uid}`; admins see open queue without contracts, payouts, purchases, entitlements, or paid claims |
| Creator Hosting Application Admin Review Updates | Admins can mark creator hosting applications approved/waiting/not-ready/declined with manual review notes without contracts, payouts, purchases, entitlements, revenue-share, or paid claims | Admins can mark creator hosting applications approved/waiting/not-ready/declined with manual review notes without contracts, payouts, purchases, entitlements, revenue-share, or paid claims | Admins can mark creator hosting applications approved/waiting/not-ready/declined with manual review notes without contracts, payouts, purchases, entitlements, revenue-share, or paid claims |
| Creator demand summary | Admin-only revenue-share beta aggregate counts plus creator beta copy | Admin-only revenue-share beta aggregate counts plus creator beta copy | Admin-only revenue-share beta aggregate counts plus creator beta copy |
| Monetization Launch Board | Admin-only aggregate Pro trial, creator beta, and partner demand signals | Admin-only aggregate Pro trial, creator beta, and partner demand signals | Admin-only aggregate Pro trial, creator beta, and partner demand signals |
| Revenue Pathway Planner | Admin/creator manual ranking for Pro, paid packs, creator hosting, and partner campaigns | Admin/creator manual ranking for Pro, paid packs, creator hosting, and partner campaigns | Admin/creator manual ranking for Pro, paid packs, creator hosting, and partner campaigns |
| Pricing Test Kit | Admin/creator pricing-language validation for shared Pro and pack product IDs | Admin/creator pricing-language validation for shared Pro and pack product IDs | Admin/creator pricing-language validation for shared Pro and pack product IDs |
| Founder Member Offer Kit | Admin/creator early-member value-validation copy before paid access | Admin/creator early-member value-validation copy before paid access | Admin/creator early-member value-validation copy before paid access |
| Community Ambassador Kit | Admin/creator recognition-led referral and challenge-leadership prompts | Admin/creator recognition-led referral and challenge-leadership prompts | Admin/creator recognition-led referral and challenge-leadership prompts |
| Community Event Interest Kit | Admin/creator local meetup, merch, pop-up, and finisher-moment validation from first-party app signals | Admin/creator local meetup, merch, pop-up, and finisher-moment validation from first-party app signals | Admin/creator local meetup, merch, pop-up, and finisher-moment validation from first-party app signals |
| Customer Value Checklist | Admin/creator value-readiness proof checks before charging | Admin/creator value-readiness proof checks before charging | Admin/creator value-readiness proof checks before charging |
| Support Refund Readiness Kit | Admin restore, marketplace refund, entitlement recovery, and escalation handoff | Admin restore, marketplace refund, entitlement recovery, and escalation handoff | Admin restore, marketplace refund, entitlement recovery, and escalation handoff |
| Entitlement Recovery Request | Review-only missing purchase support writes `entitlementRecoveryRequests/{uid}`; admins see open queue without entitlement, refund, subscription, purchase, or marketplace side effects | Review-only missing purchase support writes `entitlementRecoveryRequests/{uid}`; admins see open queue without entitlement, refund, subscription, purchase, or marketplace side effects | Review-only missing purchase support writes `entitlementRecoveryRequests/{uid}`; admins see open queue without entitlement, refund, subscription, purchase, or marketplace side effects |
| Entitlement Recovery Admin Review Updates | Admins can mark recovery requests waiting/resolved/closed with manual review notes without entitlement, refund, subscription, purchase, or marketplace side effects | Admins can mark recovery requests waiting/resolved/closed with manual review notes without entitlement, refund, subscription, purchase, or marketplace side effects | Admins can mark recovery requests waiting/resolved/closed with manual review notes without entitlement, refund, subscription, purchase, or marketplace side effects |
| Entitlement Recovery Decision Reply Kit | Admin-only copy-ready waiting/resolved/closed/marketplace escalation replies without entitlement writes, refunds, subscription changes, purchases, charges, payment collection, or marketplace bypass | Admin-only copy-ready waiting/resolved/closed/marketplace escalation replies without entitlement writes, refunds, subscription changes, purchases, charges, payment collection, or marketplace bypass | Admin-only copy-ready waiting/resolved/closed/marketplace escalation replies without entitlement writes, refunds, subscription changes, purchases, charges, payment collection, or marketplace bypass |
| Store Test Purchase Evidence Log | Admin-only `storeTestPurchaseEvidence` records for sandbox/license-test proof without entitlement, purchase, refund, marketplace, or paid-live side effects | Admin-only `storeTestPurchaseEvidence` records for sandbox/license-test proof without entitlement, purchase, refund, marketplace, or paid-live side effects | Admin-only `storeTestPurchaseEvidence` records for sandbox/license-test proof without entitlement, purchase, refund, marketplace, or paid-live side effects |
| Store Test Purchase Evidence Review Updates | Admins can mark evidence verified/needs-review/failed/archived with manual review notes without entitlement, purchase, refund, marketplace, or paid-live side effects | Admins can mark evidence verified/needs-review/failed/archived with manual review notes without entitlement, purchase, refund, marketplace, or paid-live side effects | Admins can mark evidence verified/needs-review/failed/archived with manual review notes without entitlement, purchase, refund, marketplace, or paid-live side effects |
| Store Test Evidence Decision Reply Kit | Admin-only copy-ready verified/needs-more-evidence/failed/archived replies without entitlement writes, purchase creation, refunds, marketplace bypass, store submission, paid-live flips, or unproven sandbox/license-test claims | Admin-only copy-ready verified/needs-more-evidence/failed/archived replies without entitlement writes, purchase creation, refunds, marketplace bypass, store submission, paid-live flips, or unproven sandbox/license-test claims | Admin-only copy-ready verified/needs-more-evidence/failed/archived replies without entitlement writes, purchase creation, refunds, marketplace bypass, store submission, paid-live flips, or unproven sandbox/license-test claims |
| Paid Launch Decision Gate | Admin go/no-go checks include store test evidence coverage before paid access promotion | Admin go/no-go checks include store test evidence coverage before paid access promotion | Admin go/no-go checks include store test evidence coverage before paid access promotion |
| Paid Launch Decision Reply Kit | Admin-only copy-ready ready/hold/blocked/review-note replies without paid-live flips, entitlement writes, purchases, payments, refunds, marketplace bypass, store submission, or readiness announcements | Admin-only copy-ready ready/hold/blocked/review-note replies without paid-live flips, entitlement writes, purchases, payments, refunds, marketplace bypass, store submission, or readiness announcements | Admin-only copy-ready ready/hold/blocked/review-note replies without paid-live flips, entitlement writes, purchases, payments, refunds, marketplace bypass, store submission, or readiness announcements |
| Store Launch Dry-Run Kit | Admin copy-only release rehearsal for auth, challenge, logging, sharing, support, restore, store evidence, and policy checks before paid access | Admin copy-only release rehearsal for auth, challenge, logging, sharing, support, restore, store evidence, and policy checks before paid access | Admin copy-only release rehearsal for auth, challenge, logging, sharing, support, restore, store evidence, and policy checks before paid access |
| Store Demo Account Kit | Admin copy-only reviewer notes for a synthetic demo account, seeded free flows, permissions, policy links, and paid-access cautions | Admin copy-only reviewer notes for a synthetic demo account, seeded free flows, permissions, policy links, and paid-access cautions | Admin copy-only reviewer notes for a synthetic demo account, seeded free flows, permissions, policy links, and paid-access cautions |
| Store Review Pack | Admin copy-only reviewer notes, policy evidence, permissions, data safety, support/refund handoff, and paid-access readiness cautions before store submission | Admin copy-only reviewer notes, policy evidence, permissions, data safety, support/refund handoff, and paid-access readiness cautions before store submission | Admin copy-only reviewer notes, policy evidence, permissions, data safety, support/refund handoff, and paid-access readiness cautions before store submission |
| Sandbox Purchase Test Plan | Admin manual App Store sandbox, Play license test, restore, backend validation, entitlement QA, and negative-case checklist | Admin manual App Store sandbox, Play license test, restore, backend validation, entitlement QA, and negative-case checklist | Admin manual App Store sandbox, Play license test, restore, backend validation, entitlement QA, and negative-case checklist |
| Store Listing Copy Kit | Admin App Store / Play listing draft with policy-safe paid-feature cautions | Admin App Store / Play listing draft with policy-safe paid-feature cautions | Admin App Store / Play listing draft with policy-safe paid-feature cautions |
| Store Review Submission Kit | Admin App Store / Play reviewer notes with demo, permission, support, privacy, and entitlement QA cautions | Admin App Store / Play reviewer notes with demo, permission, support, privacy, and entitlement QA cautions | Admin App Store / Play reviewer notes with demo, permission, support, privacy, and entitlement QA cautions |
| Store Review Evidence Pack | Admin reviewer-safe evidence pack with store-test counts, products, policy/support links, permission notes, and launch status | Admin reviewer-safe evidence pack with store-test counts, products, policy/support links, permission notes, and launch status | Admin reviewer-safe evidence pack with store-test counts, products, policy/support links, permission notes, and launch status |
| Policy and Support Link Hub | Hosted privacy, terms, support, and data deletion links in profile | Hosted privacy, terms, support, and data deletion links in profile | Hosted privacy, terms, support, and data deletion links in profile |
| Support Request | Profile request form writes `supportRequests`; admins see open review queue | Profile request form writes `supportRequests`; admins see open review queue | Profile request form writes `supportRequests`; admins see open review queue |
| Support Request Admin Review Updates | Admins can mark support requests waiting/resolved/closed with manual review notes without refunds, subscriptions, purchases, or entitlement side effects | Admins can mark support requests waiting/resolved/closed with manual review notes without refunds, subscriptions, purchases, or entitlement side effects | Admins can mark support requests waiting/resolved/closed with manual review notes without refunds, subscriptions, purchases, or entitlement side effects |
| Support Decision Reply Kit | Admin-only copy-ready waiting/resolved/closed/marketplace escalation replies without refunds, subscriptions, purchase resolution, entitlements, account deletion, data erasure, or marketplace bypass | Admin-only copy-ready waiting/resolved/closed/marketplace escalation replies without refunds, subscriptions, purchase resolution, entitlements, account deletion, data erasure, or marketplace bypass | Admin-only copy-ready waiting/resolved/closed/marketplace escalation replies without refunds, subscriptions, purchase resolution, entitlements, account deletion, data erasure, or marketplace bypass |
| Account Deletion Request | Profile request card writes `accountDeletionRequests/{uid}` and profile status marker; admins see review queue | Profile request card writes `accountDeletionRequests/{uid}` and profile status marker; admins see review queue | Profile request card writes `accountDeletionRequests/{uid}` and profile status marker; admins see review queue |
| Account Deletion Admin Review Updates | Admins can mark deletion requests verified/contacted/blocked/closed with manual review notes without account deletion, data erasure, purchase cancellation, refund processing, or marketplace bypass | Admins can mark deletion requests verified/contacted/blocked/closed with manual review notes without account deletion, data erasure, purchase cancellation, refund processing, or marketplace bypass | Admins can mark deletion requests verified/contacted/blocked/closed with manual review notes without account deletion, data erasure, purchase cancellation, refund processing, or marketplace bypass |
| Account Deletion Decision Reply Kit | Admin-only copy-ready verified/contacted/blocked/closed support replies without account deletion, data erasure, purchase cancellation, refund processing, entitlement writes, or marketplace bypass | Admin-only copy-ready verified/contacted/blocked/closed support replies without account deletion, data erasure, purchase cancellation, refund processing, entitlement writes, or marketplace bypass | Admin-only copy-ready verified/contacted/blocked/closed support replies without account deletion, data erasure, purchase cancellation, refund processing, entitlement writes, or marketplace bypass |
| Data Safety Disclosure Kit | Admin Play Data Safety / App Privacy disclosure draft | Admin Play Data Safety / App Privacy disclosure draft | Admin Play Data Safety / App Privacy disclosure draft |
| Launch Experiment Kit | Admin/creator manual experiment briefs from first-party signals | Admin/creator manual experiment briefs from first-party signals | Admin/creator manual experiment briefs from first-party signals |
| Launch Experiment Scorecard | Admin/creator read-only demand, reach, and community-loop scoring | Admin/creator read-only demand, reach, and community-loop scoring | Admin/creator read-only demand, reach, and community-loop scoring |
| Release QA Checklist | Admin/creator copy-ready product, store, entitlement, docs, and share-flow checks | Admin/creator copy-ready product, store, entitlement, docs, and share-flow checks | Admin/creator copy-ready product, store, entitlement, docs, and share-flow checks |
| Launch Retrospective Kit | Admin/creator manual post-launch first-party review prompt | Admin/creator manual post-launch first-party review prompt | Admin/creator manual post-launch first-party review prompt |
| Campaign Performance Board | Admin-only aggregate campaign challenge counts, splits, and member reach | Admin-only aggregate campaign challenge counts, splits, and member reach | Admin-only aggregate campaign challenge counts, splits, and member reach |
| Weekly Campaign Launch Card Kit | Admin/creator copy-ready campaign card brief from weekly template | Admin/creator copy-ready campaign card brief from weekly template | Admin/creator copy-ready campaign card brief from weekly template |
| Weekly Campaign Preflight Checklist | Admin/creator copy-ready manual campaign launch checklist from weekly template, DM, content, referral, consent, and first-party review signals | Admin/creator copy-ready manual campaign launch checklist from weekly template, DM, content, referral, consent, and first-party review signals | Admin/creator copy-ready manual campaign launch checklist from weekly template, DM, content, referral, consent, and first-party review signals |
| Weekly Campaign Review Kit | Admin/creator copy-ready manual post-launch review brief from campaign reach, referrals, consent-cleared UGC, DM readiness, and share-card usage | Admin/creator copy-ready manual post-launch review brief from campaign reach, referrals, consent-cleared UGC, DM readiness, and share-card usage | Admin/creator copy-ready manual post-launch review brief from campaign reach, referrals, consent-cleared UGC, DM readiness, and share-card usage |
| Weekly Campaign Storyboard Kit | Admin/creator copy-ready manual Reel, Stories, and carousel storyboard from weekly campaign prompt | Admin/creator copy-ready manual Reel, Stories, and carousel storyboard from weekly campaign prompt | Admin/creator copy-ready manual Reel, Stories, and carousel storyboard from weekly campaign prompt |
| Weekly Campaign Experiment Brief Kit | Admin/creator copy-ready manual experiment brief from weekly CTA, recommended launch experiment, and first-party app movement | Admin/creator copy-ready manual experiment brief from weekly CTA, recommended launch experiment, and first-party app movement | Admin/creator copy-ready manual experiment brief from weekly CTA, recommended launch experiment, and first-party app movement |
| Instagram DM Keyword Kit | Admin/creator manual replies for TRIBE, COMEBACK, PRO, FEATURE | Admin/creator manual replies for TRIBE, COMEBACK, PRO, FEATURE | Admin/creator manual replies for TRIBE, COMEBACK, PRO, FEATURE |
| Weekly Campaign Comment Reply Kit | Admin/creator manual public replies for join, comeback, paid-access, and Feature Me campaign questions | Admin/creator manual public replies for join, comeback, paid-access, and Feature Me campaign questions | Admin/creator manual public replies for join, comeback, paid-access, and Feature Me campaign questions |
| Weekly Campaign Countdown Story Kit | Admin/creator manual pre-launch Story countdown frames, sticker copy, and app-first start reminders | Admin/creator manual pre-launch Story countdown frames, sticker copy, and app-first start reminders | Admin/creator manual pre-launch Story countdown frames, sticker copy, and app-first start reminders |
| Weekly Campaign Start-Day Story Kit | Admin/creator manual launch-day Story frames, sticker copy, and first-log reminders | Admin/creator manual launch-day Story frames, sticker copy, and first-log reminders | Admin/creator manual launch-day Story frames, sticker copy, and first-log reminders |
| Weekly Campaign Midweek Check-In Story Kit | Admin/creator manual comeback Story frames, sticker copy, and first-party re-engagement review prompts | Admin/creator manual comeback Story frames, sticker copy, and first-party re-engagement review prompts | Admin/creator manual comeback Story frames, sticker copy, and first-party re-engagement review prompts |
| Weekly Campaign Weekend Push Story Kit | Admin/creator manual finish-line Story frames, sticker copy, and first-party completion momentum review prompts | Admin/creator manual finish-line Story frames, sticker copy, and first-party completion momentum review prompts | Admin/creator manual finish-line Story frames, sticker copy, and first-party completion momentum review prompts |
| Weekly Campaign Completion Recap Story Kit | Admin/creator manual aggregate recap Story frames, Feature Me consent routing, and next-challenge prompts | Admin/creator manual aggregate recap Story frames, Feature Me consent routing, and next-challenge prompts | Admin/creator manual aggregate recap Story frames, Feature Me consent routing, and next-challenge prompts |
| Weekly Campaign Next-Week Teaser Story Kit | Admin/creator manual next-challenge teaser frames, sticker copy, and first-party launch-angle review prompts | Admin/creator manual next-challenge teaser frames, sticker copy, and first-party launch-angle review prompts | Admin/creator manual next-challenge teaser frames, sticker copy, and first-party launch-angle review prompts |
| Weekly Campaign Partner Perk Teaser Story Kit | Admin/creator manual partner-perk teaser frames, app-first saved-interest routing, and partner-readiness guardrails | Admin/creator manual partner-perk teaser frames, app-first saved-interest routing, and partner-readiness guardrails | Admin/creator manual partner-perk teaser frames, app-first saved-interest routing, and partner-readiness guardrails |
| Weekly Campaign Story Poll Kit | Admin/creator manual Story poll, quiz, and question sticker prompts from the weekly campaign | Admin/creator manual Story poll, quiz, and question sticker prompts from the weekly campaign | Admin/creator manual Story poll, quiz, and question sticker prompts from the weekly campaign |
| Weekly Campaign Poll Review Kit | Admin/creator manual readback for visible Story poll reactions and first-party follow-up decisions | Admin/creator manual readback for visible Story poll reactions and first-party follow-up decisions | Admin/creator manual readback for visible Story poll reactions and first-party follow-up decisions |
| Weekly Campaign Live Q&A Kit | Admin/creator manual Live setup, question lanes, close copy, and app-first follow-up guardrails | Admin/creator manual Live setup, question lanes, close copy, and app-first follow-up guardrails | Admin/creator manual Live setup, question lanes, close copy, and app-first follow-up guardrails |
| Weekly Campaign Live Recap Kit | Admin/creator manual post-Live readback, public recap copy, content decisions, and first-party signal review guardrails | Admin/creator manual post-Live readback, public recap copy, content decisions, and first-party signal review guardrails | Admin/creator manual post-Live readback, public recap copy, content decisions, and first-party signal review guardrails |
| Weekly Campaign FAQ Carousel Kit | Admin/creator manual seven-slide carousel outline for repeated audience questions and app-first CTAs | Admin/creator manual seven-slide carousel outline for repeated audience questions and app-first CTAs | Admin/creator manual seven-slide carousel outline for repeated audience questions and app-first CTAs |
| Weekly Campaign Caption Bank Kit | Admin/creator manual Reel, carousel, Story, and pinned-comment caption variants from the weekly campaign | Admin/creator manual Reel, carousel, Story, and pinned-comment caption variants from the weekly campaign | Admin/creator manual Reel, carousel, Story, and pinned-comment caption variants from the weekly campaign |
| Weekly Campaign Collab Invite Kit | Admin/creator manual creator outreach for collab posts and Story mentions before paid hosting terms | Admin/creator manual creator outreach for collab posts and Story mentions before paid hosting terms | Admin/creator manual creator outreach for collab posts and Story mentions before paid hosting terms |
| Weekly Campaign Collab Follow-Up Kit | Admin/creator manual creator follow-ups for yes, post guidance, paid-hosting questions, and not-ready replies | Admin/creator manual creator follow-ups for yes, post guidance, paid-hosting questions, and not-ready replies | Admin/creator manual creator follow-ups for yes, post guidance, paid-hosting questions, and not-ready replies |
| Weekly Campaign Collab Safety Checklist | Admin/creator manual consent, claim, private-reply, member-data, and paid-hosting readiness review before creator escalation | Admin/creator manual consent, claim, private-reply, member-data, and paid-hosting readiness review before creator escalation | Admin/creator manual consent, claim, private-reply, member-data, and paid-hosting readiness review before creator escalation |
| Weekly Campaign Collab Recap Kit | Admin/creator manual post-collab review from first-party app movement, consent-cleared submissions, content lessons, and next-collab decisions | Admin/creator manual post-collab review from first-party app movement, consent-cleared submissions, content lessons, and next-collab decisions | Admin/creator manual post-collab review from first-party app movement, consent-cleared submissions, content lessons, and next-collab decisions |
| Weekly Campaign Collab Renewal Kit | Admin/creator manual repeat-or-pause criteria and Creator / Coach Mode review routing before deeper hosting or paid terms | Admin/creator manual repeat-or-pause criteria and Creator / Coach Mode review routing before deeper hosting or paid terms | Admin/creator manual repeat-or-pause criteria and Creator / Coach Mode review routing before deeper hosting or paid terms |
| Weekly Campaign Retention Follow-Up Kit | Admin/creator manual app-first follow-up lanes for active, comeback, feature-ready, interest-saved, and support-risk members | Admin/creator manual app-first follow-up lanes for active, comeback, feature-ready, interest-saved, and support-risk members | Admin/creator manual app-first follow-up lanes for active, comeback, feature-ready, interest-saved, and support-risk members |
| Weekly Campaign Re-Invite Kit | Admin/creator manual next-challenge referral prompts for active, comeback, feature-ready, referral-curious, and support-risk members | Admin/creator manual next-challenge referral prompts for active, comeback, feature-ready, referral-curious, and support-risk members | Admin/creator manual next-challenge referral prompts for active, comeback, feature-ready, referral-curious, and support-risk members |
| Partner perks foundation | Profile cards for future aligned partner offers plus saved interest toggles under `partnerPerkInterest` | Profile cards for future aligned partner offers plus saved interest toggles under `partnerPerkInterest` | Profile cards for future aligned partner offers plus saved interest toggles under `partnerPerkInterest` |
| Member perk eligibility | First-party progress gates for Gear, Recovery, and Fuel perks | First-party progress gates for Gear, Recovery, and Fuel perks | First-party progress gates for Gear, Recovery, and Fuel perks |
| Partner Perk Claim | Eligible members request manual perk review under `partnerPerkClaims/{uid}_{perkId}`; admins see open queue without coupons, links, payouts, discounts, purchases, entitlements, or paid claims | Eligible members request manual perk review under `partnerPerkClaims/{uid}_{perkId}`; admins see open queue without coupons, links, payouts, discounts, purchases, entitlements, or paid claims | Eligible members request manual perk review under `partnerPerkClaims/{uid}_{perkId}`; admins see open queue without coupons, links, payouts, discounts, purchases, entitlements, or paid claims |
| Partner Perk Claim Status History | Profile shows signed-in user's review-only `partnerPerkClaims` status list without coupons, partner links, payouts, discounts, purchases, entitlements, or paid claims | Profile shows signed-in user's review-only `partnerPerkClaims` status list without coupons, partner links, payouts, discounts, purchases, entitlements, or paid claims | Profile shows signed-in user's review-only `partnerPerkClaims` status list without coupons, partner links, payouts, discounts, purchases, entitlements, or paid claims |
| Partner Perk Fulfillment Readiness Kit | Admin-only copy-ready claim-readiness checks before coupons, partner links, payouts, discounts, purchases, entitlements, or fulfillment promises exist | Admin-only copy-ready claim-readiness checks before coupons, partner links, payouts, discounts, purchases, entitlements, or fulfillment promises exist | Admin-only copy-ready claim-readiness checks before coupons, partner links, payouts, discounts, purchases, entitlements, or fulfillment promises exist |
| Partner Perk Fulfillment Handoff Kit | Admin-only copy-ready approved-claim handoff notes before coupons, partner links, payouts, discounts, purchases, entitlements, payment collection, or fulfillment promises exist | Admin-only copy-ready approved-claim handoff notes before coupons, partner links, payouts, discounts, purchases, entitlements, payment collection, or fulfillment promises exist | Admin-only copy-ready approved-claim handoff notes before coupons, partner links, payouts, discounts, purchases, entitlements, payment collection, or fulfillment promises exist |
| Partner Perk Handoff Audit Kit | Admin-only copy-ready aggregate support outcome audit after manual perk handoff before refunds, coupons, partner links, payouts, discounts, purchases, entitlements, payment collection, or fulfillment promises exist | Admin-only copy-ready aggregate support outcome audit after manual perk handoff before refunds, coupons, partner links, payouts, discounts, purchases, entitlements, payment collection, or fulfillment promises exist | Admin-only copy-ready aggregate support outcome audit after manual perk handoff before refunds, coupons, partner links, payouts, discounts, purchases, entitlements, payment collection, or fulfillment promises exist |
| Partner Perk Admin Decision Reply Kit | Admin-only copy-ready approved/waiting/not-ready/declined claim replies before coupons, partner links, payouts, discounts, purchases, entitlements, or fulfillment promises exist | Admin-only copy-ready approved/waiting/not-ready/declined claim replies before coupons, partner links, payouts, discounts, purchases, entitlements, or fulfillment promises exist | Admin-only copy-ready approved/waiting/not-ready/declined claim replies before coupons, partner links, payouts, discounts, purchases, entitlements, or fulfillment promises exist |
| Partner Perk Claim Admin Review Updates | Admins can mark claims approved/waiting/not-ready/declined with manual review notes; member history shows status and note without fulfillment side effects | Admins can mark claims approved/waiting/not-ready/declined with manual review notes; member history shows status and note without fulfillment side effects | Admins can mark claims approved/waiting/not-ready/declined with manual review notes; member history shows status and note without fulfillment side effects |
| Sponsor reporting foundation | Admin-only partner demand summary and pitch copy from first-party perk interest counts | Admin-only partner demand summary and pitch copy from first-party perk interest counts | Admin-only partner demand summary and pitch copy from first-party perk interest counts |
| Partner Campaign Activation Kit | Admin-only sponsor-backed challenge pilot brief from first-party signals, copy-only | Admin-only sponsor-backed challenge pilot brief from first-party signals, copy-only | Admin-only sponsor-backed challenge pilot brief from first-party signals, copy-only |
| Partner Terms Readiness Kit | Admin-only sponsor-pilot terms brief from first-party signals, copy-only | Admin-only sponsor-pilot terms brief from first-party signals, copy-only | Admin-only sponsor-pilot terms brief from first-party signals, copy-only |
| Partner Contract Readiness Kit | Admin-only partner identity, support, disclosure, fulfillment, privacy, reporting, and destination checklist, copy-only | Admin-only partner identity, support, disclosure, fulfillment, privacy, reporting, and destination checklist, copy-only | Admin-only partner identity, support, disclosure, fulfillment, privacy, reporting, and destination checklist, copy-only |
| Partner Campaign Application | Review-only partner pilot application writes `partnerCampaignApplications/{uid}`; admins see open queue without partner links, tracking, affiliate payouts, purchases, entitlements, or paid claims | Review-only partner pilot application writes `partnerCampaignApplications/{uid}`; admins see open queue without partner links, tracking, affiliate payouts, purchases, entitlements, or paid claims | Review-only partner pilot application writes `partnerCampaignApplications/{uid}`; admins see open queue without partner links, tracking, affiliate payouts, purchases, entitlements, or paid claims |
| Partner Campaign Application Admin Review Updates | Admins can mark campaign applications approved/waiting/not-ready/declined with manual review notes without partner links, tracking, affiliate payouts, purchases, entitlements, revenue-share, or paid claims | Admins can mark campaign applications approved/waiting/not-ready/declined with manual review notes without partner links, tracking, affiliate payouts, purchases, entitlements, revenue-share, or paid claims | Admins can mark campaign applications approved/waiting/not-ready/declined with manual review notes without partner links, tracking, affiliate payouts, purchases, entitlements, revenue-share, or paid claims |
| Partner Campaign Decision Reply Kit | Admin-only copy-ready approved/waiting/not-ready/declined sponsor-pilot replies before partner links, tracking, payouts, purchases, entitlements, revenue-share, or fulfillment promises exist | Admin-only copy-ready approved/waiting/not-ready/declined sponsor-pilot replies before partner links, tracking, payouts, purchases, entitlements, revenue-share, or fulfillment promises exist | Admin-only copy-ready approved/waiting/not-ready/declined sponsor-pilot replies before partner links, tracking, payouts, purchases, entitlements, revenue-share, or fulfillment promises exist |
| Pro trial demand summary | Admin-only Pro Trial Interest aggregate counts plus Trial Launch Kit copy | Admin-only Pro Trial Interest aggregate counts plus Trial Launch Kit copy | Admin-only Pro Trial Interest aggregate counts plus Trial Launch Kit copy |
| Sponsored challenge metadata foundation | Optional challenge sponsor fields, create preview card, tracker detail card | Optional challenge sponsor fields, create preview card, tracker detail card | Optional challenge sponsor fields, create preview card, tracker detail card |
| Pro streak recovery | Pro-gated recovery writes zero-point `streak_recovery` activity for yesterday | Pro-gated recovery writes zero-point `streak_recovery` activity for yesterday | Pro-gated recovery writes zero-point `streak_recovery` activity for yesterday |
| Pro private challenge gate | Private creation requires active Pro; public remains free | Private creation requires active Pro; public remains free | Private creation requires active Pro; public remains free |
| Premium challenge pack foundation | 21-Day Reset Pack metadata and Pro creation gate | 21-Day Reset Pack metadata and Pro creation gate | 21-Day Reset Pack metadata and Pro creation gate |
| Premium pack accountability prompts | Paid packs persist and show prompt arrays on tracker/detail surfaces | Paid packs persist and show prompt arrays on tracker/detail surfaces | Paid packs persist and show prompt arrays on tracker/detail surfaces |
| Store product catalog | Shared Pro/pack product IDs in code | Shared Pro/pack product IDs in code | Shared Pro/pack product IDs in code |
| Store Launch Readiness | Admin-only product/credential/test-purchase checklist | Admin-only product/credential/test-purchase checklist | Admin-only product/credential/test-purchase checklist |
| Store Credential Setup Kit | Admin-only App Store/Play/Firebase validation handoff, copy export, and readiness probe | Admin-only App Store/Play/Firebase validation handoff, copy export, and readiness probe | Admin-only App Store/Play/Firebase validation handoff, copy export, and readiness probe |
| Subscription Management Guidance Kit | Admin-only App Store / Play subscription management guidance, copy-only | Admin-only App Store / Play subscription management guidance, copy-only | Admin-only App Store / Play subscription management guidance, copy-only |
| Billing Support Escalation Kit | Admin-only wrong-account, renewal, charge, and entitlement handoff, copy-only | Admin-only wrong-account, renewal, charge, and entitlement handoff, copy-only | Admin-only wrong-account, renewal, charge, and entitlement handoff, copy-only |
| Renewal Recovery Kit | Admin-only failed-renewal and lapsed-access restore guidance, copy-only | Admin-only failed-renewal and lapsed-access restore guidance, copy-only | Admin-only failed-renewal and lapsed-access restore guidance, copy-only |
| Cancellation Feedback Kit | Admin-only churn-learning prompts, copy-only and marketplace-safe | Admin-only churn-learning prompts, copy-only and marketplace-safe | Admin-only churn-learning prompts, copy-only and marketplace-safe |
| Lapsed Member Winback Kit | Admin-only free-first comeback challenge prompts, copy-only | Admin-only free-first comeback challenge prompts, copy-only | Admin-only free-first comeback challenge prompts, copy-only |
| Store Launch Dry-Run Kit | Admin-only release rehearsal report, copy-only | Admin-only release rehearsal report, copy-only | Admin-only release rehearsal report, copy-only |
| Store Demo Account Kit | Admin-only reviewer-safe demo account notes, copy-only | Admin-only reviewer-safe demo account notes, copy-only | Admin-only reviewer-safe demo account notes, copy-only |
| Store Review Pack | Admin-only store-review prep notes and policy evidence, copy-only | Admin-only store-review prep notes and policy evidence, copy-only | Admin-only store-review prep notes and policy evidence, copy-only |
| Challenge leaving | Member leave, admin promote, sole-admin delete | Member leave, admin promote, sole-admin delete | Member leave, admin promote, sole-admin delete |
| Challenge invite flow | Invite code lookup, join, full invite link share/copy | Invite code lookup, join, full invite link share/copy | Invite code lookup, join, full invite link share/copy |
| Referral invite hooks | Invite links carry `ref`, join stores referral metadata and count | Invite links carry `ref`, join stores referral metadata and count | Invite links carry `ref`, join stores referral metadata and count |
| Weekly challenge campaigns | Campaign templates, campaign metadata, campaign invite copy, launch-card image share | Campaign templates, campaign metadata, campaign invite copy, launch-card image share | Campaign templates, campaign metadata, campaign invite copy, launch-card image share |
| Challenge invite deep links | Web route serves invite links and iOS AASA file | Universal Link handler + custom scheme fallback | App Link handler + custom scheme fallback |
| Challenge daily tracking | Per-day task checklist, points, daily history | Per-day task checklist, points, daily history | Per-day task checklist, points, daily history |
| Challenge badge stats | Completion/top-rank stats feed badge unlocks | Completion/top-rank stats feed badge unlocks | Completion/top-rank stats feed badge unlocks |

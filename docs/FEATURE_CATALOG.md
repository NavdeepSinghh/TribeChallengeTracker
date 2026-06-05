# Rise With The Tribe Feature Catalog

This catalog is the contributor-facing map for the Web, native iOS, and native Android apps. Every feature should be built and reviewed against all three platforms unless the feature is explicitly platform-specific.

Repos:

- Web/Capacitor: `/Users/navdeepsmacbook/Documents/TribeChallengeTracker`
- Native iOS: `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS`
- Native Android: `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid`

Primary parity ledger: `FEATURE_PARITY.md`

Monetization and engagement roadmap: `docs/MONETIZATION_ROADMAP.md`

## Parity Definition

A feature is considered in parity when:

- The same user outcome exists on Web, iOS, and Android.
- Shared Firestore fields and document paths match.
- Platform-specific equivalents are documented, such as HealthKit on iOS and Health Connect on Android.
- Invite links, profile appearance, challenge membership, badges, and leaderboard identity render consistently.
- The release gate passes before deployment.

## Authentication and Onboarding

Purpose: get users signed in and collect basic training preferences.

Shared behavior:

- Google/Firebase authentication.
- New user profile creation in `users/{uid}`.
- Onboarding choices for goal, level, and training frequency.
- Existing users remain compatible if onboarding fields are missing.

Platform notes:

- Android Google Sign-In requires the Firebase Android app, the relevant debug/release SHA-1 fingerprints, and `app/google-services.json`.
- Android builds read the Web OAuth client from `google-services.json` when present, so stale local `google.webClientId` values do not override the Firebase Android config.

Release checks:

- New users can sign in.
- Onboarding saves and does not repeat once complete.
- App opens to the main experience for completed profiles.
- Android emulator sign-in can reach the Google account picker; completing Google re-auth may require user credentials on the emulator.

## Account and Data Deletion Requests

Purpose: give users and store reviewers an in-app path to request account/data deletion.

Shared behavior:

- Profile includes an "ACCOUNT DELETION REQUEST" card near policy and support links.
- Submitting writes `accountDeletionRequests/{uid}` with `status: requested`, platform `source`, denormalized email/display name, and request timestamps.
- Submitting also mirrors `users/{uid}.accountDeletionRequest.status` so all platforms can show the request as recorded.
- Admin profiles include an "ACCOUNT DELETION REVIEW QUEUE" card that lists pending requests for support follow-up.
- Account Deletion Admin Review Updates let admins mark requests `verified`, `contacted`, `blocked`, or `closed` with `reviewNote`, `reviewedBy`, and `reviewedAt`, while keeping deletion itself as a manual support operation.
- This is a support-reviewed request flow only; it does not immediately delete the Firebase Auth account, erase activity or purchase records, cancel subscriptions, process refunds, or bypass marketplace policy.

Release checks:

- Request button writes the shared Firestore document and profile marker.
- Re-opening profile shows the recorded status.
- Admin profiles can see pending requested entries without any destructive delete action.
- Firestore rules allow only the signed-in user to create/update their own request and admins to review.
- Support/data deletion hosted pages remain linked from the Profile Policy and Support hub.

## Support Requests

Purpose: give users an in-app support contact path and give admins an open request queue.

Shared behavior:

- Profile includes a "SUPPORT REQUEST" card near policy and support links.
- Users choose a category from `general`, `account`, `billing`, `bug`, or `safety` and send a message.
- Submitting writes a `supportRequests` document with `status: open`, platform `source`, denormalized email/display name, and timestamps.
- Admin profiles include a "SUPPORT REVIEW QUEUE" card that lists open requests for follow-up.
- Support Request Admin Review Updates let admin profiles mark support requests `waiting`, `resolved`, or `closed` while saving `reviewNote`, `reviewedBy`, and `reviewedAt`.
- This is a follow-up flow only; it does not process refunds, cancel subscriptions, write entitlements, resolve purchases, or bypass marketplace policy.

Release checks:

- Support request button writes the shared Firestore document.
- Admin profiles can see open support requests without any refund, subscription, or entitlement action.
- Firestore rules allow only signed-in users to create their own open requests and admins to manage the queue.
- Hosted support page remains linked from the Profile Policy and Support hub.

## Home Dashboard

Purpose: show the user’s current progress at a glance.

Shared behavior:

- Streak, total points, and days active stats.
- Activity breakdown by type.
- Calendar/history view with activity color cues.
- Challenge stats card that navigates to Challenges.
- Progress sharing entry points.

Release checks:

- Logged activity updates points, streak, days active, and calendar.
- Tapping a historical date shows the day’s recorded activity.
- Empty history states render without crashing.

## Activity Logging

Purpose: manually record daily activity and optionally import wearable activity.

Shared behavior:

- Activity type selection.
- Duration/distance/intensity where applicable.
- Points calculation and day history storage.
- Running list of activities logged in the current session.
- Badge checks after logs.

Platform notes:

- Web can use browser/runtime capabilities and Capacitor when wrapped.
- iOS imports Apple Health workouts and supports HealthKit auto-import.
- Android imports Health Connect activity and supports WorkManager auto-sync.

Release checks:

- Duplicate activity IDs are not double-saved.
- Saving updates Firestore day logs and profile stats.
- Health sync permissions fail gracefully when unavailable.

## Challenges

Purpose: let users create, join, track, share, and leave challenges.

Shared behavior:

- Create challenges from templates or custom configuration.
- Create weekly/Instagram campaign challenges from campaign-tagged templates.
- Discover public challenges.
- Join by invite code.
- Copy/share full invite links.
- Share generated challenge launch cards for Instagram/native share flows.
- Invite links carry optional referral attribution via `ref`.
- Track daily challenge tasks.
- Store per-day challenge logs under challenge member documents.
- Challenge leaderboard and member stats.
- Completed challenges show a local completion recap with points, completed days, streak, and share copy for Instagram/community proof.
- Premium pack challenges use their `packLabel` in completion recap UI and share copy when present.
- Leave challenge flow with admin handoff and sole-admin delete.
- Campaign CTA, hashtag, and label metadata for Instagram-led challenge launches.
- Premium challenge pack templates carry `isPremium`, `packId`, and `packLabel` metadata and are gated by the shared Pro entitlement.
- Seasonal campaign drops use shared template IDs across platforms: `seasonal_summer_shred` as a premium seasonal pack and `seasonal_winter_base` as a free seasonal campaign.

Firestore contracts:

- `challenges/{challengeId}`
- `challenges/{challengeId}/members/{uid}`
- `challenges/{challengeId}/members/{uid}/dailyLogs/{yyyy-MM-dd}`
- `users/{uid}.joinedChallengeIds`
- `users/{uid}.stats.challengesJoined`
- `users/{uid}.stats.challengesOwned`
- Optional campaign fields on challenge docs: `campaignId`, `campaignLabel`, `campaignHashtag`, `campaignCta`
- Optional sponsor fields on challenge docs: `sponsorName`, `sponsorLabel`, `sponsorPerk`, `sponsorUrl`
- Optional premium pack fields on challenge docs: `isPremium`, `packId`, `packLabel`
- Optional premium pack prompt field on challenge docs: `dailyPrompts`
- Optional Coach Mode fields on challenge docs: `creatorSpecialty`, `creatorBio`, `creatorCtaUrl`

Release checks:

- Creating increments owned/joined stats.
- Joining is idempotent and does not double-increment.
- Daily challenge logging is idempotent for the same day.
- Leaving removes membership and updates challenge counts.
- Admin handoff promotes another member when needed.
- Campaign challenges render correctly on all platforms and invite copy includes the CTA/hashtag.
- Sponsored challenge blocks render only when `sponsorName` is present.
- Completion recap appears only when the member has completed the challenge duration and uses existing challenge member stats.
- Premium pack completion recap copy must come from existing challenge metadata and must not imply a separate paid entitlement beyond the challenge already created.
- Completion recap sharing must not write extra backend state until premium recap/badge entitlement rules are defined.
- Creating a sponsored template preserves sponsor metadata on the challenge document.
- Missing sponsor fields must render nothing and must not affect challenge creation, joining, daily logging, invites, or leaderboards.
- Sponsor metadata is informational only until a reviewed partner config, link policy, and reporting model are added.
- Launch cards include challenge name, campaign label/hashtag, CTA, invite code, and referral link.
- Referral attribution is stored on newly joined challenge member docs when `ref` is present.
- Free users cannot create premium pack challenges, while active Pro users can create the same templates across platforms.
- Seasonal campaign templates must preserve campaign hashtags, CTAs, and premium pack metadata when a challenge is created.
- Premium pack templates can include `dailyPrompts` for extra accountability content, and tracker/detail screens must render those prompts when present.
- Paid challenge pack template cards show a Pack Value Preview from existing duration, task count, prompt count, and unlock state.
- Pack Value Preview must be metadata-only and must not grant access, write entitlements, or imply that store validation has succeeded.
- Active Pro creators with Coach Mode enabled should denormalize creator specialty, bio, and CTA link onto newly created challenge documents.
- Challenge detail/tracker screens should render Coach Host branding only when denormalized creator specialty or bio is present.

## Badges

Purpose: reward milestones, streaks, activity mix, challenge progress, and special achievements.

Shared behavior:

- Badge catalog covers streaks, milestones, activity, challenges, and special badges.
- Earned badges show positive visual state.
- Locked badges show locked/unearned state.
- In-progress badges show current/target progress.
- Unlock overlay/notification appears after earning.
- Badge awards are written to Firestore.
- Pro-only badge foundation includes `pro_weekly_report`, `pro_streak_saver`, and `pro_finisher`, all gated by `users/{uid}.entitlements.pro.active`.

Release checks:

- Badge checks run after activity logs and challenge updates.
- Challenge completion/top-rank stats feed finisher/champion badges.
- Web, iOS, and Android derive challenge badge stats from `challenges/{challengeId}/members/{uid}` plus daily challenge logs; profile aggregate fields are only a display fallback.
- Existing awarded badges are not re-awarded.
- Premium badges must not award to non-Pro users even when the activity, recovery, or completion condition is met.
- Premium badge progress can render for all users, but the current value must stay locked at zero until Pro is active.

## Leaderboard

Purpose: show personal and challenge-relative performance.

Shared behavior:

- Personal stats summary.
- Activity breakdown bars.
- Challenge leaderboards.
- Profile image/avatar appears consistently.

Release checks:

- Member rows render uploaded photos, avatar fallback, or default rank avatar.
- Challenge score changes reorder leaderboard rows.
- Missing profile appearance fields do not crash older accounts.

## Profile Appearance

Purpose: let users personalize identity across app surfaces.

Shared Firestore fields on `users/{uid}`:

- `profileImageData`
- `avatarEmoji`
- `avatarColor`
- `instagramHandle`

Shared behavior:

- Upload photo.
- Choose generated avatar.
- Remove uploaded photo.
- Save an optional Instagram handle for share copy and future community features.
- Denormalize appearance fields into joined challenge member documents.

Release checks:

- Uploads are compressed/resized before saving.
- Choosing an avatar clears `profileImageData`.
- Leaderboards update after profile appearance changes.
- Instagram handles are stored without `@` and propagate into challenge member docs.

## Feature Submissions

Purpose: let users submit streak wins, challenge completions, comeback stories, beginner wins, or transformations for potential `@risewiththetribe` featuring.

Shared behavior:

- Profile screen includes a "Submit to be featured" flow.
- User selects a submission category.
- User writes a short story.
- User can attach one optional compressed progress photo.
- User must consent before submitting.
- Submission is written to `featureSubmissions` with status `pending`.
- Submission includes denormalized profile and Instagram fields for review context.
- Profile shows recent feature submissions and review statuses.
- Admin-marked profiles can review pending submissions and mark them `approved`, `featured`, or `declined`.
- Feature Submission Review Notes let admins save `reviewNote`, `reviewedBy`, and `reviewedAt` for consent, repost fit, claims safety, and caption context without auto-posting, overriding consent, or sharing unreviewed submissions.
- Profile shows a "Community highlights" gallery from submissions marked `featured`.
- Firestore rules protect the same lifecycle: consented owner create, owner/admin private reads, authenticated featured-highlight reads, and admin-only review updates.
- Profile shows a Community Highlight Roundup Kit that copies weekly Instagram roundup text from submissions already marked `featured`.
- Profile shows a UGC Consent Reminder Kit that copies a manual repost checklist for consent, review status, attribution, claim safety, and private-detail removal before posting member wins.
- Featured highlight cards use submitted media when present, fall back to the submitted avatar fields, and provide repost-ready caption copy for Instagram.
- Profile shows an Instagram Weekly Prompt Kit with shared weekday prompts and copy-ready captions that tag `@risewiththetribe`.
- Admin/creator profile surfaces show an Instagram Content Calendar with the full seven-day cadence and copy export.

Release checks:

- Submissions under the minimum story length are blocked.
- Consent is required.
- Public featuring is never automatic.
- Missing Instagram handle does not block submission.
- Attached media is optional and stored with a content type.
- Community highlights only read submissions with `status == featured`.
- Community Highlight Roundup Kit only uses featured submissions; it must not auto-post, schedule posts, scrape DMs, export per-user activity, share unreviewed submissions, imply paid access is live, promise outcomes, or imply medical results.
- UGC Consent Reminder Kit is copy-only and must not auto-post, schedule posts, scrape DMs, store inbound DMs, export private history, share unreviewed submissions, override consent, edit member claims into outcomes, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Instagram Weekly Prompt Kit uses local weekday and first-party profile/progress state only; it must not require Instagram APIs or backend writes.
- Instagram Content Calendar uses local prompt constants only; it must not require Instagram APIs, schedule posts automatically, or write backend state.
- Admin review controls only render for profiles with `isAdmin == true` or `role == "admin"`.
- Submission status history loads without requiring Firestore composite indexes.

## Referral Invite Hooks

Purpose: create the backend foundation for referral rewards and creator/community growth loops.

Shared behavior:

- Generated invite links include `ref=USER_ID`.
- Native deep-link handlers and the web app preserve `ref` while resolving the invite code.
- Joining a challenge stores `referredBy` and `referralSource` on the challenge member document.
- Valid referred joins increment `users/{referrerUid}.stats.referralJoins`.
- Profile shows referral joins.
- Existing invite links without `ref` continue to work.
- Profile surfaces show a Referral Launch Kit that turns next-tier referral progress into copy-ready Instagram/community invite text.
- Profile surfaces show a Referral Story Sprint Kit that turns next-tier referral progress into a copy-ready Story/Reel invite around one accountability partner.
- Profile surfaces show a Referral Reward Social Proof Kit that turns unlocked referral reward progress into copy-ready Story/carousel celebration copy.

Release checks:

- Self-referrals are ignored.
- Referral attribution is tied to joins, not link opens.
- Joining without a referral does not create reward state.
- Referral counts are visible in profile and can later power badges, Pro trials, or analytics.
- Referral Launch Kit copy must use first-party progress and referral tier state only; it must not count link opens, grant rewards, or write backend referral state.
- Referral Story Sprint Kit copy must use first-party progress and referral tier state only; it must not count link opens, grant rewards, write referral state, create payouts, create affiliate rewards, unlock entitlements, imply paid access is live, promise outcomes, or imply medical results.
- Referral Reward Social Proof Kit copy must use first-party referral progress only; it must not grant rewards, write referral state, create payouts, create affiliate rewards, unlock entitlements, imply paid access is live, promise outcomes, imply medical results, or claim fulfillment before admin review.

## Wearable Health Sync

Purpose: reduce manual logging by importing wearable activity.

Shared behavior:

- Manual import button.
- Opt-in automatic sync where the platform supports it.
- Imported activity maps to the same activity log and points model.

Platform notes:

- iOS uses HealthKit and Apple Health/Apple Watch data.
- Android uses Health Connect and can read supported wearable providers through Health Connect.
- Web has parity only when wrapped in a native runtime with supported plugins.

Release checks:

- Permission denial shows a usable message.
- Re-importing the same source activity does not duplicate the log.
- Auto-sync can be toggled off.

## Progress Sharing

Purpose: help users share streaks and progress externally.

Shared behavior:

- Copy progress text.
- WhatsApp share path.
- Generated image/native share path.
- Instagram Story support or native share fallback based on platform capabilities.
- Share copy and generated images prompt users to tag `@risewiththetribe`.

Release checks:

- Share text includes points, streak, and days active.
- Generated image is non-empty.
- Missing target apps fall back to a generic share flow.

## User Win Cards

Purpose: turn personal progress into a branded, user-generated asset for Instagram, WhatsApp, and native sharing.

Shared behavior:

- Win card share copy uses live points, current streak, days active, and optional Instagram handle.
- Generated/shareable card prompts users to tag `@risewiththetribe`.
- The feature is available on Web, iOS, and Android from an existing profile or progress sharing surface.

Release checks:

- Stats on the card match the user's current local/profile state.
- Missing Instagram handle does not block card creation.
- Native share fallbacks still work when Instagram or WhatsApp are not installed.

## Weekly Recap Sharing

Purpose: create a recurring weekly social prompt that turns recent effort into shareable proof.

Shared behavior:

- Recap uses the last 7 calendar days of local activity history.
- Share copy includes points, session count, active days out of 7, optional Instagram handle, and `@risewiththetribe`.
- The feature is available from the same sharing area as progress/win cards.

Release checks:

- Empty weeks still produce a valid recap.
- Recap numbers match the last 7 days of stored history.
- Native share sheet fallback works without Instagram or WhatsApp installed.

## Referral Reward Badges

Purpose: reward meaningful community growth through attributed challenge joins.

Shared behavior:

- Referral badge progress uses `users/{uid}.stats.referralJoins`.
- `connector` unlocks at 1 referral join.
- `tribe_builder` unlocks at 5 referral joins.
- `community_captain` unlocks at 10 referral joins.
- Profile shows a referral reward ladder at 1, 5, 10, and 25 attributed joins.
- Profile referral analytics show earned tier count, joins remaining to the next tier, and ladder completion.
- The 25-join "Founder Circle" tier is a future perk candidate and does not grant paid entitlement yet.
- Profile shows a Referral Reward Claim action for the user's highest unlocked tier.
- Claim requests write `referralRewardClaims/{uid}_{tierTarget}` with `uid`, `referralJoins`, `tierTarget`, `tierLabel`, `reward`, `status`, `source`, and timestamps.
- Admin profile surfaces show a Referral Reward Review Queue for open `referralRewardClaims`.
- Referral Reward Admin Review Updates let admins mark reward claims `approved`, `waiting`, `not_ready`, or `declined` while saving `reviewNote`, `reviewedBy`, and `reviewedAt`.
- Referral Reward Claim is request-only and does not grant Pro, entitlements, discounts, purchases, payouts, affiliate rewards, or paid access.

Release checks:

- Self-referrals do not count.
- Badge progress appears in the shared badge grid before unlock.
- Award logic uses the same thresholds on Web, iOS, and Android.
- Reward ladder progress and next-tier copy match the same thresholds on Web, iOS, and Android.
- Referral analytics derive from `users/{uid}.stats.referralJoins` and do not require extra backend fields.
- Referral claims can only be created for tiers unlocked by first-party `stats.referralJoins`.
- Admin review queues verify meaningful challenge joins before manual recognition or any future perk fulfillment.

## Tribe Pro Entitlement Foundation

Purpose: prepare the product for subscriptions without breaking the free habit loop.

Shared behavior:

- All platforms read `users/{uid}.entitlements.pro`.
- Profile shows Pro active/inactive status from the shared entitlement.
- The visible benefit list is consistent across Web, iOS, and Android.
- Profile checkout surfaces include a Pro Value Snapshot from existing weekly score, 30-day active days, challenge points, and best-fit Pro benefit copy.
- Profile checkout surfaces include Pro Trial Interest capture for first-party demand signals with allowed reasons `reports`, `challenge_packs`, and `creator_tools`.
- Admin profiles include a Pro trial demand summary and Trial Launch Kit that count saved Pro Trial Interest reasons from first-party user profile data.
- Admin profiles include a Pro Trial Objection Reply Kit that turns aggregate Pro Trial Interest demand into manual replies for Pro questions before store-backed trials are live.
- Admin profiles include a Monetization Launch Board that combines aggregate Pro trial, creator beta, and partner perk demand signals.
- Admin and enabled creator profiles include a Launch Experiment Kit that recommends copy-ready Pro trial, pack-drop, referral sprint, or partner-perk tests from first-party signals.
- Admin and enabled creator profiles include a Launch Experiment Scorecard that scores the recommended test with first-party demand, campaign reach, and community-loop signals.
- Admin and enabled creator profiles include a Release QA Checklist for product IDs, store test purchases, entitlement writes, feature parity docs, and social share checks before monetization or campaign launches.
- Admin and enabled creator profiles include a Launch Retrospective Kit for manual first-party review after campaign pushes using challenge joins, referrals, feature submissions, share-card usage, and entitlement validation.
- Admin and enabled creator profiles include a Revenue Pathway Planner that ranks Pro, paid packs, creator hosting, and partner campaigns from first-party demand, campaign, and referral signals.
- Admin and enabled creator profiles include a Pricing Test Kit that exports safe pricing-language prompts for shared Pro and pack product IDs before store launch.
- Admin and enabled creator profiles include a Founder Member Offer Kit that exports early-member value-validation copy for the free challenge loop before paid access.
- Admin and enabled creator profiles include a Community Ambassador Kit that exports recognition-led referral and challenge-leadership prompts before paid roles or payouts.
- Admin and enabled creator profiles include a Customer Value Checklist that exports free-loop, paid-value, community-proof, and support-readiness checks before charging users.
- Admin profiles include a Support Refund Readiness Kit that exports restore, marketplace refund, entitlement recovery, and escalation handoff copy before paid launch.
- Profile purchase cards include an Entitlement Recovery Request action that writes `entitlementRecoveryRequests/{uid}` for manual review when restore/sync does not match store purchase history.
- Admin profiles include an Entitlement Recovery Review Queue for open `entitlementRecoveryRequests`.
- Entitlement Recovery Admin Review Updates let admins mark recovery requests `waiting`, `resolved`, or `closed` while saving `reviewNote`, `reviewedBy`, and `reviewedAt`.
- Admin profiles include a Store Test Purchase Evidence Log that records `storeTestPurchaseEvidence` after manual App Store sandbox or Play license testing.
- Admin profiles include a Paid Launch Decision Gate that exports go/no-go checks for product IDs, demand, support handoff, receipt-validation credentials, store test evidence, and entitlement QA before paid access is promoted.
- Admin profiles include a Sandbox Purchase Test Plan that exports App Store sandbox, Play license test, restore, backend `verifyPurchase`, Firestore entitlement QA, support escalation, and negative-case checks before paid access is promoted.
- Admin profiles include a Store Listing Copy Kit that exports App Store / Play listing title, subtitle, short description, value points, launch positioning, and policy-safe paid-feature cautions.
- Admin profiles include a Store Review Submission Kit that exports App Store / Play reviewer notes, demo-account checklist, permission explanations, support/privacy/data-deletion reminders, and policy-safe paid-access cautions.
- Admin profiles include a Store Review Evidence Pack that exports store-test evidence counts, product IDs, policy/support links, permission notes, validation readiness, and launch gate status for reviewer-safe submission notes.
- Profile surfaces include a Policy and Support Link Hub that opens hosted privacy, terms, support, and account/data deletion resources for users and store reviewers.
- Admin profiles include a Data Safety Disclosure Kit that exports Play Data Safety and App Privacy disclosure notes for auth, profile content, activity/health data, UGC, purchase verification, notifications, support, and deletion resources.
- Profile includes a Pro-gated analytics/report surface. Free users see a locked preview; active Pro users see report metrics and insight copy.
- Pro analytics reports use shared weekly and monthly report contracts: weekly score, 7-day consistency, monthly score, 30-day active days, 30-day points, challenge points, status labels, and next-best-action copy.
- Weekly score is derived from current progress toward custom active-day, weekly-points, and streak goals; monthly score uses the same weekly goals scaled to four weeks and the same streak target. Neither report requires a new backend collection.
- Active Pro users can share a 30-day recap prompt from the profile/report surface using the same monthly report data.
- Profile includes a Pro-gated custom goals surface for weekly active days, weekly points, and streak target.
- Profile includes a Pro-gated profile frame picker saved under `users/{uid}.cosmetics.profileFrameId`.
- Saved profile frames render on profile avatars and challenge member avatars using denormalized `profileFrameId`.
- Home share surfaces include a Pro-gated share template picker saved under `users/{uid}.sharePreferences.templateId`.
- `classic` is free; `gold` and `neon` require active Pro and change the generated share-card palette.
- Profile includes a Pro-gated Creator / Coach Mode foundation saved under `users/{uid}.creatorProfile`.
- Creator profile fields currently include `enabled`, `specialty`, `bio`, `ctaUrl`, and `revenueShareInterest` for future hosted/branded challenge and paid-hosting surfaces.
- Creator / Coach Mode includes a Pro-gated analytics foundation derived from challenge docs the creator already belongs to: hosted challenge count, member reach, active hosted challenges, and private hosted challenges.
- Creator / Coach Mode includes revenue-share readiness metrics for hosted paid-pack challenges and hosted challenges with paid-pack metadata or at least five members.
- Creator Launch Kit generates repost-ready creator launch copy from the next hosted challenge, invite code, creator specialty, creator bio, and `@risewiththetribe` tag.
- Creator Hosting Offer Kit generates a copy-only paid-hosting planning brief from creator focus, hosted challenge reach, revenue-ready signals, beta interest, and the next hosted challenge.
- Creator Terms Readiness Kit generates a copy-only responsibilities and guardrails brief for creator conduct, moderation, payout readiness, marketplace alignment, and support handoff before paid hosting.
- Creator Payout Readiness Kit generates a copy-only payout provider, tax, identity, refund, support, marketplace, and claim-safety checklist before revenue-share.
- Creator Hosting Objection Reply Kit generates copy-only manual replies for creator paid-hosting questions before revenue-share, payout operations, store validation, and entitlement QA are complete.
- Creator Hosting Application lets Pro creators with Coach Mode enabled request manual hosted-readiness review under `creatorHostingApplications/{uid}`.
- Creator Hosting Application stores creator focus, hosted challenge count, member reach, revenue-ready count, revenue-share interest, status, source, and timestamps.
- Admin profiles include a Creator Hosting Application Review Queue for open `creatorHostingApplications`.
- Creator Hosting Application Admin Review Updates let admins mark applications `approved`, `waiting`, `not_ready`, or `declined` while saving `reviewNote`, `reviewedBy`, and `reviewedAt`.
- Admin profiles include a Creator demand summary that aggregates enabled creator profiles, future revenue-share beta opt-ins, and creator profiles with branding content.
- New challenges created by active Pro users with Coach Mode enabled include denormalized creator specialty, bio, and CTA link fields so challenge detail screens can show a Coach Host block without extra profile reads.
- Profile includes a Partner Perks foundation card for future aligned offers from gear, recovery, nutrition, studio, or wearable partners.
- Users can save partner perk interest under `users/{uid}.partnerPerkInterest.selectedIds`.
- Allowed partner perk interest ids are `gear`, `recovery`, and `nutrition`.
- Partner perk interest is currently a first-party demand signal and must not add ad tracking, random offer placement, or third-party data sharing.
- Partner perk cards show first-party member eligibility progress: Gear requires 14 active days, Recovery requires 7 challenge days, and Fuel requires 1 referral join.
- Eligible members can request manual perk review under `partnerPerkClaims/{uid}_{perkId}`.
- Partner Perk Claim stores `perkId`, `perkLabel`, `perkTitle`, current eligibility value, target, requirement, status, source, and timestamps.
- Profiles show signed-in user Partner perk claim status history from `partnerPerkClaims`.
- Admin profiles include a Partner Perk Claim Review Queue for open `partnerPerkClaims`.
- Admin profiles include a Partner Perk Fulfillment Readiness Kit with Manual readiness checks, Open perk claims, `Verify the claim was written from first-party eligibility progress only`, support owner, and destination safety copy before any partner fulfillment exists.
- Admin profiles include a Partner Perk Admin Decision Reply Kit with approved, waiting, not-ready, and declined manual claim replies before any partner fulfillment exists.
- Admin profiles can update partner perk claims to `approved`, `waiting`, `not_ready`, or `declined` with `reviewNote`, `reviewedBy`, and `reviewedAt`; member claim history shows the status and review note.
- Admin profiles include a sponsor reporting foundation that counts saved partner perk interest by category.
- Admin profiles include a Partner Pitch Kit that generates sponsor outreach copy from first-party partner demand counts.
- Admin profiles include a Partner Campaign Activation Kit that generates a copy-only sponsor-backed challenge pilot brief from first-party perk demand, campaign reach, and referral signals.
- Admin profiles include a Partner Terms Readiness Kit that generates a copy-only sponsor-pilot terms brief for partner fit, disclosure, data boundaries, destination review, reporting, and support handoff.
- Admin profiles include a Partner Contract Readiness Kit that generates a copy-only checklist for partner identity, support ownership, disclosure, fulfillment, privacy, reporting, and destination review.
- Admin profiles include a Partner Campaign Objection Reply Kit that generates copy-only manual replies for sponsor-pilot questions from first-party perk demand, campaign reach, and referral signals.
- Partner Campaign Application lets users request manual sponsor-pilot review under `partnerCampaignApplications/{uid}` once they have saved at least one partner perk signal.
- Partner Campaign Application stores the top perk, first-party demand count, total demand, campaign reach, referral joins, status, source, and timestamps.
- Admin profiles include a Partner Campaign Application Review Queue for open `partnerCampaignApplications`.
- Admin profiles can update partner campaign applications to `approved`, `waiting`, `not_ready`, or `declined` with `reviewNote`, `reviewedBy`, and `reviewedAt`.
- Challenge templates can include sponsored campaign metadata for future partner-backed challenges.
- Sponsored challenge metadata currently uses the same challenge create/join/track backend and does not introduce ad targeting, tracking pixels, or random in-feed placement.
- Admin profiles include a Campaign Performance Board that aggregates campaign-backed challenge count, active/public/premium/seasonal splits, and member reach.
- Admin and enabled creator profiles include a Weekly Campaign Scheduler that derives this week's campaign prompt from existing campaign challenge templates and produces copy-ready Instagram cadence text.
- Admin and enabled creator profiles include a Weekly Campaign Launch Card Kit that turns this week's campaign prompt into a copy-ready card headline, design notes, caption draft, hashtag, and consent-safe posting guardrails.
- Admin and enabled creator profiles include a Weekly Campaign Preflight Checklist that turns this week's campaign prompt, DM keyword kit, content calendar, referral loop, consent-reviewed UGC, and first-party review metrics into a copy-ready manual launch checklist.
- Admin and enabled creator profiles include a Weekly Campaign Review Kit that turns campaign reach, referral joins, feature submissions, DM copy readiness, and share-card usage into a copy-ready post-launch review brief.
- Admin and enabled creator profiles include a Weekly Campaign Storyboard Kit that turns this week's campaign prompt into a copy-ready Reel storyboard, Story frame plan, carousel outline, hashtag, and consent-safe publishing guardrails.
- Admin and enabled creator profiles include a Weekly Campaign Experiment Brief Kit that connects this week's campaign CTA to the recommended manual launch experiment and first-party review signals.
- Admin and enabled creator profiles include an Instagram DM Keyword Kit with manual reply copy for `TRIBE`, `COMEBACK`, `PRO`, and `FEATURE` audience flows.
- Admin and enabled creator profiles include a Weekly Campaign Comment Reply Kit with manual public replies for join, comeback, paid-access, and Feature Me questions.
- Admin and enabled creator profiles include a Weekly Campaign Countdown Story Kit with manual pre-launch Story frames, countdown sticker copy, and app-first start reminders.
- Admin and enabled creator profiles include a Weekly Campaign Start-Day Story Kit with manual launch-day Story frames, sticker copy, and first-log reminders.
- Admin and enabled creator profiles include a Weekly Campaign Midweek Check-In Story Kit with manual comeback Story frames, sticker copy, and first-party re-engagement review prompts.
- Admin and enabled creator profiles include a Weekly Campaign Weekend Push Story Kit with manual finish-line Story frames, sticker copy, and first-party completion momentum review prompts.
- Admin and enabled creator profiles include a Weekly Campaign Completion Recap Story Kit with manual aggregate recap Story frames, Feature Me consent routing, and next-challenge prompts.
- Admin and enabled creator profiles include a Weekly Campaign Next-Week Teaser Story Kit with manual next-challenge teaser frames, sticker copy, and first-party launch-angle review prompts.
- Admin and enabled creator profiles include a Weekly Campaign Partner Perk Teaser Story Kit with manual perk-interest Story frames, app-first saved-interest routing, and partner-readiness guardrails.
- Admin and enabled creator profiles include a Weekly Campaign Story Poll Kit with manual poll, quiz, and question sticker prompts for weekly campaign feedback that routes voters back into first-party app actions.
- Admin and enabled creator profiles include a Weekly Campaign Poll Review Kit with manual readback prompts for turning visible Story poll reactions into next content/app CTAs backed by first-party app movement.
- Admin and enabled creator profiles include a Weekly Campaign Live Q&A Kit with manual Live setup, question lanes, close copy, and app-first follow-up guardrails from audience questions.
- Admin and enabled creator profiles include a Weekly Campaign Live Recap Kit with manual post-Live readback, public recap copy, content decisions, and first-party signal review guardrails.
- Admin and enabled creator profiles include a Weekly Campaign FAQ Carousel Kit with manual seven-slide carousel outline for repeated audience questions that routes action back into the app.
- Admin and enabled creator profiles include a Weekly Campaign Caption Bank Kit with manual Reel, carousel, Story, and pinned-comment caption variants that route followers into first-party app actions.
- Admin and enabled creator profiles include a Weekly Campaign Collab Invite Kit with manual creator outreach for collab posts and Story mentions before paid hosting, revenue-share, payout, contract, affiliate, or partner-link workflows exist.
- Admin and enabled creator profiles include a Weekly Campaign Collab Follow-Up Kit with manual yes/post-guidance/paid-hosting/not-ready replies that route deeper creator interest into Creator / Coach Mode review before paid terms.
- Admin and enabled creator profiles include a Weekly Campaign Collab Safety Checklist with manual consent, claim, private-reply, member-data, and paid-hosting readiness review before creator escalation.
- Admin and enabled creator profiles include a Weekly Campaign Collab Recap Kit with manual post-collab review from first-party app movement, consent-cleared submissions, content lessons, and next-collab decisions.
- Admin and enabled creator profiles include a Weekly Campaign Collab Renewal Kit with manual repeat-or-pause criteria and Creator / Coach Mode review routing before deeper hosting or paid terms.
- Profile includes a Pro-gated streak recovery action that writes a zero-point `streak_recovery` activity for yesterday.
- Private challenge creation is gated by the same Pro entitlement; public challenges remain free.
- Private challenge create calls must fall back to public when the creator does not have active Pro.
- Paid challenge pack templates are gated by the same Pro entitlement until store-specific purchase validation is live.
- Paid challenge pack creation also accepts specific active pack entitlements at `users/{uid}.entitlements.packs.{packId}.active`, so future receipt validation can unlock one pack without granting full Pro.
- Paid challenge packs can include accountability prompt arrays that are persisted onto challenge docs and rendered in tracker/detail surfaces.
- Profile checkout surfaces show subscription products and challenge-pack products separately, including an `UNLOCKED` state when Pro or the specific pack entitlement is active.
- The first premium pack foundation template is `21-Day Reset Pack` with `packId = 21_day_reset`.
- Profile checkout buttons surface the shared Pro subscription products; entitlement unlock still waits for receipt validation credentials.
- Admin profiles include Store Launch Readiness with product ID counts, credential setup reminders, sandbox/test purchase reminders, and entitlement write checks.

Release checks:

- Missing entitlement fields render as not active.
- Active entitlements render as active without changing core free-user behavior.
- Pro Value Snapshot must derive from existing activity/challenge/profile state only and must not require new backend fields.
- Pro Trial Interest must not grant entitlements, start purchases, share third-party data, or imply a store-backed free trial exists before App Store / Play products are configured.
- Pro Trial Objection Reply Kit is copy-only and must not claim a store-backed trial is live, quote unconfigured prices, collect payments, create purchases, grant Pro, write entitlements, offer discounts, promise founder pricing, imply guaranteed outcomes, imply medical results, scrape DMs, store inbound DMs, add tracking pixels, or pressure users.
- Pro trial demand summaries must be admin-only and aggregate counts only; they must not expose per-user reason lists in the UI.
- Monetization Launch Board must be admin-only, aggregate-only, and based on first-party demand signals already collected by the app.
- Launch Experiment Kit must be manual/copy-only and must not add tracking pixels, schedule posts, write experiment records, or claim paid access is live before store validation and entitlement QA are complete.
- Launch Experiment Scorecard must be read-only/manual planning UI and must not create experiment records, track off-platform behavior, or grant/imply paid access.
- Release QA Checklist must be copy-only/manual launch readiness UI and must not write purchases, entitlements, experiments, or off-platform tracking state.
- Launch Retrospective Kit must be copy-only/manual review UI and must not write experiments, attribution, off-platform tracking, purchases, or entitlement state.
- Revenue Pathway Planner must be copy-only/manual planning UI and must not write purchases, entitlements, partner links, tracking pixels, paid-access claims, or payout promises.
- Pricing Test Kit must be copy-only/manual planning UI and must not quote unconfigured prices, collect payments outside approved store flows, grant purchases, write entitlements, offer discounts, or claim paid access is live.
- Founder Member Offer Kit must be copy-only/manual planning UI and must not create sales, coupons, lifetime deals, payments, purchases, entitlements, discounts, or founder-pricing promises.
- Community Ambassador Kit must be copy-only/manual planning UI and must not create commissions, payouts, paid roles, affiliate links, partner tracking, purchases, entitlements, discounts, or revenue-share promises.
- Customer Value Checklist must be copy-only/manual planning UI and must not charge users, unlock paid access, promise outcomes, imply medical results, run discounts, write entitlements, or promote paid features as live.
- Support Refund Readiness Kit must be copy-only/manual planning UI and must not process refunds in-app, override App Store or Play refund policy, write entitlements manually, promise outcomes, imply medical results, or promote paid access as live.
- Paid Launch Decision Gate must read `storeTestPurchaseEvidence` counts for iOS/Android evidence coverage, remain copy-only/manual planning UI, and must not flip paid access live, write entitlements, process payments, process refunds, bypass marketplace policy, promise outcomes, imply medical results, or announce launch readiness early.
- Sandbox Purchase Test Plan must be copy-only/manual QA UI and must not run live charges, bypass marketplace policy, unlock entitlements from profile UI, write fake purchases, process refunds, promise outcomes, imply medical results, or claim paid access is live.
- Store Listing Copy Kit must be copy-only/manual planning UI and must not claim paid access is live, advertise unconfigured prices, promise outcomes, imply medical results, mention refunds outside marketplace policy, unlock entitlements, or submit policy-conflicting copy.
- Store Review Submission Kit must be copy-only/manual planning UI and must not submit inaccurate permission claims, provide personal user data in reviewer notes, bypass marketplace purchase review, claim medical or guaranteed fitness outcomes, unlock paid access from client code, or mark the app ready for review before store products, policies, support links, privacy/data deletion flows, and entitlement QA are verified.
- Store Review Evidence Pack must be copy-only/manual planning UI and must not submit store review, expose personal user data, unlock paid access, write entitlements, create purchases, process refunds, bypass marketplace policy, mark paid access live, or claim review readiness before evidence, products, credentials, policies, support links, restore flow, and entitlement QA are verified.
- Policy and Support Link Hub must open hosted informational resources only; it must not delete data in-app, process refunds, grant entitlements, collect payments, collect support messages in-app, or imply medical advice.
- Data Safety Disclosure Kit must be copy-only/manual planning UI and must not submit store privacy labels that conflict with current permissions, hide optional health/media collection, imply medical or guaranteed fitness outcomes, claim third-party ad tracking exists, omit purchase verification data, or collect new data without updating privacy, data safety, feature parity docs, and release QA.
- Store Launch Readiness must be admin-only, checklist-only, and must not unlock entitlements or mark receipt validation as configured.
- Campaign Performance Board must be admin-only, aggregate-only, and based on challenge campaign metadata and `memberCount` only.
- Weekly Campaign Scheduler must derive from existing campaign template metadata and must not create backend writes or per-user tracking.
- Weekly Campaign Launch Card Kit must be copy-only/manual planning UI and must not auto-post to Instagram, scrape DMs, add tracking pixels, imply paid access is live, promise outcomes, imply medical results, or share user activity without consent.
- Weekly Campaign Preflight Checklist must be copy-only/manual planning UI and must not schedule posts, auto-post to Instagram, scrape/store DMs, add tracking pixels, export per-user activity, share user content without consent, imply paid access is live, promise outcomes, or imply medical results.
- Weekly Campaign Review Kit must be copy-only/manual review UI and must not create attribution records, add tracking pixels, scrape/store Instagram DMs, export per-user activity, share user content without consent, imply paid access is live, promise outcomes, or imply medical results.
- Weekly Campaign Storyboard Kit must be copy-only/manual content planning UI and must not auto-post to Instagram, schedule posts from the app, scrape/store DMs, add tracking pixels, export per-user activity, share user content without consent, imply paid access is live, promise outcomes, or imply medical results.
- Weekly Campaign Experiment Brief Kit must be copy-only/manual planning UI and must not create experiment records, schedule posts, auto-post to Instagram, add tracking pixels, scrape/store Instagram DMs, export per-user activity, share user content without consent, imply paid access is live, promise outcomes, or imply medical results.
- Instagram DM Keyword Kit must be copy-only/manual-reply UI and must not imply Instagram API automation or store inbound DM data.
- Weekly Campaign Comment Reply Kit must be copy-only/manual public reply UI and must not auto-reply, scrape comments, scrape/store DMs, store inbound comments, add tracking pixels, create attribution records, export per-user activity, share user content without consent, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign Countdown Story Kit must be copy-only/manual Story countdown UI and must not auto-post, schedule Stories, scrape Story responses, scrape comments, scrape/store DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Story interactions as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign Start-Day Story Kit must be copy-only/manual launch-day Story UI and must not auto-post, schedule Stories, scrape Story responses, scrape comments, scrape/store DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Story reactions as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign Midweek Check-In Story Kit must be copy-only/manual comeback Story UI and must not auto-post, schedule Stories, scrape Story responses, scrape comments, scrape/store DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Story reactions as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign Weekend Push Story Kit must be copy-only/manual finish-line Story UI and must not auto-post, schedule Stories, scrape Story responses, scrape comments, scrape/store DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Story reactions as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign Completion Recap Story Kit must be copy-only/manual aggregate recap Story UI and must not auto-post, schedule Stories, scrape Story responses, scrape comments, scrape/store DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Story reactions as app consent, share private responses, share user wins without Feature Me consent, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign Next-Week Teaser Story Kit must be copy-only/manual next-challenge teaser Story UI and must not auto-post, schedule Stories, scrape Story responses, scrape comments, scrape/store DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Story reactions as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign Partner Perk Teaser Story Kit must be copy-only/manual partner-interest Story UI and must not auto-post, schedule Stories, scrape Story responses, scrape comments, scrape/store DMs, store Instagram identities, store inbound replies, create attribution records, create affiliate links, create partner payouts, contact partners as if demand is validated, add tracking pixels, export per-user activity, treat Story reactions as app consent, share private responses, imply paid access or perks are live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign Story Poll Kit must be copy-only/manual Story sticker planning UI and must not auto-post, scrape Story responses, scrape comments, scrape/store DMs, store inbound replies, add tracking pixels, create attribution records, export per-user activity, treat Instagram votes as app consent, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign Poll Review Kit must be copy-only/manual review UI and must not scrape Story responses, store Instagram voter identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Instagram votes as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign Live Q&A Kit must be copy-only/manual Live planning UI and must not auto-host, record private replies, scrape comments, scrape/store DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Live questions as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign Live Recap Kit must be copy-only/manual Live recap UI and must not auto-post, record private replies, scrape comments, scrape/store DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Live questions as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign FAQ Carousel Kit must be copy-only/manual FAQ carousel UI and must not auto-post, schedule posts, scrape comments, scrape/store DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Instagram questions as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign Caption Bank Kit must be copy-only/manual caption planning UI and must not auto-post, schedule posts, scrape comments, scrape/store DMs, store inbound replies, create attribution records, add tracking pixels, export per-user activity, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Weekly Campaign Collab Invite Kit must be copy-only/manual creator outreach UI and must not auto-message, scrape/store DMs, store inbound replies, create contracts, create payouts, promise revenue-share, create affiliate links, add tracking pixels, export per-user activity, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure creators.
- Weekly Campaign Collab Follow-Up Kit must be copy-only/manual creator follow-up UI and must not auto-message, scrape/store DMs, store inbound replies, create contracts, create payouts, promise revenue-share, create affiliate links, add tracking pixels, export per-user activity, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure creators.
- Weekly Campaign Collab Safety Checklist must be copy-only/manual creator consent and claim review UI and must not auto-message, scrape/store DMs, store inbound replies, create contracts, create payouts, promise revenue-share, create affiliate links, add tracking pixels, export per-user activity, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure creators.
- Weekly Campaign Collab Recap Kit must be copy-only/manual creator recap UI and must not scrape posts/comments/DMs, store Instagram identities, store inbound replies, create attribution records, create contracts, create payouts, promise revenue-share, create affiliate links, add tracking pixels, export per-user activity, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure creators.
- Weekly Campaign Collab Renewal Kit must be copy-only/manual creator renewal UI and must not auto-message, scrape posts/comments/DMs, store Instagram identities, store inbound replies, create attribution records, create contracts, create payouts, promise revenue-share, create affiliate links, add tracking pixels, export per-user activity, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure creators.
- Creator Hosting Offer Kit must be copy-only/manual planning UI and must not create contracts, payouts, purchases, entitlements, or paid-access claims.
- Creator Terms Readiness Kit must be copy-only/manual planning UI and must not create contracts, collect payout details, collect tax details, start revenue-share, process payments, create purchases, write entitlements, process refunds, bypass marketplace policy, promise outcomes, imply medical results, or claim paid creator hosting is live.
- Creator Payout Readiness Kit must be copy-only/manual planning UI and must not create payouts, collect payout details, collect tax details, create contracts, start revenue-share, process payments, create purchases, write entitlements, process refunds, bypass marketplace policy, promise outcomes, imply medical results, or claim paid creator hosting is live.
- Creator Hosting Objection Reply Kit must be copy-only/manual reply UI and must not claim paid creator hosting is live, quote unconfigured prices, collect payments, create purchases, create contracts, collect payout details, collect tax details, start revenue-share, write entitlements, process refunds, bypass marketplace policy, scrape/store DMs, add tracking pixels, or pressure creators.
- Pro analytics must unlock only when `entitlements.pro.active == true`.
- Pro weekly and monthly report metrics must be computed from existing activity logs, challenge member points, current streak data, and saved custom goals.
- The weekly and monthly report status thresholds must stay aligned across platforms: `ON TRACK` at 80+, `BUILDING` at 50-79, and `RESTART` below 50.
- Custom goals save only for active Pro users and write to `users/{uid}.goals`.
- Missing custom goal fields use defaults: 5 active days, 250 weekly points, and 30-day streak target.
- Profile frames save only for active Pro users and write to `users/{uid}.cosmetics.profileFrameId`.
- Missing or unknown profile frame ids render as the default avatar border.
- Premium share templates save only for active Pro users and write to `users/{uid}.sharePreferences.templateId`.
- Missing or unknown share template ids render as `classic`.
- Creator / Coach Mode saves only for active Pro users and writes to `users/{uid}.creatorProfile`.
- Creator profile text inputs must enforce the shared limits: 60 chars for specialty, 240 for bio, 160 for CTA URL.
- Creator analytics must derive from existing challenge documents where `createdBy == uid`; no additional tracking collection is required for this foundation.
- Non-Pro creator analytics previews must not expose hosted metrics.
- Creator revenue-share opt-in writes only `creatorProfile.revenueShareInterest`; it must not collect payout details, tax details, or imply active payments before reviewed payout infrastructure exists.
- Creator revenue-share readiness metrics must be first-party only and derived from hosted challenge metadata/member counts.
- Creator demand summaries must be admin-only and aggregate counts only; they must not expose per-user creator opt-ins in the UI.
- Creator Launch Kit must not require new backend fields and should include an invite link only when the hosted challenge has an `inviteCode`.
- Creator-branded challenge metadata must only be written from an active Pro creator profile with Coach Mode enabled.
- Creator Hosting Application must be manual review UI and must not create contracts, collect payout/tax details, create purchases, write entitlements, start revenue-share, or claim paid hosting is live.
- Creator Hosting Application review queues must use first-party hosted challenge metrics only: hosted count, member reach, and revenue-ready count.
- Creator Hosting Application Admin Review Updates must only change review status and notes; they must not create contracts, payouts, purchases, entitlements, revenue-share, or paid-access claims.
- Missing creator-branded challenge fields must render nothing on older challenge documents.
- Partner perks must remain clearly marked as future/coming soon until a real partner config source and review process exists.
- Partner perk interest toggles must sanitize selected ids against the shared allowlist before writing to Firestore.
- Partner Pitch Kit copy must be derived from first-party saved interest counts only and must not imply third-party data sharing, random ads, or tracking pixels.
- Partner Campaign Activation Kit must be copy-only/manual planning UI and must not add partner links, tracking pixels, ad targeting, purchases, entitlements, or paid-access claims.
- Partner Terms Readiness Kit must be copy-only/manual planning UI and must not add partner links, tracking pixels, ad targeting, affiliate payouts, commissions, revenue-share, purchases, entitlements, discounts, coupons, third-party data sharing, medical claims, guaranteed outcomes, or paid-access claims.
- Partner Contract Readiness Kit must be copy-only/manual planning UI and must not create partner links, tracking pixels, ad targeting, affiliate payouts, commissions, revenue-share, purchases, entitlements, discounts, coupons, third-party data sharing, medical claims, guaranteed outcomes, paid-access claims, or fulfillment promises.
- Partner Campaign Objection Reply Kit must be copy-only/manual reply UI and must not claim partner campaigns are live, add partner links, add tracking pixels, use ad targeting, collect payments, create purchases, create affiliate payouts, create commissions, start revenue-share, write entitlements, offer discounts, share third-party data, scrape/store DMs, or pressure users.
- Partner Campaign Application must be manual review UI and must not add partner links, tracking pixels, ad targeting, affiliate payouts, purchases, entitlements, revenue-share, or paid-access claims.
- Partner Campaign Application review queues must use first-party saved perk demand, campaign reach, and referral signals only.
- Partner Campaign Application Admin Review Updates must only change review status and notes; they must not add partner links, tracking pixels, ad targeting, affiliate payouts, purchases, entitlements, revenue-share, or paid-access claims.
- Partner Perk Claim must be manual review UI and must not create coupons, partner links, payouts, discounts, purchases, entitlements, or paid-access claims.
- Partner Perk Claim Status History must be read-only review UI and must not create coupons, partner links, payouts, discounts, purchases, entitlements, or paid-access claims.
- Partner Perk Fulfillment Readiness Kit must be copy-only/manual UI and must not create coupons, partner links, payouts, discounts, purchases, entitlements, affiliate rewards, tracking pixels, ad targeting, third-party data exports, paid-access claims, outcome promises, medical implications, or fulfillment promises.
- Partner Perk Admin Decision Reply Kit must be copy-only/manual UI and must not create coupons, partner links, payouts, discounts, purchases, entitlements, affiliate rewards, tracking pixels, ad targeting, third-party data exports, paid-access claims, outcome promises, medical implications, or fulfillment promises.
- Partner Perk Claim Admin Review Updates must only change review status and notes; they must not create coupons, partner links, payouts, discounts, purchases, entitlements, affiliate rewards, tracking pixels, ad targeting, third-party data exports, paid-access claims, outcome promises, medical implications, or fulfillment promises.
- Missing partner perk interest fields must render as no saved interest.
- Member perk eligibility must be computed locally from existing app stats and must not imply an actual discount, coupon, partner contract, or entitlement until partner configuration is reviewed.
- Partner demand summaries must be admin-only and aggregate counts only; they must not expose per-user interest lists in the UI.
- Sponsored challenge sponsor links must remain empty or inactive until partner destination review, disclosure copy, and reporting requirements are finalized.
- Streak recovery saves only for active Pro users, preserves any existing activities for the recovered date, and does not award points.
- Profile surfaces show a Streak Rescue Prompt Kit that copies a pressure-safe restart prompt from current streak, streak target, Pro status, and existing recovery state.
- Streak Rescue Prompt Kit is copy-only and must not award points, create activity logs, spend recovery credits, write entitlements, unlock Pro, imply paid access is live, promise outcomes, imply medical results, or pressure users after missed days.
- Profile surfaces show a Comeback Challenge Invite Kit that turns missed-day recovery copy into this week's campaign invite and DM prompt.
- Comeback Challenge Invite Kit is copy-only and must not auto-message users, scrape DMs, create challenge joins, create activity logs, spend recovery credits, write referral state, write entitlements, imply paid access is live, promise outcomes, imply medical results, or pressure users after missed days.
- Profile surfaces show a Value Proof Story Kit that turns current points, streak, weekly score, monthly score, challenge points, and this week's campaign prompt into copy-ready Instagram Story proof.
- Value Proof Story Kit is copy-only and must not auto-post, scrape DMs, add tracking pixels, export private history, create purchases, grant Pro, write entitlements, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Profile surfaces show a Story Posting Checklist Kit that bundles the weekly campaign CTA, app proof, comeback prompt, referral action, and consent-cleared highlights into a manual Instagram Story sequence.
- Story Posting Checklist Kit is copy-only and must not auto-post, schedule posts, scrape DMs, store inbound DMs, add tracking pixels, export private history, share unreviewed submissions, create challenge joins, write referral state, imply paid access is live, promise outcomes, imply medical results, or pressure users.
- Non-Pro users cannot create new private challenges, but can still create public challenges.
- Private challenge documents must not be written for non-Pro creators from client create flows.
- Non-Pro users cannot create premium challenge pack documents from client create flows or service/repository create calls.
- Premium challenge pack metadata is preserved on created challenge documents.
- Premium challenge pack prompt arrays must be preserved on created challenge documents and must render only when present.
- Future Pro-gated features must check the shared entitlement path before enabling premium behavior.

## Store Product Catalog

Purpose: keep App Store, Play Billing, web billing, and backend receipt validation aligned before purchases are enabled.

Shared product IDs:

- `com.risewiththetribe.pro.monthly`: monthly Tribe Pro subscription.
- `com.risewiththetribe.pro.yearly`: yearly Tribe Pro subscription.
- `com.risewiththetribe.pack.21_day_reset`: standalone 21-Day Reset Pack purchase candidate.
- `com.risewiththetribe.pack.summer_shred`: standalone 28-Day Summer Shred seasonal pack purchase candidate.

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
- Profile purchase cards expose "Request entitlement review" actions that write `entitlementRecoveryRequests/{uid}` with `productCount`, `proActive`, `packCount`, `activePackCount`, `reason`, `status`, `source`, and timestamps for manual support review.
- Entitlement recovery reasons include `restore_sync_failed`, `missing_pro`, `missing_pack`, `account_mismatch`, and `billing_question`.
- Entitlement Recovery Review Queue is admin-only and must not write entitlements, process refunds, cancel subscriptions, create purchases, or bypass marketplace policy.
- Entitlement Recovery Admin Review Updates must only change review status and notes; they must not write entitlements, process refunds, cancel subscriptions, create purchases, or bypass marketplace policy.
- Store Test Purchase Evidence Log writes admin-only `storeTestPurchaseEvidence` records with `platform`, `productId`, `testCase`, `result`, `evidenceNote`, `status`, `source`, and timestamps after real sandbox/license-test QA.
- Store test evidence cases include `sandbox_purchase`, `restore_sync`, `negative_validation`, and `wrong_account`; initial evidence result is `needs_review`.
- Store Test Purchase Evidence Review Updates let admins mark evidence `verified`, `needs_review`, `failed`, or `archived` with `reviewNote`, `reviewedBy`, and `reviewedAt` without writing entitlements, creating purchases, processing refunds, bypassing marketplace policy, or marking paid access live.
- Store Test Purchase Evidence Log must not write entitlements, create purchases, process refunds, bypass marketplace policy, or mark paid access live.
- Admin/creator profile surfaces show a Challenge Pack Launch Kit with copy-ready launch messaging for shared pack product IDs.
- Admin/creator profile surfaces show a Challenge Pack Objection Reply Kit with manual replies for paid-pack questions before marketplace validation is complete.
- Admin profile surfaces show a Store Credential Setup Kit with App Store Connect, Play Console, Firebase Functions secret, sandbox/test purchase, restore, and Firestore entitlement QA steps.
- Admin profile surfaces show a Subscription Management Guidance Kit with copy-ready App Store / Google Play subscription management, cancellation, restore/sync, and support-boundary guidance.
- Admin profile surfaces show a Billing Support Escalation Kit with copy-ready wrong-account, failed-renewal, duplicate-charge, cancellation-confusion, and missing-entitlement support handoff guidance.
- Admin profile surfaces show a Renewal Recovery Kit with copy-ready failed-renewal, grace-period, lapsed-access, restore/sync, and entitlement-recovery guidance.
- Admin profile surfaces show a Cancellation Feedback Kit with copy-ready learn-only churn prompts tied to first-party monetization signals.
- Admin profile surfaces show a Lapsed Member Winback Kit with free-first comeback challenge prompts tied to campaign, streak, referral, and first-party demand signals.
- Firebase Functions exposes callable `getPurchaseValidationReadiness` so admin profile surfaces can check App Store / Play credential readiness without submitting a fake purchase or writing entitlements.
- Product IDs do not unlock features directly.
- Purchase and receipt-validation work must write the shared entitlement fields before gated UI unlocks.

Release checks:

- Store product IDs match `FEATURE_PARITY.md`.
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
- Challenge Pack Objection Reply Kit must not claim packs are live, quote unconfigured prices, collect payments, unlock packs, grant Pro, write entitlements, bypass marketplace policy, scrape/store DMs, add tracking pixels, or pressure users.
- Store Credential Setup Kit must stay admin-only and must not claim paid access is live before App Store / Play test purchases validate through `verifyPurchase` and write shared Firestore entitlements.
- Subscription Management Guidance Kit must stay copy-only and must not cancel subscriptions in-app, process refunds, create purchases, write entitlements, bypass App Store or Play policy, collect payment details, promise outcomes, imply medical results, or claim paid access is live.
- Billing Support Escalation Kit must stay copy-only and must not cancel subscriptions in-app, process refunds, create purchases, write entitlements, override marketplace decisions, collect payment details, promise outcomes, imply medical results, or mark paid access live.
- Renewal Recovery Kit must stay copy-only and must not retry charges in-app, collect payment details, cancel subscriptions, process refunds, create purchases, write entitlements, override marketplace renewal status, promise restored access, imply medical results, or mark paid access live.
- Cancellation Feedback Kit must stay copy-only and must not block cancellation, retry charges in-app, collect payment details, offer unconfigured discounts, process refunds, create purchases, write entitlements, override marketplace subscription state, promise future pricing, imply medical results, pressure the member to stay, or mark paid access live.
- Lapsed Member Winback Kit must stay copy-only and must not auto-message users, scrape DMs, store inbound replies, add tracking pixels, create attribution records, offer unconfigured discounts, retry charges, collect payment details, create purchases, write entitlements, imply paid access is live, promise outcomes, imply medical results, or pressure members to return.
- Validation readiness checks must be read-only: they must not create purchase audit attempts, verify fake purchases, or grant Pro / pack entitlements.
- `verifyPurchase` audit docs must never store raw purchase tokens; only token hashes are allowed.
- Verified Pro purchases write `users/{uid}.entitlements.pro.active == true`.
- Verified challenge pack purchases write `users/{uid}.entitlements.packs.{packId}.active == true`.
- The same verified purchase cannot be linked to a different user account.
- Receipt validation remains required before any purchase can unlock Pro or paid packs.

## Monetization and Community Growth

Purpose: grow revenue without weakening trust or habit formation.

Roadmap source:

- `docs/MONETIZATION_ROADMAP.md`

Planned shared behavior:

- Weekly challenge campaign templates that connect Instagram campaigns to app participation. Initial campaign templates and campaign invite copy are implemented.
- Feature submission flow for users who want to be reposted or highlighted. Initial pending-review submissions are implemented.
- User-generated win cards for social proof and Instagram engagement. Initial cross-platform share actions are implemented.
- Referral tracking, reward badges, and reward ladder. Initial 1/5/10 badges plus 1/5/10/25 profile ladder are implemented.
- Tribe Pro subscription entitlements.
- Pro custom weekly and streak goals. Initial cross-platform profile surfaces are implemented.
- Premium challenge packs. Initial 21-Day Reset Pack metadata and Pro creation gate are implemented.
- Creator/coach challenge hosting.

Release checks:

- Free users can still log activities, join core challenges, and share progress.
- Paid entitlements are checked consistently on Web, iOS, and Android.
- User-generated content submissions include explicit consent before external reposting.
- Referral rewards count meaningful signups or joins, not only link opens.

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

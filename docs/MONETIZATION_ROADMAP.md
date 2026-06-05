# Monetization and Engagement Roadmap

This document captures the long-term revenue and engagement plan for the Rise With The Tribe ecosystem across:

- Web/Capacitor: `/Users/navdeepsmacbook/Documents/TribeChallengeTracker`
- Native iOS: `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS`
- Native Android: `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid`

The product principle is simple: users should feel that the app gives them more accountability, identity, progress, and community value than the time or money they spend on it.

## Ecosystem Positioning

Rise With The Tribe is not just a workout tracker. It is a social fitness challenge ecosystem for people who need accountability, consistency, and visible proof that they are showing up.

Instagram should drive discovery, emotion, social proof, and community energy.

The apps should drive commitment, habit formation, tracking, challenges, rewards, and deeper customer value.

Core loop:

```text
Instagram inspiration
-> join challenge
-> log activity
-> earn badges / build streak
-> share progress
-> get featured / invite friends
-> join the next challenge
```

## Revenue Ladder

### 1. Free Core Experience

Purpose: make the product valuable before asking users to pay.

Included:

- Activity logging.
- Basic streaks, points, days active, and badges.
- Public challenge discovery and participation.
- Basic progress sharing.
- Profile photo/avatar and Instagram handle.
- Invite links and challenge leaderboards.

Success metric:

- Users form a logging habit and understand the community value within the first week.

### 2. Tribe Pro Subscription

Purpose: monetize deeper accountability, personalization, and insight.

Candidate Pro benefits:

- Advanced progress analytics.
- Weekly and monthly performance reports.
- Custom goals and custom streak targets.
- Streak recovery or grace-day mechanics.
- Private challenges.
- Premium badges and profile cosmetics.
- Advanced Apple Health / Health Connect insights.
- Custom share templates.
- Longer activity and challenge history views.

Implementation notes:

- Use native in-app purchases on iOS and Android.
- Use a web-compatible billing path only when it does not conflict with app-store rules for in-app digital features.
- Keep free users functional; Pro should deepen value, not hold basic habit formation hostage.
- Initial shared subscription product IDs are `com.risewiththetribe.pro.monthly` and `com.risewiththetribe.pro.yearly`.

### 3. Paid Challenge Packs

Purpose: sell structured outcomes without requiring a full subscription commitment.

Examples:

- 21-Day Reset.
- 30-Day Discipline Challenge.
- Summer Shred.
- Beginner Consistency Plan.
- 75-Day Tribe Mode.
- Seasonal or event-based challenges.

Candidate premium content:

- Preset daily tasks.
- Bonus milestones and badges.
- Extra accountability prompts.
- Premium share templates.
- End-of-challenge recap.

Implementation notes:

- Initial shared pack product IDs are `com.risewiththetribe.pack.21_day_reset` and `com.risewiththetribe.pack.summer_shred`.
- Product constants exist across Web, iOS, and Android.
- iOS StoreKit and Android Play Billing service scaffolding can query products and launch purchase flows once console products exist.
- Firebase Functions has a callable `verifyPurchase` contract that audits attempts and returns `validation_not_configured` until real store validation credentials are available.
- Receipt validation credentials and real store test purchases are still required before enabling paid access in production.

### 4. Feature Me Submissions

Purpose: turn user progress into community proof and Instagram content.

Candidate flow:

- User taps "Submit to be featured".
- User chooses a category: streak, transformation, comeback, beginner win, challenge completion.
- User adds an optional note and before/after/progress media.
- User confirms consent for the content to be reposted.
- User includes Instagram handle so the channel can tag them.

Value:

- Users feel seen.
- The Instagram channel gets authentic UGC.
- The app becomes part of the public community identity.

### 5. Referral Rewards

Purpose: reward users for bringing the tribe with them.

Candidate rewards:

- Invite 3 friends: special badge.
- Invite 5 friends: free Pro trial or bonus cosmetic.
- Invite 10 friends: featured leaderboard moment.
- Invite 25 friends: founder/community badge.

Implementation notes:

- Referral rewards should count meaningful signups or challenge joins, not just link clicks.
- Store referral source in user profile and challenge join records.

### 6. Creator / Coach Mode

Purpose: expand beyond one audience by letting coaches and micro-creators run challenges.

Candidate features:

- Coach profile.
- Creator challenge templates.
- Private challenge invite links.
- Branded challenge pages.
- Creator leaderboard.
- Paid challenge hosting or revenue share.

Long-term value:

- Turns the app into infrastructure for other fitness and accountability communities.

### 7. Brand Partnerships

Purpose: add revenue without degrading trust.

Candidate partners:

- Fitness apparel.
- Supplements.
- Meal prep.
- Gyms and studios.
- Wearables and recovery tools.

Rules:

- Avoid random ads.
- Keep offers aligned with challenge outcomes.
- Prefer sponsor-backed challenges or member perks over intrusive advertising.

## Marketing System

### Instagram Role

Instagram is the top-of-funnel and community proof layer.

Best content mix:

- Reels for emotion, momentum, and identity.
- Carousels for useful education and saved posts.
- Stories for daily accountability and reposting user wins.
- DM keywords for challenge links and lead capture.
- Collab posts with micro-creators for qualified growth.

Example weekly cadence:

- Monday: weekly challenge launch Reel.
- Tuesday: educational carousel about consistency or discipline.
- Wednesday: user win / community story.
- Thursday: short Reel with a strong accountability hook.
- Friday: leaderboard or streak recap.
- Saturday: behind-the-scenes / founder note.
- Sunday: next-week challenge countdown and signup CTA.

### App Role

The apps are the commitment and retention layer.

The app should:

- Give users an early win.
- Make daily logging fast.
- Celebrate progress immediately.
- Make sharing beautiful and low friction.
- Make challenge participation feel social.
- Turn weekly progress into a visible recap.
- Prompt users to invite friends at moments of pride.

## Engagement Standards

Every monetized feature should pass these checks:

- Does it help the user stay consistent?
- Does it create visible proof of progress?
- Does it deepen the user's identity in the tribe?
- Does it make sharing or community participation easier?
- Does it reward effort without encouraging unhealthy behavior?
- Does the free version still feel useful and respectful?

Avoid:

- Paywalling basic logging.
- Random ads that break trust.
- Over-notifying users.
- Making leaderboards feel punishing for beginners.
- Selling features before the habit loop feels strong.

## Rollout Plan

### Phase 1: Social Growth Foundation

Status: in progress.

Features:

- Instagram handle in profile.
- Share copy/images that tag `@risewiththetribe`.
- Branded progress sharing.
- Weekly campaign challenge templates.
- Campaign CTA/hashtag metadata on challenge docs.
- Campaign invite copy for challenge sharing.
- Feature submission flow for user stories and wins.
- Referral-ready invite links that track challenge joins.
- Referral join counter visible in profile.
- User-facing feature submission status history.
- User-generated win cards for social sharing and Instagram engagement.
- Referral reward badges at 1, 5, and 10 attributed challenge joins.
- Weekly 7-day recap sharing for recurring Instagram/story prompts.
- Media upload and admin review tools for feature submissions.
- Community Highlights gallery for admin-featured UGC and repost-ready Instagram captions.
- Community Highlight Roundup Kit across Web, iOS, and Android with copy-ready weekly Instagram roundup text from featured submissions only.
- UGC Consent Reminder Kit across Web, iOS, and Android with copy-ready consent, review, attribution, claim-safety, and private-detail checks before reposting member wins.
- Instagram Weekly Prompt Kit across Web, iOS, and Android to turn the content cadence into copy-ready user/creator prompts.
- Campaign Performance Board across Web, iOS, and Android to summarize weekly/seasonal campaign reach from challenge metadata.
- Weekly Campaign Scheduler across Web, iOS, and Android to give admins and creators copy-ready prompts from this week's campaign template.
- Weekly Campaign Launch Card Kit across Web, iOS, and Android to turn this week's campaign template into copy-ready card headlines, design notes, caption drafts, hashtags, and consent-safe posting guardrails.
- Weekly Campaign Preflight Checklist across Web, iOS, and Android to confirm launch-card copy, manual DM replies, seven-day content cadence, referral copy, consent-reviewed UGC, and first-party review metrics before the weekly push.
- Weekly Campaign Review Kit across Web, iOS, and Android to review challenge joins, referral movement, consent-cleared UGC, manual DM copy, and share-card usage before shaping the next weekly push.
- Weekly Campaign Storyboard Kit across Web, iOS, and Android to turn this week's campaign prompt into a manual Reel storyboard, Story frame plan, carousel outline, hashtag, and consent-safe publishing guardrails.
- Weekly Campaign Experiment Brief Kit across Web, iOS, and Android to connect this week's campaign CTA to the recommended manual launch experiment and first-party review metrics.
- Instagram DM Keyword Kit across Web, iOS, and Android with manual reply copy for `TRIBE`, `COMEBACK`, `PRO`, and `FEATURE` audience flows.
- Weekly Campaign Comment Reply Kit across Web, iOS, and Android with manual public replies for join, comeback, paid-access, and Feature Me questions without comment/DM scraping or automation.
- Weekly Campaign Countdown Story Kit across Web, iOS, and Android with manual pre-launch Story frames, countdown sticker copy, and app-first start reminders without schedule Stories or scraping responses.
- Weekly Campaign Start-Day Story Kit across Web, iOS, and Android with manual launch-day Story frames, sticker copy, and first-log reminders without schedule Stories, scraping responses, or off-platform attribution.
- Weekly Campaign Midweek Check-In Story Kit across Web, iOS, and Android with manual comeback Story frames, sticker copy, and first-party re-engagement review prompts without schedule Stories, scraping responses, or off-platform attribution.
- Weekly Campaign Weekend Push Story Kit across Web, iOS, and Android with manual finish-line Story frames, sticker copy, and first-party completion momentum review prompts without schedule Stories, scraping responses, or off-platform attribution.
- Weekly Campaign Completion Recap Story Kit across Web, iOS, and Android with manual aggregate recap Story frames, Feature Me consent routing, and next-challenge prompts without schedule Stories, scraping responses, or off-platform attribution.
- Weekly Campaign Next-Week Teaser Story Kit across Web, iOS, and Android with manual next-challenge teaser frames, sticker copy, and first-party launch-angle review prompts without schedule Stories, scraping responses, or off-platform attribution.
- Weekly Campaign Partner Perk Teaser Story Kit across Web, iOS, and Android with manual perk-interest Story frames, app-first saved-interest routing, and partner-readiness guardrails without partner outreach, create affiliate links, create partner payouts, scraping, or attribution.
- Weekly Campaign Story Poll Kit across Web, iOS, and Android with manual Story poll, quiz, and question sticker prompts for weekly campaign feedback without scraping Story responses or treating Instagram votes as app consent.
- Weekly Campaign Poll Review Kit across Web, iOS, and Android with manual readback prompts that turn visible Story poll reactions into first-party follow-up decisions without storing voter identities or creating attribution records.
- Weekly Campaign Live Q&A Kit across Web, iOS, and Android with manual Live setup, question lanes, close copy, and app-first follow-up guardrails from audience questions.
- Weekly Campaign Live Recap Kit across Web, iOS, and Android with manual post-Live readback, public recap copy, content decisions, and first-party signal review guardrails.
- Weekly Campaign FAQ Carousel Kit across Web, iOS, and Android with manual seven-slide carousel outline for repeated audience questions that routes action back into the app.
- Weekly Campaign Caption Bank Kit across Web, iOS, and Android with manual Reel, carousel, Story, and pinned-comment caption variants that route followers into first-party app actions without scheduling posts or tracking Instagram identities.
- Weekly Campaign Collab Invite Kit across Web, iOS, and Android with manual pressure-safe creator outreach for collab posts and Story mentions before any paid hosting, revenue-share, payout, contract, affiliate, or partner-link workflow exists.
- Weekly Campaign Collab Follow-Up Kit across Web, iOS, and Android with manual yes/post-guidance/paid-hosting/not-ready replies that route deeper creator interest into Creator / Coach Mode review before paid terms.
- Weekly Campaign Collab Safety Checklist across Web, iOS, and Android with manual consent, claim, private-reply, member-data, and paid-hosting readiness review before creator escalation.
- Weekly Campaign Collab Recap Kit across Web, iOS, and Android with manual post-collab review from first-party app movement, consent-cleared submissions, content lessons, and next-collab decisions.
- Weekly Campaign Collab Renewal Kit across Web, iOS, and Android with manual repeat-or-pause criteria and Creator / Coach Mode review routing before any deeper hosting or paid terms.
- Referral Launch Kit across Web, iOS, and Android with next-tier invite copy that turns referral ladder progress into Instagram/community prompts.
- Referral Story Sprint Kit across Web, iOS, and Android with copy-ready Story/Reel prompts that invite one accountability partner toward the next referral tier.
- Referral Reward Social Proof Kit across Web, iOS, and Android with copy-ready Story/carousel celebration copy for unlocked referral progress.
- Instagram Content Calendar across Web, iOS, and Android with a seven-day creator/admin cadence for weekly planning and copy export.
- Launch Experiment Kit across Web, iOS, and Android with admin/creator copy-ready Pro, pack, referral, and partner experiment briefs derived from first-party signals.
- Launch Experiment Scorecard across Web, iOS, and Android with manual first-party demand/reach/community-loop scoring for the next launch test.
- Release QA Checklist across Web, iOS, and Android with copy-ready product ID, store test, entitlement, and social share guardrails before monetization or campaign launches.
- Launch Retrospective Kit across Web, iOS, and Android with manual first-party review copy for challenge joins, referrals, feature submissions, share-card usage, and entitlement validation after a campaign push.
- Revenue Pathway Planner across Web, iOS, and Android with admin/creator copy-ready ranking for Pro, paid packs, creator hosting, and partner campaigns from first-party signals.
- Pricing Test Kit across Web, iOS, and Android with admin/creator copy-ready pricing-language validation for shared Pro and pack product IDs before store launch.
- Founder Member Offer Kit across Web, iOS, and Android with admin/creator copy-ready early-member value validation that drives the free challenge loop before paid access.
- Community Ambassador Kit across Web, iOS, and Android with admin/creator copy-ready referral, recognition, and challenge-leadership prompts before paid roles or payouts.
- Customer Value Delivery Checklist across Web, iOS, and Android with admin/creator copy-ready proof checks for free-loop consistency, paid accountability value, community proof, and support readiness before charging.
- Value Proof Story Kit across Web, iOS, and Android with progress/report/campaign-based Instagram Story proof copy.
- Story Posting Checklist Kit across Web, iOS, and Android with campaign/proof/comeback/referral/highlight prompts for manual Instagram Story sequences.
- Streak Rescue Prompt Kit across Web, iOS, and Android with pressure-safe copy for missed-day comeback prompts.
- Comeback Challenge Invite Kit across Web, iOS, and Android with missed-day restart copy tied to this week's campaign prompt.
- Support and Refund Readiness Kit across Web, iOS, and Android with admin copy-ready restore, marketplace refund, entitlement recovery, and escalation handoff before paid launch.
- Paid Launch Decision Gate across Web, iOS, and Android with admin go/no-go checks for product IDs, demand, support handoff, receipt-validation credentials, store test evidence coverage, and entitlement QA before paid access is promoted.
- Store Listing Copy Kit across Web, iOS, and Android with admin copy-ready App Store / Play listing title, subtitle, short description, value points, launch positioning, and policy-safe paid-feature cautions.
- Store Review Submission Kit across Web, iOS, and Android with admin copy-ready reviewer notes, demo-account checklist, permission explanations, support/privacy/data-deletion reminders, and policy-safe paid-access cautions.
- Store Review Evidence Pack across Web, iOS, and Android with admin copy-ready store-test evidence counts, product IDs, policy/support links, permission notes, validation readiness, and launch gate status for reviewer-safe submission notes.
- Policy and Support Link Hub across Web, iOS, and Android with hosted privacy, terms, support, and account/data deletion resources visible from profile surfaces.
- Account Deletion Request and Review Queue flow across Web, iOS, and Android with `accountDeletionRequests/{uid}` writes, mirrored `users/{uid}.accountDeletionRequest` status, and admin-only pending request visibility for support-reviewed deletion operations.
- Account Deletion Admin Review Updates across Web, iOS, and Android with verified/contacted/blocked/closed decisions, manual `reviewNote` capture, reviewer/timestamp metadata, and no automatic account deletion, data erasure, purchase cancellation, refund processing, or marketplace policy bypass.
- Support Request and Review Queue flow across Web, iOS, and Android with `supportRequests` writes and admin-only open request visibility for account, billing, bug, safety, and general follow-up.
- Support Request Admin Review Updates across Web, iOS, and Android with admin-only status updates (`waiting`, `resolved`, `closed`) plus `reviewNote`, `reviewedBy`, and `reviewedAt` on `supportRequests` without resolving refunds, subscriptions, purchases, or entitlements from profile UI.
- Referral Reward Claim and Review Queue flow across Web, iOS, and Android with `referralRewardClaims/{uid}_{tierTarget}` writes for unlocked 1/5/10/25 referral tiers, plus admin-only review visibility before any manual recognition or future perk fulfillment.
- Referral Reward Admin Review Updates across Web, iOS, and Android with admin-only status updates (`approved`, `waiting`, `not_ready`, `declined`) plus `reviewNote`, `reviewedBy`, and `reviewedAt` on `referralRewardClaims` without granting Pro, entitlements, discounts, payouts, purchases, affiliate rewards, or paid access from client code.
- Data Safety Disclosure Kit across Web, iOS, and Android with admin copy-ready Play Data Safety and App Privacy disclosure notes for auth, profile, activity/health, UGC, purchase verification, notifications, support, and deletion resources.
- Referral reward ladder at 1, 5, 10, and 25 attributed challenge joins.
- Shareable generated challenge launch cards for Instagram/native share flows.
- Referral analytics for earned tiers, joins remaining, and ladder completion.
- Tribe Pro entitlement foundation and Pro analytics preview/report.
- Tribe Pro Value Snapshot across checkout surfaces using existing progress and best-fit benefit copy.
- Tribe Pro Trial Interest capture across Web, iOS, and Android to learn demand before live store trial configuration.
- Pro Trial Objection Reply Kit across Web, iOS, and Android with admin manual replies for Pro questions based on aggregate first-party trial demand before store-backed trials are live.
- Tribe Pro private challenge creation gate.
- Tribe Pro custom weekly and streak goals.
- Tribe Pro profile frames backed by `users/{uid}.cosmetics.profileFrameId`.
- Tribe Pro share templates backed by `users/{uid}.sharePreferences.templateId` with free `classic` and Pro `gold` / `neon` generated-card palettes.
- Creator / Coach Mode foundation backed by `users/{uid}.creatorProfile` for future hosted challenges, branded pages, and revenue-share.
- Creator analytics foundation across Web, iOS, and Android using existing hosted challenge metrics.
- Creator-branded challenge metadata across Web, iOS, and Android by denormalizing Coach Mode specialty, bio, and CTA link onto newly created challenges.
- Creator revenue-share readiness across Web, iOS, and Android with a Pro-gated beta opt-in plus first-party paid-pack/ready hosted challenge metrics.
- Creator Launch Kit across Web, iOS, and Android with generated Instagram/community copy for hosted challenge launches.
- Creator Hosting Offer Kit across Web, iOS, and Android with a copy-only paid-hosting planning brief for creator focus, hosted reach, revenue-ready signals, policy, payout, and entitlement QA.
- Creator Terms Readiness Kit across Web, iOS, and Android with a copy-only responsibilities and guardrails brief for creator conduct, moderation, payout readiness, marketplace alignment, and support handoff before paid hosting.
- Creator Payout Readiness Kit across Web, iOS, and Android with a copy-only payout provider, tax, identity, refund, support, marketplace, and creator-claim checklist before revenue-share.
- Creator Hosting Objection Reply Kit across Web, iOS, and Android with copy-only manual creator replies before revenue-share, payout operations, store validation, and entitlement QA are complete.
- Partner Perks foundation across profile surfaces for future aligned brand offers without intrusive ads.
- Partner Perk interest capture across Web, iOS, and Android to learn which aligned offers users actually want before negotiating partners.
- Partner Pitch Kit across Web, iOS, and Android to turn first-party demand counts into sponsor outreach copy.
- Partner Campaign Activation Kit across Web, iOS, and Android with copy-only sponsor-backed challenge pilot briefs from first-party perk demand, campaign reach, and referral signals.
- Partner Terms Readiness Kit across Web, iOS, and Android with copy-only sponsor-pilot terms briefs for partner fit, disclosure, data boundaries, destination review, reporting, and support handoff.
- Partner Contract Readiness Kit across Web, iOS, and Android with copy-only partner identity, support ownership, disclosure, fulfillment, privacy, reporting, and destination-review checks before sponsor/perk terms move forward.
- Partner Campaign Objection Reply Kit across Web, iOS, and Android with copy-only manual sponsor-pilot replies from first-party demand, campaign reach, and referral signals before partner links, tracking, payouts, purchases, revenue-share, or entitlements exist.
- Partner Campaign Application and Review Queue across Web, iOS, and Android with `partnerCampaignApplications/{uid}` writes for manual sponsor-pilot review before partner links, tracking, payouts, purchases, or entitlements exist.
- Partner Campaign Application Admin Review Updates across Web, iOS, and Android with admin-only status updates (`approved`, `waiting`, `not_ready`, `declined`) plus `reviewNote`, `reviewedBy`, and `reviewedAt` on `partnerCampaignApplications` before partner links, tracking pixels, ad targeting, affiliate payouts, purchases, entitlements, revenue-share, or paid-access claims exist.
- Member perk eligibility progress across Web, iOS, and Android using first-party activity, challenge, and referral stats.
- Partner Perk Claim and Review Queue across Web, iOS, and Android with `partnerPerkClaims/{uid}_{perkId}` writes for manual eligible-perk review before coupons, partner links, payouts, discounts, purchases, entitlements, or paid-access claims exist.
- Partner Perk Claim Status History across Web, iOS, and Android with signed-in user `partnerPerkClaims` readback before coupons, partner links, payouts, discounts, purchases, entitlements, or paid-access claims exist.
- Partner Perk Fulfillment Readiness Kit across Web, iOS, and Android with admin copy-ready claim-readiness checks before coupons, partner links, payouts, discounts, purchases, entitlements, affiliate rewards, tracking, or fulfillment promises exist.
- Partner Perk Admin Decision Reply Kit across Web, iOS, and Android with admin copy-ready approved, waiting, not-ready, and declined claim replies before coupons, partner links, payouts, discounts, purchases, entitlements, affiliate rewards, tracking, or fulfillment promises exist.
- Partner Perk Claim Admin Review Updates across Web, iOS, and Android with admin-only status updates (`approved`, `waiting`, `not_ready`, `declined`) plus `reviewNote`, `reviewedBy`, and `reviewedAt` on `partnerPerkClaims` before coupons, partner links, payouts, discounts, purchases, entitlements, affiliate rewards, tracking, or fulfillment promises exist.
- Pro weekly report scoring across Web, iOS, and Android using existing activity logs, challenge stats, current streaks, and custom goals.
- Challenge completion recaps across Web, iOS, and Android for shareable community proof and future premium pack finish moments.
- Premium badge foundation across Web, iOS, and Android with Pro-gated weekly report, streak recovery, and finisher badges.
- Tribe Pro streak recovery credits backed by zero-point `streak_recovery` activity log entries.
- Paid challenge pack foundation with a Pro-gated 21-Day Reset Pack template.
- Paid challenge pack value preview across Web, iOS, and Android using existing template metadata and unlock state.
- Paid challenge pack accountability prompts across Web, iOS, and Android tracker/detail surfaces.
- Challenge Pack Launch Kit across Web, iOS, and Android with copy-ready paid-pack launch messaging using shared product IDs before store credentials are live.
- Challenge Pack Objection Reply Kit across Web, iOS, and Android with manual pack-question replies that keep paid access, pricing, purchases, entitlements, and marketplace claims gated until validation is complete.
- Shared store product catalog constants for Pro and the 21-Day Reset Pack.
- Profile checkout UI wired to shared products, StoreKit product loading, and Play Billing product loading.
- Server-side purchase entitlement writer for verified Pro and challenge-pack purchases, guarded behind receipt validation.
- Purchase restore/sync actions across profile purchase cards, with native restore history replaying through backend verification.
- Store Launch Readiness across Web, iOS, and Android to keep product IDs, credential setup, sandbox purchases, and entitlement write checks visible before paid access goes live.
- Store Credential Setup Kit across Web, iOS, and Android with admin copy plus a read-only validation readiness probe for App Store Connect, Play Console, Firebase Functions secrets, sandbox/test purchase QA, and entitlement verification.
- Sandbox Purchase Test Plan across Web, iOS, and Android with admin copy-ready App Store sandbox, Play license test, restore, negative QA, backend `verifyPurchase`, Firestore entitlement, and support escalation cases before paid access is promoted.
- Subscription Management Guidance Kit across Web, iOS, and Android with admin copy-ready App Store / Google Play subscription management, cancellation, restore/sync, and support-boundary guidance before paid access is promoted.
- Billing Support Escalation Kit across Web, iOS, and Android with admin copy-ready wrong-account, failed-renewal, duplicate-charge, cancellation-confusion, and missing-entitlement handoff guidance before paid access is promoted.
- Renewal Recovery Kit across Web, iOS, and Android with admin copy-ready failed-renewal, grace-period, lapsed-access, restore/sync, and entitlement-recovery guidance before paid access is promoted.
- Cancellation Feedback Kit across Web, iOS, and Android with admin copy-ready learn-only churn prompts tied to first-party monetization signals without blocking marketplace cancellation.
- Lapsed Member Winback Kit across Web, iOS, and Android with admin copy-ready free-first comeback challenge prompts from campaign, streak, referral, and first-party demand signals.
- Entitlement Recovery Request and Review Queue across Web, iOS, and Android with `entitlementRecoveryRequests/{uid}` writes for manual missing-purchase support after restore/sync, storing `productCount`, `proActive`, `packCount`, `activePackCount`, `reason` values such as `restore_sync_failed`, status, source, and timestamps without client-side entitlement writes, refunds, subscription cancellation, purchase creation, or marketplace bypass.
- Entitlement Recovery Admin Review Updates across Web, iOS, and Android with admin-only status updates (`waiting`, `resolved`, `closed`) plus `reviewNote`, `reviewedBy`, and `reviewedAt` on `entitlementRecoveryRequests` without client-side entitlement writes, refunds, subscription cancellation, purchase creation, or marketplace bypass.
- Store Test Purchase Evidence Log across Web, iOS, and Android with admin-only `storeTestPurchaseEvidence` records for real App Store sandbox and Play license-test proof, storing platform, product ID, `sandbox_purchase`, `restore_sync`, `negative_validation`, or `wrong_account` test case, `needs_review`/passed/failed result, evidence note, status, source, and timestamps without writing entitlements, creating purchases, processing refunds, bypassing marketplace policy, or marking paid access live.
- Store Test Purchase Evidence Review Updates across Web, iOS, and Android with admin-only verified/needs_review/failed/archived decisions plus `reviewNote`, `reviewedBy`, and `reviewedAt` without writing entitlements, creating purchases, processing refunds, bypassing marketplace policy, or marking paid access live.
- Feature Submission Review Notes across Web, iOS, and Android with admin-only approved/featured/declined decisions plus `reviewNote`, `reviewedBy`, and `reviewedAt` for manual UGC consent/content review without auto-posting, overriding consent, implying outcomes, or sharing unreviewed submissions.
- Store Validation Credential Readiness across Web, iOS, Android, and Firebase Functions with `validation_configured` returned only when App Store / Play secrets are present, while sandbox/license-test purchases remain required before paid access is promoted.
- Store Validation Credential Template with `functions/.env.example` placeholders for App Store Server API and Google Play Developer API keys so production secrets can be configured without committing private keys.

Next candidates:

- Configure App Store / Play credentials and run real store test purchases.

### Phase 2: Referral and UGC Engine

Features:

- Referral invite tracking.
- Referral badges/rewards.
- Feature submission queue.
- Admin review workflow for featured submissions.
- Community highlights surface for featured submissions and repost captions.
- Challenge launch links for Instagram campaigns.
- Campaign Performance Board. Status: admin-only aggregate campaign count, active/public/premium/seasonal splits, and member reach done across Web, iOS, and Android.
- Weekly Campaign Scheduler. Status: admin/creator copy-ready cadence prompt derived from existing campaign templates done across Web, iOS, and Android.
- Weekly Campaign Launch Card Kit. Status: admin/creator copy-ready card brief done across Web, iOS, and Android using this week's campaign template without auto-posting, scraping DMs, adding tracking pixels, implying paid access is live, promising outcomes, implying medical results, or sharing user activity without consent.
- Weekly Campaign Preflight Checklist. Status: admin/creator copy-ready manual launch checklist done across Web, iOS, and Android without scheduling posts, auto-posting, scraping/storing DMs, adding tracking pixels, exporting per-user activity, sharing user content without consent, implying paid access is live, promising outcomes, or implying medical results.
- Weekly Campaign Review Kit. Status: admin/creator copy-ready manual post-launch review brief done across Web, iOS, and Android without attribution records, tracking pixels, scraped/stored Instagram DMs, exported per-user activity, shared user content without consent, paid-access claims, outcome promises, or medical implications.
- Weekly Campaign Storyboard Kit. Status: admin/creator copy-ready manual content storyboard done across Web, iOS, and Android without auto-posting, app-based scheduling, scraped/stored DMs, tracking pixels, exported per-user activity, shared user content without consent, paid-access claims, outcome promises, or medical implications.
- Weekly Campaign Experiment Brief Kit. Status: admin/creator copy-ready manual experiment brief done across Web, iOS, and Android without experiment records, scheduled posts, auto-posting, tracking pixels, scraped/stored Instagram DMs, exported per-user activity, shared user content without consent, paid-access claims, outcome promises, or medical implications.
- Instagram DM Keyword Kit. Status: admin/creator manual reply copy done across Web, iOS, and Android without relying on Instagram API automation.
- Weekly Campaign Comment Reply Kit. Status: admin/creator manual public comment replies done across Web, iOS, and Android without auto-reply behavior, comment scraping, DM scraping, stored inbound comments/DMs, attribution records, tracking pixels, exported per-user activity, shared user content without consent, paid-access claims, outcome promises, medical implications, or pressure.
- Weekly Campaign Countdown Story Kit. Status: admin/creator manual countdown Story copy done across Web, iOS, and Android without auto-posting, schedule Stories, scraped Story responses, comment scraping, DM scraping, store Instagram identities, stored inbound replies, attribution records, tracking pixels, exported per-user activity, treat Story interactions as app consent, shared private responses, paid-access claims, outcome promises, medical implications, or pressure.
- Weekly Campaign Start-Day Story Kit. Status: admin/creator manual launch-day Story copy done across Web, iOS, and Android without auto-posting, schedule Stories, scraped Story responses, comment scraping, DM scraping, store Instagram identities, stored inbound replies, attribution records, tracking pixels, exported per-user activity, treat Story reactions as app consent, shared private responses, paid-access claims, outcome promises, medical implications, or pressure.
- Weekly Campaign Midweek Check-In Story Kit. Status: admin/creator manual comeback Story copy done across Web, iOS, and Android without auto-posting, schedule Stories, scraped Story responses, comment scraping, DM scraping, store Instagram identities, stored inbound replies, attribution records, tracking pixels, exported per-user activity, treat Story reactions as app consent, shared private responses, paid-access claims, outcome promises, medical implications, or pressure.
- Weekly Campaign Weekend Push Story Kit. Status: admin/creator manual finish-line Story copy done across Web, iOS, and Android without auto-posting, schedule Stories, scraped Story responses, comment scraping, DM scraping, store Instagram identities, stored inbound replies, attribution records, tracking pixels, exported per-user activity, treat Story reactions as app consent, shared private responses, paid-access claims, outcome promises, medical implications, or pressure.
- Weekly Campaign Completion Recap Story Kit. Status: admin/creator manual aggregate recap Story copy done across Web, iOS, and Android without auto-posting, schedule Stories, scraped Story responses, comment scraping, DM scraping, store Instagram identities, stored inbound replies, attribution records, tracking pixels, exported per-user activity, treat Story reactions as app consent, shared private responses, share user wins without Feature Me consent, paid-access claims, outcome promises, medical implications, or pressure.
- Weekly Campaign Next-Week Teaser Story Kit. Status: admin/creator manual next-challenge teaser Story copy done across Web, iOS, and Android without auto-posting, schedule Stories, scraped Story responses, comment scraping, DM scraping, store Instagram identities, stored inbound replies, attribution records, tracking pixels, exported per-user activity, treat Story reactions as app consent, shared private responses, paid-access claims, outcome promises, medical implications, or pressure.
- Weekly Campaign Partner Perk Teaser Story Kit. Status: admin/creator manual partner-interest Story copy done across Web, iOS, and Android without auto-posting, schedule Stories, scraped Story responses, comment scraping, DM scraping, store Instagram identities, stored inbound replies, attribution records, create affiliate links, create partner payouts, contact partners as if demand is validated, tracking pixels, exported per-user activity, treat Story reactions as app consent, shared private responses, imply paid access or perks are live, outcome promises, medical implications, or pressure.
- Weekly Campaign Story Poll Kit. Status: admin/creator manual Story sticker prompts done across Web, iOS, and Android without auto-posting, scraped Story responses, comment scraping, DM scraping, stored inbound replies, attribution records, tracking pixels, exported per-user activity, treat Instagram votes as app consent, paid-access claims, outcome promises, medical implications, or pressure.
- Weekly Campaign Poll Review Kit. Status: admin/creator manual Story poll readback prompts done across Web, iOS, and Android without scraped Story responses, store Instagram voter identities, store inbound replies, attribution records, tracking pixels, exported per-user activity, treat Instagram votes as app consent, shared private responses, paid-access claims, outcome promises, medical implications, or pressure.
- Weekly Campaign Live Q&A Kit. Status: admin/creator manual Live Q&A copy done across Web, iOS, and Android without auto-hosting, recorded private replies, scraped comments, scraped DMs, store Instagram identities, stored inbound replies, attribution records, tracking pixels, exported per-user activity, treat Live questions as app consent, shared private responses, paid-access claims, outcome promises, medical implications, or pressure.
- Weekly Campaign Live Recap Kit. Status: admin/creator manual Live recap copy done across Web, iOS, and Android without auto-posting, recorded private replies, scraped comments, scraped DMs, store Instagram identities, stored inbound replies, attribution records, tracking pixels, exported per-user activity, treat Live questions as app consent, shared private responses, paid-access claims, outcome promises, medical implications, or pressure.
- Weekly Campaign FAQ Carousel Kit. Status: admin/creator manual FAQ carousel copy done across Web, iOS, and Android without auto-posting, scheduled posts, scraped comments, scraped DMs, store Instagram identities, stored inbound replies, attribution records, tracking pixels, exported per-user activity, treat Instagram questions as app consent, shared private responses, paid-access claims, outcome promises, medical implications, or pressure.
- Weekly Campaign Caption Bank Kit. Status: admin/creator manual campaign caption variants done across Web, iOS, and Android without auto-posting, schedule posts, scrape comments, scrape DMs, store inbound replies, attribution records, tracking pixels, exported per-user activity, share private responses, paid-access claims, outcome promises, medical implications, or pressure.
- Weekly Campaign Collab Invite Kit. Status: admin/creator manual creator outreach copy done across Web, iOS, and Android without auto-message, scraped DMs, stored inbound replies, create contracts, create payouts, promise revenue-share claims, affiliate links, tracking pixels, exported per-user activity, shared private responses, paid-access claims, outcome promises, medical implications, or pressure creators.
- Weekly Campaign Collab Follow-Up Kit. Status: admin/creator manual creator follow-up copy done across Web, iOS, and Android without auto-message, scraped DMs, stored inbound replies, create contracts, create payouts, promise revenue-share claims, affiliate links, tracking pixels, exported per-user activity, shared private responses, paid-access claims, outcome promises, medical implications, or pressure creators.
- Weekly Campaign Collab Safety Checklist. Status: admin/creator manual consent and claim review done across Web, iOS, and Android without auto-message, scraped DMs, stored inbound replies, create contracts, create payouts, promise revenue-share claims, affiliate links, tracking pixels, exported per-user activity, shared private responses, paid-access claims, outcome promises, medical implications, or pressure creators.
- Weekly Campaign Collab Recap Kit. Status: admin/creator manual post-collab recap copy done across Web, iOS, and Android without scraped posts, scraped comments, scraped DMs, stored Instagram identities, stored inbound replies, attribution records, create contracts, create payouts, promise revenue-share claims, affiliate links, tracking pixels, exported per-user activity, shared private responses, paid-access claims, outcome promises, medical implications, or pressure creators.
- Weekly Campaign Collab Renewal Kit. Status: admin/creator manual repeat-or-pause copy done across Web, iOS, and Android without auto-message, scraped posts, scraped comments, scraped DMs, stored Instagram identities, stored inbound replies, attribution records, create contracts, create payouts, promise revenue-share claims, affiliate links, tracking pixels, exported per-user activity, shared private responses, paid-access claims, outcome promises, medical implications, or pressure creators.
- Community Highlight Roundup Kit. Status: copy-ready weekly featured-win roundup done across Web, iOS, and Android using featured submissions only, without auto-posting, scheduling posts, scraping DMs, exporting per-user activity, sharing unreviewed submissions, paid-access claims, outcome promises, or medical implications.
- UGC Consent Reminder Kit. Status: copy-ready manual repost consent checklist done across Web, iOS, and Android using featured/review queue counts without auto-posting, scheduling posts, scraping DMs, storing inbound DMs, exporting private history, sharing unreviewed submissions, overriding consent, editing member claims into outcomes, paid-access claims, outcome promises, medical implications, or pressure.
- Referral Story Sprint Kit. Status: member copy-ready Story/Reel referral sprint done across Web, iOS, and Android without link-open counting, reward grants, referral-state writes, payouts, affiliate rewards, entitlement unlocks, paid-access claims, outcome promises, or medical implications.
- Referral Reward Social Proof Kit. Status: member copy-ready Story/carousel celebration copy done across Web, iOS, and Android using first-party referral progress only, without reward grants, referral-state writes, payouts, affiliate rewards, entitlement unlocks, paid-access claims, outcome promises, medical implications, or fulfillment claims before admin review.
- Instagram Content Calendar. Status: admin/creator seven-day cadence planner and copy export done across Web, iOS, and Android using local prompt constants only.

### Phase 3: Pro Subscription Foundation

Features:

- Entitlement model shared across Web, iOS, and Android. Status: read-only profile foundation done.
- Native in-app purchase setup. Status: shared product IDs, StoreKit/Play Billing service scaffolding, profile checkout UI, and purchase restore/sync actions done.
- Receipt validation callable. Status: request/audit contract, App Store transaction lookup, Google Play purchase lookup, and entitlement writes are wired; production credentials and real store test purchases pending.
- Store Launch Readiness. Status: admin-only checklist and copy surface done across Web, iOS, and Android using the shared product catalog.
- Store Credential Setup Kit. Status: admin-only operational handoff and read-only validation readiness probe done across Web, iOS, and Android for store credentials, Firebase receipt-validation secrets, sandbox/test purchases, and Firestore entitlement checks.
- Store Validation Credential Template. Status: safe `functions/.env.example` placeholders added for every required App Store and Play validation key; real private keys and service account JSON must stay outside git.
- Sandbox Purchase Test Plan. Status: admin manual App Store sandbox, Play license test, restore, negative QA, backend `verifyPurchase`, Firestore entitlement, and support escalation checklist done across Web, iOS, and Android without running live charges, writing fake purchases, unlocking entitlements from profile UI, or claiming paid access is live.
- Subscription Management Guidance Kit. Status: admin-only marketplace-first guidance done across Web, iOS, and Android for Apple ID subscriptions, Google Play subscriptions, restore/sync, and support escalation without cancelling subscriptions in-app, processing refunds, creating purchases, writing entitlements, bypassing marketplace policy, collecting payment details, or claiming paid access is live.
- Billing Support Escalation Kit. Status: admin-only marketplace-first billing handoff done across Web, iOS, and Android for wrong-account, failed-renewal, duplicate-charge, cancellation-confusion, and missing-entitlement cases without cancelling subscriptions in-app, processing refunds, creating purchases, writing entitlements, overriding marketplace decisions, collecting payment details, or marking paid access live.
- Entitlement Recovery Request and Review Queue. Status: request-only missing purchase support flow done across Web, iOS, and Android, writing `entitlementRecoveryRequests/{uid}` and admin-only open queues without writing entitlements, processing refunds, cancelling subscriptions, creating purchases, or bypassing marketplace policy.
- Entitlement Recovery Admin Review Updates. Status: admin-only status update and review-note flow done across Web, iOS, and Android for `waiting`, `resolved`, and `closed` entitlement recovery requests, writing `reviewNote`, `reviewedBy`, and `reviewedAt` without writing entitlements, processing refunds, cancelling subscriptions, creating purchases, or bypassing marketplace policy.
- Store Test Purchase Evidence Log. Status: admin-only evidence recording done across Web, iOS, and Android for sandbox/license-test purchase proof, with `needs_review` records that do not unlock entitlements, create purchase records, process refunds, or mark paid access live.
- Store Test Purchase Evidence Review Updates. Status: admin-only review action and note flow done across Web, iOS, and Android for `verified`, `needs_review`, `failed`, and `archived` evidence decisions without entitlement, purchase, refund, marketplace, or paid-live side effects.
- Feature Submission Review Notes. Status: admin-only review-note flow done across Web, iOS, and Android for `approved`, `featured`, and `declined` user stories without auto-posting, overriding consent, implying outcomes, or sharing unreviewed submissions.
- Pro feature flags. Status: initial shared entitlement gate done.
- Premium analytics. Status: profile preview/report done.
- Pro Value Snapshot. Status: checkout/profile conversion preview done across Web, iOS, and Android.
- Pro Trial Interest. Status: first-party demand capture done across Web, iOS, and Android without granting entitlements or implying live store trials.
- Pro trial demand summary. Status: admin-only aggregate counts and Trial Launch Kit copy done across Web, iOS, and Android.
- Pro Trial Objection Reply Kit. Status: admin manual Pro question replies done across Web, iOS, and Android using aggregate first-party trial demand without claiming live store trials, quoting unconfigured prices, collecting payments, creating purchases, granting Pro, writing entitlements, offering discounts, promising founder pricing, outcome promises, medical implications, scraped/stored DMs, tracking pixels, or pressure.
- Monetization Launch Board. Status: admin-only aggregate launch-readiness view combining Pro trial, creator beta, and partner demand signals.
- Launch Experiment Kit. Status: admin/creator manual experiment planner done across Web, iOS, and Android using first-party signals only, with no ad tracking or paid-live claims.
- Launch Experiment Scorecard. Status: admin/creator manual first-party scorecard done across Web, iOS, and Android to evaluate the recommended experiment without tracking pixels or paid-access claims.
- Release QA Checklist. Status: admin/creator manual launch guardrail done across Web, iOS, and Android for product IDs, store test purchases, entitlement writes, feature parity docs, and share-flow QA.
- Launch Retrospective Kit. Status: admin/creator manual post-launch review prompt done across Web, iOS, and Android using first-party campaign, referral, share, UGC, and entitlement QA signals only.
- Revenue Pathway Planner. Status: admin/creator manual revenue-path ranking done across Web, iOS, and Android using Pro, paid pack, creator, partner, campaign, and referral signals only.
- Pricing Test Kit. Status: admin/creator manual pricing-language validation done across Web, iOS, and Android using shared Pro and pack product IDs without prices, purchases, discounts, or entitlement writes.
- Founder Member Offer Kit. Status: admin/creator manual early-member value-validation copy done across Web, iOS, and Android without sales, founder pricing, payments, purchases, discounts, or entitlement writes.
- Community Ambassador Kit. Status: admin/creator manual ambassador-recruitment copy done across Web, iOS, and Android without commissions, payouts, paid roles, affiliate links, partner tracking, purchases, entitlements, discounts, or revenue-share promises.
- Customer Value Delivery Checklist. Status: admin/creator manual value-readiness copy done across Web, iOS, and Android without charging users, unlocking paid access, promising outcomes, implying medical results, running discounts, writing entitlements, or promoting paid features as live.
- Support and Refund Readiness Kit. Status: admin manual support-readiness copy done across Web, iOS, and Android without processing refunds in-app, overriding App Store or Play refund policy, manually writing entitlements, promising outcomes, implying medical results, or promoting paid access as live.
- Paid Launch Decision Gate. Status: admin manual go/no-go gate done across Web, iOS, and Android with read-only `storeTestPurchaseEvidence` iOS/Android coverage counts, without flipping paid access live, writing entitlements, processing payments/refunds, bypassing marketplace policy, promising outcomes, implying medical results, or announcing launch readiness early.
- Store Listing Copy Kit. Status: admin manual store-listing planning copy done across Web, iOS, and Android without claiming paid access is live, advertising unconfigured prices, promising outcomes, implying medical results, mentioning refunds outside marketplace policy, unlocking entitlements, or submitting policy-conflicting copy.
- Store Review Submission Kit. Status: admin manual store-review planning copy done across Web, iOS, and Android without submitting inaccurate permission claims, providing personal user data in reviewer notes, bypassing marketplace purchase review, claiming medical or guaranteed fitness outcomes, unlocking paid access from client code, or marking the app ready for review before store products, policies, support links, privacy/data deletion flows, and entitlement QA are verified.
- Store Review Evidence Pack. Status: admin manual reviewer-evidence copy done across Web, iOS, and Android using store-test evidence counts, product IDs, policy/support links, permission notes, validation readiness, and launch gate status without submitting store review, exposing personal user data, unlocking paid access, writing entitlements, creating purchases, processing refunds, bypassing marketplace policy, marking paid access live, or claiming review readiness early.
- Policy and Support Link Hub. Status: hosted privacy, terms, support, and account/data deletion pages plus profile links done across Web, iOS, and Android so users and reviewers can find release/support resources from the app.
- Account Deletion Request and Review Queue flow. Status: request-only profile control and admin review queue done across Web, iOS, and Android, writing `accountDeletionRequests/{uid}` plus profile status markers without immediate account deletion, purchase cancellation, refund handling, or marketplace policy bypass.
- Account Deletion Admin Review Updates. Status: admin-only review action and note flow done across Web, iOS, and Android, including `reviewNote`, `reviewedBy`, `reviewedAt`, and safe reviewed statuses without destructive deletion side effects.
- Support Request and Review Queue flow. Status: support contact form and admin queue done across Web, iOS, and Android, writing `supportRequests` without processing refunds, cancelling subscriptions, writing entitlements, resolving purchases, or bypassing marketplace policy.
- Support Request Admin Review Updates. Status: admin-only status update and review-note flow done across Web, iOS, and Android for `waiting`, `resolved`, and `closed` support requests, writing `reviewNote`, `reviewedBy`, and `reviewedAt` without resolving refunds, subscriptions, purchases, or entitlements from profile UI.
- Referral Reward Claim and Review Queue flow. Status: request-only claim action and admin queue done across Web, iOS, and Android, writing `referralRewardClaims/{uid}_{tierTarget}` for unlocked referral tiers without granting Pro, entitlements, discounts, purchases, payouts, affiliate rewards, or paid access from client code.
- Referral Reward Admin Review Updates. Status: admin-only status update and review-note flow done across Web, iOS, and Android for `approved`, `waiting`, `not_ready`, and `declined` referral reward claims, writing `reviewNote`, `reviewedBy`, and `reviewedAt` without granting Pro, entitlements, discounts, payouts, purchases, affiliate rewards, or paid access from client code.
- Data Safety Disclosure Kit. Status: admin manual Play Data Safety / App Privacy planning copy done across Web, iOS, and Android without submitting conflicting privacy labels, hiding optional health/media collection, implying medical outcomes, claiming third-party ad tracking, omitting purchase verification data, or collecting new data without privacy, docs, and release QA updates.
- Weekly and monthly progress reports. Status: shared weekly score plus 30-day monthly score, status, next-best-action report, and Pro monthly recap sharing done across Web, iOS, and Android.
- Custom goals and custom streak targets. Status: profile goal editor and progress preview done.
- Value Proof Story Kit. Status: copy-ready progress proof Story copy done across Web, iOS, and Android using current app progress, weekly/monthly report scores, challenge points, and this week's campaign prompt without auto-posting, scraping DMs, adding tracking pixels, exporting private history, creating purchases, granting Pro, writing entitlements, paid-access claims, outcome promises, medical implications, or pressure.
- Story Posting Checklist Kit. Status: copy-ready manual Instagram Story checklist done across Web, iOS, and Android using weekly campaign CTA, app proof, comeback prompt, referral action, and featured submissions count without auto-posting, scheduling posts, scraping DMs, storing inbound DMs, adding tracking pixels, exporting private history, sharing unreviewed submissions, creating challenge joins, writing referral state, paid-access claims, outcome promises, medical implications, or pressure.
- Streak Rescue Prompt Kit. Status: copy-ready missed-day comeback prompt done across Web, iOS, and Android using current streak, streak target, Pro status, and existing recovery state without awarding points, creating activity logs, spending recovery credits, writing entitlements, unlocking Pro, paid-access claims, outcome promises, medical implications, or pressure after missed days.
- Comeback Challenge Invite Kit. Status: copy-ready missed-day restart invite done across Web, iOS, and Android using this week's campaign prompt without auto-messaging users, scraping DMs, creating challenge joins, creating activity logs, spending recovery credits, writing referral state, writing entitlements, paid-access claims, outcome promises, medical implications, or pressure after missed days.
- Private challenges. Status: create gate done; public challenges remain free.
- Creator / Coach Mode foundation. Status: Pro-gated profile metadata editor, hosted analytics, and creator-branded challenge metadata done across Web, iOS, and Android.
- Creator demand summary. Status: admin-only revenue-share beta aggregate counts and creator beta copy done across Web, iOS, and Android.
- Creator Hosting Offer Kit. Status: Pro-gated creator copy-only offer planning brief done across Web, iOS, and Android; it does not create contracts, payouts, purchases, entitlements, or paid-access claims.
- Creator Terms Readiness Kit. Status: Pro-gated creator copy-only terms-readiness brief done across Web, iOS, and Android without creating contracts, collecting payout/tax details, starting revenue-share, processing payments, creating purchases, writing entitlements, processing refunds, bypassing marketplace policy, promising outcomes, implying medical results, or claiming paid creator hosting is live.
- Creator Payout Readiness Kit. Status: Pro-gated creator copy-only payout operations checklist done across Web, iOS, and Android without creating payouts, collecting payout/tax details, creating contracts, starting revenue-share, processing payments, creating purchases, writing entitlements, processing refunds, bypassing marketplace policy, promising outcomes, implying medical results, or claiming paid creator hosting is live.
- Creator Hosting Objection Reply Kit. Status: Pro-gated creator copy-only manual replies done across Web, iOS, and Android without claiming paid creator hosting is live, quoting unconfigured prices, collecting payments, creating purchases/contracts, collecting payout/tax details, starting revenue-share, writing entitlements, bypassing marketplace policy, scraped/stored DMs, tracking pixels, or pressure.
- Creator Hosting Application and Review Queue. Status: Pro Creator Mode request-only hosted-readiness application done across Web, iOS, and Android, writing `creatorHostingApplications/{uid}` and admin-only open queues without creating contracts, payouts, purchases, entitlements, revenue-share, or paid-access claims.
- Creator Hosting Application Admin Review Updates. Status: admin-only status update and review-note flow done across Web, iOS, and Android for `approved`, `waiting`, `not_ready`, and `declined` `creatorHostingApplications`, writing `reviewNote`, `reviewedBy`, and `reviewedAt` without contracts, payouts, purchases, entitlements, revenue-share, or paid-access claims.

### Phase 4: Paid Challenge Packs

Features:

- Premium challenge templates. Status: initial 21-Day Reset Pack template and Pro creation gate done.
- Premium pack accountability prompts. Status: paid-pack daily prompt arrays persist and render across Web, iOS, and Android.
- Challenge pack purchase/entitlement tracking. Status: shared product IDs, native query service scaffolding, verification payload contract, per-pack entitlement gates, live validation calls, and server entitlement writer done; production credentials and real store test purchases pending.
- Challenge pack checkout visibility. Status: profile surfaces show pack products and per-pack unlocked state across Web, iOS, and Android.
- Challenge Pack Launch Kit. Status: admin/creator copy-ready launch messaging done across Web, iOS, and Android using shared pack product IDs, with store-credential pending copy.
- Challenge Pack Objection Reply Kit. Status: admin/creator manual reply copy done across Web, iOS, and Android for paid-pack questions before marketplace validation, pricing, purchase, restore, and entitlement QA are complete.
- Challenge Pack Objection Reply Kit guardrail: must not claim packs are live, quote unconfigured prices, collect payments, unlock packs, grant Pro, write entitlements, bypass marketplace policy, scrape/store DMs, add tracking pixels, or pressure users.
- Store Credential Setup Kit. Status: admin-only release handoff plus `getPurchaseValidationReadiness` probe keeps App Store, Play Billing, Firebase Functions, and entitlement QA requirements visible before paid pack access is promoted as live.
- Sandbox Purchase Test Plan. Status: admin-only manual purchase QA checklist done across Web, iOS, and Android for Pro and challenge-pack sandbox/test purchases, restore, backend validation, entitlement QA, and negative cases before paid pack access is promoted as live.
- Subscription Management Guidance Kit. Status: admin-only copy-ready subscription management guidance done across Web, iOS, and Android while cancellation, refund, purchase, and entitlement actions remain marketplace/backend support responsibilities.
- Billing Support Escalation Kit. Status: admin-only copy-ready billing support handoff done across Web, iOS, and Android while refunds, cancellations, purchase disputes, and entitlement changes remain marketplace/backend support responsibilities.
- Renewal Recovery Kit. Status: admin-only copy-ready failed-renewal and lapsed-access recovery guidance done across Web, iOS, and Android while charge retries, payment updates, refunds, cancellations, renewal status, and entitlement changes remain marketplace/backend support responsibilities.
- Cancellation Feedback Kit. Status: admin-only copy-ready churn learning prompts done across Web, iOS, and Android while cancellation, billing changes, refunds, discounts, purchase creation, and entitlement changes remain marketplace/backend support responsibilities.
- Lapsed Member Winback Kit. Status: admin-only copy-ready free-first comeback prompts done across Web, iOS, and Android while messaging automation, tracking, discounts, charges, purchases, entitlements, and paid-access claims remain out of scope.
- Entitlement Recovery Request and Review Queue. Status: member request action and admin review queue done across Web, iOS, and Android for Pro and challenge-pack restore/support mismatches, with no client-side purchase or entitlement side effects.
- Entitlement Recovery Admin Review Updates. Status: manual admin decision updates done across Web, iOS, and Android on `entitlementRecoveryRequests` with `reviewNote`, `reviewedBy`, and `reviewedAt` while entitlement writes, refunds, subscription cancellation, purchase creation, and marketplace bypass remain out of client scope.
- Store Test Purchase Evidence Log. Status: admin-only evidence log done across Web, iOS, and Android for Pro and challenge-pack sandbox/license-test proof before paid pack access is promoted.
- Pack Value Preview. Status: paid pack template cards show duration, task count, prompt count, and unlock state across Web, iOS, and Android.
- Premium badges and completion recap. Status: Pro-gated premium badge foundation, free completion recap foundation, and basic pack-aware recap copy done across Web, iOS, and Android.
- Seasonal campaign drops. Status: initial Summer Shred premium pack and Winter Base free campaign templates done across Web, iOS, and Android.

### Phase 5: Creator / Coach Mode

Features:

- Creator profiles.
- Branded challenge pages.
- Private creator challenge links.
- Creator analytics. Status: Pro-gated hosted challenge summary done across Web, iOS, and Android.
- Branded challenge pages. Status: initial Coach Host block done on challenge detail/tracker surfaces using denormalized creator profile fields.
- Creator Launch Kit. Status: generated hosted-challenge launch copy with invite link done across Web, iOS, and Android.
- Revenue-share or hosting model. Status: initial Pro-gated revenue-share opt-in and readiness metrics done across Web, iOS, and Android; real payout provider and terms pending.
- Creator Hosting Offer Kit. Status: copy-only hosted-offer planning brief done across Web, iOS, and Android while payout provider, creator terms, and paid-hosting policy remain pending.
- Creator Terms Readiness Kit. Status: copy-only creator terms checklist done across Web, iOS, and Android while payout provider, creator agreement, tax operations, support handoff, and paid-hosting policy remain pending.
- Creator Payout Readiness Kit. Status: copy-only payout operations checklist done across Web, iOS, and Android while payout provider, creator agreement, tax operations, support handoff, marketplace QA, and paid-hosting policy remain pending.
- Creator Hosting Objection Reply Kit. Status: copy-only manual creator question replies done across Web, iOS, and Android while payout provider, creator agreement, tax operations, support handoff, store validation, and entitlement QA remain pending.
- Creator Hosting Application and Review Queue. Status: manual hosted-readiness application and admin review queue done across Web, iOS, and Android while real payout provider, creator terms, paid-hosting policy, purchases, and entitlements remain pending.
- Creator Hosting Application Admin Review Updates. Status: manual admin decision updates done across Web, iOS, and Android on `creatorHostingApplications` with `reviewNote`, `reviewedBy`, and `reviewedAt` while contracts, payouts, purchases, entitlements, revenue-share, and paid-access claims remain pending.

### Phase 6: Partnerships

Features:

- Sponsored challenge metadata. Status: initial template metadata, create preview cards, and tracker detail cards done across Web, iOS, and Android.
- Partner offer cards. Status: profile cards and saved first-party interest toggles done across Web, iOS, and Android.
- Member perks. Status: first-party eligibility progress foundation done across Web, iOS, and Android.
- Sponsor reporting. Status: admin-only first-party partner demand summary and Partner Pitch Kit done across Web, iOS, and Android.
- Partner Campaign Activation Kit. Status: admin-only copy-ready sponsor-backed challenge pilot brief done across Web, iOS, and Android without partner links, tracking pixels, ad targeting, purchases, or entitlement changes.
- Partner Terms Readiness Kit. Status: admin-only copy-ready sponsor-pilot terms brief done across Web, iOS, and Android without partner links, tracking pixels, ad targeting, affiliate payouts, commissions, revenue-share, purchases, entitlements, discounts, coupons, third-party data sharing, medical claims, guaranteed outcomes, or paid-access claims.
- Partner Contract Readiness Kit. Status: admin-only copy-ready partner contract checklist done across Web, iOS, and Android without creating partner links, tracking pixels, ad targeting, affiliate payouts, commissions, revenue-share, purchases, entitlements, discounts, coupons, third-party data sharing, medical claims, guaranteed outcomes, paid-access claims, or fulfillment promises.
- Partner Campaign Objection Reply Kit. Status: admin-only copy-ready manual sponsor-pilot replies done across Web, iOS, and Android without claiming partner campaigns are live, partner links, tracking pixels, ad targeting, payments, purchases, affiliate payouts, commissions, revenue-share, entitlements, discounts, third-party data sharing, scraped/stored DMs, or pressure.
- Partner Campaign Application and Review Queue. Status: manual sponsor-pilot review application done across Web, iOS, and Android, writing `partnerCampaignApplications/{uid}` and admin-only open queues without partner links, tracking pixels, ad targeting, affiliate payouts, purchases, entitlements, revenue-share, or paid-access claims.
- Partner Campaign Application Admin Review Updates. Status: admin-only status update and review-note flow done across Web, iOS, and Android for `approved`, `waiting`, `not_ready`, and `declined` `partnerCampaignApplications`, writing `reviewNote`, `reviewedBy`, and `reviewedAt` without partner links, tracking pixels, ad targeting, affiliate payouts, purchases, entitlements, revenue-share, or paid-access claims.
- Partner Perk Claim and Review Queue. Status: manual eligible-perk claim request done across Web, iOS, and Android, writing `partnerPerkClaims/{uid}_{perkId}` and admin-only open queues without coupons, partner links, payouts, discounts, purchases, entitlements, or paid-access claims.
- Partner Perk Claim Status History. Status: signed-in user review-only `partnerPerkClaims` status list done across Web, iOS, and Android without coupons, partner links, payouts, discounts, purchases, entitlements, or paid-access claims.
- Partner Perk Fulfillment Readiness Kit. Status: admin copy-only claim-readiness brief done across Web, iOS, and Android without coupons, partner links, payouts, discounts, purchases, entitlements, affiliate rewards, tracking pixels, ad targeting, third-party data exports, paid-access claims, outcome promises, medical implications, or fulfillment promises.
- Partner Perk Admin Decision Reply Kit. Status: admin copy-only decision reply brief done across Web, iOS, and Android for approved, waiting, not-ready, and declined claim replies without coupons, partner links, payouts, discounts, purchases, entitlements, affiliate rewards, tracking pixels, ad targeting, third-party data exports, paid-access claims, outcome promises, medical implications, or fulfillment promises.
- Partner Perk Claim Admin Review Updates. Status: admin-only status update and review-note flow done across Web, iOS, and Android for `approved`, `waiting`, `not_ready`, and `declined` `partnerPerkClaims`, writing `reviewNote`, `reviewedBy`, and `reviewedAt` without coupons, partner links, payouts, discounts, purchases, entitlements, affiliate rewards, tracking pixels, ad targeting, third-party data exports, paid-access claims, outcome promises, medical implications, or fulfillment promises.

## Cross-Platform Build Rule

Unless a capability is intentionally platform-specific, every roadmap feature should be implemented and documented across Web, iOS, and Android in the same feature slice.

For every feature:

1. Define shared Firestore fields and security assumptions.
2. Implement Web, iOS, and Android equivalents.
3. Update `FEATURE_PARITY.md`.
4. Update `docs/FEATURE_CATALOG.md` when the feature becomes part of the product surface.
5. Add release checks and tests before shipping.

## Suggested Next Build

Build the Weekly Challenge Campaign Engine:

- Campaign-branded challenge templates.
- Shareable challenge launch cards.
- Instagram CTA copy.
- Invite/referral tracking hooks.
- Cross-platform challenge creation parity.

Initial implementation status:

- Campaign-branded challenge templates: done.
- Instagram CTA copy persisted on challenge docs: done.
- Cross-platform challenge creation parity: done.
- Pending-review feature submissions: done.
- User-facing feature submission status history: done.
- Community highlights for featured submissions: done.
- Invite/referral tracking hooks: done.
- Referral join counter: done.
- Shareable generated launch cards: done.

This creates the strongest bridge between Instagram attention and app-based commitment.

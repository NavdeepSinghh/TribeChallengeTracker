# Marketing and Content Strategy

This document turns the product roadmap into an operating plan for release, growth, retention, and monetization across:

- Web/Capacitor: `/Users/navdeepsmacbook/Documents/TribeChallengeTracker`
- Native iOS: `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS`
- Native Android: `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid`

Related docs:

- Copy-ready Instagram content bank: `docs/INSTAGRAM_CONTENT_BANK.md`
- Product growth and revenue roadmap: `docs/MONETIZATION_ROADMAP.md`
- Contributor feature map: `docs/FEATURE_CATALOG.md`
- Cross-platform parity ledger: `FEATURE_PARITY.md`
- Store/release guardrails: `docs/STORE_READINESS.md`

## Strategy Principle

Rise With The Tribe should grow from real commitment, real member proof, and respectful accountability.

Instagram creates discovery and social energy. The apps create commitment, tracking, challenge momentum, support, and paid value. Every campaign should move people from inspiration into a first-party app action that can be supported, measured, and kept honest.

Core loop:

```text
Instagram prompt
-> app challenge join
-> first log
-> progress proof
-> share / referral / Feature Me submission
-> community highlight
-> next challenge or paid value path
```

## Audience Lane Index

Purpose: keep new-member, returning-member, contributor, creator, coach, and partner audience lanes in a focused strategy file while preserving the same message and app-surface map.

<!-- include: marketing-content-strategy/audience-lanes.md -->

## Instagram Growth Loop Index

Weekly campaign prompts, share-card proof, community highlights, referral prompts, and creator/admin operating cues now live in `docs/marketing-content-strategy/instagram-growth-loops.md` so the main strategy stays easier to scan while preserving the same Instagram-to-app growth loop contracts.

<!-- include: marketing-content-strategy/instagram-growth-loops.md -->

## Engagement and Retention Index

First-week onboarding, comeback prompts, challenge momentum, and renewal/cancellation recovery now live in `docs/marketing-content-strategy/engagement-retention.md` so the main strategy can stay concise while preserving the same retention prompts, paid-boundary guardrails, and recovery rules.

<!-- include: marketing-content-strategy/engagement-retention.md -->

## Monetization Pathway Index

Subscription, premium challenge, creator/coaching, sponsor, paid community, and merch/event monetization paths now live in `docs/marketing-content-strategy/monetization-pathways.md` so the main strategy can stay focused while preserving paid-access timing, marketplace, payout, fulfillment, and trust guardrails.

<!-- include: marketing-content-strategy/monetization-pathways.md -->

## Launch Phase Index

Release foundation, free challenge push, paid validation, paid launch, and creator/partner expansion phases now live in `docs/marketing-content-strategy/launch-phases.md` so the main strategy can stay concise while preserving store-readiness, evidence, paid-access, and expansion sequencing.

<!-- include: marketing-content-strategy/launch-phases.md -->

## Production Guardrails

Paid features must be honest:

- Free habit formation stays useful.
- Paid access is not promoted as live before store validation and entitlement QA pass.
- Purchase, restore, renewal, refund, cancellation, and recovery behavior must match App Store, Play, Firebase, and backend reality.

Content must stay respectful:

- No fake urgency.
- No shame-based comeback copy.
- No dark patterns around cancellation, renewals, trials, or discounts.
- No unsupported health, medical, body transformation, or guaranteed outcome claims.

Community proof must be consent-based:

- Feature Me consent is required.
- Admin review is required before public featuring.
- Private details and sensitive claims are removed before posting.
- Instagram interactions are not app consent.

Platform behavior must stay clean:

- Web, iOS, and Android should expose the same user outcome unless a platform limitation is documented.
- Shared Firestore fields and product IDs must stay aligned.
- Store/backend behavior must be verified before launch copy changes.
- Every feature must update `FEATURE_PARITY.md`, `docs/FEATURE_CATALOG.md`, and release checks where applicable.

## Operating Cadence

Weekly:

- Choose one campaign template.
- Export launch, Story, DM, comment, and referral copy.
- Confirm Feature Me/community highlights are consent-reviewed.
- Run the weekly campaign.
- Review first-party joins, logs, referrals, shares, and submissions.
- Decide the next campaign angle.

Monthly:

- Review retention, comeback, and completion signals.
- Review Pro/pack/creator/partner demand.
- Update store, support, and data safety readiness if product behavior changed.
- Update parity docs for any feature shipped or changed.
- Decide whether the next month is free-growth, paid-validation, paid-launch, creator, or partner focused.

Before every store or paid launch:

- Run `npm run release:check:all`.
- Confirm product IDs and receipt validation readiness.
- Confirm sandbox/test purchase evidence.
- Confirm support, refund, cancellation, restore, and entitlement recovery handoffs.
- Confirm store listing copy does not overclaim paid access, outcomes, or health benefits.

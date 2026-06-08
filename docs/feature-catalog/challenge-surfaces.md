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

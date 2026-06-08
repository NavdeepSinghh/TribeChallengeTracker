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
- Referral Reward Decision Reply Kit copies approved, waiting, not-ready, and declined manual claim replies without granting Pro, entitlements, discounts, payouts, purchases, affiliate rewards, or fulfillment promises.
- Referral Reward Claim is request-only and does not grant Pro, entitlements, discounts, purchases, payouts, affiliate rewards, or paid access.

Release checks:

- Self-referrals do not count.
- Badge progress appears in the shared badge grid before unlock.
- Award logic uses the same thresholds on Web, iOS, and Android.
- Reward ladder progress and next-tier copy match the same thresholds on Web, iOS, and Android.
- Referral analytics derive from `users/{uid}.stats.referralJoins` and do not require extra backend fields.
- Referral claims can only be created for tiers unlocked by first-party `stats.referralJoins`.
- Admin review queues verify meaningful challenge joins before manual recognition or any future perk fulfillment.

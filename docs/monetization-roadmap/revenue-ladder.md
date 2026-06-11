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
- 14-Day Comeback Sprint.
- 21-Day Event Prep Pack.
- Seasonal or event-based challenges.

Candidate premium content:

- Preset daily tasks.
- Bonus milestones and badges.
- Extra accountability prompts.
- Premium share templates.
- End-of-challenge recap.

Implementation notes:

- Initial shared pack product IDs are `com.risewiththetribe.pack.21_day_reset`, `com.risewiththetribe.pack.summer_shred`, `com.risewiththetribe.pack.beginner_consistency`, `com.risewiththetribe.pack.discipline_30`, `com.risewiththetribe.pack.tribe_mode_75`, `com.risewiththetribe.pack.comeback_14`, and `com.risewiththetribe.pack.event_prep_21`.
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

### Creator and Partner Revenue Ladder Index

Creator / Coach Mode and Brand Partnerships now live in `docs/monetization-roadmap/creator-partner-revenue-ladder.md` so the main revenue ladder stays focused while include-aware roadmap checks preserve creator/coach, paid hosting, revenue-share, brand-partnership, sponsor-backed challenge, member-perk, random-ad, and trust-aligned monetization rules.

<!-- include: creator-partner-revenue-ladder.md -->

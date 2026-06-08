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
- Profile surfaces show a Referral Launch Kit that turns next-tier referral progress into a copy-ready launch checklist, caption draft, manual comment reply, app-link guidance, and first-party join review prompt.
- Profile surfaces show a Referral Story Sprint Kit that turns next-tier referral progress into a copy-ready Story/Reel invite around one accountability partner.
- Profile surfaces show a Referral Reward Social Proof Kit that turns unlocked referral reward progress into copy-ready Story/carousel celebration copy.
- Admin profile surfaces show a Referral Reward Decision Reply Kit that turns open referral reward claims into copy-ready approved/waiting/not-ready/declined manual replies.

Release checks:

- Self-referrals are ignored.
- Referral attribution is tied to joins, not link opens.
- Joining without a referral does not create reward state.
- Referral counts are visible in profile and can later power badges, Pro trials, or analytics.
- Referral Launch Kit copy must use first-party progress and referral tier state only; it must not count link opens, grant rewards, write referral state, create payouts, create affiliate rewards, unlock entitlements, imply paid access is live, promise outcomes, imply medical results, scrape DMs, store inbound replies, add tracking pixels, pressure invites, or claim reward fulfillment before admin review.
- Referral Story Sprint Kit copy must use first-party progress and referral tier state only; it must not count link opens, grant rewards, write referral state, create payouts, create affiliate rewards, unlock entitlements, imply paid access is live, promise outcomes, or imply medical results.
- Referral Reward Social Proof Kit copy must use first-party referral progress only; it must not grant rewards, write referral state, create payouts, create affiliate rewards, unlock entitlements, imply paid access is live, promise outcomes, imply medical results, or claim fulfillment before admin review.
- Referral Reward Decision Reply Kit must be copy-only/manual UI and must not grant Pro, write entitlements, unlock challenge packs, create discounts, create payouts, create purchases, create affiliate rewards, write referral state, count link opens, claim fulfillment, promise outcomes, imply medical results, scrape/store DMs or replies, add tracking pixels, auto-message users, or pressure members.

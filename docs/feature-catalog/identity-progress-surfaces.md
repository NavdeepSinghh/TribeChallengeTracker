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

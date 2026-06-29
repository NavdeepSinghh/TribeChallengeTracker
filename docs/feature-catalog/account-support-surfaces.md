## Account and Data Deletion Requests

Purpose: give users and store reviewers an in-app path to request account/data deletion.

Shared behavior:

- Profile includes an "ACCOUNT DELETION REQUEST" card near policy and support links.
- Submitting writes `accountDeletionRequests/{uid}` with `status: requested`, platform `source`, denormalized email/display name, and request timestamps.
- Submitting also mirrors `users/{uid}.accountDeletionRequest.status` so all platforms can show the request as recorded.
- On iOS, users signed in with Apple are asked to confirm with Apple before the request is recorded. TribeLog calls Firebase Auth's Apple token revocation path with the fresh Apple authorization code, records `appleSignInRevocation.status`, and Apple may send the user its own revocation confirmation email.
- Admin profiles include an "ACCOUNT DELETION REVIEW QUEUE" card that lists pending requests for support follow-up.
- Account Deletion Admin Review Updates let admins mark requests `verified`, `contacted`, `blocked`, or `closed` with `reviewNote`, `reviewedBy`, and `reviewedAt`, while keeping deletion itself as a manual support operation.
- Admin profiles include an Account Deletion Decision Reply Kit that copies verified, contacted, blocked, and closed support-reviewed replies while keeping destructive deletion work manual.
- This is a support-reviewed request flow only; it does not immediately delete the Firebase Auth account, erase activity or purchase records, cancel subscriptions, process refunds, or bypass marketplace policy.
- Account Deletion Decision Reply Kit must be copy-only/manual UI and must not delete Firebase Auth accounts, erase activity records, erase purchase records, cancel subscriptions, process refunds, write entitlements, bypass App Store or Google Play policy, collect payment details, expose private user data, promise immediate deletion, auto-message users, scrape/store DMs, or pressure members.

Release checks:

- Request button writes the shared Firestore document and profile marker.
- Re-opening profile shows the recorded status.
- iOS Sign in with Apple accounts show the Apple confirmation prompt before request recording, then save the revocation outcome for admin review.
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
- Admin profiles include a Support Decision Reply Kit that copies waiting, resolved, closed, and marketplace escalation replies while keeping support actions manual.
- This is a follow-up flow only; it does not process refunds, cancel subscriptions, write entitlements, resolve purchases, or bypass marketplace policy.
- Support Decision Reply Kit must be copy-only/manual UI and must not process refunds, cancel subscriptions, resolve purchases, write entitlements, delete accounts, erase activity records, collect payment details, bypass App Store or Google Play policy, expose private user data, promise immediate resolution, auto-message users, scrape/store DMs, or pressure members.

Release checks:

- Support request button writes the shared Firestore document.
- Admin profiles can see open support requests without any refund, subscription, or entitlement action.
- Firestore rules allow only signed-in users to create their own open requests and admins to manage the queue.
- Hosted support page remains linked from the Profile Policy and Support hub.

# TribeLog Admin Console Ops Plan

## Decision

Build admin operations into the existing web app first, not as a separate native app.

Why:

- Web is faster to ship and safer to iterate for internal operations.
- Firestore already has `/admins/{uid}` access control for privileged reads/writes.
- The consumer iOS and Android apps should stay clean for App Review and Play review.
- Moderation, support, account deletion review, store readiness, and partner/creator review tasks are operational workflows, not consumer app features.

## First Console Scope

The first admin console should action the queues that can block launch or review:

- Content reports from `contentReports`
- Support requests from `supportRequests`
- Account/data deletion review records from `accountDeletionRequests`

Allowed actions:

- Mark content reports as reviewing, resolved, dismissed, or remove eligible reported content.
- Mark support requests as waiting, resolved, or closed.
- Mark deletion requests as contacted, verified, blocked, or closed.
- Process verified deletion requests through the `processAccountDeletion` callable.
- Add a short manual review note and reviewer name.

Explicit non-goals:

- Do not process refunds.
- Do not cancel subscriptions.
- Do not grant paid access or write entitlements.
- Do not process account deletion before the request is marked verified.
- Do not expose private user data beyond what is required for review.

## Access Model

- A user is treated as an admin in the dedicated Admin tab only if `/admins/{uid}` exists.
- Firestore remains the real permission boundary through the same `/admins/{uid}` check.
- Existing profile-level admin/creator planning surfaces may still use profile flags, but operational queue actions should follow `/admins/{uid}`.
- Add or remove admins by managing `/admins/{uid}` from Firebase Console or trusted backend tooling.

## Current Implementation

- Web app shows an Admin tab only for admin-profile users.
- Admin tab loads and actions content reports, support requests, and account deletion requests.
- Verified deletion requests show a destructive "Process deletion" action that calls a backend function.
- `processAccountDeletion` checks `/admins/{uid}`, prevents self-deletion, writes an audit record, deletes private user data, removes the Firebase Auth account, and anonymizes shared records.
- Billing, refund, entitlement, and subscription cleanup remains outside the admin console.
- Firestore rules still enforce admin writes even if the UI is exposed.

## Next Admin Work

- Add search/filter by status, category, and user email.
- Add direct links to reported content/challenge context.
- Add an audit-log collection for every admin action.
- Add admin-only release checklist view for App Store, Play, and web launch readiness.
- Add a guided billing follow-up checklist for processed account deletion requests.

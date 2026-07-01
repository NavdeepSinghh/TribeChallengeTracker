# Claude Review Queue: Workouts Milestones

## Current Status

Claude file upload from Chrome is currently blocked by the Codex Chrome Extension permission:

```text
{"code":-32000,"message":"Not allowed"}
fileChooser.setFiles failed
```

Required user/browser action:

```text
To enable file upload, go to chrome://extensions in Chrome, click Details under the Codex extension, and enable "Allow access to file URLs." See [here](https://developers.openai.com/codex/app/chrome-extension#upload-files) for details.
```

## Review Order

1. Milestone 4: iOS Workouts Read-Only Library
2. Milestone 5: Android Workouts Read-Only Library
3. Milestone 6: Guided Workout MVP

## Zip Files To Upload

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/tribelog-workouts-milestone-4-ios-library-2026-06-30.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/tribelog-workouts-milestone-5-android-library-2026-06-30.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/tribelog-workouts-milestone-6-guided-workout-mvp-2026-06-30.zip
```

## Paste Prompt For Claude

```text
You are reviewing TribeLog Workouts Feature milestones for Navdeep.

Context:
- TribeLog is a fitness challenge tracker app.
- Positioning lock: Free forever, built by the tribe, for the tribe.
- Architecture lock: Firebase-first, backend-driven content, MVVM + Clean Architecture within the Workouts feature boundary.
- Platform parity target: Web, iOS, Android.
- Social model: private / tribe / public visibility, follow/unfollow, copy-with-attribution.
- Lottie + SVG asset strategy is already approved.

Review these attached zips in order:

1. Milestone 4: iOS Workouts Read-Only Library
2. Milestone 5: Android Workouts Read-Only Library
3. Milestone 6: Guided Workout MVP

For each milestone:
- Lead with verdict: APPROVED, APPROVED WITH REQUIRED FIXES, or BLOCKED.
- Separate blockers from nice-to-haves.
- Verify MVVM + Clean Architecture layer separation.
- Verify backend-driven content and cross-platform parity.
- Verify brand audit screenshots and UX states.
- Check TEST_REPORT.md and KNOWN_GAPS.md for honesty.

For M6 specifically:
- Decide whether M6 can be implementation-approved with `finishWorkoutSession` deployment as a release blocker.
- Decide whether iOS/Android direct HTTPS callable calls are acceptable or whether native Firebase Functions SDKs are required before release.
- Decide whether iOS/Android ViewModel/domain tests are required before M7.
- Confirm payload parity across Web/iOS/Android, especially `assetHashSnapshot`, duration, points, and completed-set filtering.

After review, provide:
1. Verdict per milestone
2. Required fix list
3. Whether Codex can proceed to M7
4. Copy-paste response for Codex
```

## Local Docs

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/milestone-4/CLAUDE_REVIEW_PACKET.md
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/milestone-5/CLAUDE_REVIEW_PACKET.md
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/milestone-6/CLAUDE_REVIEW_PACKET.md
```

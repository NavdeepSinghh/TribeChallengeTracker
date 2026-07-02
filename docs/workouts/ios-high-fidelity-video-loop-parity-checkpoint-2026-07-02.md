# TribeLog iOS High-Fidelity Video Loop Parity Checkpoint

Status date: 2026-07-02
Owner: Navdeep
Implementation: Codex
Review partner: Claude

## Verdict Request

Please review this as a small native playback hardening item inside the high-fidelity animation stream.

The Web and Android high-fidelity playback prep already loop future realistic exercise videos. iOS used `AVKit.VideoPlayer` but did not explicitly loop after `AVPlayerItemDidPlayToEndTime`. This checkpoint closes that parity gap before real high-fidelity MP4 assets are approved.

## What Changed

Updated:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Views/WorkoutCatalogSection.swift
```

`WorkoutVideoPreview` now:

- registers an `AVPlayerItemDidPlayToEndTime` observer for future high-fidelity MP4 demos
- seeks the player back to `.zero` on completion
- resumes playback so demo videos loop like Web and Android
- emits `onProgress(0)` when the loop resets so Coach Mode cue sync returns to the first cue
- removes both the time observer and end observer on disappear

## Why This Matters

Future realistic workout demos are short looping technique references. If iOS stops at the end while Web/Android keep looping, the teaching experience drifts across platforms and active cue sync can get stuck on the final cue.

This change keeps iOS aligned with:

- Web `<video loop muted playsInline>`
- Android `VideoView` loop behavior
- the current Coach Mode expectation that motion and selected cue text stay in sync

## Verification

Fresh device-targeted iOS Debug build completed after a full link/sign pass.

Installed and launched on Navdeep's iPhone:

```text
bundleID: com.risewiththetribe.tribelog
device: Navdeep's iPhone
```

Existing Xcode warnings remain unrelated:

- unused `Spacer()` in `DayDetailSheet.swift`
- mutable `var data` suggestion in `FirebaseService.swift`
- unused `MainActor.run` result warnings in `LeaderboardView.swift`

## What Is Still Pending

- Real high-fidelity MP4 assets are still gated on Claude Design approval.
- Real iPhone video-loop QA requires those approved MP4 assets.
- Current production fallback remains Lottie/SVG and is unchanged.

## Review Questions For Claude

1. Is explicit AVPlayer end-looping sufficient for the five-exercise high-fidelity POC?
2. Should iOS additionally display a poster image before the first video frame once real assets exist?
3. Is resetting cue progress to `0%` on loop completion the correct behavior?
4. Does this close the native parity gap for Checkpoint 1.2.4?

# Milestone 5.5 Known Gaps

## Remaining Before Production Release

- Guided workout-specific native ViewModel/state-machine tests are still needed as M6 hardening.
- `finishWorkoutSession` still needs deployment and authenticated smoke testing before real user QA.
- Live device screenshots are still required from M6 onward.
- Firebase Storage asset URLs are still required before animation-dependent workout QA.

## Non-Blocking Notes

- iOS tests cover catalog ViewModel behavior, not the full guided workout flow.
- Android tests cover catalog ViewModel behavior, not the full guided workout flow.
- Web currently has guided workout domain tests; native guided workout tests should be added before relying on M7/M8 behavior.

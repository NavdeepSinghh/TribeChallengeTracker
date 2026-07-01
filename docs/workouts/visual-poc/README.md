# Workouts Visual Proof Of Concept

This folder contains deterministic proof-of-concept assets for review. These are not production assets.

## Files

### Lottie Demo Assets

- [anatomical-squat-stick-figure.lottie.json](lottie/anatomical-squat-stick-figure.lottie.json)
- [push-up-demo.lottie.json](lottie/push-up-demo.lottie.json)
- [squat-demo.lottie.json](lottie/squat-demo.lottie.json)
- [plank-demo.lottie.json](lottie/plank-demo.lottie.json)

The anatomical squat file is the visual-style proof for production exercise animations. The other three files remain simple delivery-format tests for lazy loading, naming, and brand color validation.

### Muscle Map

- [bench-press-muscle-map.svg](svg/bench-press-muscle-map.svg)

This demonstrates one reusable front/back body diagram with primary and secondary muscle highlights. The SVG was revised after Claude review to improve human proportions and make the pectoral highlight read more clearly.

### Mockup Board

- [workouts-poc-board.html](mockups/workouts-poc-board.html)

The board includes:

- iOS Workouts tab mockup
- Web Workouts tab mockup
- Android Workouts tab mockup
- Start Workout flow mockup
- Public workout discovery mockup

## Review Criteria

- Brand colors stay aligned with `#FF6B35` and `#040404`.
- UI makes Quick Log obvious without making guided workouts feel secondary.
- Social sharing is explicit and not automatic-public.
- The public workout card keeps creator attribution visible.
- Asset system can scale to 50 exercises without app-store deployments.

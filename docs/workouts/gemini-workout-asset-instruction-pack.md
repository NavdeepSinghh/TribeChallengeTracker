# Gemini Workout Asset Instruction Pack

Status date: 2026-07-02
Owner: Navdeep
Product: TribeLog Workouts tab
Purpose: reusable instruction pack for generating premium workout visuals with Gemini.

## Why This Pack Exists

TribeLog is building the Workouts tab from a logger into a guided training experience. The app already has backend-driven exercises, guided sessions, muscle maps, rest timers, workout history, and social sharing. The next visual layer should make the workout detail and guided workout flow feel premium, clear, and motivating.

Gemini has already produced a strong visual direction for a squat-style workout image:

```text
/Users/navdeepsmacbook/Downloads/Gemini_Generated_Image_ozgugmozgugmozgu.png
```

That image works because it has:

- realistic adult body proportions
- dark training-studio atmosphere
- clear exercise posture
- tasteful muscle activation glow
- no app UI baked into the image
- no fake medical or transformation claim

Use that as the quality bar, but keep TribeLog's own product identity.

## Browser Terms Check And App-Use Decision

Checked in browser on 2026-07-02:

```text
Gemini browser app:
https://gemini.google.com/app

Gemini API Additional Terms:
https://ai.google.dev/gemini-api/terms

Google Terms of Service:
https://policies.google.com/terms

Google Generative AI Prohibited Use Policy:
https://policies.google.com/terms/generative-ai/use-policy

Google Nano Banana Pro / watermark guidance:
https://blog.google/innovation-and-ai/products/nano-banana-pro/
```

Decision:

```text
Yes, TribeLog can use Gemini-generated workout visuals in the app, provided each final asset passes the production checks below.
```

Why:

```text
Google's terms say some services allow users to generate original content and Google won't claim ownership over that generated content.
Gemini API terms say the developer is responsible for generated content use and must comply with applicable law.
Google's use policy requires respecting intellectual property/privacy rights and avoiding misleading health or expertise claims.
Google notes generated images include SynthID; free/Pro Gemini app generations may also include a visible Gemini sparkle watermark.
Google says visible watermark-free images are available for professional workflows through Google AI Ultra or Google AI Studio developer tooling.
```

Production requirements:

```text
Use Google AI Studio / Gemini API / eligible watermark-free generation flow for production assets where possible.
Do not ship visible Gemini sparkle marks, random logos, signatures, or generated brand marks.
Keep an internal provenance note for each final asset: prompt, date, tool/model, reviewer, approved file hash.
Do not use prompts that mention competitor apps, copyrighted character styles, athlete likenesses, celebrities, brand names, or proprietary anatomy art.
Do not use generated assets for medical, rehab, injury-treatment, diagnosis, or guaranteed health outcome claims.
Do not present AI-generated visuals as human-shot exercise photography.
```

Current sample image assessment:

```text
/Users/navdeepsmacbook/Downloads/Gemini_Generated_Image_ozgugmozgugmozgu.png

Resolution: 1408x768
Use: good visual direction and likely usable as an internal reference / POC hero.
Production caveat: bottom-right contains visible mark-like shapes. Regenerate watermark-free via AI Studio/eligible workflow, or remove/crop only after confirming this is allowed for the generation source used.
Production caveat: resize/crop to app targets before shipping, e.g. 1280x720 WebP for hero/poster use.
```

## TribeLog Brand Direction

Use this visual system for every generated asset:

```text
Background: near-black / dark studio, close to #040404
Brand orange: #FF6B35 for primary muscle glow
Secondary highlight: soft teal/cyan or soft salmon, lower intensity than primary
Lighting: subtle teal rim light, soft studio depth, no busy gym clutter
Mood: focused, premium, calm, trainer-like
Body: realistic adult athlete, athletic but not extreme, non-sexualized
Composition: mobile-first, centered, enough negative space for app UI overlays
```

Avoid:

```text
No logos
No watermarks
No generated text inside the image
No app UI inside the image
No timers or counters baked into the image
No social media icons or reaction buttons
No medical labels
No injury, rehab, treatment, diagnosis, pain-free, or guarantee claims
No before/after transformation imagery
No competitor app lookalike UI
No hypersexualized poses or exaggerated bodybuilder proportions
No cluttered commercial gym background
```

All words, labels, exercise names, timers, reps, sets, and cue text must stay in the TribeLog app layer.

## Required Asset Types

Gemini should create raster visual assets only. Codex will convert, compress, upload, and wire them into Firebase Storage.

### 1. Workouts Tab Hero

Purpose: top-of-tab visual that communicates guided training and muscle targeting.

Output:

```text
workouts/ui/v1/workouts-tab-hero.png
workouts/ui/v1/workouts-tab-hero.webp
```

Recommended size:

```text
1600x900 source PNG
1280x720 compressed WebP
```

Prompt:

```text
Create a premium hero image for the TribeLog Workouts tab.
Show a realistic adult athlete in a controlled strength-training pose inside a dark near-black studio. Use a subtle teal rim light and a tasteful #FF6B35 orange glow on the main working muscles. The image should feel like a guided trainer experience: focused, calm, technical, and motivating.
Composition must be mobile-first with the athlete centered and enough clean negative space around the subject for app UI overlays.
No text, no logo, no watermark, no app UI, no social media icons, no medical labels, no before/after claim.
```

### 2. Guided Workout Card Hero

Purpose: image shown in the guided workout entry point or "Start a session" area.

Output:

```text
workouts/ui/v1/guided-workout-card.png
workouts/ui/v1/guided-workout-card.webp
```

Recommended size:

```text
1600x900 source PNG
1280x720 compressed WebP
```

Prompt:

```text
Create a premium guided workout card image for TribeLog.
Show a realistic athlete preparing for a workout with subtle visual energy: a dumbbell, kettlebell, or bodyweight stance is acceptable. Use dark #040404 studio lighting, teal rim light, and #FF6B35 orange muscle glow only where it helps show movement intent.
The image should communicate "start a focused training session" without showing app UI.
No text, no logo, no watermark, no medical claims, no transformation claims.
```

### 3. Training Plan Category Images

Purpose: visual tiles for future plan categories.

Outputs:

```text
workouts/ui/v1/category-upper-body.png
workouts/ui/v1/category-lower-body.png
workouts/ui/v1/category-full-body.png
workouts/ui/v1/category-cardio.png
workouts/ui/v1/category-mobility.png
```

Recommended size:

```text
1024x1024 source PNG
800x800 compressed WebP
```

Prompt template:

```text
Create a square premium category image for TribeLog: {CATEGORY_NAME}.
Show one realistic athlete pose that clearly represents {CATEGORY_NAME}. Use a dark near-black studio, subtle teal rim light, and #FF6B35 orange glow on the relevant active muscle areas. Keep the body realistic, adult, athletic, and non-sexualized.
Leave the image clean with no text, no logo, no watermark, no app UI, no medical labels.
```

Category guidance:

```text
Upper Body: pressing or pulling pose, shoulders/chest/back visible.
Lower Body: squat or lunge pose, quads/glutes highlighted.
Full Body: loaded carry, kettlebell swing setup, or compound lift.
Cardio: treadmill, bike, rower, or running posture with lower-chain emphasis.
Mobility: stretch posture with subtle whole-body engagement.
```

### 4. Exercise Poster Frames

Purpose: primary visual in exercise detail and guided workout "Movement Coach" panel.

Output path:

```text
workouts/exercises/v2/{exerciseId}/poster.png
workouts/exercises/v2/{exerciseId}/poster.webp
```

Recommended size:

```text
1280x720 source PNG
1280x720 compressed WebP
```

Prompt template:

```text
Create one premium poster frame for TribeLog exercise: {EXERCISE_NAME}.
Show a realistic adult athlete performing the clearest teaching moment of the exercise. Use a dark near-black studio background, subtle teal rim light, and #FF6B35 orange glow on the primary target muscles. Secondary muscles may use a softer teal/cyan or salmon glow at lower opacity.
Camera: {CAMERA_ANGLE}.
Equipment: {EQUIPMENT}.
Primary muscles: {PRIMARY_MUSCLES}.
Secondary muscles: {SECONDARY_MUSCLES}.
Form priority: {FORM_PRIORITY}.
Keep the full body and all relevant equipment visible on mobile. Leave safe margins around hands, feet, head, and equipment. The image should be technically useful, not dramatic.
No text, no exercise name, no labels, no logo, no watermark, no app UI, no timer, no reps, no medical claims, no before/after transformation.
```

### 5. Exercise Phase Frames

Purpose: still frames for the guided workout cue sequence. These can later be used to create video, image sequences, or app cue cards.

Output paths:

```text
workouts/exercises/v2/{exerciseId}/phase-1-setup.png
workouts/exercises/v2/{exerciseId}/phase-2-working.png
workouts/exercises/v2/{exerciseId}/phase-3-finish.png
workouts/exercises/v2/{exerciseId}/phase-4-reset.png
```

Recommended size:

```text
1280x720 PNG
```

Prompt template:

```text
Create phase {PHASE_NUMBER} of 4 for TribeLog exercise: {EXERCISE_NAME}.
This phase is: {PHASE_NAME}.
Show the athlete in the exact body position for this phase, using the same visual style as the poster frame: dark #040404 studio, subtle teal rim light, realistic body proportions, #FF6B35 orange glow on primary muscles, softer secondary glow where useful.
Maintain consistent camera angle, athlete proportions, lighting, and equipment placement across all four phase frames.
No text, no labels, no logo, no watermark, no app UI, no timer, no social UI, no medical claims.
```

Phase meanings:

```text
setup: starting position, braced and ready
working: main effort or movement phase
finish: strongest completed position or target range
reset: controlled return or ready for next rep
```

### 6. Workout Completion Share Backgrounds

Purpose: clean visuals for generated share cards after a workout is completed.

Outputs:

```text
workouts/social/v1/share-strength.png
workouts/social/v1/share-cardio.png
workouts/social/v1/share-mobility.png
```

Recommended size:

```text
1080x1920 source PNG
1080x1920 compressed WebP
```

Prompt:

```text
Create a vertical background image for a TribeLog workout completion share card.
Theme: {STRENGTH_OR_CARDIO_OR_MOBILITY}.
Use a dark premium training-studio look, subtle teal rim light, and a restrained #FF6B35 orange energy glow. Leave large clean negative space in the center and bottom for the app to overlay workout stats and text.
No text, no logo, no watermark, no social media UI, no person if it would compete with overlay text.
```

## First POC Batch

Before generating all 50 assets, create a proof batch of five exercises:

```text
goblet_squat
push_up
lat_pulldown
romanian_deadlift
bulgarian_split_squat
```

These cover:

```text
loaded squat
bodyweight push
machine/cable pull
hip hinge
single-leg lower body
```

Do not scale to all exercises until the five POC outputs are reviewed.

## Full Exercise Asset List

Use these exact IDs and names.

| ID | Name | Primary | Secondary | Equipment | Level | Pattern |
|---|---|---|---|---|---|---|
| bench_press | Bench Press | chest | triceps, front_delts | barbell, bench | intermediate | push |
| dumbbell_bench_press | Dumbbell Bench Press | chest | triceps, front_delts | dumbbell, bench | beginner | push |
| incline_dumbbell_press | Incline Dumbbell Press | upper_chest | front_delts, triceps | dumbbell, incline_bench | intermediate | push |
| push_up | Push-Up | chest | triceps, front_delts, core | bodyweight | beginner | push |
| machine_chest_press | Machine Chest Press | chest | triceps, front_delts | machine | beginner | push |
| dumbbell_shoulder_press | Dumbbell Shoulder Press | shoulders | triceps, upper_chest | dumbbell | intermediate | push |
| lateral_raise | Lateral Raise | side_delts | upper_traps | dumbbell | beginner | push |
| dumbbell_chest_fly | Dumbbell Chest Fly | chest | front_delts | dumbbell, bench | intermediate | push |
| triceps_pushdown | Triceps Pushdown | triceps | forearms | cable | beginner | push |
| bench_dip | Bench Dip | triceps | chest, front_delts | bench, bodyweight | beginner | push |
| lat_pulldown | Lat Pulldown | lats | biceps, rhomboids, rear_delts | cable | beginner | pull |
| pull_up | Pull-Up | lats | biceps, rhomboids, rear_delts | pull_up_bar, bodyweight | intermediate | pull |
| assisted_pull_up | Assisted Pull-Up | lats | biceps, rhomboids | assisted_pull_up_machine | beginner | pull |
| seated_cable_row | Seated Cable Row | rhomboids, lats | biceps, rear_delts | cable | beginner | pull |
| one_arm_dumbbell_row | One-Arm Dumbbell Row | lats, rhomboids | biceps, rear_delts | dumbbell, bench | intermediate | pull |
| barbell_bent_over_row | Barbell Bent-Over Row | rhomboids, lats | biceps, rear_delts, core | barbell | intermediate | pull |
| face_pull | Face Pull | rear_delts | rhomboids, upper_traps | cable | beginner | pull |
| rear_delt_fly | Rear Delt Fly | rear_delts | rhomboids, upper_traps | dumbbell | beginner | pull |
| dumbbell_biceps_curl | Dumbbell Biceps Curl | biceps | forearms | dumbbell | beginner | pull |
| hammer_curl | Hammer Curl | biceps, forearms | none | dumbbell | beginner | pull |
| back_squat | Back Squat | quads, glutes | hamstrings, core | barbell, rack | intermediate | squat |
| goblet_squat | Goblet Squat | quads, glutes | hamstrings, core | dumbbell, kettlebell | beginner | squat |
| leg_press | Leg Press | quads, glutes | hamstrings | machine | beginner | squat |
| romanian_deadlift | Romanian Deadlift | hamstrings, glutes | lower_back | barbell, dumbbell | intermediate | hinge |
| conventional_deadlift | Conventional Deadlift | hamstrings, glutes | quads, lower_back, core | barbell | advanced | hinge |
| hip_thrust | Hip Thrust | glutes | hamstrings | barbell, bench | intermediate | hinge |
| walking_lunge | Walking Lunge | quads, glutes | hamstrings, calves | bodyweight, dumbbell | beginner | squat |
| bulgarian_split_squat | Bulgarian Split Squat | quads, glutes | hamstrings, core | bench, dumbbell | intermediate | squat |
| step_up | Step-Up | quads, glutes | hamstrings, calves | box, dumbbell | beginner | squat |
| leg_extension | Leg Extension | quads | none | machine | beginner | squat |
| seated_leg_curl | Seated Leg Curl | hamstrings | none | machine | beginner | hinge |
| standing_calf_raise | Standing Calf Raise | calves | none | machine, bodyweight | beginner | squat |
| glute_bridge | Glute Bridge | glutes | hamstrings, core | bodyweight | beginner | hinge |
| kettlebell_swing | Kettlebell Swing | glutes, hamstrings | core, lower_back | kettlebell | intermediate | hinge |
| plank | Plank | core | shoulders, glutes | bodyweight | beginner | core |
| side_plank | Side Plank | obliques | core, shoulders | bodyweight | intermediate | core |
| dead_bug | Dead Bug | core | hip_flexors, lower_back | bodyweight | beginner | core |
| bird_dog | Bird Dog | core | glutes, lower_back, shoulders | bodyweight | beginner | core |
| bicycle_crunch | Bicycle Crunch | obliques, core | hip_flexors | bodyweight | intermediate | core |
| hanging_knee_raise | Hanging Knee Raise | lower_abs | hip_flexors, forearms | pull_up_bar, bodyweight | intermediate | core |
| russian_twist | Russian Twist | obliques | core, hip_flexors | bodyweight, medicine_ball | beginner | core |
| mountain_climber | Mountain Climber | core, hip_flexors | shoulders, quads | bodyweight | beginner | core |
| treadmill_run | Treadmill Run | quads, hamstrings, calves | core, glutes | treadmill | beginner | cardio |
| incline_walk | Incline Walk | quads, glutes | calves, hamstrings, core | treadmill | beginner | cardio |
| stationary_bike | Stationary Bike | quads | hamstrings, calves, glutes | stationary_bike | beginner | cardio |
| rowing_machine | Rowing Machine | lats, rhomboids, hamstrings, glutes | biceps, core, calves | rowing_machine | intermediate | cardio |
| cat_cow | Cat-Cow | lower_back, core | shoulders, glutes | bodyweight, mat | beginner | mobility |
| downward_dog | Downward Dog | hamstrings, calves | shoulders, lats, lower_back | bodyweight, mat | beginner | mobility |
| childs_pose | Child's Pose | lats, lower_back | shoulders, glutes | bodyweight, mat | beginner | mobility |
| worlds_greatest_stretch | World's Greatest Stretch | hip_flexors | hamstrings, glutes, core, shoulders | bodyweight, mat | intermediate | mobility |

## Camera Guidance By Pattern

```text
push: front-three-quarter or side-three-quarter; show chest/shoulders/arms clearly
pull: back-three-quarter or front-three-quarter; show lats/upper back without hiding equipment
squat: side-three-quarter; show hips, knees, ankles, and torso angle
hinge: side-three-quarter; show hip hinge and neutral spine clearly
core: side or three-quarter depending on floor position
cardio: side-three-quarter; include machine only if it clarifies movement
mobility: side or three-quarter; prioritize stretch target and posture
```

## Batch Workflow

Generate in this order:

```text
POC Batch: goblet_squat, push_up, lat_pulldown, romanian_deadlift, bulgarian_split_squat
Batch 1: upper push
Batch 2: upper pull
Batch 3: lower body
Batch 4: core
Batch 5: cardio + mobility
```

For each batch, Gemini should return:

```text
1. Poster PNG for each exercise
2. Four phase PNGs for each exercise
3. A simple contact sheet / review board
4. Notes on any uncertain anatomy or equipment detail
```

Do not generate the next batch until the current batch is reviewed.

## Review Checklist

A Gemini output is acceptable only if:

```text
Primary muscle highlight is anatomically correct.
Secondary muscle highlight is lower intensity than primary.
Exercise posture is safe and recognizable.
Equipment is correct and not invented in a confusing way.
Full body and equipment fit in mobile crop.
There is no baked-in text or logo.
There is no watermark.
There is no competitor-style UI.
The image still works when cropped into a rounded mobile card.
The visual style matches the dark TribeLog brand.
```

Reject or regenerate if:

```text
Muscles glow in the wrong anatomical location.
Hands, feet, head, equipment, or joints are cropped.
The pose suggests unsafe form.
The body is sexualized or distorted.
The background is too busy.
The image contains text, labels, or fake app UI.
The image looks like a medical diagram instead of a workout coach visual.
```

## Master Prompt To Paste Into Gemini

Use this before asking for any specific asset:

```text
You are generating production candidate visual assets for TribeLog, a mobile-first fitness challenge and guided workout app.

Visual identity:
- near-black premium studio background close to #040404
- brand orange #FF6B35 for primary muscle activation glow
- subtle teal rim light for depth
- soft secondary muscle glow at lower opacity
- realistic adult athlete, athletic but non-sexualized
- clear exercise posture and equipment
- mobile-first composition with full body visible

Product rule:
The image must teach the workout visually. It should answer:
1. What movement is this?
2. Which muscles should the user feel?
3. What body position matters?

Hard restrictions:
No text, no labels, no exercise names, no logo, no watermark, no app UI, no timer, no reps, no social media UI, no medical claims, no injury claims, no before/after transformation, no competitor app UI, no hypersexualized body.

Output should be clean image content only. TribeLog will add all UI text, cue labels, timers, stats, and buttons in the app layer.
```

## Example Single-Exercise Prompt

```text
Create one premium poster frame for TribeLog exercise: Goblet Squat.
Show a realistic adult athlete holding a kettlebell at chest height in the bottom half of a controlled goblet squat. Camera is side-three-quarter. Keep the full body, feet, knees, hips, torso, head, and kettlebell visible on mobile.
Primary muscles: quads and glutes with tasteful #FF6B35 orange glow.
Secondary muscles: core and hamstrings with softer teal/salmon glow.
Form priority: chest tall, knees tracking over toes, hips descending between heels, no knee collapse.
Style: dark near-black studio, subtle teal rim light, premium trainer feel, realistic body proportions.
No text, no labels, no logo, no watermark, no app UI, no medical labels, no transformation claims.
```

## Handoff To Codex

After Gemini creates assets, Codex should:

```text
1. Save source PNGs under generated/workouts/high-fidelity/v2/{exerciseId}/
2. Convert approved poster images to WebP.
3. Compress to target size.
4. Upload approved assets to Firebase Storage.
5. Add or update mediaManifest paths only after review approval.
6. Keep existing Lottie/SVG assetManifest as fallback.
7. Run visual QA on Web, iOS, and Android before release.
```

Proposed final Storage convention:

```text
workouts/exercises/v2/{exerciseId}/poster.webp
workouts/exercises/v2/{exerciseId}/phase-1-setup.webp
workouts/exercises/v2/{exerciseId}/phase-2-working.webp
workouts/exercises/v2/{exerciseId}/phase-3-finish.webp
workouts/exercises/v2/{exerciseId}/phase-4-reset.webp
```

Optional later video convention:

```text
workouts/exercises/v2/{exerciseId}/demo.mp4
workouts/exercises/v2/{exerciseId}/demo.webm
```

## Product Note

Gemini visuals should make the Workouts tab feel premium, but they should not replace the product logic.

The app remains responsible for:

```text
exercise data
sets/reps/weight logging
rest timers
AI coaching text
history and PRs
social sharing
safe recommendation rules
```

The asset's job is visual clarity. The app's job is guidance, trust, and action.

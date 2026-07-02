# Guided Workout Suggestion Roadmap

## Core Product Principle

Guided Workout should evolve TribeLog from a workout logger into a session coach.

The first version guides the user after they choose a session. The next versions should help the user decide what to do before the session starts.

## Current State: User-Picked Guided Sessions

Today, guided workouts are user-selected.

```text
User opens Workouts
→ chooses exercises or a workout
→ starts a guided session
→ logs sets, reps, and weight
→ uses rest timer between sets
→ finishes workout
→ TribeLog records it automatically
```

This is valuable because it makes the workout easier to complete once the user has already decided what to train.

The limitation is that TribeLog is not yet answering the key question:

```text
What should I do today?
```

## Product Path

### Phase 1: Manual Guided Workout

Goal: Let users start and complete a structured workout session.

The user picks the exercises. TribeLog guides the flow.

```text
Pick exercises
→ Start workout
→ Follow exercise order
→ Watch movement demo
→ View muscle map
→ Log sets/reps/weight
→ Rest timer
→ Finish summary
→ Auto-log to TribeLog
```

This turns TribeLog from a simple activity log into a usable workout companion.

### Phase 2: Plan-Based Suggestions

Goal: Let users follow a training plan so TribeLog can surface today’s workout.

The user chooses a plan once. TribeLog then knows what to suggest each day.

```text
User chooses plan
→ Plan defines weekly schedule
→ TribeLog identifies today’s session
→ Workouts tab shows “Today’s Workout”
→ User taps Start
→ Guided workout begins
```

Example:

```text
Beginner Strength Foundation
├─ Day 1: Full body strength
├─ Day 2: Rest / mobility
├─ Day 3: Upper body
├─ Day 4: Rest
└─ Day 5: Lower body
```

The Workouts tab can then show:

```text
Today’s Workout
Upper Body Strength
6 exercises · 42 min · Beginner

Start Workout
```

This is the first real recommendation layer, but it stays simple and trustworthy because it comes from a plan the user chose.

### Phase 3: Backend Performance Summary

Goal: Build a trusted backend summary of how the user is performing before adding AI coaching language.

Inputs can include:

```text
User goal
Training level
Chosen training frequency
Completed workout history
Skipped sessions
Recent muscle groups trained
Volume trends
Personal records
Recovery signals, if available later
```

The backend should compute facts such as:

```text
Workouts completed this week
Plan adherence
Skipped sessions
Most trained muscle groups
Undertrained muscle groups
Weekly volume trend
Recent PRs
Session consistency
Suggested next workout from rules
```

This keeps the source of truth deterministic, testable, and safe.

Example backend summary:

```text
User trained 3 times this week.
Lower body was skipped twice.
Push volume is 40% higher than pull volume.
Squat improved by 5 kg compared with the last session.
Suggested next workout: Pull + Core.
Reason: Balance push/pull volume and avoid repeating lower body after missed sessions.
```

### Phase 4: AI-Assisted Coaching Insights

Goal: Use AI to explain performance and suggestions in a helpful, human way.

AI should not make decisions directly from raw data. Instead:

```text
Backend computes facts
→ Backend chooses safe candidate recommendations
→ AI turns the facts into clear coaching language
→ User keeps full control
```

Example AI output:

```text
Nice momentum this week. You trained 3 times and improved your squat by 5 kg.

Your push work is ahead of your pull work, so today I’d suggest Pull + Core.
It should take around 35-40 minutes and help balance the week.
```

AI can help with:

```text
Progress explanations
Workout recommendation summaries
Plan adherence feedback
Exercise substitution explanations
Weekly performance recaps
Motivational but honest coaching notes
```

AI should not:

```text
Diagnose injuries
Make medical claims
Use fake certainty
Pressure the user
Override the user’s choice
Create unsupported health claims
```

This should come after enough workout history exists to make suggestions feel earned, not random.

### Phase 5: Adaptive AI Coach

Goal: Let AI help personalize the plan experience while staying inside backend guardrails.

Possible features:

```text
Adjust next session difficulty
Suggest exercise substitutions
Explain why a plan should stay the same or change
Summarize weekly wins
Identify consistency patterns
Recommend deload or lighter sessions based on explicit app data
```

The AI coach should always work from approved backend summaries and safe recommendation candidates.

## Recommendation Philosophy

Suggestions should be helpful, not controlling.

TribeLog should always let the user:

```text
Start suggested workout
Swap exercises
Skip today
Choose a different workout
Quick log instead
```

The app should reduce decision fatigue without making the user feel trapped.

## AI Architecture Principle

AI should be the explanation layer, not the authority layer.

```text
Raw workout data
→ Backend aggregation
→ Rule-based recommendation candidates
→ AI coaching explanation
→ User chooses
```

This gives TribeLog the warmth of a coach without losing trust, testability, or safety.

## AI Provider Strategy

Use an AI provider abstraction in the backend so TribeLog is not locked into one model vendor.

Recommended V1 provider setup:

```text
Daily coach A/B test:
Gemini 2.5 Flash-Lite
DeepSeek V4 Flash

Deeper weekly review / plan adjustment:
DeepSeek V4 Pro

Ultra-cheap utility lane:
Groq Llama 3.1 8B or Groq GPT OSS 20B

Fallback provider:
OpenAI Responses API
```

Rationale:

```text
Gemini 2.5 Flash-Lite is the best default candidate for very cheap daily coaching cards.
DeepSeek V4 Flash is similarly cheap and should be A/B tested against Gemini for coaching tone.
DeepSeek V4 Pro is still inexpensive and better suited to deeper weekly reasoning.
Groq is extremely cheap and fast, but should start as a rewrite/summarization utility lane.
OpenAI remains useful as a fallback and quality benchmark for structured output reliability.
```

The client apps should never call AI providers directly.

```text
iOS / Web / Android
→ Firebase Callable Function
→ Backend Performance Summary Engine
→ Rule-Based Recommendation Engine
→ AI Provider Router
   ├─ Gemini 2.5 Flash-Lite
   ├─ DeepSeek V4 Flash
   ├─ DeepSeek V4 Pro
   ├─ Groq utility model
   └─ OpenAI fallback / benchmark
→ JSON Validator
→ Safety Filter
→ Firestore aiInsights
→ Client renders insight
```

### Provider Router Rules

The backend should choose the provider by task type, not by client platform.

```text
daily_workout_card
→ 50% Gemini 2.5 Flash-Lite
→ 50% DeepSeek V4 Flash

weekly_performance_review
→ DeepSeek V4 Pro
→ OpenAI fallback if JSON validity or quality drops

copy_rewrite / notification_copy / share_card_caption
→ Groq Llama 3.1 8B or Groq GPT OSS 20B

quality_benchmark_sample
→ OpenAI Responses API on a small percentage of requests
```

This keeps the expensive model usage small while still giving TribeLog a quality reference point.

### Provider Evaluation Metrics

The first 2-4 week AI rollout should compare Gemini 2.5 Flash-Lite vs DeepSeek V4 Flash on real but safe summarized workout payloads.

Measure:

```text
JSON schema validity
Safety filter pass/fail rate
Latency p50 / p95
Cost per generated insight
User taps Start Suggested Workout
User dismisses or swaps suggestion
Thumbs up / thumbs down on coaching card
Support complaints or confusing outputs
```

Winner becomes the default daily coach. The other remains a fallback.

### Cost Direction

Approximate per-insight payload:

```text
Input: 1,500 tokens
Output: 300 tokens
```

Gemini 2.5 Flash-Lite estimate:

```text
≈ $0.00027 per insight
≈ $0.80/month for 100 daily active users
≈ $8/month for 1,000 daily active users
≈ $81/month for 10,000 daily active users
```

DeepSeek V4 Flash estimate:

```text
≈ $0.00029 per insight
≈ $0.90/month for 100 daily active users
≈ $9/month for 1,000 daily active users
≈ $88/month for 10,000 daily active users
```

DeepSeek V4 Pro estimate:

```text
≈ $0.00091 per insight
≈ $2.75/month for 100 daily active users
≈ $27/month for 1,000 daily active users
≈ $274/month for 10,000 daily active users
```

Groq Llama 3.1 8B utility estimate:

```text
≈ $0.00010 per insight
≈ $0.30/month for 100 daily active users
≈ $3/month for 1,000 daily active users
≈ $30/month for 10,000 daily active users
```

These numbers assume one generated insight per active user per day and no extra retries. Actual cost should be controlled with caching and rate limits.

Pricing should be re-checked immediately before launch because AI model pricing changes often.

### Cost Controls

```text
Generate at most one daily insight per user.
Cache AI output in Firestore.
Regenerate only after workout completion or next day.
Use weekly batch jobs for deeper recaps.
Run Gemini Flash-Lite vs DeepSeek Flash as the daily coach A/B test.
Use DeepSeek V4 Pro only for deeper weekly review.
Use Groq only for cheap utility tasks unless coaching quality is proven.
Keep OpenAI as a fallback and benchmark, not the default.
Set provider-level monthly budgets.
Add per-user rate limits.
Log token usage per insight.
```

### Privacy Rule

Only send summarized workout facts to the AI provider.

Allowed payload:

```text
3 workouts this week
push volume high
pull volume low
1 squat PR
goal = strength
suggested next workout = Pull + Core
```

Avoid sending:

```text
Full name
Email
Raw health records
Sensitive medical notes
Location
Private social data
Any unnecessary personally identifiable information
```

The AI prompt should receive enough context to explain the recommendation, not enough context to reconstruct the user’s private profile.

## Roadmap Summary

```text
Phase 1
Manual guided workout
User decides what to train.

Phase 2
Plan-based workout suggestions
User follows a plan, TribeLog suggests today’s session.

Phase 3
Backend performance summary
TribeLog computes trusted facts about history, progress, adherence, and balance.

Phase 4
AI-assisted coaching insights
AI explains the backend facts and suggested next action in plain language.

Phase 5
Adaptive AI coach
AI helps personalize plan adjustments and substitutions within backend guardrails.
```

## Product North Star

The ideal Workouts tab should eventually answer:

```text
What should I do today?
Why should I do it?
How do I do it well?
What did I achieve?
```

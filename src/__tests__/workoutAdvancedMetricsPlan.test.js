import {
  bucketPublicWorkoutMetric,
  buildWorkoutInsightPrivacySummary,
  countSessionsForExercise,
  countTrainingWeeks,
  countTrainingWeeksForExercise,
  evaluateWorkoutInsightReadiness,
  WORKOUT_INSIGHT_FEATURE_IDS,
} from "../workouts/domain/workoutInsightMetrics";

const fs = require("fs");
const path = require("path");
const {
  validateAdvancedMetricsPlan,
} = require("../../scripts/validate-workout-advanced-metrics-plan");

const repoRoot = path.resolve(__dirname, "../..");

const sessions = [
  {
    id: "s1",
    status: "completed",
    dateStr: "2026-07-01",
    totalVolumeKg: 1200,
    exercises: [{ exerciseId: "bench_press" }],
  },
  {
    id: "s2",
    status: "completed",
    dateStr: "2026-07-03",
    totalVolumeKg: 1600,
    exercises: [{ exerciseId: "bench_press" }],
  },
  {
    id: "s3",
    status: "completed",
    dateStr: "2026-07-05",
    totalVolumeKg: 1800,
    exercises: [{ exerciseId: "goblet_squat" }],
  },
];

const overloadReadySessions = [
  {
    id: "b1",
    status: "completed",
    dateStr: "2026-07-01",
    exercises: [{ exerciseId: "bench_press" }],
  },
  {
    id: "b2",
    status: "completed",
    dateStr: "2026-07-03",
    exercises: [{ exerciseId: "bench_press" }],
  },
  {
    id: "b3",
    status: "completed",
    dateStr: "2026-07-08",
    exercises: [{ exerciseId: "bench_press" }],
  },
  {
    id: "b4",
    status: "completed",
    dateStr: "2026-07-10",
    exercises: [{ exerciseId: "bench_press" }],
  },
];

describe("advanced workout metrics plan", () => {
  it("validates the draft Phase 3 vote and metrics plan", () => {
    const plan = JSON.parse(fs.readFileSync(path.join(repoRoot, "scripts/workout-advanced-metrics-plan.json"), "utf8"));
    const validated = validateAdvancedMetricsPlan(plan);

    expect(validated.status).toBe("draft_pending_tribe_vote");
    expect(validated.voteOptions.map(option => option.id)).toEqual([
      "muscle_volume_heat_map",
      "progressive_overload_suggestions",
      "expanded_exercise_library",
      "shareable_workout_cards",
    ]);
    expect(validated.metrics).toHaveLength(4);
  });

  it("rejects unsupported medical-style claims in vote options", () => {
    const plan = JSON.parse(fs.readFileSync(path.join(repoRoot, "scripts/workout-advanced-metrics-plan.json"), "utf8"));
    plan.voteOptions[0].description = "Diagnose injury risk from your training.";

    expect(() => validateAdvancedMetricsPlan(plan)).toThrow(/unsupported health or medical claim/i);
  });

  it("rejects too-loose progressive overload thresholds", () => {
    const plan = JSON.parse(fs.readFileSync(path.join(repoRoot, "scripts/workout-advanced-metrics-plan.json"), "utf8"));
    const overloadOption = plan.voteOptions.find(option => option.id === "progressive_overload_suggestions");
    overloadOption.minimumData.sessions_per_exercise = 2;

    expect(() => validateAdvancedMetricsPlan(plan)).toThrow(/sessions_per_exercise must be at least 4/i);
  });
});

describe("workout insight readiness", () => {
  it("requires enough completed sessions before showing muscle volume heat maps", () => {
    expect(evaluateWorkoutInsightReadiness("muscle_volume_heat_map", { sessions: sessions.slice(0, 2) })).toMatchObject({
      ready: false,
      copy: "Log a few more workouts to unlock your first weekly muscle map.",
    });
    expect(evaluateWorkoutInsightReadiness("muscle_volume_heat_map", { sessions })).toMatchObject({
      ready: true,
      copy: "Ready to show.",
    });
  });

  it("requires repeated exercise history before overload suggestions", () => {
    expect(evaluateWorkoutInsightReadiness("progressive_overload_suggestions", {
      sessions: overloadReadySessions,
      exerciseId: "bench_press",
    })).toMatchObject({ ready: true });

    expect(evaluateWorkoutInsightReadiness("progressive_overload_suggestions", {
      sessions: sessions.slice(0, 2),
      exerciseId: "bench_press",
    })).toMatchObject({
      ready: false,
      copy: "Log this exercise across a couple of weeks before TribeLog suggests the next step.",
    });

    expect(evaluateWorkoutInsightReadiness("progressive_overload_suggestions", {
      sessions: overloadReadySessions.slice(0, 3),
      exerciseId: "bench_press",
    })).toMatchObject({
      ready: false,
      copy: "Log this exercise across a couple of weeks before TribeLog suggests the next step.",
    });
  });

  it("counts weeks and per-exercise sessions from completed sessions only", () => {
    const mixedSessions = [
      ...sessions,
      { id: "draft", status: "draft", dateStr: "2026-07-12", exercises: [{ exerciseId: "bench_press" }] },
    ];

    expect(countTrainingWeeks(mixedSessions)).toBe(countTrainingWeeks(sessions));
    expect(countSessionsForExercise(mixedSessions, "bench_press")).toBe(2);
    expect(countTrainingWeeksForExercise(overloadReadySessions, "bench_press")).toBe(2);
  });

  it("buckets public metrics and documents privacy posture", () => {
    expect(bucketPublicWorkoutMetric("weekly_muscle_volume_kg", 2764)).toBe(2800);
    expect(bucketPublicWorkoutMetric("duration_minutes", 33)).toBe(35);
    expect(buildWorkoutInsightPrivacySummary("shareable_workout_cards")).toContain("explicit share");
    expect(buildWorkoutInsightPrivacySummary("shareable_workout_cards")).toContain("outside TribeLog");
    expect(WORKOUT_INSIGHT_FEATURE_IDS).toContain("expanded_exercise_library");
  });
});

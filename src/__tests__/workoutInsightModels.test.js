import {
  buildMuscleHeatMapRegions,
  buildMuscleVolumeInsight,
  buildProgressionInsightCopy,
  mapWorkoutInsightAggregateDocument,
  mapWorkoutProgressionSuggestionDocument,
  selectProgressionExerciseCandidate,
} from "../workouts/domain/workoutInsightModels";

describe("workout insight models", () => {
  it("maps progression suggestions into conservative UI data", () => {
    const suggestion = mapWorkoutProgressionSuggestionDocument("bench_press", {
      status: "ready",
      level: "intermediate",
      observedSessions: 5,
      observedTrainingWeeks: 3,
      latestBestSet: { reps: 10, weightKg: 62.5 },
      previousBestSet: { reps: 9, weightKg: 62.5 },
      suggestion: { type: "weight", targetReps: 10, targetWeightKg: 65 },
      explanation: "Try a small weight increase and keep the reps controlled.",
    });

    expect(suggestion).toMatchObject({
      exerciseId: "bench_press",
      status: "ready",
      suggestion: { targetWeightKg: 65, targetReps: 10, type: "weight" },
    });
    expect(buildProgressionInsightCopy({
      candidate: { exerciseId: "bench_press", name: "Bench Press" },
      suggestion,
    })).toMatchObject({
      title: "Bench Press: 65 kg x 10",
      actionLabel: "Refresh suggestion",
    });
  });

  it("selects a repeated exercise candidate from existing history without fetching history again", () => {
    const sessions = [
      {
        status: "completed",
        dateStr: "2026-07-01",
        exercises: [
          { exerciseId: "bench_press", name: "Bench Press", volumeKg: 1800 },
          { exerciseId: "lat_pulldown", name: "Lat Pulldown", volumeKg: 1200 },
        ],
      },
      {
        status: "completed",
        dateStr: "2026-07-02",
        exercises: [
          { exerciseId: "bench_press", name: "Bench Press", volumeKg: 1900 },
        ],
      },
    ];

    expect(selectProgressionExerciseCandidate(sessions, [])).toMatchObject({
      exerciseId: "bench_press",
      name: "Bench Press",
    });
  });

  it("maps muscle volume aggregates and adds relative intensity for heat-map UI", () => {
    const aggregate = mapWorkoutInsightAggregateDocument("weekly_2026-W27", {
      periodKey: "2026-W27",
      sessionCount: 4,
      totalVolumeKg: 3200,
      muscles: {
        chest: { muscle: "chest", volumeKg: 1200, setCount: 8 },
        quads: { muscle: "quads", volumeKg: 2400, setCount: 12 },
      },
    });
    const insight = buildMuscleVolumeInsight(aggregate);

    expect(insight.topMuscles.map(muscle => muscle.muscle)).toEqual(["quads", "chest"]);
    expect(insight.maxVolumeKg).toBe(2400);
    expect(insight.topMuscles[0].intensity).toBe(1);
    expect(insight.topMuscles[1].intensity).toBe(0.5);
  });

  it("groups muscle volume into anatomical heat-map regions", () => {
    const aggregate = mapWorkoutInsightAggregateDocument("weekly_2026-W27", {
      muscles: {
        upper_chest: { muscle: "upper_chest", volumeKg: 800, setCount: 6 },
        chest: { muscle: "chest", volumeKg: 700, setCount: 5 },
        quads: { muscle: "quads", volumeKg: 2400, setCount: 12 },
        hamstrings: { muscle: "hamstrings", volumeKg: 1200, setCount: 8 },
      },
    });

    const regions = buildMuscleHeatMapRegions(aggregate);

    expect(regions.map(region => region.region)).toEqual(["quads", "chest", "hamstrings"]);
    expect(regions.find(region => region.region === "chest")).toMatchObject({
      label: "Chest",
      volumeKg: 1500,
      setCount: 11,
      view: "front",
    });
    expect(regions[0].intensity).toBe(1);
    expect(regions.find(region => region.region === "hamstrings").view).toBe("back");
  });

  it("keeps insufficient-data progression copy transparent", () => {
    const copy = buildProgressionInsightCopy({
      candidate: { exerciseId: "push_up", name: "Push-Up" },
      suggestion: mapWorkoutProgressionSuggestionDocument("push_up", {
        status: "insufficient_data",
        observedSessions: 1,
        explanation: "Log this exercise across a couple of weeks before TribeLog suggests the next step.",
      }),
    });

    expect(copy.title).toContain("needs more history");
    expect(copy.body).toContain("couple of weeks");
  });
});

import {
  buildVolumeTrend,
  mapExercisePrDocument,
  mapWorkoutSessionDocument,
  summarizeWorkoutHistory,
} from "../workouts/domain/workoutHistoryModels";
import {
  GetWorkoutHistorySummaryUseCase,
  GetWorkoutVolumeTrendUseCase,
  LoadWorkoutHistoryUseCase,
  LoadWorkoutPersonalRecordsUseCase,
} from "../workouts/domain/workoutHistoryUseCases";

describe("workout history models", () => {
  it("maps trusted finished session mirror fields for history UI", () => {
    const session = mapWorkoutSessionDocument("session-1", {
      name: "Upper Body",
      source: "guided",
      status: "completed",
      dateStr: "2026-07-01",
      durationSeconds: 1800,
      totalVolumeKg: 2400,
      activityLogId: "activity-1",
      feedId: "feed-1",
      publicWorkoutId: "public-1",
      exercises: [
        {
          exerciseId: "bench_press",
          nameSnapshot: "Bench Press",
          primaryMusclesSnapshot: ["chest"],
          assetHashSnapshot: "bench-v1",
          sets: [{ setNumber: 1, reps: 10, weightKg: 60, completedAt: "2026-07-01T00:00:00Z" }],
        },
      ],
    });

    expect(session).toMatchObject({
      id: "session-1",
      name: "Upper Body",
      source: "guided",
      feedId: "feed-1",
      publicWorkoutId: "public-1",
      exerciseCount: 1,
    });
    expect(session.exercises[0]).toMatchObject({
      exerciseId: "bench_press",
      bestWeightKg: 60,
      volumeKg: 600,
      assetHashSnapshot: "bench-v1",
    });
  });

  it("summarizes sessions, PRs, feed mirrors, and volume trend", () => {
    const sessions = [
      mapWorkoutSessionDocument("a", { status: "completed", dateStr: "2026-06-29", totalVolumeKg: 1000, durationSeconds: 1200, feedId: "feed-a" }),
      mapWorkoutSessionDocument("b", { status: "completed", dateStr: "2026-07-01", totalVolumeKg: 1600, durationSeconds: 1800 }),
    ];
    const prs = [
      mapExercisePrDocument("bench_press", { bestWeightKg: 60, bestEstimatedOneRepMaxKg: 80 }),
    ];

    expect(summarizeWorkoutHistory(sessions, prs)).toMatchObject({
      sessionCount: 2,
      totalVolumeKg: 2600,
      totalDurationMinutes: 50,
      personalRecordCount: 1,
      mirroredToFeed: 1,
    });
    expect(buildVolumeTrend(sessions)).toEqual([
      { id: "a", label: "06-29", volumeKg: 1000 },
      { id: "b", label: "07-01", volumeKg: 1600 },
    ]);
  });
});

describe("workout history use cases", () => {
  it("loads history and PRs through repository contracts", async () => {
    const repository = {
      listCompletedSessions: jest.fn(async () => [{ id: "session" }]),
      listPersonalRecords: jest.fn(async () => [{ exerciseId: "squat" }]),
    };

    await expect(new LoadWorkoutHistoryUseCase(repository).execute({ limit: 4 })).resolves.toEqual([{ id: "session" }]);
    await expect(new LoadWorkoutPersonalRecordsUseCase(repository).execute()).resolves.toEqual([{ exerciseId: "squat" }]);
    expect(repository.listCompletedSessions).toHaveBeenCalledWith({ limit: 4 });
  });

  it("keeps summary and trend pure for ViewModels", () => {
    const sessions = [mapWorkoutSessionDocument("s1", { status: "completed", dateStr: "2026-07-01", totalVolumeKg: 900 })];
    const summary = new GetWorkoutHistorySummaryUseCase().execute({ sessions, personalRecords: [] });
    const trend = new GetWorkoutVolumeTrendUseCase().execute({ sessions });

    expect(summary.sessionCount).toBe(1);
    expect(trend[0]).toMatchObject({ id: "s1", volumeKg: 900 });
  });
});

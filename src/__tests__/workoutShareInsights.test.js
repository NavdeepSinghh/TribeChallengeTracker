import {
  buildMuscleVolumeShareCard,
  buildPersonalRecordShareCard,
  buildWorkoutShareCaption,
  buildWorkoutSummaryShareCard,
  publicWorkoutTrendScore,
  rankPublicWorkoutDiscovery,
} from "../workouts/domain/workoutShareInsights";

describe("workout share insight cards", () => {
  it("builds workout summary cards as explicit private previews", () => {
    const card = buildWorkoutSummaryShareCard({
      profile: { displayName: "Navdeep" },
      session: {
        name: "Upper Body",
        dateStr: "2026-07-01",
        exerciseCount: 3,
        durationMinutes: 42,
        totalVolumeKg: 2764,
        points: 65,
        exercises: [
          { nameSnapshot: "Bench Press" },
          { nameSnapshot: "Lat Pulldown" },
        ],
        privateNotes: "Do not share me",
      },
    });

    expect(card).toMatchObject({
      type: "workout_summary",
      title: "Upper Body",
      subtitle: "3 exercises · 42 min",
      ownerDisplayName: "Navdeep",
      dateLabel: "07-01",
      privacy: {
        previewOnly: true,
        requiresExplicitShare: true,
      },
    });
    expect(card.metrics[0]).toEqual({ label: "Volume", value: "2800 kg" });
    expect(JSON.stringify(card)).not.toContain("Do not share me");
  });

  it("rounds muscle volume card values and excludes source session ids", () => {
    const card = buildMuscleVolumeShareCard({
      profile: { displayName: "Navdeep" },
      aggregate: {
        periodKey: "2026-W27",
        sourceSessionIds: ["private-session"],
        muscles: {
          chest: { muscle: "chest", volumeKg: 1510, sourceSessionIds: ["private-session"] },
          quads: { muscle: "quads", volumeKg: 2401 },
        },
      },
    });

    expect(card).toMatchObject({
      type: "muscle_volume",
      title: "Weekly muscle volume",
      subtitle: "2026-W27",
      privacy: {
        roundedValues: true,
        requiresExplicitShare: true,
      },
    });
    expect(card.metrics[0]).toEqual({ label: "quads", value: "2400 kg" });
    expect(JSON.stringify(card)).not.toContain("private-session");
  });

  it("builds PR cards without exact timestamps or private notes", () => {
    const card = buildPersonalRecordShareCard({
      profile: { displayName: "Navdeep" },
      exerciseName: "Bench Press",
      pr: {
        bestWeightKg: 80,
        bestEstimatedOneRepMaxKg: 100,
        updatedAt: "2026-07-01T10:00:00Z",
      },
    });

    expect(card).toMatchObject({
      type: "personal_record",
      title: "New PR",
      subtitle: "Bench Press",
    });
    expect(JSON.stringify(card)).not.toContain("2026-07-01T10:00:00Z");
  });

  it("filters unsafe claim wording from share captions", () => {
    const card = buildWorkoutSummaryShareCard({
      session: {
        name: "Injury Cure Workout",
        durationMinutes: 30,
        totalVolumeKg: 1000,
      },
    });

    expect(card.title).toBe("Workout complete");
    expect(buildWorkoutShareCaption(card)).toContain("Logged with TribeLog.");
  });
});

describe("public workout discovery ranking", () => {
  it("scores and ranks public workouts without exposing private workouts", () => {
    const now = new Date("2026-07-01T12:00:00Z");
    const ranked = rankPublicWorkoutDiscovery([
      {
        id: "old_popular",
        visibility: "public",
        copiedCount: 7,
        reactionCounts: { fire: 2 },
        publishedAt: "2026-06-30T12:00:00Z",
      },
      {
        id: "fresh",
        visibility: "public",
        copiedCount: 1,
        reactionCounts: { fire: 1 },
        publishedAt: "2026-07-01T11:00:00Z",
      },
      {
        id: "private",
        visibility: "private",
        copiedCount: 100,
      },
    ], now);

    expect(ranked.map(workout => workout.id)).toEqual(["old_popular", "fresh"]);
    expect(ranked[0].trendScore).toBeGreaterThan(ranked[1].trendScore);
    expect(publicWorkoutTrendScore(ranked[1], now)).toBe(ranked[1].trendScore);
  });
});

import {
  mapPublicWorkoutDocument,
  publicWorkoutSummary,
  sortPublicWorkouts,
} from "../workouts/domain/workoutSocialModels";
import {
  CopyPublicWorkoutUseCase,
  LoadPublicWorkoutsUseCase,
  ToggleWorkoutCreatorFollowUseCase,
} from "../workouts/domain/workoutSocialUseCases";

describe("workouts social discovery", () => {
  it("maps public workout documents into safe discovery cards", () => {
    const workout = mapPublicWorkoutDocument("public_1", {
      ownerUid: "creator_1",
      ownerDisplayName: " Nav ",
      visibility: "public",
      name: " Upper Body ",
      summary: "",
      totalVolumeKg: 2400.5,
      durationSeconds: 1500,
      copiedCount: 4,
      reactionCounts: { fire: 2 },
      exercises: [
        {
          exerciseId: "bench_press",
          name: "Bench Press",
          primaryMuscles: ["chest"],
          setCount: 3,
          repSummary: "3 sets · 8-10 reps",
          bestWeightKg: 80,
        },
      ],
    });

    expect(workout).toMatchObject({
      id: "public_1",
      publicWorkoutId: "public_1",
      ownerUid: "creator_1",
      ownerDisplayName: "Nav",
      name: "Upper Body",
      exerciseCount: 1,
      totalVolumeKg: 2400.5,
      copiedCount: 4,
      reactionCounts: { fire: 2 },
    });
    expect(workout.exercises[0]).toMatchObject({
      exerciseId: "bench_press",
      name: "Bench Press",
      repSummary: "3 sets · 8-10 reps",
    });
    expect(publicWorkoutSummary(workout)).toBe("1 exercise · 25 min");
  });

  it("sorts public workouts by publish time then date", () => {
    const workouts = [
      mapPublicWorkoutDocument("a", { ownerUid: "a", publishedAt: "2026-06-29T00:00:00.000Z", dateStr: "2026-06-29" }),
      mapPublicWorkoutDocument("b", { ownerUid: "b", publishedAt: "2026-07-01T00:00:00.000Z", dateStr: "2026-07-01" }),
      mapPublicWorkoutDocument("c", { ownerUid: "c", dateStr: "2026-06-30" }),
    ];

    expect(sortPublicWorkouts(workouts).map(workout => workout.id)).toEqual(["b", "a", "c"]);
  });

  it("delegates social use cases to the repository", async () => {
    const repository = {
      fetchPublicWorkouts: jest.fn().mockResolvedValue([
        { publicWorkoutId: "older", id: "older", visibility: "public", copiedCount: 10, publishedAt: "2026-06-30T00:00:00.000Z" },
        { publicWorkoutId: "fresh", id: "fresh", visibility: "public", copiedCount: 1, reactionCounts: { fire: 1 }, publishedAt: new Date().toISOString() },
      ]),
      copyPublicWorkout: jest.fn().mockResolvedValue({ templateId: "template_1" }),
      followCreator: jest.fn().mockResolvedValue("following"),
      unfollowCreator: jest.fn().mockResolvedValue("none"),
    };

    const ranked = await new LoadPublicWorkoutsUseCase(repository).execute({ limit: 3 });
    expect(ranked.map(workout => workout.publicWorkoutId)).toEqual(["older", "fresh"]);
    expect(ranked[0].trendScore).toBeGreaterThan(ranked[1].trendScore);
    await expect(new CopyPublicWorkoutUseCase(repository).execute("public_1")).resolves.toEqual({ templateId: "template_1" });
    await expect(new ToggleWorkoutCreatorFollowUseCase(repository).execute({ ownerUid: "creator_1" }, "none")).resolves.toBe("following");
    await expect(new ToggleWorkoutCreatorFollowUseCase(repository).execute({ ownerUid: "creator_1" }, "following")).resolves.toBe("none");

    expect(repository.fetchPublicWorkouts).toHaveBeenCalledWith({ limit: 3 });
    expect(repository.copyPublicWorkout).toHaveBeenCalledWith("public_1");
    expect(repository.followCreator).toHaveBeenCalledWith({ ownerUid: "creator_1" });
    expect(repository.unfollowCreator).toHaveBeenCalledWith("creator_1");
  });
});

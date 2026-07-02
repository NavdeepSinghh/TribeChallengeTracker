import { retryAfterSeconds } from "../workouts/presentation/useWorkoutInsightsViewModel";

describe("workout insights ViewModel helpers", () => {
  it("prefers structured callable retry metadata over message parsing", () => {
    expect(retryAfterSeconds({
      details: { retryAfterSeconds: 45 },
      message: "Different copy with no seconds pattern",
    })).toBe(45);
  });

  it("falls back to legacy retry message parsing", () => {
    expect(retryAfterSeconds({
      message: "Try again in 31 seconds.",
    })).toBe(31);
  });

  it("returns zero when no retry metadata is available", () => {
    expect(retryAfterSeconds({
      message: "Please wait before trying again.",
    })).toBe(0);
  });
});

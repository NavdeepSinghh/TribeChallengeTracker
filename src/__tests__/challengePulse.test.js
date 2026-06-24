const { buildChallengePulse } = require("../challengeTracker/challengePulse");

describe("challenge pulse", () => {
  it("turns numeric challenge tasks into simple totals", () => {
    const tasks = [
      { id: "workout", label: "Workout - 45 min", emoji: "💪" },
      { id: "water", label: "3 L of water drunk", emoji: "💧" },
      { id: "steps", label: "8k steps walked", emoji: "👟" },
      { id: "proof", label: "Progress proof logged", emoji: "📸" },
    ];
    const progress = {
      "2026-06-20": { completedTasks: ["workout", "water", "steps", "proof"], allComplete: true, points: 60 },
      "2026-06-21": { completedTasks: ["workout", "water"], allComplete: false, points: 20 },
    };

    const pulse = buildChallengePulse({ tasks, progress });

    expect(pulse.metrics).toEqual(expect.arrayContaining([
      expect.objectContaining({ label: "WORKOUT", value: "1.5h" }),
      expect.objectContaining({ label: "STEPS", value: "8k" }),
      expect.objectContaining({ label: "WATER", value: "6 L" }),
      expect.objectContaining({ label: "CHALLENGE PTS", value: "80" }),
    ]));
    expect(pulse.focus).toEqual(expect.arrayContaining(["movement", "water", "steps", "check-ins"]));
    expect(pulse.hasLogs).toBe(true);
  });

  it("falls back to check-in counts when tasks do not include quantities", () => {
    const tasks = [
      { id: "movement", label: "Intentional movement completed", emoji: "🏃" },
      { id: "hydration", label: "Hydration target hit", emoji: "💧" },
      { id: "support", label: "Encouraged the tribe", emoji: "📣" },
    ];
    const progress = {
      "2026-06-20": { completedTasks: ["movement", "hydration"], allComplete: false, points: 20 },
    };

    const pulse = buildChallengePulse({ tasks, progress });

    expect(pulse.metrics).toEqual(expect.arrayContaining([
      expect.objectContaining({ label: "SESSIONS", value: "1" }),
      expect.objectContaining({ label: "HYDRATION", value: "1" }),
      expect.objectContaining({ label: "CHALLENGE PTS", value: "20" }),
    ]));
  });
});

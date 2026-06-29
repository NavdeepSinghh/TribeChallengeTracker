const {
  buildCustomChallengeRules,
  normalizeCustomChallengeSettings,
} = require("../challenges/customChallengeModel");

describe("custom challenge model", () => {
  it("normalizes custom tasks, reminders, and community settings", () => {
    const settings = normalizeCustomChallengeSettings({
      duration: "14",
      description: "  Pull day accountability   ",
      tasks: [
        {
          id: "pullups",
          label: "Pull-ups or lat pulldowns",
          emoji: "💪",
          type: "sessions",
          targetValue: "3",
          unit: "sets",
          frequency: "weekly",
          points: "45",
        },
      ],
      reminders: { enabled: true, timeOfDay: "18:30", onlyIfNotLogged: true },
      community: { announcementsEnabled: true, memberMessagesEnabled: true },
    });

    expect(settings.duration).toBe(14);
    expect(settings.tasks[0]).toMatchObject({
      id: "pullups",
      label: "Pull-ups or lat pulldowns",
      targetValue: 3,
      unit: "sets",
      frequency: "weekly",
      points: 45,
      required: true,
    });
    expect(settings.reminders.timeOfDay).toBe("18:30");
    expect(settings.community.memberMessagesEnabled).toBe(true);
  });

  it("builds readable challenge rules from multiple custom tasks", () => {
    const settings = normalizeCustomChallengeSettings({
      tasks: [
        { label: "Walk", emoji: "👟", type: "steps", targetValue: 8000, unit: "steps", frequency: "daily", points: 30 },
        { label: "Water", emoji: "💧", type: "water", targetValue: 2.5, unit: "L", frequency: "daily", points: 20 },
      ],
    });

    expect(buildCustomChallengeRules(settings.tasks)).toEqual([
      "👟 Walk: 8000 steps daily for 30 pts.",
      "💧 Water: 2.5 L daily for 20 pts.",
    ]);
  });
});

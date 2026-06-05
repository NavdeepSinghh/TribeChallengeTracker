const { deriveChallengeBadgeStats } = require("../challengeStats");

describe("challenge badge stats", () => {
  it("derives completed and champion counts from member progress", () => {
    const challenges = [
      { id: "reset", duration: 7, status: "active", endDate: "2026-06-20" },
      { id: "soft", duration: 30, status: "completed", endDate: "2026-05-01" },
    ];
    const membersByChallenge = {
      reset: [
        { uid: "me", totalPoints: 120, daysCompleted: 7, longestStreak: 7 },
        { uid: "friend", totalPoints: 100, daysCompleted: 6, longestStreak: 6 },
      ],
      soft: [
        { uid: "friend", totalPoints: 500, daysCompleted: 30, longestStreak: 12 },
        { uid: "me", totalPoints: 480, daysCompleted: 30, longestStreak: 20 },
      ],
    };
    const progressByChallenge = {
      reset: Object.fromEntries(Array.from({ length: 7 }, (_, index) => [`2026-06-${String(index + 1).padStart(2, "0")}`, { allComplete: true }])),
      soft: {},
    };

    expect(deriveChallengeBadgeStats({
      uid: "me",
      challenges,
      membersByChallenge,
      progressByChallenge,
      today: new Date("2026-06-04"),
    })).toEqual({ completed: 2, top1: 1 });
  });

  it("does not count missing memberships or unfinished challenges", () => {
    expect(deriveChallengeBadgeStats({
      uid: "me",
      challenges: [{ id: "starter", duration: 7, status: "active", endDate: "2026-06-20" }],
      membersByChallenge: {
        starter: [{ uid: "me", totalPoints: 50, daysCompleted: 3, longestStreak: 3 }],
      },
      progressByChallenge: {
        starter: {
          "2026-06-01": { allComplete: true },
          "2026-06-02": { allComplete: false },
        },
      },
    })).toEqual({ completed: 0, top1: 0 });
  });
});

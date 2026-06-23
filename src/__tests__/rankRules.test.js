const {
  calculateRankScore,
  getTribeStatus,
  normalizeRankRules,
  rankRequirementText,
} = require("../rankRules");

describe("rank rules CMS core", () => {
  it("normalizes published rank rules with safe fallback values", () => {
    const rules = normalizeRankRules({
      dailyRankPointCap: "150",
      levels: [
        { id: "rookie", label: "Rookie", emoji: "🌱", minScore: 0 },
        { id: "warrior", label: "Warrior", icon: "⚔️", minScore: "600", minActiveDays: "7" },
      ],
    });

    expect(rules.dailyRankPointCap).toBe(150);
    expect(rules.levels[1]).toMatchObject({
      id: "warrior",
      icon: "⚔️",
      minScore: 600,
      min: 600,
      minXP: 600,
      minActiveDays: 7,
    });
  });

  it("requires every published gate before promoting a user", () => {
    const rules = normalizeRankRules({
      levels: [
        { id: "rookie", label: "Rookie", icon: "🌱", color: "#34D399", minScore: 0 },
        { id: "legend", label: "Legend", icon: "💫", color: "#FFD700", minScore: 4000, minActiveDays: 45, minStreak: 14, completedChallenges: 1 },
      ],
    });

    expect(getTribeStatus({ score: 4500, activeDays: 45, streak: 13, completedChallenges: 1 }, rules).rank.label).toBe("Rookie");
    expect(getTribeStatus({ score: 4500, activeDays: 45, streak: 14, completedChallenges: 1 }, rules).rank.label).toBe("Legend");
    expect(rankRequirementText(rules.levels[1])).toContain("4,000 pts");
    expect(rankRequirementText(rules.levels[1])).toContain("45 active days");
  });

  it("caps score contribution per day for rank progression", () => {
    const score = calculateRankScore({
      "2026-06-22": { totalPoints: 300 },
      "2026-06-23": { totalPoints: 40 },
    }, 120);

    expect(score).toBe(160);
  });
});

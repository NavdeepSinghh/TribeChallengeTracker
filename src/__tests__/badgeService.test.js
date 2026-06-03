jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  updateDoc: jest.fn(),
  getDoc: jest.fn(),
  arrayUnion: jest.fn((...items) => items),
}));

jest.mock("../firebase", () => ({
  db: {},
}));

const {
  BADGES,
  BADGE_CATEGORIES,
  calcBadgeXP,
  checkBadges,
  getBadgeProgress,
  getTribeRank,
} = require("../badgeService");

const baseStats = {
  totalLogs: 0,
  streak: 0,
  totalPts: 0,
  daysActive: 0,
  runKm: 0,
  cycleKm: 0,
  walkKm: 0,
  actCounts: {},
  uniqueTypes: 0,
  challengesJoined: 0,
  challengesOwned: 0,
  challengesCompleted: 0,
  top1Finishes: 0,
  weeklyLogs: 0,
  isOG: false,
  comeback: false,
  weekendWarrior: false,
};

describe("badge service", () => {
  it("keeps the shared badge catalog at 30 badges across the expected categories", () => {
    expect(BADGES).toHaveLength(30);
    expect(BADGE_CATEGORIES.map((category) => category.id)).toEqual([
      "all",
      "streak",
      "points",
      "activity",
      "challenge",
      "special",
    ]);
    expect(new Set(BADGES.map((badge) => badge.id)).size).toBe(BADGES.length);
  });

  it("awards milestone, activity, challenge, and special badges from stats", () => {
    const awarded = checkBadges(
      {
        ...baseStats,
        totalLogs: 1,
        streak: 7,
        totalPts: 500,
        daysActive: 10,
        runKm: 50,
        cycleKm: 100,
        walkKm: 50,
        actCounts: { yoga: 10, gym: 15, swim: 10 },
        uniqueTypes: 6,
        challengesJoined: 3,
        challengesOwned: 1,
        challengesCompleted: 1,
        top1Finishes: 1,
        weeklyLogs: 5,
        isOG: true,
        comeback: true,
        weekendWarrior: true,
      },
      new Set()
    );

    [
      "first_log",
      "streak7",
      "pts500",
      "days10",
      "run_50km",
      "cycle_100",
      "walk_50",
      "yoga_10",
      "gym_15",
      "swim_10",
      "variety",
      "squad",
      "creator",
      "finisher",
      "champion",
      "og_tribe",
      "comeback",
      "weekend_w",
      "no_excuses",
    ].forEach((badgeId) => expect(awarded).toContain(badgeId));
  });

  it("does not re-award badges that are already earned", () => {
    const awarded = checkBadges(
      { ...baseStats, totalLogs: 1, streak: 3, totalPts: 100 },
      new Set(["first_log", "streak3", "pts100"])
    );

    expect(awarded).toEqual(["pts50"]);
  });

  it("reports progress using the same current and target values shown in UI", () => {
    expect(getBadgeProgress("streak7", { ...baseStats, streak: 4 })).toEqual({
      current: 4,
      target: 7,
      label: "day streak",
    });
    expect(getBadgeProgress("finisher", { ...baseStats, challengesCompleted: 1 })).toEqual({
      current: 1,
      target: 1,
      label: "completed",
    });
  });

  it("calculates badge XP and tribe rank from earned badge IDs", () => {
    const xp = calcBadgeXP(new Set(["first_log", "streak7", "champion"]));
    expect(xp).toBe(360);
    expect(getTribeRank(xp).label).toBe("Elite");
  });
});

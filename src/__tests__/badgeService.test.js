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
  checkBadges,
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
  referralJoins: 0,
  challengesCompleted: 0,
  top1Finishes: 0,
  weeklyLogs: 0,
  proActive: false,
  streakRecoveryCredits: 0,
  isOG: false,
  comeback: false,
  weekendWarrior: false,
};

describe("badge service", () => {
  it("gates premium badges behind active Pro entitlement", () => {
    expect(checkBadges(
      { ...baseStats, weeklyLogs: 5, streakRecoveryCredits: 1, challengesCompleted: 1, proActive: false },
      new Set()
    )).not.toEqual(expect.arrayContaining(["pro_weekly_report", "pro_streak_saver", "pro_finisher"]));

    expect(checkBadges(
      { ...baseStats, weeklyLogs: 5, streakRecoveryCredits: 1, challengesCompleted: 1, proActive: true },
      new Set()
    )).toEqual(expect.arrayContaining(["pro_weekly_report", "pro_streak_saver", "pro_finisher"]));
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
        referralJoins: 10,
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
      "connector",
      "tribe_builder",
      "community_captain",
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

});

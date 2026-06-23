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
  calcBadgeXP,
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

describe("badge progress and rank service", () => {
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
    expect(getBadgeProgress("tribe_builder", { ...baseStats, referralJoins: 3 })).toEqual({
      current: 3,
      target: 5,
      label: "referral joins",
    });
    expect(getBadgeProgress("pro_streak_saver", { ...baseStats, proActive: true, streakRecoveryCredits: 1 })).toEqual({
      current: 1,
      target: 1,
      label: "Pro recovery",
    });
  });

  it("calculates badge XP and tribe rank from earned badge IDs", () => {
    const xp = calcBadgeXP(new Set(["first_log", "streak7", "champion"]));
    expect(xp).toBe(360);
    expect(getTribeRank(xp).label).toBe("Rookie");
  });
});

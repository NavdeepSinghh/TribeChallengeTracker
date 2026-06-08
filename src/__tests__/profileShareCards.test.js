const {
  buildMonthlyRecapShareText,
  buildWeeklyRecapShareText,
  buildWinCardShareText,
} = require("../profile/profileShareCards");

describe("profile share copy helpers", () => {
  it("builds win, weekly, and monthly share copy with optional Instagram handle", () => {
    expect(buildWinCardShareText({
      currentStreak: 6,
      daysActive: 18,
      instagram: "tribe_member",
      totalWinPoints: 940,
    })).toContain("940 pts · 6-day streak · 18 days active @tribe_member");

    expect(buildWeeklyRecapShareText({
      instagram: "",
      weeklyRecap: { activeDays: 5, points: 310, sessions: 7 },
    })).toContain("310 pts · 7 sessions · 5/7 days active");

    expect(buildMonthlyRecapShareText({
      instagram: "tribe_member",
      monthlyReport: { activeDays: 21, monthlyPoints: 1440, monthlyScore: 82, sessions: 29 },
    })).toContain("1440 pts · 29 sessions · 21/30 days active · 82% score @tribe_member");
  });

});

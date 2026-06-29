const {
  isCompletedChallenge,
  splitMyChallenges,
  topDiscoverChallenges,
} = require("../challenges/challengeListModel");

describe("challenge list model", () => {
  const today = new Date("2026-06-29T12:00:00");

  it("splits active and completed joined challenges", () => {
    const sections = splitMyChallenges([
      { id: "active", status: "active", endDate: "2026-07-05" },
      { id: "ended", status: "active", endDate: "2026-06-01" },
      { id: "completed", status: "completed", endDate: "2026-07-01" },
    ], today);

    expect(sections.active.map(challenge => challenge.id)).toEqual(["active"]);
    expect(sections.completed.map(challenge => challenge.id)).toEqual(["ended", "completed"]);
    expect(isCompletedChallenge({ endDate: "2026-06-29" }, today)).toBe(false);
  });

  it("shows only top unjoined public active discover challenges by member count", () => {
    const joinedIds = new Set(["joined"]);
    const discover = topDiscoverChallenges([
      { id: "small", isPublic: true, memberCount: 3, endDate: "2026-07-10", name: "Small" },
      { id: "joined", isPublic: true, memberCount: 99, endDate: "2026-07-10", name: "Joined" },
      { id: "private", isPublic: false, memberCount: 80, endDate: "2026-07-10", name: "Private" },
      { id: "ended", isPublic: true, memberCount: 70, endDate: "2026-06-01", name: "Ended" },
      { id: "large", isPublic: true, memberCount: 20, endDate: "2026-07-10", name: "Large" },
      { id: "medium", isPublic: true, memberCount: 10, endDate: "2026-07-10", name: "Medium" },
      { id: "extra", isPublic: true, memberCount: 7, endDate: "2026-07-10", name: "Extra" },
    ], joinedIds, 3, today);

    expect(discover.map(challenge => challenge.id)).toEqual(["large", "medium", "extra"]);
  });
});

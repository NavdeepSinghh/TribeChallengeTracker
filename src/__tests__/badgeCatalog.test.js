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
} = require("../badgeService");

describe("badge catalog", () => {
  it("keeps the shared badge catalog at 36 badges across the expected categories", () => {
    expect(BADGES).toHaveLength(36);
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
});

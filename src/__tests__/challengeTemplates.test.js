jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  serverTimestamp: jest.fn(),
  increment: jest.fn(),
  arrayUnion: jest.fn(),
  arrayRemove: jest.fn(),
}));

jest.mock("../firebase", () => ({
  db: {},
}));

const fs = require("fs");
const path = require("path");
const { CHALLENGE_TEMPLATES } = require("../challengeService");
const { CORE_CHALLENGE_TEMPLATES } = require("../coreChallengeTemplates");

describe("challenge templates", () => {
  it("keeps core campaign and long-form challenge templates in stable order", () => {
    expect(CORE_CHALLENGE_TEMPLATES.map(template => template.id)).toEqual([
      "weekly_reset",
      "comeback_week",
      "75hard",
      "75soft",
      "30tribe",
    ]);

    const campaignTemplates = CORE_CHALLENGE_TEMPLATES.filter(template => template.campaignId);
    expect(campaignTemplates.map(template => template.id)).toEqual([
      "weekly_reset",
      "comeback_week",
      "30tribe",
    ]);
    expect(campaignTemplates).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: "weekly_reset",
        campaignLabel: "Weekly Campaign",
        campaignHashtag: "#RiseWithTheTribe",
      }),
      expect.objectContaining({
        id: "30tribe",
        campaignLabel: "Core Campaign",
        campaignHashtag: "#30DayTribe",
      }),
    ]));
  });

  it("keeps seasonal campaign drops available on all platforms", () => {
    const seasonalIds = ["seasonal_summer_shred", "seasonal_winter_base"];
    const webIds = CHALLENGE_TEMPLATES.map(template => template.id);
    const iosCatalog = fs.readFileSync(path.resolve(__dirname, "../../../TribeChallengeTrackerIOS/TribeChallenge/Models/Challenge.swift"), "utf8");
    const androidCatalog = fs.readFileSync(path.resolve(__dirname, "../../../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/model/Models.kt"), "utf8");

    seasonalIds.forEach((id) => {
      expect(webIds).toContain(id);
      expect(iosCatalog).toContain(`id: "${id}"`);
      expect(androidCatalog).toContain(`id = "${id}"`);
    });

    const summer = CHALLENGE_TEMPLATES.find(template => template.id === "seasonal_summer_shred");
    expect(summer).toMatchObject({
      isPremium: true,
      packId: "summer_shred",
      campaignHashtag: "#TribeSummerShred",
    });
  });

  it("keeps premium pack accountability prompts in paid templates", () => {
    const reset = CHALLENGE_TEMPLATES.find(template => template.id === "premium_21_reset");
    const summer = CHALLENGE_TEMPLATES.find(template => template.id === "seasonal_summer_shred");
    const iosCatalog = fs.readFileSync(path.resolve(__dirname, "../../../TribeChallengeTrackerIOS/TribeChallenge/Models/Challenge.swift"), "utf8");
    const androidCatalog = fs.readFileSync(path.resolve(__dirname, "../../../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/model/Models.kt"), "utf8");

    expect(reset.dailyPrompts).toEqual(expect.arrayContaining([
      "What is the smallest win you can protect today?",
      "Choose recovery with the same discipline as training.",
    ]));
    expect(summer.dailyPrompts).toEqual(expect.arrayContaining([
      "Post one honest progress proof, not a perfect one.",
      "Check in with your accountability partner before you log off.",
    ]));

    [
      "What is the smallest win you can protect today?",
      "Post one honest progress proof, not a perfect one.",
    ].forEach((prompt) => {
      expect(iosCatalog).toContain(prompt);
      expect(androidCatalog).toContain(prompt);
    });
  });
});

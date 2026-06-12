jest.mock("../firebase", () => ({
  db: {},
  functions: {},
}));

const {
  buildProfileWeeklyCampaignDerivedData,
} = require("../profile/profileWeeklyCampaignDerivedData");
const {
  buildWeeklyCampaignDerivedDataInput,
} = require("../testUtils/weeklyCampaignTestFixtures");

describe("Weekly Campaign derived data", () => {
  const result = () => buildProfileWeeklyCampaignDerivedData(buildWeeklyCampaignDerivedDataInput());

  it("carries the campaign prompt through core scheduler, launch card, and review copy", () => {
    const data = result();

    expect(data.campaignSchedulerCopy).toContain("Week 12 is Seven Day Reset");
    expect(data.weeklyCampaignLaunchCardCopy).toContain("Card headline: Seven Day Reset");
    expect(data.weeklyCampaignLaunchCardCopy).toContain("#TribeReset");
    expect(data.weeklyCampaignPreflightCopy).toContain("Pending feature submissions: 2");
    expect(data.weeklyCampaignReviewCopy).toContain("Share-card usage: review in native share/activity surfaces only");
    expect(data.dmKeywordCopy).toContain("DM keyword TRIBE reply");
    expect(data.dmKeywordCopy).toContain("DM keyword FEATURE reply");
  });

  it("chooses a first-party launch experiment and keeps paid/tracking boundaries explicit", () => {
    const data = result();

    expect(data.recommendedLaunchExperiment.label).toBe("Referral Sprint");
    expect(data.weeklyCampaignExperimentBriefCopy).toContain("Measure only first-party app movement");
    expect(data.launchExperimentCopy).toContain("do not add tracking pixels");
    expect(data.launchQaChecklistCopy).toContain("[x] PRODUCT IDS");
    expect(data.launchQaChecklistCopy).toContain("[ ] STORE TESTS");
    expect(data.launchRetrospectiveCopy).toContain("does not add tracking pixels");
    expect(data.launchRetrospectiveReadinessScriptCopy).toContain("Launch Retrospective Readiness Script Kit");
    expect(data.launchRetrospectiveReadinessScriptCopy).toContain("Manual retrospective readiness script");
    expect(data.launchRetrospectiveReadinessScriptCopy).toContain("Capture only first-party app movement");
    expect(data.launchRetrospectiveReadinessScriptCopy).toContain("Separate directional Instagram reactions");
    expect(data.launchRetrospectiveReadinessScriptCopy).toContain("This launch retrospective readiness script is copy-only");
    expect(data.launchRetrospectiveReadinessScriptCopy).toContain("Do not create experiment records");
    expect(data.launchRetrospectiveReadinessScriptCopy).toContain("attribution records");
    expect(data.launchRetrospectiveReadinessScriptCopy).toContain("tracking pixels");
    expect(data.launchRetrospectiveReadinessScriptCopy).toContain("purchases");
    expect(data.launchRetrospectiveReadinessScriptCopy).toContain("entitlement writes");
    expect(data.launchRetrospectiveReadinessScriptCopy).toContain("paid-access grants");
  });

  it("builds engagement, collab, retention, and re-invite copy without automation side effects", () => {
    const data = result();

    expect(data.weeklyCampaignCommentReplyCopy).toContain("Q: How do I join?");
    expect(data.weeklyCampaignCountdownStoryCopy).toContain("Manual Story sequence");
    expect(data.weeklyCampaignCaptionBankCopy).toContain("manual caption bank");
    expect(data.weeklyCampaignCollabCopyCards).toHaveLength(9);
    expect(data.weeklyCampaignCollabCopyCards.map(card => card.title)).toEqual([
      "Weekly Campaign Collab Invite Kit",
      "Weekly Campaign Collab Follow-Up Kit",
      "Weekly Campaign Collab Safety Checklist",
      "Weekly Campaign Collab Recap Kit",
      "Weekly Campaign Collab Renewal Kit",
      "Weekly Campaign Retention Follow-Up Kit",
      "Weekly Campaign Support Triage Kit",
      "Weekly Campaign Support Readiness Script Kit",
      "Weekly Campaign Re-Invite Kit",
    ]);
    expect(data.weeklyCampaignCollabCopyCards[5].copyText).toContain("Manual follow-up lanes");
    expect(data.weeklyCampaignCollabCopyCards[6].copyText).toContain("Manual triage lanes");
    expect(data.weeklyCampaignCollabCopyCards[6].copyText).toContain("Open support-risk items: 1");
    expect(data.weeklyCampaignCollabCopyCards[7].copyText).toContain("Manual support readiness script");
    expect(data.weeklyCampaignCollabCopyCards[7].copyText).toContain("billing/refund, privacy/deletion, paid-access confusion");
    expect(data.weeklyCampaignCollabCopyCards[8].copyText).toContain("Manual re-invite lanes");
    data.weeklyCampaignCollabCopyCards.forEach((card) => {
      expect(card.copyText).toContain("Do not");
      expect(card.copyText).toMatch(/auto-message|auto-post|scrape/);
    });
  });
});

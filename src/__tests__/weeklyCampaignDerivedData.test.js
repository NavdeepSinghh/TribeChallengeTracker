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
    expect(data.weeklyCampaignLaunchCopyQaCopy).toContain("Weekly Campaign Launch Copy QA Kit");
    expect(data.weeklyCampaignLaunchCopyQaCopy).toContain("Manual launch copy QA checklist");
    expect(data.weeklyCampaignLaunchCopyQaCopy).toContain("approved caption");
    expect(data.weeklyCampaignLaunchCopyQaCopy).toContain("Do not auto-post to Instagram");
    expect(data.weeklyCampaignLaunchCopyQaCopy).toContain("schedule posts from the app");
    expect(data.weeklyCampaignLaunchCopyQaCopy).toContain("scrape comments");
    expect(data.weeklyCampaignLaunchCopyQaCopy).toContain("create attribution records");
    expect(data.weeklyCampaignLaunchCopyQaCopy).toContain("count link opens");
    expect(data.weeklyCampaignLaunchCopyQaCopy).toContain("write referral state");
    expect(data.weeklyCampaignLaunchCopyQaCopy).toContain("write entitlements");
    expect(data.weeklyCampaignLaunchCopyQaCopy).toContain("unlock paid access");
    expect(data.weeklyCampaignLaunchCopyQaCopy).toContain("offer discounts");
    expect(data.weeklyCampaignLaunchCopyQaCopy).toContain("promise refunds");
    expect(data.weeklyCampaignFirstDayMonitorCopy).toContain("Weekly Campaign First 24h Monitor Kit");
    expect(data.weeklyCampaignFirstDayMonitorCopy).toContain("Manual first 24h monitor checklist");
    expect(data.weeklyCampaignFirstDayMonitorCopy).toContain("first-party app movement");
    expect(data.weeklyCampaignFirstDayMonitorCopy).toContain("support-risk replies");
    expect(data.weeklyCampaignFirstDayMonitorCopy).toContain("repeat/hold recommendation");
    expect(data.weeklyCampaignFirstDayMonitorCopy).toContain("Do not auto-post to Instagram");
    expect(data.weeklyCampaignFirstDayMonitorCopy).toContain("scrape posts");
    expect(data.weeklyCampaignFirstDayMonitorCopy).toContain("create attribution records");
    expect(data.weeklyCampaignFirstDayMonitorCopy).toContain("count link opens");
    expect(data.weeklyCampaignFirstDayMonitorCopy).toContain("share private responses");
    expect(data.weeklyCampaignFirstDayMonitorCopy).toContain("write referral state");
    expect(data.weeklyCampaignFirstDayMonitorCopy).toContain("grant rewards");
    expect(data.weeklyCampaignFirstDayMonitorCopy).toContain("write entitlements");
    expect(data.weeklyCampaignFirstDayMonitorCopy).toContain("unlock paid access");
    expect(data.weeklyCampaignMidweekAdjustmentCopy).toContain("Weekly Campaign Midweek Adjustment Kit");
    expect(data.weeklyCampaignMidweekAdjustmentCopy).toContain("Manual midweek adjustment checklist");
    expect(data.weeklyCampaignMidweekAdjustmentCopy).toContain("Choose one adjustment lane");
    expect(data.weeklyCampaignMidweekAdjustmentCopy).toContain("support-risk replies");
    expect(data.weeklyCampaignMidweekAdjustmentCopy).toContain("approved copy");
    expect(data.weeklyCampaignMidweekAdjustmentCopy).toContain("Do not auto-post to Instagram");
    expect(data.weeklyCampaignMidweekAdjustmentCopy).toContain("scrape posts");
    expect(data.weeklyCampaignMidweekAdjustmentCopy).toContain("create attribution records");
    expect(data.weeklyCampaignMidweekAdjustmentCopy).toContain("count link opens");
    expect(data.weeklyCampaignMidweekAdjustmentCopy).toContain("write referral state");
    expect(data.weeklyCampaignMidweekAdjustmentCopy).toContain("grant rewards");
    expect(data.weeklyCampaignMidweekAdjustmentCopy).toContain("write entitlements");
    expect(data.weeklyCampaignMidweekAdjustmentCopy).toContain("unlock paid access");
    expect(data.weeklyCampaignWeekendPushDecisionCopy).toContain("Weekly Campaign Weekend Push Decision Kit");
    expect(data.weeklyCampaignWeekendPushDecisionCopy).toContain("Manual weekend push decision checklist");
    expect(data.weeklyCampaignWeekendPushDecisionCopy).toContain("Choose one decision lane");
    expect(data.weeklyCampaignWeekendPushDecisionCopy).toContain("Sunday recap handoff");
    expect(data.weeklyCampaignWeekendPushDecisionCopy).toContain("Do not auto-post to Instagram");
    expect(data.weeklyCampaignWeekendPushDecisionCopy).toContain("scrape posts");
    expect(data.weeklyCampaignWeekendPushDecisionCopy).toContain("create attribution records");
    expect(data.weeklyCampaignWeekendPushDecisionCopy).toContain("count link opens");
    expect(data.weeklyCampaignWeekendPushDecisionCopy).toContain("share private responses");
    expect(data.weeklyCampaignWeekendPushDecisionCopy).toContain("write referral state");
    expect(data.weeklyCampaignWeekendPushDecisionCopy).toContain("grant rewards");
    expect(data.weeklyCampaignWeekendPushDecisionCopy).toContain("write entitlements");
    expect(data.weeklyCampaignWeekendPushDecisionCopy).toContain("unlock paid access");
    expect(data.weeklyCampaignSundayRecapQaCopy).toContain("Weekly Campaign Sunday Recap QA Kit");
    expect(data.weeklyCampaignSundayRecapQaCopy).toContain("Manual Sunday recap QA checklist");
    expect(data.weeklyCampaignSundayRecapQaCopy).toContain("aggregate and app-first");
    expect(data.weeklyCampaignSundayRecapQaCopy).toContain("consent-cleared proof references");
    expect(data.weeklyCampaignSundayRecapQaCopy).toContain("next-week handoff");
    expect(data.weeklyCampaignSundayRecapQaCopy).toContain("Do not auto-post to Instagram");
    expect(data.weeklyCampaignSundayRecapQaCopy).toContain("scrape posts");
    expect(data.weeklyCampaignSundayRecapQaCopy).toContain("create attribution records");
    expect(data.weeklyCampaignSundayRecapQaCopy).toContain("count link opens");
    expect(data.weeklyCampaignSundayRecapQaCopy).toContain("share private responses");
    expect(data.weeklyCampaignSundayRecapQaCopy).toContain("write referral state");
    expect(data.weeklyCampaignSundayRecapQaCopy).toContain("grant rewards");
    expect(data.weeklyCampaignSundayRecapQaCopy).toContain("write entitlements");
    expect(data.weeklyCampaignSundayRecapQaCopy).toContain("unlock paid access");
    expect(data.weeklyCampaignNextWeekLaunchAngleCopy).toContain("Weekly Campaign Next-Week Launch Angle Kit");
    expect(data.weeklyCampaignNextWeekLaunchAngleCopy).toContain("Manual next-week launch angle checklist");
    expect(data.weeklyCampaignNextWeekLaunchAngleCopy).toContain("Choose one angle lane");
    expect(data.weeklyCampaignNextWeekLaunchAngleCopy).toContain("app-first");
    expect(data.weeklyCampaignNextWeekLaunchAngleCopy).toContain("next preflight owner");
    expect(data.weeklyCampaignNextWeekLaunchAngleCopy).toContain("Do not auto-post to Instagram");
    expect(data.weeklyCampaignNextWeekLaunchAngleCopy).toContain("scrape posts");
    expect(data.weeklyCampaignNextWeekLaunchAngleCopy).toContain("create attribution records");
    expect(data.weeklyCampaignNextWeekLaunchAngleCopy).toContain("count link opens");
    expect(data.weeklyCampaignNextWeekLaunchAngleCopy).toContain("share private responses");
    expect(data.weeklyCampaignNextWeekLaunchAngleCopy).toContain("write referral state");
    expect(data.weeklyCampaignNextWeekLaunchAngleCopy).toContain("grant rewards");
    expect(data.weeklyCampaignNextWeekLaunchAngleCopy).toContain("write entitlements");
    expect(data.weeklyCampaignNextWeekLaunchAngleCopy).toContain("unlock paid access");
    expect(data.weeklyCampaignPreflightOwnerHandoffCopy).toContain("Weekly Campaign Preflight Owner Handoff Kit");
    expect(data.weeklyCampaignPreflightOwnerHandoffCopy).toContain("Manual preflight owner handoff checklist");
    expect(data.weeklyCampaignPreflightOwnerHandoffCopy).toContain("Assign one owner");
    expect(data.weeklyCampaignPreflightOwnerHandoffCopy).toContain("copy boundary note");
    expect(data.weeklyCampaignPreflightOwnerHandoffCopy).toContain("Do not auto-post to Instagram");
    expect(data.weeklyCampaignPreflightOwnerHandoffCopy).toContain("scrape posts");
    expect(data.weeklyCampaignPreflightOwnerHandoffCopy).toContain("create attribution records");
    expect(data.weeklyCampaignPreflightOwnerHandoffCopy).toContain("count link opens");
    expect(data.weeklyCampaignPreflightOwnerHandoffCopy).toContain("share private responses");
    expect(data.weeklyCampaignPreflightOwnerHandoffCopy).toContain("write referral state");
    expect(data.weeklyCampaignPreflightOwnerHandoffCopy).toContain("grant rewards");
    expect(data.weeklyCampaignPreflightOwnerHandoffCopy).toContain("write entitlements");
    expect(data.weeklyCampaignPreflightOwnerHandoffCopy).toContain("unlock paid access");
    expect(data.weeklyCampaignPreflightReadinessDecisionCopy).toContain("Weekly Campaign Preflight Readiness Decision Kit");
    expect(data.weeklyCampaignPreflightReadinessDecisionCopy).toContain("Manual preflight readiness decision checklist");
    expect(data.weeklyCampaignPreflightReadinessDecisionCopy).toContain("Choose one readiness lane");
    expect(data.weeklyCampaignPreflightReadinessDecisionCopy).toContain("preflight start note");
    expect(data.weeklyCampaignPreflightReadinessDecisionCopy).toContain("Do not auto-post to Instagram");
    expect(data.weeklyCampaignPreflightReadinessDecisionCopy).toContain("scrape posts");
    expect(data.weeklyCampaignPreflightReadinessDecisionCopy).toContain("create attribution records");
    expect(data.weeklyCampaignPreflightReadinessDecisionCopy).toContain("count link opens");
    expect(data.weeklyCampaignPreflightReadinessDecisionCopy).toContain("share private responses");
    expect(data.weeklyCampaignPreflightReadinessDecisionCopy).toContain("write referral state");
    expect(data.weeklyCampaignPreflightReadinessDecisionCopy).toContain("grant rewards");
    expect(data.weeklyCampaignPreflightReadinessDecisionCopy).toContain("write entitlements");
    expect(data.weeklyCampaignPreflightReadinessDecisionCopy).toContain("unlock paid access");
    expect(data.weeklyCampaignPreflightCopyFreezeCopy).toContain("Weekly Campaign Preflight Copy Freeze Kit");
    expect(data.weeklyCampaignPreflightCopyFreezeCopy).toContain("Manual preflight copy freeze checklist");
    expect(data.weeklyCampaignPreflightCopyFreezeCopy).toContain("Freeze the launch-card headline");
    expect(data.weeklyCampaignPreflightCopyFreezeCopy).toContain("copy-change owner");
    expect(data.weeklyCampaignPreflightCopyFreezeCopy).toContain("Do not auto-post to Instagram");
    expect(data.weeklyCampaignPreflightCopyFreezeCopy).toContain("scrape posts");
    expect(data.weeklyCampaignPreflightCopyFreezeCopy).toContain("create attribution records");
    expect(data.weeklyCampaignPreflightCopyFreezeCopy).toContain("count link opens");
    expect(data.weeklyCampaignPreflightCopyFreezeCopy).toContain("share private responses");
    expect(data.weeklyCampaignPreflightCopyFreezeCopy).toContain("write referral state");
    expect(data.weeklyCampaignPreflightCopyFreezeCopy).toContain("grant rewards");
    expect(data.weeklyCampaignPreflightCopyFreezeCopy).toContain("write entitlements");
    expect(data.weeklyCampaignPreflightCopyFreezeCopy).toContain("unlock paid access");
    expect(data.weeklyCampaignPreflightAssetReadinessCopy).toContain("Weekly Campaign Preflight Asset Readiness Kit");
    expect(data.weeklyCampaignPreflightAssetReadinessCopy).toContain("Manual preflight asset readiness checklist");
    expect(data.weeklyCampaignPreflightAssetReadinessCopy).toContain("Confirm launch-card headline");
    expect(data.weeklyCampaignPreflightAssetReadinessCopy).toContain("preflight asset handoff");
    expect(data.weeklyCampaignPreflightAssetReadinessCopy).toContain("Do not auto-post to Instagram");
    expect(data.weeklyCampaignPreflightAssetReadinessCopy).toContain("scrape posts");
    expect(data.weeklyCampaignPreflightAssetReadinessCopy).toContain("create attribution records");
    expect(data.weeklyCampaignPreflightAssetReadinessCopy).toContain("count link opens");
    expect(data.weeklyCampaignPreflightAssetReadinessCopy).toContain("share private responses");
    expect(data.weeklyCampaignPreflightAssetReadinessCopy).toContain("write referral state");
    expect(data.weeklyCampaignPreflightAssetReadinessCopy).toContain("grant rewards");
    expect(data.weeklyCampaignPreflightAssetReadinessCopy).toContain("write entitlements");
    expect(data.weeklyCampaignPreflightAssetReadinessCopy).toContain("unlock paid access");
    expect(data.weeklyCampaignPreflightLaunchPacketQaCopy).toContain("Weekly Campaign Preflight Launch Packet QA Kit");
    expect(data.weeklyCampaignPreflightLaunchPacketQaCopy).toContain("Manual preflight launch packet QA checklist");
    expect(data.weeklyCampaignPreflightLaunchPacketQaCopy).toContain("one approved launch-card headline");
    expect(data.weeklyCampaignPreflightLaunchPacketQaCopy).toContain("final preflight handoff");
    expect(data.weeklyCampaignPreflightLaunchPacketQaCopy).toContain("Do not auto-post to Instagram");
    expect(data.weeklyCampaignPreflightLaunchPacketQaCopy).toContain("scrape posts");
    expect(data.weeklyCampaignPreflightLaunchPacketQaCopy).toContain("create attribution records");
    expect(data.weeklyCampaignPreflightLaunchPacketQaCopy).toContain("count link opens");
    expect(data.weeklyCampaignPreflightLaunchPacketQaCopy).toContain("share private responses");
    expect(data.weeklyCampaignPreflightLaunchPacketQaCopy).toContain("write referral state");
    expect(data.weeklyCampaignPreflightLaunchPacketQaCopy).toContain("grant rewards");
    expect(data.weeklyCampaignPreflightLaunchPacketQaCopy).toContain("write entitlements");
    expect(data.weeklyCampaignPreflightLaunchPacketQaCopy).toContain("unlock paid access");
    expect(data.weeklyCampaignPreflightGoNoGoCopy).toContain("Weekly Campaign Preflight Go/No-Go Kit");
    expect(data.weeklyCampaignPreflightGoNoGoCopy).toContain("Manual preflight go/no-go checklist");
    expect(data.weeklyCampaignPreflightGoNoGoCopy).toContain("Choose one go/no-go lane");
    expect(data.weeklyCampaignPreflightGoNoGoCopy).toContain("preflight checklist owner");
    expect(data.weeklyCampaignPreflightGoNoGoCopy).toContain("Do not auto-post to Instagram");
    expect(data.weeklyCampaignPreflightGoNoGoCopy).toContain("scrape posts");
    expect(data.weeklyCampaignPreflightGoNoGoCopy).toContain("create attribution records");
    expect(data.weeklyCampaignPreflightGoNoGoCopy).toContain("count link opens");
    expect(data.weeklyCampaignPreflightGoNoGoCopy).toContain("share private responses");
    expect(data.weeklyCampaignPreflightGoNoGoCopy).toContain("write referral state");
    expect(data.weeklyCampaignPreflightGoNoGoCopy).toContain("grant rewards");
    expect(data.weeklyCampaignPreflightGoNoGoCopy).toContain("write entitlements");
    expect(data.weeklyCampaignPreflightGoNoGoCopy).toContain("unlock paid access");
    expect(data.weeklyCampaignPreflightChecklistHandoffCopy).toContain("Weekly Campaign Preflight Checklist Handoff Kit");
    expect(data.weeklyCampaignPreflightChecklistHandoffCopy).toContain("Manual preflight checklist handoff");
    expect(data.weeklyCampaignPreflightChecklistHandoffCopy).toContain("one checklist owner");
    expect(data.weeklyCampaignPreflightChecklistHandoffCopy).toContain("preflight checklist start time");
    expect(data.weeklyCampaignPreflightChecklistHandoffCopy).toContain("Do not auto-post to Instagram");
    expect(data.weeklyCampaignPreflightChecklistHandoffCopy).toContain("scrape posts");
    expect(data.weeklyCampaignPreflightChecklistHandoffCopy).toContain("create attribution records");
    expect(data.weeklyCampaignPreflightChecklistHandoffCopy).toContain("count link opens");
    expect(data.weeklyCampaignPreflightChecklistHandoffCopy).toContain("share private responses");
    expect(data.weeklyCampaignPreflightChecklistHandoffCopy).toContain("write referral state");
    expect(data.weeklyCampaignPreflightChecklistHandoffCopy).toContain("grant rewards");
    expect(data.weeklyCampaignPreflightChecklistHandoffCopy).toContain("write entitlements");
    expect(data.weeklyCampaignPreflightChecklistHandoffCopy).toContain("unlock paid access");
    expect(data.weeklyCampaignPreflightCopy).toContain("Pending feature submissions: 2");
    expect(data.weeklyCampaignPreflightChecklistQaCopy).toContain("Weekly Campaign Preflight Checklist QA Kit");
    expect(data.weeklyCampaignPreflightChecklistQaCopy).toContain("Manual preflight checklist QA");
    expect(data.weeklyCampaignPreflightChecklistQaCopy).toContain("completed preflight checklist");
    expect(data.weeklyCampaignPreflightChecklistQaCopy).toContain("launch readiness handoff");
    expect(data.weeklyCampaignPreflightChecklistQaCopy).toContain("Do not auto-post to Instagram");
    expect(data.weeklyCampaignPreflightChecklistQaCopy).toContain("scrape posts");
    expect(data.weeklyCampaignPreflightChecklistQaCopy).toContain("create attribution records");
    expect(data.weeklyCampaignPreflightChecklistQaCopy).toContain("count link opens");
    expect(data.weeklyCampaignPreflightChecklistQaCopy).toContain("share private responses");
    expect(data.weeklyCampaignPreflightChecklistQaCopy).toContain("write referral state");
    expect(data.weeklyCampaignPreflightChecklistQaCopy).toContain("grant rewards");
    expect(data.weeklyCampaignPreflightChecklistQaCopy).toContain("write entitlements");
    expect(data.weeklyCampaignPreflightChecklistQaCopy).toContain("unlock paid access");
    expect(data.weeklyCampaignLaunchReadinessHandoffCopy).toContain("Weekly Campaign Launch Readiness Handoff Kit");
    expect(data.weeklyCampaignLaunchReadinessHandoffCopy).toContain("Manual launch readiness handoff");
    expect(data.weeklyCampaignLaunchReadinessHandoffCopy).toContain("one launch readiness owner");
    expect(data.weeklyCampaignLaunchReadinessHandoffCopy).toContain("launch operator handoff");
    expect(data.weeklyCampaignLaunchReadinessHandoffCopy).toContain("Do not auto-post to Instagram");
    expect(data.weeklyCampaignLaunchReadinessHandoffCopy).toContain("scrape posts");
    expect(data.weeklyCampaignLaunchReadinessHandoffCopy).toContain("create attribution records");
    expect(data.weeklyCampaignLaunchReadinessHandoffCopy).toContain("count link opens");
    expect(data.weeklyCampaignLaunchReadinessHandoffCopy).toContain("share private responses");
    expect(data.weeklyCampaignLaunchReadinessHandoffCopy).toContain("write referral state");
    expect(data.weeklyCampaignLaunchReadinessHandoffCopy).toContain("grant rewards");
    expect(data.weeklyCampaignLaunchReadinessHandoffCopy).toContain("write entitlements");
    expect(data.weeklyCampaignLaunchReadinessHandoffCopy).toContain("unlock paid access");
    expect(data.weeklyCampaignFinalPostingPrepQaCopy).toContain("Weekly Campaign Final Posting Prep QA Kit");
    expect(data.weeklyCampaignFinalPostingPrepQaCopy).toContain("Manual final posting prep QA");
    expect(data.weeklyCampaignFinalPostingPrepQaCopy).toContain("one caption");
    expect(data.weeklyCampaignFinalPostingPrepQaCopy).toContain("manual launch operator");
    expect(data.weeklyCampaignFinalPostingPrepQaCopy).toContain("Do not auto-post to Instagram");
    expect(data.weeklyCampaignFinalPostingPrepQaCopy).toContain("scrape posts");
    expect(data.weeklyCampaignFinalPostingPrepQaCopy).toContain("create attribution records");
    expect(data.weeklyCampaignFinalPostingPrepQaCopy).toContain("count link opens");
    expect(data.weeklyCampaignFinalPostingPrepQaCopy).toContain("share private responses");
    expect(data.weeklyCampaignFinalPostingPrepQaCopy).toContain("write referral state");
    expect(data.weeklyCampaignFinalPostingPrepQaCopy).toContain("grant rewards");
    expect(data.weeklyCampaignFinalPostingPrepQaCopy).toContain("write entitlements");
    expect(data.weeklyCampaignFinalPostingPrepQaCopy).toContain("unlock paid access");
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

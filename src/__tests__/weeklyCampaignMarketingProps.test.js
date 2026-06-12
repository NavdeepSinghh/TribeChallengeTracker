jest.mock("../firebase", () => ({
  db: {},
  functions: {},
}));

const {
  buildProfileWeeklyCampaignDerivedData,
} = require("../profile/profileWeeklyCampaignDerivedData");
const {
  buildWeeklyCampaignMarketingProps,
} = require("../profile/weeklyCampaignMarketingProps");
const {
  buildWeeklyCampaignMarketingSectionData,
} = require("../profile/weeklyCampaignMarketingSectionData");
const {
  buildWeeklyCampaignDerivedDataInput,
  weeklyCampaignPrompt,
} = require("../testUtils/weeklyCampaignTestFixtures");

describe("Weekly Campaign marketing props", () => {
  it("maps the derived model into the Weekly Campaign marketing prop contract", () => {
    const data = buildProfileWeeklyCampaignDerivedData(buildWeeklyCampaignDerivedDataInput());
    const props = buildWeeklyCampaignMarketingProps({
      ...data,
      creatorEnabled: true,
      instagramContentCalendarCopy: "Rise With The Tribe Instagram Content Calendar",
      isAdmin: false,
      weeklyCampaignPrompt,
    });

    expect(props.creatorEnabled).toBe(true);
    expect(props.isAdmin).toBe(false);
    expect(props.weeklyCampaignPrompt).toEqual(weeklyCampaignPrompt);
    expect(props.weeklyCampaignLaunchCardCopy).toContain("Card headline: Seven Day Reset");
    expect(props.weeklyCampaignLaunchCopyQaCopy).toContain("Weekly Campaign Launch Copy QA Kit");
    expect(props.weeklyCampaignFirstDayMonitorCopy).toContain("Weekly Campaign First 24h Monitor Kit");
    expect(props.weeklyCampaignMidweekAdjustmentCopy).toContain("Weekly Campaign Midweek Adjustment Kit");
    expect(props.weeklyCampaignWeekendPushDecisionCopy).toContain("Weekly Campaign Weekend Push Decision Kit");
    expect(props.weeklyCampaignSundayRecapQaCopy).toContain("Weekly Campaign Sunday Recap QA Kit");
    expect(props.weeklyCampaignNextWeekLaunchAngleCopy).toContain("Weekly Campaign Next-Week Launch Angle Kit");
    expect(props.weeklyCampaignPreflightOwnerHandoffCopy).toContain("Weekly Campaign Preflight Owner Handoff Kit");
    expect(props.weeklyCampaignPreflightReadinessDecisionCopy).toContain("Weekly Campaign Preflight Readiness Decision Kit");
    expect(props.weeklyCampaignPreflightCopyFreezeCopy).toContain("Weekly Campaign Preflight Copy Freeze Kit");
    expect(props.weeklyCampaignPreflightAssetReadinessCopy).toContain("Weekly Campaign Preflight Asset Readiness Kit");
    expect(props.weeklyCampaignPreflightLaunchPacketQaCopy).toContain("Weekly Campaign Preflight Launch Packet QA Kit");
    expect(props.weeklyCampaignPreflightGoNoGoCopy).toContain("Weekly Campaign Preflight Go/No-Go Kit");
    expect(props.weeklyCampaignPreflightChecklistHandoffCopy).toContain("Weekly Campaign Preflight Checklist Handoff Kit");
    expect(props.weeklyCampaignPreflightChecklistQaCopy).toContain("Weekly Campaign Preflight Checklist QA Kit");
    expect(props.launchRetrospectiveReadinessScriptCopy).toContain("Launch Retrospective Readiness Script Kit");
    expect(props.weeklyCampaignCollabCopyCards).toHaveLength(9);
    expect(props.weeklyCampaignCollabCopyCards[6].title).toBe("Weekly Campaign Support Triage Kit");
    expect(props.weeklyCampaignCollabCopyCards[6].copyText).toContain("create support tickets outside the app");
    expect(props.weeklyCampaignCollabCopyCards[7].title).toBe("Weekly Campaign Support Readiness Script Kit");
    expect(props.weeklyCampaignCollabCopyCards[7].copyText).toContain("Manual support readiness script");
    expect(props.weeklyCampaignCollabCopyCards[7].copyText).toContain("Confirm the member's campaign question is resolved");
    expect(props.weeklyCampaignCollabCopyCards[7].copyText).toContain("Do not auto-message users");
    expect(props.weeklyCampaignCommentReplyCopy).toContain("Q: How do I join?");
    expect(props.instagramContentCalendarCopy).toContain("Instagram Content Calendar");
    expect(Object.keys(props).sort()).toEqual([
      "approvedWeeklyCampaignReviews",
      "campaignPerformanceSummary",
      "creatorEnabled",
      "dmKeywordCopy",
      "featureReviewQueue",
      "handleWeeklyCampaignReviewDecision",
      "handleWeeklyCampaignReviewSubmit",
      "instagramContentCalendarCopy",
      "isAdmin",
      "isSubmittingWeeklyCampaignReview",
      "launchRetrospectiveReadinessScriptCopy",
      "recommendedLaunchExperiment",
      "referralJoins",
      "reviewingWeeklyCampaignReviewId",
      "setWeeklyCampaignReviewNotes",
      "supportReviewQueue",
      "weeklyCampaignCaptionBankCopy",
      "weeklyCampaignCollabCopyCards",
      "weeklyCampaignCommentReplyCopy",
      "weeklyCampaignCompletionRecapStoryCopy",
      "weeklyCampaignCountdownStoryCopy",
      "weeklyCampaignExperimentBriefCopy",
      "weeklyCampaignFaqCarouselCopy",
      "weeklyCampaignFirstDayMonitorCopy",
      "weeklyCampaignLaunchCardCopy",
      "weeklyCampaignLaunchCopyQaCopy",
      "weeklyCampaignLiveQaCopy",
      "weeklyCampaignLiveRecapCopy",
      "weeklyCampaignMidweekAdjustmentCopy",
      "weeklyCampaignMidweekCheckInStoryCopy",
      "weeklyCampaignNextWeekLaunchAngleCopy",
      "weeklyCampaignNextWeekTeaserStoryCopy",
      "weeklyCampaignPartnerPerkTeaserStoryCopy",
      "weeklyCampaignPollReviewCopy",
      "weeklyCampaignPreflightAssetReadinessCopy",
      "weeklyCampaignPreflightChecklistHandoffCopy",
      "weeklyCampaignPreflightChecklistQaCopy",
      "weeklyCampaignPreflightCopy",
      "weeklyCampaignPreflightCopyFreezeCopy",
      "weeklyCampaignPreflightGoNoGoCopy",
      "weeklyCampaignPreflightLaunchPacketQaCopy",
      "weeklyCampaignPreflightOwnerHandoffCopy",
      "weeklyCampaignPreflightReadinessDecisionCopy",
      "weeklyCampaignPrompt",
      "weeklyCampaignReviewCopy",
      "weeklyCampaignReviewMessage",
      "weeklyCampaignReviewNotes",
      "weeklyCampaignReviewQueue",
      "weeklyCampaignStartDayStoryCopy",
      "weeklyCampaignStoryPollCopy",
      "weeklyCampaignStoryboardCopy",
      "weeklyCampaignSundayRecapQaCopy",
      "weeklyCampaignWeekendPushDecisionCopy",
      "weeklyCampaignWeekendPushStoryCopy",
    ]);
  });

  it("builds an operator summary from first-party campaign signals", () => {
    const data = buildProfileWeeklyCampaignDerivedData(buildWeeklyCampaignDerivedDataInput());
    const sectionData = buildWeeklyCampaignMarketingSectionData({
      ...buildWeeklyCampaignMarketingProps({
        ...data,
        campaignPerformanceSummary: buildWeeklyCampaignDerivedDataInput().campaignPerformanceSummary,
        creatorEnabled: true,
        featureReviewQueue: buildWeeklyCampaignDerivedDataInput().featureReviewQueue,
        instagramContentCalendarCopy: "Rise With The Tribe Instagram Content Calendar",
        isAdmin: true,
        referralJoins: 5,
        weeklyCampaignPrompt,
      }),
    });

    expect(sectionData.operatingSummaryProps.title).toBe("Weekly Campaign Operator Summary");
    expect(sectionData.operatingSummaryProps.status).toBe("READY");
    expect(sectionData.operatingSummaryProps.metrics).toEqual([
      ["Reach", 9],
      ["Active", 2],
      ["Referrals", 5],
      ["UGC", 2],
    ]);
    expect(sectionData.operatingSummaryProps.actionLanes.map(lane => lane.label)).toEqual([
      "READY",
      "REVIEW UGC",
      "REFERRAL SIGNAL",
    ]);
    expect(sectionData.operatingSummaryProps.copyText).toContain("Do not auto-post");
    expect(sectionData.operatingSummaryProps.copyText).toContain("Recommended review lens: Referral Sprint");
    expect(sectionData.weeklyCampaignMetricKitSections).toHaveLength(19);
    expect(sectionData.weeklyCampaignMetricKitSections[0].title).toBe("Weekly Campaign Launch Copy QA Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[0].buttonLabel).toBe("COPY LAUNCH COPY QA");
    expect(sectionData.weeklyCampaignMetricKitSections[0].copyText).toContain("Manual launch copy QA checklist");
    expect(sectionData.weeklyCampaignMetricKitSections[0].copyText).toContain("Do not auto-post to Instagram");
    expect(sectionData.weeklyCampaignMetricKitSections[1].title).toBe("Weekly Campaign First 24h Monitor Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[1].buttonLabel).toBe("COPY 24H MONITOR");
    expect(sectionData.weeklyCampaignMetricKitSections[1].copyText).toContain("Manual first 24h monitor checklist");
    expect(sectionData.weeklyCampaignMetricKitSections[1].copyText).toContain("support-risk replies");
    expect(sectionData.weeklyCampaignMetricKitSections[2].title).toBe("Weekly Campaign Midweek Adjustment Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[2].buttonLabel).toBe("COPY MIDWEEK ADJUSTMENT");
    expect(sectionData.weeklyCampaignMetricKitSections[2].copyText).toContain("Manual midweek adjustment checklist");
    expect(sectionData.weeklyCampaignMetricKitSections[2].copyText).toContain("Choose one adjustment lane");
    expect(sectionData.weeklyCampaignMetricKitSections[3].title).toBe("Weekly Campaign Weekend Push Decision Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[3].buttonLabel).toBe("COPY WEEKEND DECISION");
    expect(sectionData.weeklyCampaignMetricKitSections[3].copyText).toContain("Manual weekend push decision checklist");
    expect(sectionData.weeklyCampaignMetricKitSections[3].copyText).toContain("Sunday recap handoff");
    expect(sectionData.weeklyCampaignMetricKitSections[4].title).toBe("Weekly Campaign Sunday Recap QA Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[4].buttonLabel).toBe("COPY SUNDAY RECAP QA");
    expect(sectionData.weeklyCampaignMetricKitSections[4].copyText).toContain("Manual Sunday recap QA checklist");
    expect(sectionData.weeklyCampaignMetricKitSections[4].copyText).toContain("next-week handoff");
    expect(sectionData.weeklyCampaignMetricKitSections[5].title).toBe("Weekly Campaign Next-Week Launch Angle Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[5].buttonLabel).toBe("COPY NEXT-WEEK ANGLE");
    expect(sectionData.weeklyCampaignMetricKitSections[5].copyText).toContain("Manual next-week launch angle checklist");
    expect(sectionData.weeklyCampaignMetricKitSections[5].copyText).toContain("next preflight owner");
    expect(sectionData.weeklyCampaignMetricKitSections[6].title).toBe("Weekly Campaign Preflight Owner Handoff Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[6].buttonLabel).toBe("COPY PREFLIGHT HANDOFF");
    expect(sectionData.weeklyCampaignMetricKitSections[6].copyText).toContain("Manual preflight owner handoff checklist");
    expect(sectionData.weeklyCampaignMetricKitSections[6].copyText).toContain("copy boundary note");
    expect(sectionData.weeklyCampaignMetricKitSections[7].title).toBe("Weekly Campaign Preflight Readiness Decision Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[7].buttonLabel).toBe("COPY PREFLIGHT DECISION");
    expect(sectionData.weeklyCampaignMetricKitSections[7].copyText).toContain("Manual preflight readiness decision checklist");
    expect(sectionData.weeklyCampaignMetricKitSections[7].copyText).toContain("preflight start note");
    expect(sectionData.weeklyCampaignMetricKitSections[8].title).toBe("Weekly Campaign Preflight Copy Freeze Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[8].buttonLabel).toBe("COPY PREFLIGHT FREEZE");
    expect(sectionData.weeklyCampaignMetricKitSections[8].copyText).toContain("Manual preflight copy freeze checklist");
    expect(sectionData.weeklyCampaignMetricKitSections[8].copyText).toContain("copy-change owner");
    expect(sectionData.weeklyCampaignMetricKitSections[9].title).toBe("Weekly Campaign Preflight Asset Readiness Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[9].buttonLabel).toBe("COPY PREFLIGHT ASSETS");
    expect(sectionData.weeklyCampaignMetricKitSections[9].copyText).toContain("Manual preflight asset readiness checklist");
    expect(sectionData.weeklyCampaignMetricKitSections[9].copyText).toContain("preflight asset handoff");
    expect(sectionData.weeklyCampaignMetricKitSections[10].title).toBe("Weekly Campaign Preflight Launch Packet QA Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[10].buttonLabel).toBe("COPY PACKET QA");
    expect(sectionData.weeklyCampaignMetricKitSections[10].copyText).toContain("Manual preflight launch packet QA checklist");
    expect(sectionData.weeklyCampaignMetricKitSections[10].copyText).toContain("final preflight handoff");
    expect(sectionData.weeklyCampaignMetricKitSections[11].title).toBe("Weekly Campaign Preflight Go/No-Go Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[11].buttonLabel).toBe("COPY GO/NO-GO");
    expect(sectionData.weeklyCampaignMetricKitSections[11].copyText).toContain("Manual preflight go/no-go checklist");
    expect(sectionData.weeklyCampaignMetricKitSections[11].copyText).toContain("preflight checklist owner");
    expect(sectionData.weeklyCampaignMetricKitSections[12].title).toBe("Weekly Campaign Preflight Checklist Handoff Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[12].buttonLabel).toBe("COPY CHECKLIST HANDOFF");
    expect(sectionData.weeklyCampaignMetricKitSections[12].copyText).toContain("Manual preflight checklist handoff");
    expect(sectionData.weeklyCampaignMetricKitSections[12].copyText).toContain("preflight checklist start time");
    expect(sectionData.weeklyCampaignMetricKitSections[13].title).toBe("Weekly Campaign Preflight Checklist");
    expect(sectionData.weeklyCampaignMetricKitSections[14].title).toBe("Weekly Campaign Preflight Checklist QA Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[14].buttonLabel).toBe("COPY CHECKLIST QA");
    expect(sectionData.weeklyCampaignMetricKitSections[14].copyText).toContain("Manual preflight checklist QA");
    expect(sectionData.weeklyCampaignMetricKitSections[14].copyText).toContain("launch readiness handoff");
    expect(sectionData.weeklyCampaignMetricKitSections[18].title).toBe("Launch Retrospective Readiness Script Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[18].copyText).toContain("Manual retrospective readiness script");
    expect(sectionData.weeklyCampaignMetricKitSections[18].copyText).toContain("Do not create experiment records");
  });
});

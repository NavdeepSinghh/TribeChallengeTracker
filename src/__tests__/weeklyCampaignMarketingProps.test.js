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
      "weeklyCampaignNextWeekTeaserStoryCopy",
      "weeklyCampaignPartnerPerkTeaserStoryCopy",
      "weeklyCampaignPollReviewCopy",
      "weeklyCampaignPreflightCopy",
      "weeklyCampaignPrompt",
      "weeklyCampaignReviewCopy",
      "weeklyCampaignReviewMessage",
      "weeklyCampaignReviewNotes",
      "weeklyCampaignReviewQueue",
      "weeklyCampaignStartDayStoryCopy",
      "weeklyCampaignStoryPollCopy",
      "weeklyCampaignStoryboardCopy",
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
    expect(sectionData.weeklyCampaignMetricKitSections).toHaveLength(8);
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
    expect(sectionData.weeklyCampaignMetricKitSections[7].title).toBe("Launch Retrospective Readiness Script Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[7].copyText).toContain("Manual retrospective readiness script");
    expect(sectionData.weeklyCampaignMetricKitSections[7].copyText).toContain("Do not create experiment records");
  });
});

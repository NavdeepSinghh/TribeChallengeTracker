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
    expect(props.weeklyCampaignLaunchReadinessHandoffCopy).toContain("Weekly Campaign Launch Readiness Handoff Kit");
    expect(props.weeklyCampaignFinalPostingPrepQaCopy).toContain("Weekly Campaign Final Posting Prep QA Kit");
    expect(props.weeklyCampaignManualPostingOperatorBriefCopy).toContain("Weekly Campaign Manual Posting Operator Brief Kit");
    expect(props.weeklyCampaignPostCompleteCallbackQaCopy).toContain("Weekly Campaign Post-Complete Callback QA Kit");
    expect(props.weeklyCampaignReviewHandoffCopy).toContain("Weekly Campaign Review Handoff Kit");
    expect(props.weeklyCampaignReviewDecisionCopy).toContain("Weekly Campaign Review Decision Kit");
    expect(props.weeklyCampaignStoryboardHandoffCopy).toContain("Weekly Campaign Storyboard Handoff Kit");
    expect(props.weeklyCampaignStoryboardQaCopy).toContain("Weekly Campaign Storyboard QA Kit");
    expect(props.weeklyCampaignExperimentBriefHandoffCopy).toContain("Weekly Campaign Experiment Brief Handoff Kit");
    expect(props.weeklyCampaignExperimentBriefQaCopy).toContain("Weekly Campaign Experiment Brief QA Kit");
    expect(props.weeklyCampaignExperimentBriefApprovalCopy).toContain("Weekly Campaign Experiment Brief Approval Kit");
    expect(props.launchRetrospectiveDecisionCopy).toContain("Launch Retrospective Decision Kit");
    expect(props.launchRetrospectiveDecisionReplyCopy).toContain("Launch Retrospective Decision Reply Kit");
    expect(props.launchRetrospectiveNextCampaignBriefCopy).toContain("Launch Retrospective Next Campaign Brief Kit");
    expect(props.launchRetrospectiveNextCampaignBriefQaCopy).toContain("Launch Retrospective Next Campaign Brief QA Kit");
    expect(props.launchRetrospectiveNextCampaignFinalPostingPrepHandoffCopy).toContain("Launch Retrospective Next Campaign Final Posting Prep Handoff Kit");
    expect(props.launchRetrospectiveNextCampaignFinalPostingPrepQaBridgeCopy).toContain("Launch Retrospective Next Campaign Final Posting Prep QA Bridge Kit");
    expect(props.launchRetrospectiveNextCampaignManualPostingOperatorBriefQaBridgeCopy).toContain("Launch Retrospective Next Campaign Manual Posting Operator Brief QA Bridge Kit");
    expect(props.launchRetrospectiveNextCampaignManualPostingOperatorHandoffCopy).toContain("Launch Retrospective Next Campaign Manual Posting Operator Handoff Kit");
    expect(props.launchRetrospectiveNextCampaignPostCompleteCallbackHandoffCopy).toContain("Launch Retrospective Next Campaign Post-Complete Callback Handoff Kit");
    expect(props.launchRetrospectiveNextCampaignPostCompleteCallbackQaBridgeCopy).toContain("Launch Retrospective Next Campaign Post-Complete Callback QA Bridge Kit");
    expect(props.launchRetrospectiveNextCampaignReviewHandoffBridgeCopy).toContain("Launch Retrospective Next Campaign Review Handoff Bridge Kit");
    expect(props.launchRetrospectiveNextCampaignReviewHandoffQaBridgeCopy).toContain("Launch Retrospective Next Campaign Review Handoff QA Bridge Kit");
    expect(props.launchRetrospectiveNextCampaignReviewOwnerHandoffCopy).toContain("Launch Retrospective Next Campaign Review Owner Handoff Kit");
    expect(props.launchRetrospectiveNextCampaignReviewOwnerQaCopy).toContain("Launch Retrospective Next Campaign Review Owner QA Kit");
    expect(props.launchRetrospectiveNextCampaignReviewNotesHandoffCopy).toContain("Launch Retrospective Next Campaign Review Notes Handoff Kit");
    expect(props.launchRetrospectiveNextCampaignReviewNotesQaCopy).toContain("Launch Retrospective Next Campaign Review Notes QA Kit");
    expect(props.launchRetrospectiveNextCampaignReviewDecisionHandoffCopy).toContain("Launch Retrospective Next Campaign Review Decision Handoff Kit");
    expect(props.launchRetrospectiveNextCampaignReviewDecisionQaCopy).toContain("Launch Retrospective Next Campaign Review Decision QA Kit");
    expect(props.launchRetrospectiveNextCampaignReviewDecisionReplyHandoffCopy).toContain("Launch Retrospective Next Campaign Review Decision Reply Handoff Kit");
    expect(props.launchRetrospectiveNextCampaignLaunchCopyApprovalCopy).toContain("Launch Retrospective Next Campaign Launch Copy Approval Kit");
    expect(props.launchRetrospectiveNextCampaignLaunchCopyHandoffCopy).toContain("Launch Retrospective Next Campaign Launch Copy Handoff Kit");
    expect(props.launchRetrospectiveNextCampaignLaunchCopyQaBridgeCopy).toContain("Launch Retrospective Next Campaign Launch Copy QA Bridge Kit");
    expect(props.launchRetrospectiveNextCampaignPreflightBridgeCopy).toContain("Launch Retrospective Next Campaign Preflight Bridge Kit");
    expect(props.launchRetrospectiveNextCampaignHandoffCopy).toContain("Launch Retrospective Next Campaign Handoff Kit");
    expect(props.launchRetrospectiveNextCampaignQaCopy).toContain("Launch Retrospective Next Campaign QA Kit");
    expect(props.launchRetrospectiveReadinessHandoffCopy).toContain("Launch Retrospective Readiness Handoff Kit");
    expect(props.launchRetrospectiveReadinessQaCopy).toContain("Launch Retrospective Readiness QA Kit");
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
      "launchRetrospectiveDecisionCopy",
      "launchRetrospectiveDecisionReplyCopy",
      "launchRetrospectiveNextCampaignBriefCopy",
      "launchRetrospectiveNextCampaignBriefQaCopy",
      "launchRetrospectiveNextCampaignFinalPostingPrepHandoffCopy",
      "launchRetrospectiveNextCampaignFinalPostingPrepQaBridgeCopy",
      "launchRetrospectiveNextCampaignHandoffCopy",
      "launchRetrospectiveNextCampaignLaunchCopyApprovalCopy",
      "launchRetrospectiveNextCampaignLaunchCopyHandoffCopy",
      "launchRetrospectiveNextCampaignLaunchCopyQaBridgeCopy",
      "launchRetrospectiveNextCampaignManualPostingOperatorBriefQaBridgeCopy",
      "launchRetrospectiveNextCampaignManualPostingOperatorHandoffCopy",
      "launchRetrospectiveNextCampaignPostCompleteCallbackHandoffCopy",
      "launchRetrospectiveNextCampaignPostCompleteCallbackQaBridgeCopy",
      "launchRetrospectiveNextCampaignPreflightBridgeCopy",
      "launchRetrospectiveNextCampaignQaCopy",
      "launchRetrospectiveNextCampaignReviewDecisionHandoffCopy",
      "launchRetrospectiveNextCampaignReviewDecisionQaCopy",
      "launchRetrospectiveNextCampaignReviewDecisionReplyHandoffCopy",
      "launchRetrospectiveNextCampaignReviewHandoffBridgeCopy",
      "launchRetrospectiveNextCampaignReviewHandoffQaBridgeCopy",
      "launchRetrospectiveNextCampaignReviewNotesHandoffCopy",
      "launchRetrospectiveNextCampaignReviewNotesQaCopy",
      "launchRetrospectiveNextCampaignReviewOwnerHandoffCopy",
      "launchRetrospectiveNextCampaignReviewOwnerQaCopy",
      "launchRetrospectiveReadinessHandoffCopy",
      "launchRetrospectiveReadinessQaCopy",
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
      "weeklyCampaignExperimentBriefApprovalCopy",
      "weeklyCampaignExperimentBriefCopy",
      "weeklyCampaignExperimentBriefHandoffCopy",
      "weeklyCampaignExperimentBriefQaCopy",
      "weeklyCampaignFaqCarouselCopy",
      "weeklyCampaignFinalPostingPrepQaCopy",
      "weeklyCampaignFirstDayMonitorCopy",
      "weeklyCampaignLaunchCardCopy",
      "weeklyCampaignLaunchCopyQaCopy",
      "weeklyCampaignLaunchReadinessHandoffCopy",
      "weeklyCampaignLiveQaCopy",
      "weeklyCampaignLiveRecapCopy",
      "weeklyCampaignManualPostingOperatorBriefCopy",
      "weeklyCampaignMidweekAdjustmentCopy",
      "weeklyCampaignMidweekCheckInStoryCopy",
      "weeklyCampaignNextWeekLaunchAngleCopy",
      "weeklyCampaignNextWeekTeaserStoryCopy",
      "weeklyCampaignPartnerPerkTeaserStoryCopy",
      "weeklyCampaignPollReviewCopy",
      "weeklyCampaignPostCompleteCallbackQaCopy",
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
      "weeklyCampaignReviewDecisionCopy",
      "weeklyCampaignReviewHandoffCopy",
      "weeklyCampaignReviewMessage",
      "weeklyCampaignReviewNotes",
      "weeklyCampaignReviewQueue",
      "weeklyCampaignStartDayStoryCopy",
      "weeklyCampaignStoryPollCopy",
      "weeklyCampaignStoryboardCopy",
      "weeklyCampaignStoryboardHandoffCopy",
      "weeklyCampaignStoryboardQaCopy",
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
    expect(sectionData.weeklyCampaignMetricKitSections).toHaveLength(57);
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
    expect(sectionData.weeklyCampaignMetricKitSections[15].title).toBe("Weekly Campaign Launch Readiness Handoff Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[15].buttonLabel).toBe("COPY READY HANDOFF");
    expect(sectionData.weeklyCampaignMetricKitSections[15].copyText).toContain("Manual launch readiness handoff");
    expect(sectionData.weeklyCampaignMetricKitSections[15].copyText).toContain("launch operator handoff");
    expect(sectionData.weeklyCampaignMetricKitSections[16].title).toBe("Weekly Campaign Final Posting Prep QA Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[16].buttonLabel).toBe("COPY POSTING QA");
    expect(sectionData.weeklyCampaignMetricKitSections[16].copyText).toContain("Manual final posting prep QA");
    expect(sectionData.weeklyCampaignMetricKitSections[16].copyText).toContain("manual launch operator");
    expect(sectionData.weeklyCampaignMetricKitSections[17].title).toBe("Weekly Campaign Manual Posting Operator Brief Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[17].buttonLabel).toBe("COPY OPERATOR BRIEF");
    expect(sectionData.weeklyCampaignMetricKitSections[17].copyText).toContain("Manual posting operator brief");
    expect(sectionData.weeklyCampaignMetricKitSections[17].copyText).toContain("manual post-complete callback owner");
    expect(sectionData.weeklyCampaignMetricKitSections[18].title).toBe("Weekly Campaign Post-Complete Callback QA Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[18].buttonLabel).toBe("COPY CALLBACK QA");
    expect(sectionData.weeklyCampaignMetricKitSections[18].copyText).toContain("Manual post-complete callback QA");
    expect(sectionData.weeklyCampaignMetricKitSections[18].copyText).toContain("first-party monitor owner");
    expect(sectionData.weeklyCampaignMetricKitSections[19].title).toBe("Weekly Campaign Review Handoff Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[19].buttonLabel).toBe("COPY REVIEW HANDOFF");
    expect(sectionData.weeklyCampaignMetricKitSections[19].copyText).toContain("Manual review handoff");
    expect(sectionData.weeklyCampaignMetricKitSections[19].copyText).toContain("first-party signal summary");
    expect(sectionData.weeklyCampaignMetricKitSections[20].title).toBe("Weekly Campaign Review Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[21].title).toBe("Weekly Campaign Review Decision Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[21].buttonLabel).toBe("COPY REVIEW DECISION");
    expect(sectionData.weeklyCampaignMetricKitSections[21].copyText).toContain("Manual review decision");
    expect(sectionData.weeklyCampaignMetricKitSections[21].copyText).toContain("next content owner");
    expect(sectionData.weeklyCampaignMetricKitSections[22].title).toBe("Weekly Campaign Storyboard Handoff Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[22].buttonLabel).toBe("COPY STORYBOARD HANDOFF");
    expect(sectionData.weeklyCampaignMetricKitSections[22].copyText).toContain("Manual storyboard handoff");
    expect(sectionData.weeklyCampaignMetricKitSections[22].copyText).toContain("paid-language hold note");
    expect(sectionData.weeklyCampaignMetricKitSections[23].title).toBe("Weekly Campaign Storyboard Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[24].title).toBe("Weekly Campaign Storyboard QA Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[24].buttonLabel).toBe("COPY STORYBOARD QA");
    expect(sectionData.weeklyCampaignMetricKitSections[24].copyText).toContain("Manual storyboard QA");
    expect(sectionData.weeklyCampaignMetricKitSections[24].copyText).toContain("experiment brief owner");
    expect(sectionData.weeklyCampaignMetricKitSections[25].title).toBe("Weekly Campaign Experiment Brief Handoff Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[25].buttonLabel).toBe("COPY EXPERIMENT HANDOFF");
    expect(sectionData.weeklyCampaignMetricKitSections[25].copyText).toContain("Manual experiment brief handoff");
    expect(sectionData.weeklyCampaignMetricKitSections[25].copyText).toContain("approved storyboard reference");
    expect(sectionData.weeklyCampaignMetricKitSections[26].title).toBe("Weekly Campaign Experiment Brief QA Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[26].buttonLabel).toBe("COPY EXPERIMENT QA");
    expect(sectionData.weeklyCampaignMetricKitSections[26].copyText).toContain("Manual experiment brief QA");
    expect(sectionData.weeklyCampaignMetricKitSections[26].copyText).toContain("retrospective readiness owner");
    expect(sectionData.weeklyCampaignMetricKitSections[28].title).toBe("Weekly Campaign Experiment Brief Approval Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[28].buttonLabel).toBe("COPY EXPERIMENT APPROVAL");
    expect(sectionData.weeklyCampaignMetricKitSections[28].copyText).toContain("Manual experiment brief approval");
    expect(sectionData.weeklyCampaignMetricKitSections[28].copyText).toContain("retrospective readiness trigger");
    expect(sectionData.weeklyCampaignMetricKitSections[29].title).toBe("Launch Retrospective Readiness Handoff Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[29].buttonLabel).toBe("COPY RETRO HANDOFF");
    expect(sectionData.weeklyCampaignMetricKitSections[29].copyText).toContain("Manual retrospective readiness handoff");
    expect(sectionData.weeklyCampaignMetricKitSections[29].copyText).toContain("repeat/hold decision deadline");
    expect(sectionData.weeklyCampaignMetricKitSections[30].title).toBe("Launch Retrospective Readiness QA Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[30].buttonLabel).toBe("COPY RETRO QA");
    expect(sectionData.weeklyCampaignMetricKitSections[30].copyText).toContain("Manual retrospective readiness QA");
    expect(sectionData.weeklyCampaignMetricKitSections[30].copyText).toContain("repeat/hold decision owner");
    expect(sectionData.weeklyCampaignMetricKitSections[31].title).toBe("Launch Retrospective Readiness Script Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[31].copyText).toContain("Manual retrospective readiness script");
    expect(sectionData.weeklyCampaignMetricKitSections[31].copyText).toContain("Do not create experiment records");
    expect(sectionData.weeklyCampaignMetricKitSections[32].title).toBe("Launch Retrospective Decision Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[32].buttonLabel).toBe("COPY RETRO DECISION");
    expect(sectionData.weeklyCampaignMetricKitSections[32].copyText).toContain("Manual retrospective decision");
    expect(sectionData.weeklyCampaignMetricKitSections[32].copyText).toContain("next campaign owner");
    expect(sectionData.weeklyCampaignMetricKitSections[33].title).toBe("Launch Retrospective Decision Reply Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[33].buttonLabel).toBe("COPY RETRO REPLY");
    expect(sectionData.weeklyCampaignMetricKitSections[33].copyText).toContain("Manual retrospective decision replies");
    expect(sectionData.weeklyCampaignMetricKitSections[33].copyText).toContain("APPROVED TO REPEAT");
    expect(sectionData.weeklyCampaignMetricKitSections[33].copyText).toContain("OPEN STORE QA");
    expect(sectionData.weeklyCampaignMetricKitSections[34].title).toBe("Launch Retrospective Next Campaign Handoff Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[34].buttonLabel).toBe("COPY NEXT HANDOFF");
    expect(sectionData.weeklyCampaignMetricKitSections[34].copyText).toContain("Manual next campaign handoff");
    expect(sectionData.weeklyCampaignMetricKitSections[34].copyText).toContain("next preflight owner");
    expect(sectionData.weeklyCampaignMetricKitSections[35].title).toBe("Launch Retrospective Next Campaign QA Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[35].buttonLabel).toBe("COPY NEXT QA");
    expect(sectionData.weeklyCampaignMetricKitSections[35].copyText).toContain("Manual next campaign QA");
    expect(sectionData.weeklyCampaignMetricKitSections[35].copyText).toContain("next campaign QA owner");
    expect(sectionData.weeklyCampaignMetricKitSections[36].title).toBe("Launch Retrospective Next Campaign Brief Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[36].buttonLabel).toBe("COPY NEXT BRIEF");
    expect(sectionData.weeklyCampaignMetricKitSections[36].copyText).toContain("Manual next campaign brief");
    expect(sectionData.weeklyCampaignMetricKitSections[36].copyText).toContain("app-first campaign angle");
    expect(sectionData.weeklyCampaignMetricKitSections[37].title).toBe("Launch Retrospective Next Campaign Brief QA Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[37].buttonLabel).toBe("COPY BRIEF QA");
    expect(sectionData.weeklyCampaignMetricKitSections[37].copyText).toContain("Manual next campaign brief QA");
    expect(sectionData.weeklyCampaignMetricKitSections[37].copyText).toContain("next campaign brief QA owner");
    expect(sectionData.weeklyCampaignMetricKitSections[38].title).toBe("Launch Retrospective Next Campaign Preflight Bridge Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[38].buttonLabel).toBe("COPY PREFLIGHT BRIDGE");
    expect(sectionData.weeklyCampaignMetricKitSections[38].copyText).toContain("Manual next campaign preflight bridge");
    expect(sectionData.weeklyCampaignMetricKitSections[38].copyText).toContain("launch-copy QA owner");
    expect(sectionData.weeklyCampaignMetricKitSections[39].title).toBe("Launch Retrospective Next Campaign Launch Copy Handoff Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[39].buttonLabel).toBe("COPY LAUNCH COPY HANDOFF");
    expect(sectionData.weeklyCampaignMetricKitSections[39].copyText).toContain("Manual next campaign launch-copy handoff");
    expect(sectionData.weeklyCampaignMetricKitSections[39].copyText).toContain("launch-copy writer");
    expect(sectionData.weeklyCampaignMetricKitSections[40].title).toBe("Launch Retrospective Next Campaign Launch Copy QA Bridge Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[40].buttonLabel).toBe("COPY LAUNCH COPY QA BRIDGE");
    expect(sectionData.weeklyCampaignMetricKitSections[40].copyText).toContain("Manual next campaign launch-copy QA bridge");
    expect(sectionData.weeklyCampaignMetricKitSections[40].copyText).toContain("approved launch-copy handoff reference");
    expect(sectionData.weeklyCampaignMetricKitSections[41].title).toBe("Launch Retrospective Next Campaign Launch Copy Approval Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[41].buttonLabel).toBe("COPY LAUNCH COPY APPROVAL");
    expect(sectionData.weeklyCampaignMetricKitSections[41].copyText).toContain("Manual next campaign launch-copy approval");
    expect(sectionData.weeklyCampaignMetricKitSections[41].copyText).toContain("manual posting prep owner");
    expect(sectionData.weeklyCampaignMetricKitSections[42].title).toBe("Launch Retrospective Next Campaign Final Posting Prep Handoff Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[42].buttonLabel).toBe("COPY POSTING PREP HANDOFF");
    expect(sectionData.weeklyCampaignMetricKitSections[42].copyText).toContain("Manual next campaign final posting prep handoff");
    expect(sectionData.weeklyCampaignMetricKitSections[42].copyText).toContain("approved launch-copy approval reference");
    expect(sectionData.weeklyCampaignMetricKitSections[43].title).toBe("Launch Retrospective Next Campaign Final Posting Prep QA Bridge Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[43].buttonLabel).toBe("COPY POSTING PREP QA BRIDGE");
    expect(sectionData.weeklyCampaignMetricKitSections[43].copyText).toContain("Manual next campaign final posting prep QA bridge");
    expect(sectionData.weeklyCampaignMetricKitSections[43].copyText).toContain("manual posting operator brief owner");
    expect(sectionData.weeklyCampaignMetricKitSections[44].title).toBe("Launch Retrospective Next Campaign Manual Posting Operator Handoff Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[44].buttonLabel).toBe("COPY OPERATOR HANDOFF");
    expect(sectionData.weeklyCampaignMetricKitSections[44].copyText).toContain("Manual next campaign posting operator handoff");
    expect(sectionData.weeklyCampaignMetricKitSections[44].copyText).toContain("post-complete callback owner");
    expect(sectionData.weeklyCampaignMetricKitSections[45].title).toBe("Launch Retrospective Next Campaign Manual Posting Operator Brief QA Bridge Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[45].buttonLabel).toBe("COPY OPERATOR QA BRIDGE");
    expect(sectionData.weeklyCampaignMetricKitSections[45].copyText).toContain("Manual next campaign operator brief QA bridge");
    expect(sectionData.weeklyCampaignMetricKitSections[45].copyText).toContain("first-party monitor owner");
    expect(sectionData.weeklyCampaignMetricKitSections[46].title).toBe("Launch Retrospective Next Campaign Post-Complete Callback Handoff Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[46].buttonLabel).toBe("COPY CALLBACK HANDOFF");
    expect(sectionData.weeklyCampaignMetricKitSections[46].copyText).toContain("Manual next campaign post-complete callback handoff");
    expect(sectionData.weeklyCampaignMetricKitSections[46].copyText).toContain("review handoff owner");
    expect(sectionData.weeklyCampaignMetricKitSections[47].title).toBe("Launch Retrospective Next Campaign Post-Complete Callback QA Bridge Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[47].buttonLabel).toBe("COPY CALLBACK QA BRIDGE");
    expect(sectionData.weeklyCampaignMetricKitSections[47].copyText).toContain("Manual next campaign post-complete callback QA bridge");
    expect(sectionData.weeklyCampaignMetricKitSections[47].copyText).toContain("Weekly Campaign Review Handoff Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[48].title).toBe("Launch Retrospective Next Campaign Review Handoff Bridge Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[48].buttonLabel).toBe("COPY REVIEW BRIDGE");
    expect(sectionData.weeklyCampaignMetricKitSections[48].copyText).toContain("Manual next campaign review handoff bridge");
    expect(sectionData.weeklyCampaignMetricKitSections[48].copyText).toContain("weekly campaign review owner");
    expect(sectionData.weeklyCampaignMetricKitSections[49].title).toBe("Launch Retrospective Next Campaign Review Handoff QA Bridge Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[49].buttonLabel).toBe("COPY REVIEW QA BRIDGE");
    expect(sectionData.weeklyCampaignMetricKitSections[49].copyText).toContain("Manual next campaign review handoff QA bridge");
    expect(sectionData.weeklyCampaignMetricKitSections[49].copyText).toContain("Weekly Campaign Review Handoff Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[50].title).toBe("Launch Retrospective Next Campaign Review Owner Handoff Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[50].buttonLabel).toBe("COPY REVIEW OWNER");
    expect(sectionData.weeklyCampaignMetricKitSections[50].copyText).toContain("Manual next campaign review owner handoff");
    expect(sectionData.weeklyCampaignMetricKitSections[50].copyText).toContain("review decision owner");
    expect(sectionData.weeklyCampaignMetricKitSections[51].title).toBe("Launch Retrospective Next Campaign Review Owner QA Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[51].buttonLabel).toBe("COPY REVIEW OWNER QA");
    expect(sectionData.weeklyCampaignMetricKitSections[51].copyText).toContain("Manual next campaign review owner QA");
    expect(sectionData.weeklyCampaignMetricKitSections[51].copyText).toContain("review owner QA reviewer");
    expect(sectionData.weeklyCampaignMetricKitSections[52].title).toBe("Launch Retrospective Next Campaign Review Notes Handoff Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[52].buttonLabel).toBe("COPY REVIEW NOTES");
    expect(sectionData.weeklyCampaignMetricKitSections[52].copyText).toContain("Manual next campaign review notes handoff");
    expect(sectionData.weeklyCampaignMetricKitSections[52].copyText).toContain("review notes owner");
    expect(sectionData.weeklyCampaignMetricKitSections[53].title).toBe("Launch Retrospective Next Campaign Review Notes QA Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[53].buttonLabel).toBe("COPY REVIEW NOTES QA");
    expect(sectionData.weeklyCampaignMetricKitSections[53].copyText).toContain("Manual next campaign review notes QA");
    expect(sectionData.weeklyCampaignMetricKitSections[53].copyText).toContain("review notes QA reviewer");
    expect(sectionData.weeklyCampaignMetricKitSections[54].title).toBe("Launch Retrospective Next Campaign Review Decision Handoff Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[54].buttonLabel).toBe("COPY REVIEW DECISION");
    expect(sectionData.weeklyCampaignMetricKitSections[54].copyText).toContain("Manual next campaign review decision handoff");
    expect(sectionData.weeklyCampaignMetricKitSections[54].copyText).toContain("review decision owner");
    expect(sectionData.weeklyCampaignMetricKitSections[55].title).toBe("Launch Retrospective Next Campaign Review Decision QA Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[55].buttonLabel).toBe("COPY REVIEW DECISION QA");
    expect(sectionData.weeklyCampaignMetricKitSections[55].copyText).toContain("Manual next campaign review decision QA");
    expect(sectionData.weeklyCampaignMetricKitSections[55].copyText).toContain("review decision QA reviewer");
    expect(sectionData.weeklyCampaignMetricKitSections[56].title).toBe("Launch Retrospective Next Campaign Review Decision Reply Handoff Kit");
    expect(sectionData.weeklyCampaignMetricKitSections[56].buttonLabel).toBe("COPY REVIEW REPLY");
    expect(sectionData.weeklyCampaignMetricKitSections[56].copyText).toContain("Manual next campaign review decision reply handoff");
    expect(sectionData.weeklyCampaignMetricKitSections[56].copyText).toContain("decision reply owner");
  });
});

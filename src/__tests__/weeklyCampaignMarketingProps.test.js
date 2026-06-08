const {
  buildProfileWeeklyCampaignDerivedData,
} = require("../profile/profileWeeklyCampaignDerivedData");
const {
  buildWeeklyCampaignMarketingProps,
} = require("../profile/weeklyCampaignMarketingProps");
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
    expect(props.weeklyCampaignCollabCopyCards).toHaveLength(7);
    expect(props.weeklyCampaignCommentReplyCopy).toContain("Q: How do I join?");
    expect(props.instagramContentCalendarCopy).toContain("Instagram Content Calendar");
    expect(Object.keys(props).sort()).toEqual([
      "campaignPerformanceSummary",
      "creatorEnabled",
      "dmKeywordCopy",
      "featureReviewQueue",
      "instagramContentCalendarCopy",
      "isAdmin",
      "recommendedLaunchExperiment",
      "referralJoins",
      "weeklyCampaignCaptionBankCopy",
      "weeklyCampaignCollabCopyCards",
      "weeklyCampaignCommentReplyCopy",
      "weeklyCampaignCompletionRecapStoryCopy",
      "weeklyCampaignCountdownStoryCopy",
      "weeklyCampaignExperimentBriefCopy",
      "weeklyCampaignFaqCarouselCopy",
      "weeklyCampaignLaunchCardCopy",
      "weeklyCampaignLiveQaCopy",
      "weeklyCampaignLiveRecapCopy",
      "weeklyCampaignMidweekCheckInStoryCopy",
      "weeklyCampaignNextWeekTeaserStoryCopy",
      "weeklyCampaignPartnerPerkTeaserStoryCopy",
      "weeklyCampaignPollReviewCopy",
      "weeklyCampaignPreflightCopy",
      "weeklyCampaignPrompt",
      "weeklyCampaignReviewCopy",
      "weeklyCampaignStartDayStoryCopy",
      "weeklyCampaignStoryPollCopy",
      "weeklyCampaignStoryboardCopy",
      "weeklyCampaignWeekendPushStoryCopy",
    ]);
  });
});

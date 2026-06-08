const weeklyCampaignPrompt = {
  cta: "Log one honest session today.",
  duration: 7,
  hashtag: "#TribeReset",
  label: "Reset Week",
  name: "Seven Day Reset",
  week: 12,
};

function buildWeeklyCampaignDerivedDataInput() {
  return {
    campaignPerformanceSummary: {
      active: 2,
      memberReach: 9,
      premium: 1,
      public: 2,
      seasonal: 1,
      total: 3,
    },
    featureReviewQueue: [{ id: "feature-1" }, { id: "feature-2" }],
    monetizationSignalTotal: 7,
    partnerDemandTotal: 3,
    proTrialDemandTotal: 1,
    referralJoins: 5,
    storeCatalog: [
      { id: "com.risewiththetribe.pro.monthly", kind: "subscription" },
      { id: "com.risewiththetribe.pack.reset", kind: "pack" },
    ],
    storePackCount: 2,
    weeklyCampaignPrompt,
  };
}

module.exports = {
  buildWeeklyCampaignDerivedDataInput,
  weeklyCampaignPrompt,
};

import {
  buildLaunchExperiments,
  buildLaunchQaChecklist,
  pickRecommendedLaunchExperiment,
  scoreLaunchExperiment,
} from './monetizationModel';

export function buildLaunchExperimentCopy({
  proTrialDemandTotal,
  storePackCount,
  referralJoins,
  partnerDemandTotal,
  weeklyCampaignPrompt,
  monetizationSignalTotal,
  campaignPerformanceSummary,
  storeCatalog,
}) {
  const launchExperiments = buildLaunchExperiments({
    proTrialDemandTotal,
    storePackCount,
    referralJoins,
    partnerDemandTotal,
  });
  const recommendedLaunchExperiment = pickRecommendedLaunchExperiment(launchExperiments);
  const {
    scorecard: experimentScorecard,
    score: experimentScore,
    label: experimentScoreLabel,
  } = scoreLaunchExperiment({
    monetizationSignalTotal,
    referralJoins,
    campaignPerformanceSummary,
  });
  const launchQaChecklist = buildLaunchQaChecklist(storeCatalog);

  return {
    launchExperiments,
    experimentScore,
    experimentScoreLabel,
    recommendedLaunchExperiment,
    weeklyCampaignExperimentBriefCopy: `Rise With The Tribe Weekly Campaign Experiment Brief Kit:\n\nCampaign: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nRecommended experiment: ${recommendedLaunchExperiment.label}\nSignal: ${recommendedLaunchExperiment.signal}\nAction: ${recommendedLaunchExperiment.action}\n\nExperiment brief:\n[ ] Anchor the experiment to this week's campaign CTA: ${weeklyCampaignPrompt.cta}\n[ ] Use the launch card, storyboard, content calendar, and DM keyword kit as manual copy inputs\n[ ] Measure only first-party app movement: challenge joins, referral joins, feature submissions, share-card usage, and saved interest signals\n[ ] Review the result with the Weekly Campaign Review Kit before repeating or retiring the experiment\n\nThis is a manual weekly campaign experiment brief only. Do not create experiment records, schedule posts, auto-post to Instagram, add tracking pixels, scrape or store Instagram DMs, export per-user activity, share user content without consent, imply paid access is live, promise outcomes, or imply medical results.`,
    launchExperimentCopy: `Rise With The Tribe Launch Experiment Kit:\n\nRecommended test: ${recommendedLaunchExperiment.label}\nSignal: ${recommendedLaunchExperiment.signal}\nAction: ${recommendedLaunchExperiment.action}\n\nThis is a manual Instagram/app experiment. Use first-party app signals only, do not add tracking pixels, and do not promote paid access as live until store validation and entitlement QA are complete.\n\nThis week's campaign hook: ${weeklyCampaignPrompt.name} - ${weeklyCampaignPrompt.cta} ${weeklyCampaignPrompt.hashtag}`,
    launchExperimentScorecardCopy: `Rise With The Tribe Launch Experiment Scorecard:\n\nRecommended test: ${recommendedLaunchExperiment.label}\nScore: ${experimentScore}/100 (${experimentScoreLabel})\nDemand signal: ${experimentScorecard.demandSignal}\nCampaign reach: ${experimentScorecard.campaignReach}\nCommunity loop: ${experimentScorecard.communityLoop}\nRisk: ${experimentScorecard.risk}\n\nUse this as a manual planning score only. It uses first-party app signals, does not add tracking pixels, and does not grant or imply paid access.`,
    launchQaChecklistCopy: `Rise With The Tribe Release QA Checklist:\n\n${launchQaChecklist.map(([label, status, ready]) => `${ready ? '[x]' : '[ ]'} ${label}: ${status}`).join('\n')}\n\nBefore a monetization or social launch: confirm store products, receipt-validation credentials, entitlement writes, feature parity docs, and native/web share flows across Web, iOS, and Android.`,
    launchRetrospectiveCopy: `Rise With The Tribe Launch Retrospective Kit:\n\nExperiment reviewed: ${recommendedLaunchExperiment.label}\nPlanning score: ${experimentScore}/100 (${experimentScoreLabel})\nDemand signal: ${experimentScorecard.demandSignal}\nCampaign reach: ${experimentScorecard.campaignReach}\nReferral joins: ${referralJoins}\nCommunity loop: ${experimentScorecard.communityLoop}\n\nReview manually after the push: challenge joins, referral movement, feature submissions, share-card usage, and entitlement validation. This is a first-party review prompt only; it does not add tracking pixels, automated attribution, or paid-access changes.`,
  };
}

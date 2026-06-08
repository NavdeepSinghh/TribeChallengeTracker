export function buildWeeklyCampaignOperatingSummary({
  campaignPerformanceSummary = {},
  featureReviewQueue = [],
  recommendedLaunchExperiment = {},
  referralJoins = 0,
  weeklyCampaignPrompt = {},
}) {
  const memberReach = campaignPerformanceSummary.memberReach || 0;
  const activeCampaigns = campaignPerformanceSummary.active || 0;
  const pendingFeatureReviews = featureReviewQueue.length;
  const experimentLabel = recommendedLaunchExperiment.label || 'First-party review';
  const campaignName = weeklyCampaignPrompt.name || 'This week';
  const hashtag = weeklyCampaignPrompt.hashtag || '#RiseWithTheTribe';

  const readinessLevel = memberReach > 0 && activeCampaigns > 0 ? 'READY' : 'PREP';
  const reviewLevel = pendingFeatureReviews > 0 ? 'REVIEW UGC' : 'NO UGC QUEUE';
  const referralLevel = referralJoins > 0 ? 'REFERRAL SIGNAL' : 'SEED INVITES';

  return {
    title: 'Weekly Campaign Operator Summary',
    subtitle: `${campaignName} ${hashtag}`,
    status: readinessLevel,
    accent: '#38bdf8',
    metrics: [
      ['Reach', memberReach],
      ['Active', activeCampaigns],
      ['Referrals', referralJoins],
      ['UGC', pendingFeatureReviews],
    ],
    actionLanes: [
      {
        label: readinessLevel,
        body: `${campaignName} has ${memberReach} member${memberReach === 1 ? '' : 's'} in reach. Keep the CTA app-first and use ${experimentLabel} as the manual test lens.`,
      },
      {
        label: reviewLevel,
        body: pendingFeatureReviews > 0
          ? `Review ${pendingFeatureReviews} Feature Me submission${pendingFeatureReviews === 1 ? '' : 's'} before any recap, repost, or creator collab mention.`
          : 'No Feature Me queue is waiting; use aggregate campaign movement only in public recap copy.',
      },
      {
        label: referralLevel,
        body: referralJoins > 0
          ? `Turn ${referralJoins} referral join${referralJoins === 1 ? '' : 's'} into the next re-invite prompt without granting rewards or tracking link opens.`
          : 'Seed the next invite from the weekly challenge loop before introducing paid, partner, or creator paths.',
      },
    ],
    copyText: [
      `Weekly Campaign Operator Summary: ${campaignName}`,
      `Hashtag: ${hashtag}`,
      `Status: ${readinessLevel}`,
      `Member reach: ${memberReach}`,
      `Active campaigns: ${activeCampaigns}`,
      `Referral joins: ${referralJoins}`,
      `Feature Me queue: ${pendingFeatureReviews}`,
      `Recommended review lens: ${experimentLabel}`,
      '',
      'Next manual steps:',
      `1. ${campaignName}: keep CTA app-first and review first-party app movement only.`,
      `2. UGC: ${pendingFeatureReviews > 0 ? 'review consent-cleared submissions before recap copy.' : 'use aggregate movement only.'}`,
      `3. Referrals: ${referralJoins > 0 ? 're-invite from meaningful challenge joins.' : 'seed invites from the challenge loop.'}`,
      '',
      'Do not auto-post, scrape comments or DMs, store Instagram identities, count link opens, grant rewards, write entitlements, imply paid access is live, promise outcomes, imply medical results, or pressure users.',
    ].join('\n'),
  };
}

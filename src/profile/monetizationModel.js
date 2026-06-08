export { buildMonetizationSummaryCopy } from './monetizationSummaryCopy';

export function buildRevenuePathways({
  proTrialDemandTotal,
  campaignPerformanceSummary,
  storePackCount,
  creatorRevenueShareTotal,
  creatorRevenueShareSummary,
  partnerDemandTotal,
  referralJoins,
}) {
  return [
    {
      id: 'pro',
      label: 'Tribe Pro',
      signal: proTrialDemandTotal + Math.min(3, campaignPerformanceSummary.memberReach || 0),
      action: 'Prioritize store trial setup, Pro report previews, and upgrade copy around deeper accountability.',
    },
    {
      id: 'packs',
      label: 'Paid Packs',
      signal: storePackCount + Math.min(3, campaignPerformanceSummary.premium || 0),
      action: 'Tease the next structured pack, validate store products, and keep free challenge participation warm.',
    },
    {
      id: 'creator',
      label: 'Creator Hosting',
      signal: creatorRevenueShareTotal + (creatorRevenueShareSummary.branded || 0),
      action: 'Prepare creator terms, hosted challenge support, and payout operations before paid hosting.',
    },
    {
      id: 'partner',
      label: 'Partner Campaign',
      signal: partnerDemandTotal + Math.min(3, referralJoins),
      action: 'Pilot one sponsor-backed challenge perk using first-party demand and campaign reach only.',
    },
  ];
}

export function pickRecommendedRevenuePath(revenuePathways) {
  return [...revenuePathways].sort((a, b) => {
    const aReady = a.signal > 0 ? 1 : 0;
    const bReady = b.signal > 0 ? 1 : 0;
    return bReady - aReady || b.signal - a.signal;
  })[0];
}

export function isValidationReadinessConfirmed(validationReadinessMessage) {
  return Boolean(
    validationReadinessMessage
      && !validationReadinessMessage.includes('Could not')
      && !validationReadinessMessage.includes('No entitlements were changed'),
  );
}

export {
  getMinimumStoreTestEvidenceStatus,
  summarizeStoreTestEvidence,
} from './storeTestEvidenceModel';

export function buildPaidLaunchDecisionItems({
  storeCatalog,
  monetizationSignalTotal,
  validationReadinessConfirmed,
  storeTestEvidenceReady,
}) {
  return [
    { label: 'Product IDs in code', ready: storeCatalog.length > 0 },
    { label: 'First-party demand captured', ready: monetizationSignalTotal > 0 },
    { label: 'Support and refund handoff drafted', ready: true },
    { label: 'Receipt-validation credentials confirmed', ready: validationReadinessConfirmed },
    { label: 'Store test evidence recorded', ready: storeTestEvidenceReady },
    { label: 'Entitlement QA passed', ready: false },
  ];
}

export {
  buildLaunchExperiments,
  buildLaunchQaChecklist,
  pickRecommendedLaunchExperiment,
  scoreLaunchExperiment,
} from './launchExperimentModel';

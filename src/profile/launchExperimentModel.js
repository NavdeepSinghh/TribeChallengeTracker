export function buildLaunchExperiments({
  proTrialDemandTotal,
  storePackCount,
  referralJoins,
  partnerDemandTotal,
}) {
  return [
    {
      id: 'pro_trial',
      label: 'Pro Trial CTA',
      signal: proTrialDemandTotal,
      action: 'Post a Pro report preview and ask followers to save Pro Trial Interest in the app.',
    },
    {
      id: 'pack_drop',
      label: 'Pack Drop Tease',
      signal: storePackCount,
      action: 'Tease the next paid challenge pack, then route members to the free challenge loop until store tests pass.',
    },
    {
      id: 'referral_sprint',
      label: 'Referral Sprint',
      signal: referralJoins,
      action: 'Run a 48-hour invite push around the next referral tier and ask members to bring one accountability partner.',
    },
    {
      id: 'partner_perk',
      label: 'Partner Perk Poll',
      signal: partnerDemandTotal,
      action: 'Ask the audience which aligned perk would help them stay consistent, then capture interest inside profile perks.',
    },
  ];
}

export function pickRecommendedLaunchExperiment(launchExperiments) {
  return [...launchExperiments].sort((a, b) => {
    const aReady = a.signal > 0 ? 1 : 0;
    const bReady = b.signal > 0 ? 1 : 0;
    return bReady - aReady || b.signal - a.signal;
  })[0];
}

export function scoreLaunchExperiment({ monetizationSignalTotal, referralJoins, campaignPerformanceSummary }) {
  const scorecard = {
    demandSignal: monetizationSignalTotal + referralJoins,
    campaignReach: campaignPerformanceSummary.memberReach || 0,
    communityLoop: referralJoins + (campaignPerformanceSummary.memberReach || 0),
    risk: 'LOW',
  };
  const score = Math.min(100, Math.round(
    Math.min(40, scorecard.demandSignal * 8)
    + Math.min(35, scorecard.campaignReach * 2)
    + Math.min(25, scorecard.communityLoop * 3)
  ));
  const label = score >= 70 ? 'READY' : score >= 35 ? 'BUILD' : 'SEED';
  return { scorecard, score, label };
}

export function buildLaunchQaChecklist(storeCatalog) {
  return [
    ['PRODUCT IDS', `${storeCatalog.length} shared IDs in code`, true],
    ['STORE TESTS', 'Sandbox and Play test purchases pending', false],
    ['ENTITLEMENTS', 'Verify Pro and pack Firestore writes', false],
    ['SOCIAL SHARE', 'Retest launch cards and copy flows', true],
  ];
}

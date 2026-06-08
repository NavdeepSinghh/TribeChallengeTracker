import { PRO_TRIAL_REASONS } from './profileConstants';

export function buildProfileMonetizationSignalData({
  creatorRevenueShareSummary,
  partnerDemandTotal,
  proTrialSummary,
}) {
  const topProTrialReason = PRO_TRIAL_REASONS
    .map(reason => ({ ...reason, demand: proTrialSummary[reason.id] || 0 }))
    .sort((a, b) => b.demand - a.demand)[0];
  const proTrialDemandTotal = PRO_TRIAL_REASONS.reduce((sum, reason) => sum + (proTrialSummary[reason.id] || 0), 0);
  const creatorRevenueShareTotal = creatorRevenueShareSummary.revenueShareInterest || 0;
  const monetizationSignalTotal = proTrialDemandTotal + creatorRevenueShareTotal + partnerDemandTotal;

  return {
    creatorRevenueShareTotal,
    monetizationSignalTotal,
    proTrialDemandTotal,
    topProTrialReason,
  };
}

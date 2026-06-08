import { PARTNER_PERKS } from '../partnerPerks';
import { buildPartnerMonetizationCopy } from './partnerMonetizationCopy';

export function buildProfilePartnerDerivedData({
  campaignPerformanceSummary,
  challengePoints,
  daysActive,
  partnerCampaignApplicationReviewQueue,
  partnerPerkClaimReviewQueue,
  partnerPerkSummary,
  selectedPartnerPerkIds,
  referralJoins,
}) {
  const partnerPerkStats = {
    activeDays: daysActive,
    challengeDays: challengePoints.reduce((sum, challenge) => sum + (challenge.daysCompleted || 0), 0),
    referralJoins,
  };
  const topPartnerPerk = PARTNER_PERKS
    .map(perk => ({ ...perk, demand: partnerPerkSummary[perk.id] || 0 }))
    .sort((a, b) => b.demand - a.demand)[0];
  const partnerDemandTotal = PARTNER_PERKS.reduce((sum, perk) => sum + (partnerPerkSummary[perk.id] || 0), 0);
  const applicationPartnerPerk = topPartnerPerk && (topPartnerPerk.demand || selectedPartnerPerkIds.includes(topPartnerPerk.id))
    ? topPartnerPerk
    : PARTNER_PERKS.find(perk => selectedPartnerPerkIds.includes(perk.id));
  const applicationPartnerSignalCount = Math.max(
    applicationPartnerPerk?.demand || 0,
    applicationPartnerPerk && selectedPartnerPerkIds.includes(applicationPartnerPerk.id) ? 1 : 0,
  );
  const partnerCampaignApplicationSignalTotal = Math.max(partnerDemandTotal, selectedPartnerPerkIds.length);
  const partnerPitchCopy = topPartnerPerk && partnerDemandTotal
    ? `Rise With The Tribe partner pitch: ${partnerDemandTotal} first-party member perk signals captured so far. Top demand is ${topPartnerPerk.label} with ${topPartnerPerk.demand} interested member${topPartnerPerk.demand === 1 ? '' : 's'}. We can attach aligned partner value to challenge campaigns without random ads or third-party tracking.`
    : 'Rise With The Tribe partner pitch: member perk demand is being collected from first-party profile interest. Keep growing challenge participation before pitching aligned partners.';
  const {
    partnerActivationCopy,
    partnerTermsReadinessCopy,
    partnerContractReadinessCopy,
    partnerPerkFulfillmentReadinessCopy,
    partnerPerkFulfillmentHandoffCopy,
    partnerPerkHandoffAuditCopy,
    partnerPerkDecisionReplyCopy,
    partnerCampaignObjectionReplyCopy,
    partnerCampaignDecisionReplyCopy,
  } = buildPartnerMonetizationCopy({
    topPartnerPerk,
    partnerDemandTotal,
    campaignPerformanceSummary,
    referralJoins,
    partnerPerkClaimReviewQueue,
    partnerCampaignApplicationReviewQueue,
  });

  return {
    applicationPartnerPerk,
    applicationPartnerSignalCount,
    partnerActivationCopy,
    partnerCampaignApplicationSignalTotal,
    partnerCampaignDecisionReplyCopy,
    partnerCampaignObjectionReplyCopy,
    partnerContractReadinessCopy,
    partnerDemandTotal,
    partnerPerkDecisionReplyCopy,
    partnerPerkFulfillmentHandoffCopy,
    partnerPerkFulfillmentReadinessCopy,
    partnerPerkHandoffAuditCopy,
    partnerPerkStats,
    partnerPitchCopy,
    partnerTermsReadinessCopy,
    topPartnerPerk,
  };
}

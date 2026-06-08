export { buildPartnerAdminCopyKitProps } from './partnerAdminCopyKitProps';
export { buildPartnerCampaignDecisionReplyCardProps } from './partnerCampaignDecisionReplyCardProps';
export { buildPartnerCampaignReviewQueueSectionProps } from './partnerCampaignReviewQueueSectionProps';
export { buildPartnerPerkAdminReviewSectionProps } from './partnerPerkAdminReviewSectionProps';

import { buildPartnerAdminCopyKitProps } from './partnerAdminCopyKitProps';
import { buildPartnerCampaignDecisionReplyCardProps } from './partnerCampaignDecisionReplyCardProps';
import { buildPartnerCampaignReviewQueueSectionProps } from './partnerCampaignReviewQueueSectionProps';
import { buildPartnerPerkAdminReviewSectionProps } from './partnerPerkAdminReviewSectionProps';

export function buildPartnerPerksAdminSummaryProps(props) {
  return {
    adminCopyKitProps: buildPartnerAdminCopyKitProps(props),
    campaignDecisionReplyCardProps: buildPartnerCampaignDecisionReplyCardProps(props),
    campaignReviewQueueSectionProps: buildPartnerCampaignReviewQueueSectionProps(props),
    partnerPerkSummary: props.partnerPerkSummary,
    perkReviewSectionProps: buildPartnerPerkAdminReviewSectionProps(props),
  };
}

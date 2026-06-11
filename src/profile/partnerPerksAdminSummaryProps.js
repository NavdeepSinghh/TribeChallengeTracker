export { buildPartnerAdminCopyKitProps } from './partnerAdminCopyKitProps';
export { buildPartnerCampaignDecisionReplyCardProps } from './partnerCampaignDecisionReplyCardProps';
export { buildPartnerCampaignRetrospectiveReviewCardProps } from './partnerCampaignRetrospectiveReviewCardProps';
export { buildPartnerCampaignReviewQueueSectionProps } from './partnerCampaignReviewQueueSectionProps';
export { buildPartnerPerkAdminReviewSectionProps } from './partnerPerkAdminReviewSectionProps';

import { buildPartnerAdminCopyKitProps } from './partnerAdminCopyKitProps';
import { buildPartnerCampaignDecisionReplyCardProps } from './partnerCampaignDecisionReplyCardProps';
import { buildPartnerCampaignRetrospectiveReviewCardProps } from './partnerCampaignRetrospectiveReviewCardProps';
import { buildPartnerCampaignReviewQueueSectionProps } from './partnerCampaignReviewQueueSectionProps';
import { buildPartnerPerkAdminReviewSectionProps } from './partnerPerkAdminReviewSectionProps';

export function buildPartnerPerksAdminSummaryProps(props) {
  return {
    adminCopyKitProps: buildPartnerAdminCopyKitProps(props),
    campaignDecisionReplyCardProps: buildPartnerCampaignDecisionReplyCardProps(props),
    campaignRetrospectiveReviewCardProps: buildPartnerCampaignRetrospectiveReviewCardProps(props),
    campaignReviewQueueSectionProps: buildPartnerCampaignReviewQueueSectionProps(props),
    partnerPerkSummary: props.partnerPerkSummary,
    perkReviewSectionProps: buildPartnerPerkAdminReviewSectionProps(props),
  };
}

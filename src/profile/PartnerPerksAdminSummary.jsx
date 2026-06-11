import PartnerCampaignDecisionReplyCard from './PartnerCampaignDecisionReplyCard';
import PartnerCampaignRetrospectiveReviewCard from './PartnerCampaignRetrospectiveReviewCard';
import PartnerCampaignReviewQueueSection from './PartnerCampaignReviewQueueSection';
import PartnerAdminCopyKits from './PartnerAdminCopyKits';
import PartnerDemandGrid from './PartnerDemandGrid';
import PartnerPerkAdminReviewSection from './PartnerPerkAdminReviewSection';
import { buildPartnerPerksAdminSummaryProps } from './partnerPerksAdminSummaryProps';

export default function PartnerPerksAdminSummary(props) {
  const {
    adminCopyKitProps,
    campaignDecisionReplyCardProps,
    campaignRetrospectiveReviewCardProps,
    campaignReviewQueueSectionProps,
    partnerPerkSummary,
    perkReviewSectionProps,
  } = buildPartnerPerksAdminSummaryProps(props);

  return (
    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <p style={{ margin: '0 0 8px', color: '#fff', fontSize: 11, fontWeight: 900 }}>Partner demand summary</p>
      <PartnerDemandGrid partnerPerkSummary={partnerPerkSummary} />
      <PartnerAdminCopyKits {...adminCopyKitProps} />
      <PartnerPerkAdminReviewSection {...perkReviewSectionProps} />
      <PartnerCampaignReviewQueueSection {...campaignReviewQueueSectionProps} />
      <PartnerCampaignDecisionReplyCard {...campaignDecisionReplyCardProps} />
      <PartnerCampaignRetrospectiveReviewCard {...campaignRetrospectiveReviewCardProps} />
    </div>
  );
}

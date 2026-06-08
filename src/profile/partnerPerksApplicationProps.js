export function buildPartnerPerksApplicationProps({
  handlePartnerCampaignApplication,
  isSubmittingPartnerCampaignApplication,
  partnerCampaignApplicationMessage,
  partnerCampaignApplicationSignalTotal,
}) {
  return {
    partnerCampaignApplicationSignalTotal,
    onPartnerCampaignApplication: handlePartnerCampaignApplication,
    isSubmittingPartnerCampaignApplication,
    partnerCampaignApplicationMessage,
  };
}

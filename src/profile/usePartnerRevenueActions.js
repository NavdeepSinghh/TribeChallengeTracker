import useCreatorRevenueActions from './useCreatorRevenueActions';
import useMonetizationInterestActions from './useMonetizationInterestActions';
import usePartnerCampaignActions from './usePartnerCampaignActions';
import usePartnerPerkActions from './usePartnerPerkActions';

export default function usePartnerRevenueActions(inputs) {
  return {
    ...useCreatorRevenueActions(inputs),
    ...useMonetizationInterestActions(inputs),
    ...usePartnerCampaignActions(inputs),
    ...usePartnerPerkActions(inputs),
  };
}

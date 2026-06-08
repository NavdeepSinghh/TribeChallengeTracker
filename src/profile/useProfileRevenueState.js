import useCreatorRevenueState from './useCreatorRevenueState';
import useMonetizationDemandState from './useMonetizationDemandState';
import usePartnerRevenueState from './usePartnerRevenueState';

export default function useProfileRevenueState() {
  const creatorRevenueState = useCreatorRevenueState();
  const monetizationDemandState = useMonetizationDemandState();
  const partnerRevenueState = usePartnerRevenueState();

  return {
    ...creatorRevenueState,
    ...monetizationDemandState,
    ...partnerRevenueState,
  };
}

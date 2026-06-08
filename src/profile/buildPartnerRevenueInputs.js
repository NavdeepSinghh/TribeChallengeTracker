import {
  buildPartnerRevenueComputedInputs,
  buildPartnerRevenueScreenInputs,
} from './partnerRevenueInputGroups';

export function buildPartnerRevenueInputs({ computedData, screenState, user, onProfileUpdated }) {
  return {
    ...buildPartnerRevenueComputedInputs(computedData),
    ...buildPartnerRevenueScreenInputs(screenState),
    user,
    onProfileUpdated,
  };
}

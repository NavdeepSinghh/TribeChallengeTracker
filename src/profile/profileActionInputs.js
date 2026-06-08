import { buildCommunitySupportInputs } from './buildCommunitySupportInputs';
import { buildPartnerRevenueInputs } from './buildPartnerRevenueInputs';
import { buildPreferenceInputs } from './buildPreferenceInputs';
import { buildStoreCommerceInputs } from './buildStoreCommerceInputs';

export function buildProfileActionInputs(context) {
  return {
    communitySupportInputs: buildCommunitySupportInputs(context),
    partnerRevenueInputs: buildPartnerRevenueInputs(context),
    preferenceInputs: buildPreferenceInputs(context),
    storeCommerceInputs: buildStoreCommerceInputs(context),
  };
}

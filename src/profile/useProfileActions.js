import { buildProfileActionInputs } from './profileActionInputs';
import useCommunitySupportActions from './useCommunitySupportActions';
import usePartnerRevenueActions from './usePartnerRevenueActions';
import useProfilePreferenceActions from './useProfilePreferenceActions';
import useStoreCommerceActions from './useStoreCommerceActions';

export default function useProfileActions({
  computedData,
  myHistory,
  screenState,
  user,
  onHistoryUpdated,
  onProfileUpdated,
}) {
  const {
    communitySupportInputs,
    partnerRevenueInputs,
    preferenceInputs,
    storeCommerceInputs,
  } = buildProfileActionInputs({
    computedData,
    myHistory,
    onHistoryUpdated,
    onProfileUpdated,
    screenState,
    user,
  });

  const preferenceActions = useProfilePreferenceActions(preferenceInputs);
  const storeCommerceActions = useStoreCommerceActions(storeCommerceInputs);
  const partnerRevenueActions = usePartnerRevenueActions(partnerRevenueInputs);
  const communitySupportActions = useCommunitySupportActions(communitySupportInputs);

  return {
    ...preferenceActions,
    ...storeCommerceActions,
    ...partnerRevenueActions,
    ...communitySupportActions,
  };
}

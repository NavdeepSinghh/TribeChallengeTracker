import useProfileActions from './useProfileActions';
import useProfileComputedData from './useProfileComputedData';
import useProfileScreenState from './useProfileScreenState';

export default function useProfileScreenController({
  user,
  earnedBadges,
  myHistory,
  challengeStats,
  rankRules,
  onProfileUpdated,
  onHistoryUpdated,
  onClose,
}) {
  const screenState = useProfileScreenState(user);
  const computedData = useProfileComputedData({
    screenState,
    user,
    earnedBadges,
    myHistory,
    challengeStats,
    rankRules,
  });
  const profileActions = useProfileActions({
    computedData,
    myHistory,
    screenState,
    user,
    onHistoryUpdated,
    onProfileUpdated,
  });

  return {
    ...screenState,
    ...computedData,
    ...profileActions,
    onClose,
    user,
  };
}

import { buildProfileScreenStats } from './buildProfileScreenStats';
import {
  buildProfileScreenDerivedDataInputs,
} from './profileComputedDataInputs';
import { buildProfileShareActionInputs } from './profileShareActionInputs';
import { buildProfileScreenDerivedData } from './profileScreenDerivedData';
import useProfileShareActions from './useProfileShareActions';

export default function useProfileComputedData({
  screenState,
  user,
  earnedBadges,
  myHistory,
  challengeStats,
  rankRules,
}) {
  const {
    challengePoints,
    goalActiveDays,
    goalPoints,
    goalStreak,
    profile,
    setShowBreakdown,
  } = screenState;

  const stats = buildProfileScreenStats({
    profile,
    myHistory,
    challengeStats,
    referralJoins: profile?.stats?.referralJoins || 0,
    earnedBadges,
    challengePoints,
    goalActiveDays,
    goalPoints,
    goalStreak,
    onChallengePointsClick: () => setShowBreakdown(true),
    rankRules,
  });

  const shareActions = useProfileShareActions(buildProfileShareActionInputs({
    stats,
    screenState,
    user,
  }));

  const derivedDataInputs = buildProfileScreenDerivedDataInputs({
    stats,
    screenState,
    user,
    myHistory,
  });
  const derivedData = buildProfileScreenDerivedData({
    ...derivedDataInputs,
  });

  return {
    ...stats,
    ...shareActions,
    ...derivedData,
  };
}

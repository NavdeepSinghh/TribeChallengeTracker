import { useState } from 'react';
import { buildProfileScreenLoadTargets } from './profileScreenLoadTargets';
import useProfileScreenDataLoader from './useProfileScreenDataLoader';
import useProfileEngagementState from './useProfileEngagementState';
import useProfilePreferenceState from './useProfilePreferenceState';
import useProfileReviewState from './useProfileReviewState';
import useProfileRevenueState from './useProfileRevenueState';
import useProfileStoreState from './useProfileStoreState';
import useProfileSupportState from './useProfileSupportState';

export default function useProfileScreenState(user) {
  const [profile, setProfile] = useState(null);
  const [visible, setVisible] = useState(false);
  const [challengePoints, setChallengePoints] = useState([]);
  const [profileChallenges, setProfileChallenges] = useState([]);
  const engagementState = useProfileEngagementState(user);
  const reviewState = useProfileReviewState();
  const preferenceState = useProfilePreferenceState();
  const storeState = useProfileStoreState();
  const revenueState = useProfileRevenueState();
  const supportState = useProfileSupportState();

  const loadTargets = buildProfileScreenLoadTargets({
    engagementState,
    preferenceState,
    reviewState,
    revenueState,
    setChallengePoints,
    setProfile,
    setProfileChallenges,
    setVisible,
    storeState,
  });
  useProfileScreenDataLoader(user, loadTargets);

  return {
    challengePoints,
    profile,
    profileChallenges,
    setChallengePoints,
    setProfile,
    visible,
    ...engagementState,
    ...preferenceState,
    ...reviewState,
    ...revenueState,
    ...storeState,
    ...supportState,
  };
}

import { useState } from 'react';
import { getChallenge } from '../challengeService';
import useChallengeDiscoverySearch from './useChallengeDiscoverySearch';
import usePendingChallengeInvite from './usePendingChallengeInvite';
import useUserChallengeList from './useUserChallengeList';

export default function useChallengesTabState({
  onJoinHandled,
  onStatsChanged,
  pendingJoinCode,
  user,
}) {
  const [view, setView] = useState('list');
  const [detailChallenge, setDetailChallenge] = useState(null);
  const [trackerChallenge, setTrackerChallenge] = useState(null);
  const {
    joinedIds,
    load,
    loading,
    myChallenges,
    profile,
  } = useUserChallengeList({ user });

  const {
    handleSearch,
    searchQuery,
    searchResults,
    searching,
  } = useChallengeDiscoverySearch({ joinedIds });

  usePendingChallengeInvite({
    joinedIds,
    onJoinHandled,
    pendingJoinCode,
    setDetailChallenge,
    setTrackerChallenge,
    setView,
  });

  const openChallenge = async (challengeId) => {
    const c = await getChallenge(challengeId);
    if (!c) return;
    if (joinedIds.has(challengeId)) {
      setTrackerChallenge(c);
      setView('tracker');
    } else {
      setDetailChallenge(c);
      setView('detail');
    }
  };

  const refreshList = () => { setView('list'); load(); };
  const handleCreate = () => { load(); onStatsChanged?.(); };
  const handleJoined = () => { load(); openChallenge(detailChallenge.id); onStatsChanged?.(); };
  const handleLeft = () => { load(); onStatsChanged?.(); };

  return {
    detailChallenge,
    handleCreate,
    handleJoined,
    handleLeft,
    handleSearch,
    loading,
    myChallenges,
    openChallenge,
    profile,
    refreshList,
    searchQuery,
    searchResults,
    searching,
    setDetailChallenge,
    setTrackerChallenge,
    setView,
    trackerChallenge,
    view,
  };
}

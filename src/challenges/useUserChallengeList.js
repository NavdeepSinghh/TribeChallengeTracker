import { useEffect, useState } from 'react';
import { getUserChallenges } from '../challengeService';
import { splitMyChallenges } from './challengeListModel';

export default function useUserChallengeList({ user }) {
  const [myChallenges, setMyChallenges] = useState([]);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [joinedIds, setJoinedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const load = async () => {
    const { getUserProfile } = await import('../userService');
    const p = await getUserProfile(user.uid);
    setProfile(p);
    const ids = p?.joinedChallengeIds || [];
    const challenges = await getUserChallenges(ids);
    const sections = splitMyChallenges(challenges);
    setMyChallenges(challenges);
    setActiveChallenges(sections.active);
    setCompletedChallenges(sections.completed);
    setJoinedIds(new Set(ids));
    setLoading(false);
  };

  useEffect(() => { load(); }, [user?.uid]);

  return {
    activeChallenges,
    completedChallenges,
    joinedIds,
    load,
    loading,
    myChallenges,
    profile,
  };
}

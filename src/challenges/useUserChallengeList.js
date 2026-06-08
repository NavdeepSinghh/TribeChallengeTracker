import { useEffect, useState } from 'react';
import { getUserChallenges } from '../challengeService';

export default function useUserChallengeList({ user }) {
  const [myChallenges, setMyChallenges] = useState([]);
  const [joinedIds, setJoinedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const load = async () => {
    const { getUserProfile } = await import('../userService');
    const p = await getUserProfile(user.uid);
    setProfile(p);
    const ids = p?.joinedChallengeIds || [];
    const challenges = await getUserChallenges(ids);
    setMyChallenges(challenges);
    setJoinedIds(new Set(ids));
    setLoading(false);
  };

  useEffect(() => { load(); }, [user?.uid]);

  return {
    joinedIds,
    load,
    loading,
    myChallenges,
    profile,
  };
}

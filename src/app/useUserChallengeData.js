import { useCallback, useEffect, useState } from "react";
import { getUserChallenges, getUserChallengeBadgeStats } from "../challengeService";
import { getUserProfile } from "../userService";

function profileChallengeStats(profile, fallback = {}) {
  return {
    joined: (profile?.stats?.challengesJoined ?? profile?.['stats.challengesJoined']) || fallback.joined || 0,
    owned: (profile?.stats?.challengesOwned ?? profile?.['stats.challengesOwned']) || fallback.owned || 0,
    ...fallback.extra,
  };
}

export default function useUserChallengeData(user) {
  const userUid = user?.uid;
  const [challengeStats, setChallengeStats] = useState({ joined: 0, owned: 0 });
  const [myChallenges, setMyChallenges] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (!userUid) {
      setMyChallenges([]);
      setUserProfile(null);
      return;
    }

    getUserProfile(userUid).then(profile => {
      setUserProfile(profile);
      setChallengeStats(profileChallengeStats(profile));

      const ids = profile?.joinedChallengeIds || [];
      if (!ids.length) {
        setMyChallenges([]);
        return;
      }

      getUserChallenges(ids).then(async challenges => {
        setMyChallenges(challenges);
        const badgeStats = await getUserChallengeBadgeStats(userUid, challenges);
        setChallengeStats(profileChallengeStats(profile, {
          joined: challenges.length,
          owned: challenges.filter(challenge => challenge.createdBy === userUid).length,
          extra: {
            completed: badgeStats.completed,
            top1: badgeStats.top1,
          },
        }));
      });
    });
  }, [userUid]);

  const refreshChallengeStats = useCallback(async () => {
    if (!userUid) return { joined: 0, owned: 0 };
    const profile = await getUserProfile(userUid);
    setUserProfile(profile);
    const nextStats = profileChallengeStats(profile);
    setChallengeStats(nextStats);
    return nextStats;
  }, [userUid]);

  return {
    challengeStats,
    myChallenges,
    refreshChallengeStats,
    setChallengeStats,
    setUserProfile,
    userProfile,
  };
}

import { useCallback, useEffect, useRef, useState } from "react";
import { BADGES, awardBadges, checkBadges, loadEarnedBadges } from "../badgeService";
import { buildActivityStats } from "./activityStats";

export default function useAppBadges({ user, userProfile }) {
  const userUid = user?.uid;
  const [earnedBadges, setEarnedBadges] = useState(new Set());
  const sessionEarnedRef = useRef(null);
  const [badgeQueue, setBadgeQueue] = useState([]);

  useEffect(() => {
    if (!userUid) return;
    loadEarnedBadges(userUid).then(loaded => {
      sessionEarnedRef.current = loaded;
      setEarnedBadges(loaded);
    });
  }, [userUid]);

  const triggerBadgeCheck = useCallback((history, challengeStats) => {
    if (!userUid) return;
    const stats = buildActivityStats(history, challengeStats, userProfile);
    const alreadyEarned = new Set([...(sessionEarnedRef.current || new Set()), ...earnedBadges]);
    const newIds = checkBadges(stats, alreadyEarned);
    if (!newIds.length) return;

    const newSet = new Set([...alreadyEarned, ...newIds]);
    setEarnedBadges(newSet);

    const overlayIds = newIds.filter(id => !sessionEarnedRef.current?.has(id));
    if (overlayIds.length) {
      setBadgeQueue(queue => [
        ...queue,
        ...overlayIds.map(id => BADGES.find(badge => badge.id === id)).filter(Boolean),
      ]);
    }
    awardBadges(userUid, newIds).catch(console.error);
  }, [earnedBadges, userProfile, userUid]);

  return {
    badgeQueue,
    earnedBadges,
    setBadgeQueue,
    triggerBadgeCheck,
  };
}

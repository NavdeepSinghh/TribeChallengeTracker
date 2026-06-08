export default function useChallengeRefreshHandlers({
  clearPendingChallengeEntry,
  myHistory,
  refreshChallengeStats,
  triggerBadgeCheck,
}) {
  const handleChallengeStatsChanged = () => {
    refreshChallengeStats().then(newStats => {
      triggerBadgeCheck(myHistory, newStats);
    });
  };

  const handleChallengeJoinHandled = () => {
    clearPendingChallengeEntry();
    refreshChallengeStats().then(newStats => {
      triggerBadgeCheck(myHistory, newStats);
    });
  };

  return {
    handleChallengeJoinHandled,
    handleChallengeStatsChanged,
  };
}

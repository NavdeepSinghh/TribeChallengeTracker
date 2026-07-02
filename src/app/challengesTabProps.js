export function buildChallengesTabProps({
  handleChallengeJoinHandled,
  handleChallengeStatsChanged,
  pendingJoinCode,
  pendingReferralUid,
  setTab,
}) {
  return {
    onOpenWorkouts: setTab ? () => setTab("board") : undefined,
    pendingJoinCode,
    pendingReferralUid,
    onStatsChanged: handleChallengeStatsChanged,
    onJoinHandled: handleChallengeJoinHandled,
  };
}

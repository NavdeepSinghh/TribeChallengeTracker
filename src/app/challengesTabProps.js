export function buildChallengesTabProps({
  handleChallengeJoinHandled,
  handleChallengeStatsChanged,
  pendingJoinCode,
  pendingReferralUid,
}) {
  return {
    pendingJoinCode,
    pendingReferralUid,
    onStatsChanged: handleChallengeStatsChanged,
    onJoinHandled: handleChallengeJoinHandled,
  };
}

export function buildProfileEngagementState({
  profileChallenges,
  userId,
  weeklyReport,
  currentStreak,
  totalChallengePoints,
  myHistory,
  proActive,
}) {
  const creatorOwnedChallenges = profileChallenges.filter(challenge => challenge.createdBy === userId);
  const creatorAnalytics = {
    hosted: creatorOwnedChallenges.length,
    members: creatorOwnedChallenges.reduce((sum, challenge) => sum + (challenge.memberCount || 0), 0),
    active: creatorOwnedChallenges.filter(challenge => !challenge.endDate || new Date(challenge.endDate) >= new Date()).length,
    private: creatorOwnedChallenges.filter(challenge => challenge.isPublic === false).length,
    paidPacks: creatorOwnedChallenges.filter(challenge => challenge.isPremium || challenge.packId).length,
    revenueReady: creatorOwnedChallenges.filter(challenge => challenge.isPremium || challenge.packId || (challenge.memberCount || 0) >= 5).length,
  };
  const proValueFocus = (() => {
    if (creatorAnalytics.hosted > 0) return 'Creator launch + hosted analytics';
    if (weeklyReport.weeklyScore < 60) return 'Custom goals + weekly report';
    if (currentStreak >= 5) return 'Streak recovery + premium badges';
    if (totalChallengePoints > 0) return 'Private challenges + pack recaps';
    return 'Premium analytics + share templates';
  })();
  const proValueNextAction = proActive
    ? 'Use your Pro report, custom goals, and launch tools to keep the next week intentional.'
    : `Best fit: ${proValueFocus}. Upgrade when you want deeper accountability beyond the free habit loop.`;
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayKey = yesterdayDate.toISOString().split('T')[0];
  const yesterdayRecovered = (myHistory[yesterdayKey]?.activities || []).some(activity => activity.activityId === 'streak_recovery' || activity.type === 'streak_recovery');

  return {
    creatorOwnedChallenges,
    creatorAnalytics,
    proValueFocus,
    proValueNextAction,
    yesterdayKey,
    yesterdayRecovered,
  };
}

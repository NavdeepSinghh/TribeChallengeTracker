export { buildProfileEngagementState } from './profileEngagementState';

export function buildProfileAppearanceState({ profile, rank, selectedFrameId, profileFrames }) {
  const avatarEmoji = profile?.avatarEmoji || rank.icon;
  const avatarColor = profile?.avatarColor || rank.color;
  const activeFrameId = selectedFrameId || profile?.cosmetics?.profileFrameId || 'none';
  const activeFrame = profileFrames.find(frame => frame.id === activeFrameId) || profileFrames[0];
  const frameGradient = activeFrame.id === 'none'
    ? `${avatarColor}55`
    : `linear-gradient(135deg, ${activeFrame.colors[0]}, ${activeFrame.colors[1]})`;
  const profileImageSrc = profile?.profileImageData ? `data:image/jpeg;base64,${profile.profileImageData}` : null;

  return {
    avatarEmoji,
    avatarColor,
    activeFrameId,
    activeFrame,
    frameGradient,
    profileImageSrc,
  };
}

export function buildStatsGrid({
  profile,
  challengeStats,
  referralJoins,
  earnedBadges,
  badgeXP,
  rank,
  totalChallengePoints,
  daysActive,
  accent,
  gold,
  onChallengePointsClick,
}) {
  return [
    { label: 'CHALLENGES JOINED', value: profile?.stats?.challengesJoined ?? challengeStats.joined, icon: '\u{1F3AF}', color: accent },
    { label: 'CHALLENGES STARTED', value: profile?.stats?.challengesOwned ?? challengeStats.owned, icon: '\u{1F3C6}', color: gold },
    { label: 'REFERRAL JOINS', value: referralJoins, icon: '\u{1F91D}', color: '#34D399' },
    { label: 'BADGES EARNED', value: earnedBadges.size, icon: '\u2B50', color: '#A78BFA' },
    { label: 'TOTAL XP', value: badgeXP, icon: rank.icon, color: rank.color },
    {
      label: 'CHALLENGE PTS',
      value: totalChallengePoints,
      icon: '\u{1F3C5}',
      color: '#34D399',
      onClick: onChallengePointsClick,
    },
    { label: 'DAYS ACTIVE', value: daysActive, icon: '\u{1F4C5}', color: '#60A5FA' },
  ];
}

export function buildPreferenceRows({ onboarding, goalLabels, levelLabels, frequencyLabels }) {
  return [
    onboarding?.goal && { label: 'GOAL', value: goalLabels[onboarding.goal] || onboarding.goal },
    onboarding?.level && { label: 'LEVEL', value: levelLabels[onboarding.level] || onboarding.level },
    onboarding?.frequency && { label: 'FREQUENCY', value: frequencyLabels[onboarding.frequency] || onboarding.frequency },
    onboarding?.motivation && { label: 'DRIVEN BY', value: onboarding.motivation.replace('_', ' ').toUpperCase() },
  ].filter(Boolean);
}

export function buildGoalProgress({ weeklyRecap, goalActiveDays, goalPoints, goalStreak, currentStreak }) {
  return {
    activeDays: Math.min(100, Math.round((weeklyRecap.activeDays / Math.max(1, goalActiveDays)) * 100)),
    points: Math.min(100, Math.round((weeklyRecap.points / Math.max(1, goalPoints)) * 100)),
    streak: Math.min(100, Math.round((currentStreak / Math.max(1, goalStreak)) * 100)),
  };
}

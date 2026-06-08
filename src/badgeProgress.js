const BADGE_PROGRESS = {
  first_log:  { current: stats => stats.totalLogs,                 target: 1,    label: "activity" },
  streak3:    { current: stats => stats.streak,                    target: 3,    label: "day streak" },
  streak7:    { current: stats => stats.streak,                    target: 7,    label: "day streak" },
  streak14:   { current: stats => stats.streak,                    target: 14,   label: "day streak" },
  streak30:   { current: stats => stats.streak,                    target: 30,   label: "day streak" },
  streak75:   { current: stats => stats.streak,                    target: 75,   label: "day streak" },
  pts50:      { current: stats => stats.totalPts,                  target: 50,   label: "pts" },
  pts100:     { current: stats => stats.totalPts,                  target: 100,  label: "pts" },
  pts500:     { current: stats => stats.totalPts,                  target: 500,  label: "pts" },
  pts1000:    { current: stats => stats.totalPts,                  target: 1000, label: "pts" },
  pts5000:    { current: stats => stats.totalPts,                  target: 5000, label: "pts" },
  days10:     { current: stats => stats.daysActive,                target: 10,   label: "days" },
  days30:     { current: stats => stats.daysActive,                target: 30,   label: "days" },
  run_50km:   { current: stats => Math.floor(stats.runKm),         target: 50,   label: "km" },
  yoga_10:    { current: stats => stats.actCounts.yoga || 0,       target: 10,   label: "sessions" },
  gym_15:     { current: stats => stats.actCounts.gym || 0,        target: 15,   label: "sessions" },
  cycle_100:  { current: stats => Math.floor(stats.cycleKm),       target: 100,  label: "km" },
  swim_10:    { current: stats => stats.actCounts.swim || 0,       target: 10,   label: "sessions" },
  walk_50:    { current: stats => Math.floor(stats.walkKm),        target: 50,   label: "km" },
  allround:   { current: stats => stats.uniqueTypes,               target: 3,    label: "types" },
  variety:    { current: stats => stats.uniqueTypes,               target: 6,    label: "types" },
  first_join: { current: stats => stats.challengesJoined,          target: 1,    label: "challenge" },
  creator:    { current: stats => stats.challengesOwned,           target: 1,    label: "challenge" },
  squad:      { current: stats => stats.challengesJoined,          target: 3,    label: "challenges" },
  connector:  { current: stats => stats.referralJoins || 0,        target: 1,    label: "referral join" },
  tribe_builder: { current: stats => stats.referralJoins || 0,     target: 5,    label: "referral joins" },
  community_captain: { current: stats => stats.referralJoins || 0, target: 10,   label: "referral joins" },
  finisher:   { current: stats => stats.challengesCompleted || 0,  target: 1,    label: "completed" },
  champion:   { current: stats => stats.top1Finishes || 0,         target: 1,    label: "#1 finish" },
  og_tribe:   { current: stats => stats.isOG ? 1 : 0,             target: 1,    label: "member" },
  comeback:   { current: stats => stats.comeback ? 1 : 0,         target: 1,    label: "comeback" },
  weekend_w:  { current: stats => stats.weekendWarrior ? 1 : 0,   target: 1,    label: "weekend" },
  no_excuses: { current: stats => stats.weeklyLogs || 0,           target: 5,    label: "sessions" },
  pro_weekly_report: { current: stats => stats.proActive ? (stats.weeklyLogs || 0) : 0, target: 5, label: "Pro weekly logs" },
  pro_streak_saver:  { current: stats => stats.proActive ? (stats.streakRecoveryCredits || 0) : 0, target: 1, label: "Pro recovery" },
  pro_finisher:      { current: stats => stats.proActive ? (stats.challengesCompleted || 0) : 0, target: 1, label: "Pro completed" },
};

export function getBadgeProgress(badgeId, stats) {
  const progress = BADGE_PROGRESS[badgeId];
  if (!progress) return { current: 0, target: 1, label: "" };
  return {
    current: progress.current(stats),
    target: progress.target,
    label: progress.label,
  };
}

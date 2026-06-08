import { BADGES, TRIBE_RANKS } from './badgeCatalog';

export function getTribeRank(xp) {
  let rank = TRIBE_RANKS[0];
  for (const r of TRIBE_RANKS) {
    if (xp >= r.min) rank = r;
  }
  const idx = TRIBE_RANKS.indexOf(rank);
  return { ...rank, next: TRIBE_RANKS[idx + 1] || null };
}

export function calcBadgeXP(earned) {
  return BADGES.filter(b => earned.has(b.id)).reduce((s, b) => s + b.xp, 0);
}

export function checkBadges(stats, currentEarned) {
  const out = [];
  const check = (id, cond) => { if (cond && !currentEarned.has(id)) out.push(id); };

  check('first_log',  stats.totalLogs >= 1);
  check('streak3',    stats.streak >= 3);
  check('streak7',    stats.streak >= 7);
  check('streak14',   stats.streak >= 14);
  check('streak30',   stats.streak >= 30);
  check('streak75',   stats.streak >= 75);
  check('pts50',      stats.totalPts >= 50);
  check('pts100',     stats.totalPts >= 100);
  check('pts500',     stats.totalPts >= 500);
  check('pts1000',    stats.totalPts >= 1000);
  check('pts5000',    stats.totalPts >= 5000);
  check('days10',     stats.daysActive >= 10);
  check('days30',     stats.daysActive >= 30);
  check('run_50km',   stats.runKm >= 50);
  check('yoga_10',    (stats.actCounts.yoga || 0) >= 10);
  check('gym_15',     (stats.actCounts.gym || 0) >= 15);
  check('cycle_100',  stats.cycleKm >= 100);
  check('swim_10',    (stats.actCounts.swim || 0) >= 10);
  check('walk_50',    stats.walkKm >= 50);
  check('allround',   stats.uniqueTypes >= 3);
  check('variety',    stats.uniqueTypes >= 6);
  check('first_join', stats.challengesJoined >= 1);
  check('creator',    stats.challengesOwned >= 1);
  check('squad',      stats.challengesJoined >= 3);
  check('connector',  (stats.referralJoins || 0) >= 1);
  check('tribe_builder', (stats.referralJoins || 0) >= 5);
  check('community_captain', (stats.referralJoins || 0) >= 10);
  check('finisher',   (stats.challengesCompleted || 0) >= 1);
  check('champion',   (stats.top1Finishes || 0) >= 1);
  check('og_tribe',   stats.isOG);
  check('comeback',   stats.comeback);
  check('weekend_w',  stats.weekendWarrior);
  check('no_excuses', stats.weeklyLogs >= 5);
  check('pro_weekly_report', stats.proActive && stats.weeklyLogs >= 5);
  check('pro_streak_saver', stats.proActive && (stats.streakRecoveryCredits || 0) >= 1);
  check('pro_finisher', stats.proActive && (stats.challengesCompleted || 0) >= 1);

  return out;
}

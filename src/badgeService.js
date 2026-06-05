import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';

export const BADGE_CATEGORIES = [
  { id: "all",       label: "All",        icon: "✨" },
  { id: "streak",    label: "Streak",     icon: "🔥" },
  { id: "points",    label: "Milestones", icon: "⭐" },
  { id: "activity",  label: "Activity",   icon: "💪" },
  { id: "challenge", label: "Challenges", icon: "🎯" },
  { id: "special",   label: "Special",    icon: "👑" },
];

// 36 badges across 5 categories. xp = badge XP value contributing to Tribe Rank.
export const BADGES = [
  // ── STREAK ────────────────────────────────────────────────────────────────────
  { id: "first_log",  cat: "streak",    icon: "🌱", label: "First Step",        desc: "Log your very first activity",                color: "#34D399", xp: 10  },
  { id: "streak3",    cat: "streak",    icon: "🔥", label: "On Fire",            desc: "3-day activity streak",                       color: "#FF6B35", xp: 25  },
  { id: "streak7",    cat: "streak",    icon: "⚡", label: "Week Warrior",       desc: "7-day activity streak",                       color: "#FFD700", xp: 50  },
  { id: "streak14",   cat: "streak",    icon: "💎", label: "Two Weeks Strong",   desc: "14-day activity streak",                      color: "#38BDF8", xp: 100 },
  { id: "streak30",   cat: "streak",    icon: "🏆", label: "Month Legend",       desc: "30-day activity streak",                      color: "#F59E0B", xp: 250 },
  { id: "streak75",   cat: "streak",    icon: "👑", label: "75 Hard Spirit",     desc: "75-day activity streak — the ultimate test",  color: "#C084FC", xp: 750 },
  // ── MILESTONES ────────────────────────────────────────────────────────────────
  { id: "pts50",      cat: "points",    icon: "🌟", label: "Getting Started",    desc: "Earn 50 total points",                        color: "#34D399", xp: 10  },
  { id: "pts100",     cat: "points",    icon: "💯", label: "Century Club",       desc: "Earn 100 total points",                       color: "#C084FC", xp: 20  },
  { id: "pts500",     cat: "points",    icon: "🚀", label: "Rising Star",        desc: "Earn 500 total points",                       color: "#F59E0B", xp: 75  },
  { id: "pts1000",    cat: "points",    icon: "💫", label: "Elite",              desc: "Earn 1,000 total points",                     color: "#FFD700", xp: 150 },
  { id: "pts5000",    cat: "points",    icon: "☄️", label: "Tribe Legend",      desc: "Earn 5,000 total points",                     color: "#FF6B35", xp: 500 },
  { id: "days10",     cat: "points",    icon: "📅", label: "Ten Club",           desc: "Be active on 10 different days",              color: "#34D399", xp: 30  },
  { id: "days30",     cat: "points",    icon: "🗓️", label: "Thirty Strong",     desc: "Be active on 30 different days",              color: "#60A5FA", xp: 100 },
  // ── ACTIVITY ──────────────────────────────────────────────────────────────────
  { id: "run_50km",   cat: "activity",  icon: "🏃", label: "Road Runner",        desc: "Run 50km total",                              color: "#34D399", xp: 75  },
  { id: "yoga_10",    cat: "activity",  icon: "🧘", label: "Zen Tribe",          desc: "10 yoga sessions",                            color: "#A78BFA", xp: 50  },
  { id: "gym_15",     cat: "activity",  icon: "💪", label: "Iron Tribe",         desc: "Hit the gym 15 times",                        color: "#F59E0B", xp: 75  },
  { id: "cycle_100",  cat: "activity",  icon: "🚴", label: "Cyclone",            desc: "Cycle 100km total",                           color: "#60A5FA", xp: 100 },
  { id: "swim_10",    cat: "activity",  icon: "🏊", label: "Deep Diver",         desc: "10 swim sessions",                            color: "#38BDF8", xp: 60  },
  { id: "walk_50",    cat: "activity",  icon: "🚶", label: "Wanderer",           desc: "Walk 50km total",                             color: "#4ADE80", xp: 40  },
  { id: "allround",   cat: "activity",  icon: "🌈", label: "All-Rounder",        desc: "Log 3 different activity types",              color: "#C084FC", xp: 40  },
  { id: "variety",    cat: "activity",  icon: "🎪", label: "Variety Pack",       desc: "Try all 6 activity types",                    color: "#F59E0B", xp: 100 },
  // ── CHALLENGES ────────────────────────────────────────────────────────────────
  { id: "first_join", cat: "challenge", icon: "🤝", label: "Tribe Member",       desc: "Join your first challenge",                   color: "#60A5FA", xp: 30  },
  { id: "creator",    cat: "challenge", icon: "🎯", label: "Challenge Creator",  desc: "Create your first challenge",                 color: "#FF6B35", xp: 50  },
  { id: "squad",      cat: "challenge", icon: "👥", label: "Squad Goals",        desc: "Join 3 different challenges",                 color: "#A78BFA", xp: 75  },
  { id: "connector",  cat: "challenge", icon: "📣", label: "Connector",          desc: "Bring 1 friend into a challenge",             color: "#34D399", xp: 50  },
  { id: "tribe_builder", cat: "challenge", icon: "🤝", label: "Tribe Builder",   desc: "Bring 5 friends into challenges",             color: "#FF6B35", xp: 150 },
  { id: "community_captain", cat: "challenge", icon: "🌟", label: "Community Captain", desc: "Bring 10 friends into challenges",      color: "#FFD700", xp: 300 },
  { id: "finisher",   cat: "challenge", icon: "✅", label: "Finisher",           desc: "Complete a full challenge",                   color: "#34D399", xp: 200 },
  { id: "champion",   cat: "challenge", icon: "🥇", label: "Champion",           desc: "Finish #1 on a challenge leaderboard",        color: "#FFD700", xp: 300 },
  // ── SPECIAL ───────────────────────────────────────────────────────────────────
  { id: "og_tribe",   cat: "special",   icon: "🌅", label: "OG Tribe",           desc: "Founding tribe member — you were here first", color: "#FF6B35", xp: 100 },
  { id: "comeback",   cat: "special",   icon: "🦾", label: "Comeback King",      desc: "Log after a 3+ day gap — never quit",         color: "#F59E0B", xp: 50  },
  { id: "weekend_w",  cat: "special",   icon: "🎉", label: "Weekend Warrior",    desc: "Log on both Saturday and Sunday",             color: "#C084FC", xp: 40  },
  { id: "no_excuses", cat: "special",   icon: "🧱", label: "No Excuses",         desc: "Log 5 sessions in a single week",             color: "#38BDF8", xp: 60  },
  { id: "pro_weekly_report", cat: "special", icon: "📈", label: "Pro Weekly Report", desc: "Tribe Pro: hit 5 active logs in a week",   color: "#A78BFA", xp: 120 },
  { id: "pro_streak_saver",  cat: "special", icon: "🛡️", label: "Streak Saver",      desc: "Tribe Pro: use a streak recovery credit",  color: "#34D399", xp: 90  },
  { id: "pro_finisher",      cat: "special", icon: "🏁", label: "Pro Finisher",       desc: "Tribe Pro: complete a full challenge",     color: "#FFD700", xp: 180 },
];

export const TRIBE_RANKS = [
  { label: "Rookie",    min: 0,    icon: "🌱", color: "#34D399" },
  { label: "Warrior",   min: 100,  icon: "⚔️",  color: "#60A5FA" },
  { label: "Elite",     min: 300,  icon: "🚀", color: "#F59E0B" },
  { label: "Legend",    min: 700,  icon: "💫", color: "#FFD700" },
  { label: "Tribe God", min: 1500, icon: "👑", color: "#C084FC" },
];

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

// Returns badge IDs that should be newly awarded given current stats.
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

// Returns progress toward a badge for display.
export function getBadgeProgress(badgeId, stats) {
  const map = {
    first_log:  { current: stats.totalLogs,                 target: 1,    label: "activity" },
    streak3:    { current: stats.streak,                    target: 3,    label: "day streak" },
    streak7:    { current: stats.streak,                    target: 7,    label: "day streak" },
    streak14:   { current: stats.streak,                    target: 14,   label: "day streak" },
    streak30:   { current: stats.streak,                    target: 30,   label: "day streak" },
    streak75:   { current: stats.streak,                    target: 75,   label: "day streak" },
    pts50:      { current: stats.totalPts,                  target: 50,   label: "pts" },
    pts100:     { current: stats.totalPts,                  target: 100,  label: "pts" },
    pts500:     { current: stats.totalPts,                  target: 500,  label: "pts" },
    pts1000:    { current: stats.totalPts,                  target: 1000, label: "pts" },
    pts5000:    { current: stats.totalPts,                  target: 5000, label: "pts" },
    days10:     { current: stats.daysActive,                target: 10,   label: "days" },
    days30:     { current: stats.daysActive,                target: 30,   label: "days" },
    run_50km:   { current: Math.floor(stats.runKm),         target: 50,   label: "km" },
    yoga_10:    { current: stats.actCounts.yoga || 0,       target: 10,   label: "sessions" },
    gym_15:     { current: stats.actCounts.gym || 0,        target: 15,   label: "sessions" },
    cycle_100:  { current: Math.floor(stats.cycleKm),       target: 100,  label: "km" },
    swim_10:    { current: stats.actCounts.swim || 0,       target: 10,   label: "sessions" },
    walk_50:    { current: Math.floor(stats.walkKm),        target: 50,   label: "km" },
    allround:   { current: stats.uniqueTypes,               target: 3,    label: "types" },
    variety:    { current: stats.uniqueTypes,               target: 6,    label: "types" },
    first_join: { current: stats.challengesJoined,          target: 1,    label: "challenge" },
    creator:    { current: stats.challengesOwned,           target: 1,    label: "challenge" },
    squad:      { current: stats.challengesJoined,          target: 3,    label: "challenges" },
    connector:  { current: stats.referralJoins || 0,        target: 1,    label: "referral join" },
    tribe_builder: { current: stats.referralJoins || 0,     target: 5,    label: "referral joins" },
    community_captain: { current: stats.referralJoins || 0, target: 10,   label: "referral joins" },
    finisher:   { current: stats.challengesCompleted || 0,  target: 1,    label: "completed" },
    champion:   { current: stats.top1Finishes || 0,         target: 1,    label: "#1 finish" },
    og_tribe:   { current: stats.isOG ? 1 : 0,             target: 1,    label: "member" },
    comeback:   { current: stats.comeback ? 1 : 0,         target: 1,    label: "comeback" },
    weekend_w:  { current: stats.weekendWarrior ? 1 : 0,   target: 1,    label: "weekend" },
    no_excuses: { current: stats.weeklyLogs || 0,           target: 5,    label: "sessions" },
    pro_weekly_report: { current: stats.proActive ? (stats.weeklyLogs || 0) : 0, target: 5, label: "Pro weekly logs" },
    pro_streak_saver:  { current: stats.proActive ? (stats.streakRecoveryCredits || 0) : 0, target: 1, label: "Pro recovery" },
    pro_finisher:      { current: stats.proActive ? (stats.challengesCompleted || 0) : 0, target: 1, label: "Pro completed" },
  };
  return map[badgeId] || { current: 0, target: 1, label: "" };
}

export async function awardBadges(uid, badgeIds) {
  if (!badgeIds.length) return;
  await updateDoc(doc(db, 'users', uid), { earnedBadges: arrayUnion(...badgeIds) });
}

export async function loadEarnedBadges(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return new Set(snap.data()?.earnedBadges || []);
}

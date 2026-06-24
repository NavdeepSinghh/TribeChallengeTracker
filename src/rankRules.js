export const DEFAULT_TRIBE_RANK_LEVELS = [
  { id: "rookie", label: "Rookie", icon: "🌱", color: "#34D399", minScore: 0, minActiveDays: 0, minStreak: 0, completedChallenges: 0 },
  { id: "warrior", label: "Warrior", icon: "⚔️", color: "#60A5FA", minScore: 500, minActiveDays: 7, minStreak: 0, completedChallenges: 0 },
  { id: "elite", label: "Elite", icon: "🚀", color: "#F59E0B", minScore: 1500, minActiveDays: 21, minStreak: 7, completedChallenges: 0 },
  { id: "legend", label: "Legend", icon: "💫", color: "#FFD700", minScore: 4000, minActiveDays: 45, minStreak: 14, completedChallenges: 1 },
  { id: "tribegod", label: "Tribe God", icon: "👑", color: "#C084FC", minScore: 10000, minActiveDays: 90, minStreak: 30, completedChallenges: 3 },
];

export const DEFAULT_TRIBE_RANK_RULES = {
  version: 1,
  status: "published",
  dailyRankPointCap: 120,
  levels: DEFAULT_TRIBE_RANK_LEVELS,
};

function numberOr(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function normalizeRankRules(raw) {
  const sourceLevels = Array.isArray(raw?.levels) && raw.levels.length
    ? raw.levels
    : DEFAULT_TRIBE_RANK_LEVELS;

  const levels = sourceLevels
    .map((level, index) => {
      const fallback = DEFAULT_TRIBE_RANK_LEVELS[index] || DEFAULT_TRIBE_RANK_LEVELS[0];
      const minScore = numberOr(level.minScore ?? level.min ?? level.minXP, fallback.minScore);
      return {
        id: String(level.id || fallback.id || `rank_${index}`),
        label: String(level.label || fallback.label || "Rank"),
        icon: String(level.icon || level.emoji || fallback.icon || "⭐"),
        color: String(level.color || fallback.color || "#FFD700"),
        minScore: Math.max(0, Math.round(minScore)),
        min: Math.max(0, Math.round(minScore)),
        minXP: Math.max(0, Math.round(minScore)),
        minActiveDays: Math.max(0, Math.round(numberOr(level.minActiveDays, fallback.minActiveDays || 0))),
        minStreak: Math.max(0, Math.round(numberOr(level.minStreak, fallback.minStreak || 0))),
        completedChallenges: Math.max(0, Math.round(numberOr(level.completedChallenges, fallback.completedChallenges || 0))),
      };
    })
    .sort((a, b) => a.minScore - b.minScore);

  return {
    version: Math.max(1, Math.round(numberOr(raw?.version, DEFAULT_TRIBE_RANK_RULES.version))),
    status: raw?.status === "draft" ? "draft" : "published",
    dailyRankPointCap: Math.max(20, Math.round(numberOr(raw?.dailyRankPointCap, DEFAULT_TRIBE_RANK_RULES.dailyRankPointCap))),
    levels,
    updatedAt: raw?.updatedAt || null,
    updatedBy: raw?.updatedBy || "",
  };
}

export function calculateRankScore(history = {}, dailyCap = DEFAULT_TRIBE_RANK_RULES.dailyRankPointCap) {
  return Object.values(history || {}).reduce((sum, day) => {
    const total = Number(day?.totalPoints || 0);
    return sum + Math.min(Math.max(0, total), dailyCap);
  }, 0);
}

function passesLevel(metrics, level) {
  return metrics.score >= level.minScore
    && metrics.activeDays >= level.minActiveDays
    && metrics.streak >= level.minStreak
    && metrics.completedChallenges >= level.completedChallenges;
}

export function getRankForScore(score, rules = DEFAULT_TRIBE_RANK_RULES) {
  const normalized = normalizeRankRules(rules);
  let rank = normalized.levels[0];
  for (const level of normalized.levels) {
    if (score >= level.minScore) rank = level;
  }
  const idx = normalized.levels.findIndex(level => level.id === rank.id);
  return { ...rank, next: normalized.levels[idx + 1] || null };
}

export function getTribeStatus(metrics = {}, rules = DEFAULT_TRIBE_RANK_RULES) {
  const normalized = normalizeRankRules(rules);
  const safeMetrics = {
    score: Math.max(0, Math.round(numberOr(metrics.score, 0))),
    activeDays: Math.max(0, Math.round(numberOr(metrics.activeDays, 0))),
    streak: Math.max(0, Math.round(numberOr(metrics.streak, 0))),
    completedChallenges: Math.max(0, Math.round(numberOr(metrics.completedChallenges, 0))),
  };

  let rank = normalized.levels[0];
  for (const level of normalized.levels) {
    if (passesLevel(safeMetrics, level)) rank = level;
  }
  const idx = normalized.levels.findIndex(level => level.id === rank.id);
  return { rank: { ...rank, next: normalized.levels[idx + 1] || null }, next: normalized.levels[idx + 1] || null };
}

export function rankRequirementText(level) {
  if (!level) return "Highest status reached";
  const parts = [`${level.minScore.toLocaleString()} Tribe Score`];
  if (level.minActiveDays > 0) parts.push(`${level.minActiveDays} active days`);
  if (level.minStreak > 0) parts.push(`${level.minStreak}-day streak`);
  if (level.completedChallenges > 0) parts.push(`${level.completedChallenges} completed challenge${level.completedChallenges === 1 ? "" : "s"}`);
  return parts.join(" + ");
}

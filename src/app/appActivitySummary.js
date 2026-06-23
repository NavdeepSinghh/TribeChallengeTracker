import { calculateRankScore, getTribeStatus } from "../rankRules";
import { ACTIVITY_TYPES, getEntryActivities, getStreak } from "./activityModel";

export function buildAppActivitySummary({ myHistory, rankRules, userProfile }) {
  const streak = getStreak(myHistory);
  const allActivities = Object.values(myHistory).flatMap(entry => getEntryActivities(entry));
  const totalPts = allActivities.reduce((s, a) => s + (a.points || 0), 0);
  const daysActive = Object.keys(myHistory).filter(d => getEntryActivities(myHistory[d]).length > 0).length;
  const completedChallenges = userProfile?.stats?.challengesCompleted || 0;
  const actCounts = ACTIVITY_TYPES.reduce((acc, a) => {
    acc[a.id] = allActivities.filter(h => h.type === a.id).length;
    return acc;
  }, {});
  const hasActivePro = userProfile?.entitlements?.pro?.active === true;
  const shareTemplateId = userProfile?.sharePreferences?.templateId || "classic";

  return {
    actCounts,
    allActivities,
    daysActive,
    hasActivePro,
    shareStats: {
      totalPts,
      streak,
      daysActive,
      rank: getTribeStatus({
        score: calculateRankScore(myHistory, rankRules?.dailyRankPointCap),
        activeDays: daysActive,
        streak,
        completedChallenges,
      }, rankRules).rank,
      instagramHandle: userProfile?.instagramHandle,
      templateId: shareTemplateId,
    },
    shareTemplateId,
    streak,
    totalPts,
  };
}

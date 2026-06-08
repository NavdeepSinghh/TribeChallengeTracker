import { buildMonthlyReport, buildWeeklyReport } from '../weeklyReport';
import { summarizeProAnalytics } from './profileStats';

export function buildProfileReportData({
  allActivities,
  currentStreak,
  daysActive,
  goals,
  monthlyRecap,
  totalChallengePoints,
  totalWinPoints,
  weeklyRecap,
}) {
  const proAnalytics = summarizeProAnalytics({
    activities: allActivities,
    daysActive,
    totalWinPoints,
    weeklyRecap,
    separator: ' · ',
  });
  const weeklyReport = buildWeeklyReport({
    weeklyRecap,
    goals,
    currentStreak,
    totalChallengePoints,
    bestType: proAnalytics.bestType,
  });
  const monthlyReport = buildMonthlyReport({
    monthlyRecap,
    goals,
    currentStreak,
    totalChallengePoints,
    bestType: proAnalytics.bestType,
  });

  return {
    monthlyReport,
    proAnalytics,
    weeklyReport,
  };
}

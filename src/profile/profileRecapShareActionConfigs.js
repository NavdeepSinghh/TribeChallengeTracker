import {
  buildMonthlyRecapShareText,
  buildWeeklyRecapShareText,
} from './profileShareCards';
import {
  buildProfileShareBlobInput,
  getProfileInstagramHandle,
} from './profileShareConfigHelpers';

export function buildWeeklyRecapShareConfig({
  currentStreak,
  instagramHandle,
  profile,
  rank,
  setWinCardMessage,
  weeklyRecap,
}) {
  const instagram = getProfileInstagramHandle({ instagramHandle, profile });

  return {
    blobInput: buildProfileShareBlobInput({
      daysActive: weeklyRecap.activeDays,
      displayName: '7-Day Recap',
      instagramHandle: instagram,
      periodLabel: '7-Day Recap',
      points: weeklyRecap.points,
      profile,
      rank,
      sessions: weeklyRecap.sessions,
      streak: currentStreak,
      variant: 'weekly',
    }),
    downloadName: 'rise-with-the-tribe-weekly-recap.png',
    errorMessage: 'Could not create weekly recap.',
    fallbackMessage: 'Weekly recap downloaded and copy saved.',
    setMessage: setWinCardMessage,
    shareReadyMessage: 'Weekly recap ready to share.',
    text: buildWeeklyRecapShareText({ instagram, weeklyRecap }),
    title: 'Rise With The Tribe Weekly Recap',
  };
}

export function buildMonthlyRecapShareConfig({
  currentStreak,
  instagramHandle,
  monthlyReport,
  profile,
  rank,
  setWinCardMessage,
}) {
  const instagram = getProfileInstagramHandle({ instagramHandle, profile });

  return {
    blobInput: buildProfileShareBlobInput({
      daysActive: monthlyReport.activeDays,
      displayName: '30-Day Recap',
      instagramHandle: instagram,
      periodLabel: '30-Day Recap',
      points: monthlyReport.monthlyPoints,
      profile,
      rank,
      sessions: monthlyReport.sessions,
      streak: currentStreak,
      variant: 'monthly',
    }),
    downloadName: 'rise-with-the-tribe-monthly-recap.png',
    errorMessage: 'Could not create monthly recap.',
    fallbackMessage: 'Monthly recap downloaded and copy saved.',
    setMessage: setWinCardMessage,
    shareReadyMessage: 'Monthly recap ready to share.',
    text: buildMonthlyRecapShareText({ instagram, monthlyReport }),
    title: 'Rise With The Tribe 30-Day Recap',
  };
}

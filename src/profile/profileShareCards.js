import { makeWinCardBlob } from './profileMedia';

export function buildWinCardShareText({
  currentStreak,
  daysActive,
  instagram,
  totalWinPoints,
}) {
  return `My Rise With The Tribe win card: ${totalWinPoints} pts · ${currentStreak}-day streak · ${daysActive} days active${instagram ? ` @${instagram}` : ''}\nTag @risewiththetribe and build your next win.`;
}

export function buildWeeklyRecapShareText({
  instagram,
  weeklyRecap,
}) {
  return `My 7-day Rise With The Tribe recap: ${weeklyRecap.points} pts · ${weeklyRecap.sessions} sessions · ${weeklyRecap.activeDays}/7 days active${instagram ? ` @${instagram}` : ''}\nTag @risewiththetribe and start your next week strong.`;
}

export function buildMonthlyRecapShareText({
  instagram,
  monthlyReport,
}) {
  return `My 30-day Rise With The Tribe recap: ${monthlyReport.monthlyPoints} pts · ${monthlyReport.sessions} sessions · ${monthlyReport.activeDays}/30 days active · ${monthlyReport.monthlyScore}% score${instagram ? ` @${instagram}` : ''}\nTag @risewiththetribe and build your next month with the tribe.`;
}

export async function shareProfileCard({
  blobInput,
  downloadName,
  imageType = 'image/png',
  setMessage,
  shareReadyMessage,
  fallbackMessage,
  errorMessage = 'Could not create share card.',
  text,
  title,
}) {
  setMessage('');
  try {
    const blob = await makeWinCardBlob(blobInput);
    const file = blob ? new File([blob], downloadName, { type: imageType }) : null;
    if (navigator.share && file && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ title, text, files: [file] });
      setMessage(shareReadyMessage);
      return;
    }
    await navigator.clipboard?.writeText(text);
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadName;
      a.click();
      URL.revokeObjectURL(url);
    }
    setMessage(fallbackMessage);
  } catch (err) {
    setMessage(err?.message || errorMessage);
  }
}

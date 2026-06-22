import { buildWinCardShareText } from './profileShareCards';
import {
  buildProfileShareBlobInput,
  getProfileInstagramHandle,
} from './profileShareConfigHelpers';
export {
  buildMonthlyRecapShareConfig,
  buildWeeklyRecapShareConfig,
} from './profileRecapShareActionConfigs';

export function buildWinCardShareConfig({
  currentStreak,
  daysActive,
  instagramHandle,
  profile,
  rank,
  setWinCardMessage,
  totalWinPoints,
  user,
}) {
  const instagram = getProfileInstagramHandle({ instagramHandle, profile });

  return {
    blobInput: buildProfileShareBlobInput({
      daysActive,
      instagramHandle: instagram,
      points: totalWinPoints,
      profile,
      rank,
      streak: currentStreak,
      user,
      variant: 'win',
    }),
    downloadName: 'rise-with-the-tribe-win-card.png',
    errorMessage: 'Could not create win card.',
    fallbackMessage: 'Win card downloaded and copy saved.',
    setMessage: setWinCardMessage,
    shareReadyMessage: 'Win card ready to share.',
    text: buildWinCardShareText({ currentStreak, daysActive, instagram, totalWinPoints }),
    title: 'Rise With The Tribe Win Card',
  };
}

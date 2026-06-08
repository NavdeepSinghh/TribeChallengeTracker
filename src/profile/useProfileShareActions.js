import { shareProfileCard } from './profileShareCards';
import {
  buildMonthlyRecapShareConfig,
  buildWeeklyRecapShareConfig,
  buildWinCardShareConfig,
} from './profileShareActionConfigs';

export default function useProfileShareActions({
  currentStreak,
  daysActive,
  instagramHandle,
  monthlyReport,
  profile,
  rank,
  setWinCardMessage,
  totalWinPoints,
  user,
  weeklyRecap,
}) {
  const shareInputs = {
    currentStreak,
    daysActive,
    instagramHandle,
    monthlyReport,
    profile,
    rank,
    setWinCardMessage,
    totalWinPoints,
    user,
    weeklyRecap,
  };

  const handleWinCardShare = async () => {
    await shareProfileCard(buildWinCardShareConfig(shareInputs));
  };

  const handleWeeklyRecapShare = async () => {
    await shareProfileCard(buildWeeklyRecapShareConfig(shareInputs));
  };

  const handleMonthlyRecapShare = async () => {
    await shareProfileCard(buildMonthlyRecapShareConfig(shareInputs));
  };

  return {
    handleMonthlyRecapShare,
    handleWeeklyRecapShare,
    handleWinCardShare,
  };
}

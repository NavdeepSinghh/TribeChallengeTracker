import { ACCENT } from './profileConstants';
import WinCardRecapStatus from './WinCardRecapStatus';
import WinCardShareActions from './WinCardShareActions';
import WinCardShareHeader from './WinCardShareHeader';

export default function WinCardShareSection({
  totalWinPoints,
  currentStreak,
  daysActive,
  rank,
  handleWinCardShare,
  handleWeeklyRecapShare,
  handleMonthlyRecapShare,
  proActive,
  weeklyRecap,
  monthlyReport,
  winCardMessage,
}) {
  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: `linear-gradient(135deg, ${ACCENT}12, rgba(52,211,153,0.08))`,
      border: `1px solid ${ACCENT}24`,
    }}>
      <WinCardShareHeader
        currentStreak={currentStreak}
        daysActive={daysActive}
        rank={rank}
        totalWinPoints={totalWinPoints}
      />
      <WinCardShareActions
        handleMonthlyRecapShare={handleMonthlyRecapShare}
        handleWeeklyRecapShare={handleWeeklyRecapShare}
        handleWinCardShare={handleWinCardShare}
        proActive={proActive}
      />
      <WinCardRecapStatus
        monthlyReport={monthlyReport}
        weeklyRecap={weeklyRecap}
        winCardMessage={winCardMessage}
      />
    </div>
  );
}

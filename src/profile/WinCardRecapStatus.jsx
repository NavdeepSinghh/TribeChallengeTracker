export default function WinCardRecapStatus({
  monthlyReport,
  weeklyRecap,
  winCardMessage,
}) {
  return (
    <>
      <p style={{ margin: '8px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
        This week: {weeklyRecap.points} pts · {weeklyRecap.sessions} sessions · {weeklyRecap.activeDays}/7 days
      </p>
      <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
        This month: {monthlyReport.monthlyPoints} pts · {monthlyReport.sessions} sessions · {monthlyReport.activeDays}/30 days
      </p>
      {winCardMessage && (
        <p style={{ margin: '8px 0 0', color: winCardMessage.includes('Could not') ? '#ffb199' : '#777', fontSize: 10, fontFamily: 'monospace' }}>
          {winCardMessage}
        </p>
      )}
    </>
  );
}

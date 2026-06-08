import { ACCENT } from './challengeTrackerTheme';

export default function TodayHeader({ allDone, challenge, dayNum, memberData, todayLog }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
      <div>
        <p style={{ margin: 0, fontSize: 10, color: '#555', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1 }}>
          DAY {dayNum} OF {challenge.duration}
        </p>
        <p style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#fff' }}>
          {todayLog ? (allDone ? "Day complete! 🎉" : "Progress saved ✓") : "Today's Tasks"}
        </p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 24, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: ACCENT }}>
          {memberData?.currentStreak || 0}
        </div>
        <div style={{ fontSize: 9, color: '#555', fontFamily: 'monospace', fontWeight: 700 }}>STREAK 🔥</div>
      </div>
    </div>
  );
}

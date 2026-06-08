import { GOLD } from './profileConstants';

export default function WinCardShareHeader({
  currentStreak,
  daysActive,
  rank,
  totalWinPoints,
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
      <div>
        <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Win card</p>
        <p style={{ margin: '4px 0 0', color: '#777', fontSize: 10, fontFamily: 'monospace', lineHeight: 1.35 }}>
          {totalWinPoints} pts · {currentStreak}d streak · {daysActive} days active
        </p>
      </div>
      <span style={{ color: GOLD, fontSize: 20, lineHeight: 1 }}>{rank.icon}</span>
    </div>
  );
}

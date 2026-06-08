import { ACCENT, GOLD } from './challengeTrackerTheme';

export default function ProgressStatsGrid({ memberData }) {
  const stats = [
    { label: 'POINTS', value: memberData?.totalPoints || 0, color: GOLD },
    { label: 'DAYS', value: memberData?.daysCompleted || 0, color: '#34D399' },
    { label: 'BEST STK', value: memberData?.longestStreak || 0, color: ACCENT },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
      {stats.map(s => (
        <div key={s.label} style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14, padding: '14px 10px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: s.color }}>{s.value}</div>
          <div style={{ fontSize: 9, color: '#555', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 0.5, marginTop: 2 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

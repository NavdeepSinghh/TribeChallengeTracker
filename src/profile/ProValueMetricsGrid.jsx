import { GOLD } from './profileConstants';

export default function ProValueMetricsGrid({
  proActive,
  weeklyReport,
  monthlyRecap,
  totalChallengePoints,
}) {
  const metrics = [
    ['WEEK SCORE', `${weeklyReport.weeklyScore}%`],
    ['30D ACTIVE', `${monthlyRecap.activeDays}/30`],
    ['CHAL PTS', totalChallengePoints],
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      {metrics.map(([label, value]) => (
        <div key={label} style={{ borderRadius: 10, padding: 8, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ margin: 0, color: proActive ? GOLD : '#60A5FA', fontSize: 8, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
          <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 16, fontWeight: 900 }}>{value}</p>
        </div>
      ))}
    </div>
  );
}

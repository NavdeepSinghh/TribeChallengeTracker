export default function ProAnalyticsReportSection({ proActive, weeklyReport, monthlyReport }) {
  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: proActive ? 'rgba(167,139,250,0.08)' : 'rgba(255,255,255,0.025)',
      border: `1px solid ${proActive ? 'rgba(167,139,250,0.28)' : 'rgba(255,255,255,0.06)'}`,
      opacity: proActive ? 1 : 0.82,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Pro analytics report</p>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
            Weekly and monthly performance insight
          </p>
        </div>
        <span style={{ color: proActive ? '#A78BFA' : '#777', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
          {proActive ? 'UNLOCKED' : 'PRO PREVIEW'}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {[
          ['WEEKLY SCORE', `${weeklyReport.weeklyScore}%`],
          ['7D CONSISTENCY', `${weeklyReport.consistency}%`],
          ['CHALLENGE PTS', `${weeklyReport.totalChallengePoints}`],
        ].map(([label, value]) => (
          <div key={label} style={{
            textAlign: 'center', borderRadius: 10, padding: '9px 6px',
            background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <p style={{ margin: 0, color: '#fff', fontSize: 15, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>{value}</p>
            <p style={{ margin: '3px 0 0', color: '#666', fontSize: 8, fontWeight: 800, fontFamily: 'monospace' }}>{label}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
        {[
          ['MONTH SCORE', `${monthlyReport.monthlyScore}%`],
          ['30D ACTIVE', `${monthlyReport.activeDays}/30`],
          ['30D POINTS', `${monthlyReport.monthlyPoints}`],
        ].map(([label, value]) => (
          <div key={label} style={{
            textAlign: 'center', borderRadius: 10, padding: '9px 6px',
            background: 'rgba(167,139,250,0.055)', border: '1px solid rgba(167,139,250,0.10)',
          }}>
            <p style={{ margin: 0, color: '#fff', fontSize: 15, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>{proActive ? value : 'LOCKED'}</p>
            <p style={{ margin: '3px 0 0', color: '#666', fontSize: 8, fontWeight: 800, fontFamily: 'monospace' }}>{label}</p>
          </div>
        ))}
      </div>
      <p style={{ margin: '12px 0 0', color: '#bbb', fontSize: 11, lineHeight: 1.45 }}>
        {proActive ? weeklyReport.nextAction : 'Unlock Tribe Pro to turn your history into weekly reports, trends, and personalized targets.'}
      </p>
      {proActive && (
        <p style={{ margin: '8px 0 0', color: '#A78BFA', fontSize: 10, lineHeight: 1.45, fontFamily: 'monospace' }}>
          MONTHLY: {monthlyReport.status} · {monthlyReport.nextAction}
        </p>
      )}
      <p style={{ margin: '8px 0 0', color: '#777', fontSize: 10, fontFamily: 'monospace' }}>
        STATUS: {proActive ? weeklyReport.status : 'LOCKED'} · TOP ACTIVITY: {proActive ? weeklyReport.bestType : 'LOCKED'}
      </p>
    </div>
  );
}

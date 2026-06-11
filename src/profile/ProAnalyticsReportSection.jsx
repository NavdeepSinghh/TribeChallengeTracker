export default function ProAnalyticsReportSection({ proActive, weeklyReport, monthlyReport, longHistoryReport, healthSyncInsight }) {
  const longHistory = longHistoryReport || {
    activeDays: 0,
    activeRate: 0,
    sessions: 0,
    points: 0,
    status: 'RESET WINDOW',
    topType: 'No activity yet',
    topTypeSessions: 0,
    nextAction: 'Restart with the free challenge loop and use the 90-day view to spot the simplest comeback window.',
  };
  const healthInsight = healthSyncInsight || {
    syncedSessions: 0,
    manualSessions: 0,
    syncRate: 0,
    syncedPoints: 0,
    status: 'MANUAL BASE',
    nextAction: 'Try one optional Health sync import from the log screen, or keep manual logging if that feels clearer.',
  };

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
      <div style={{
        marginTop: 10,
        borderRadius: 10,
        padding: 10,
        background: proActive ? 'rgba(45,212,191,0.07)' : 'rgba(255,255,255,0.025)',
        border: `1px solid ${proActive ? 'rgba(45,212,191,0.20)' : 'rgba(255,255,255,0.06)'}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', marginBottom: 8 }}>
          <p style={{ margin: 0, color: '#fff', fontSize: 12, fontWeight: 900 }}>90-day history insight</p>
          <span style={{ color: proActive ? '#5EEAD4' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
            {proActive ? longHistory.status : 'PRO PREVIEW'}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            ['90D ACTIVE', `${longHistory.activeDays}/90`],
            ['90D SESSIONS', `${longHistory.sessions}`],
            ['90D POINTS', `${longHistory.points}`],
          ].map(([label, value]) => (
            <div key={label} style={{
              textAlign: 'center',
              borderRadius: 8,
              padding: '8px 5px',
              background: 'rgba(255,255,255,0.035)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <p style={{ margin: 0, color: '#fff', fontSize: 14, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>
                {proActive ? value : 'LOCKED'}
              </p>
              <p style={{ margin: '3px 0 0', color: '#777', fontSize: 8, fontWeight: 800, fontFamily: 'monospace' }}>{label}</p>
            </div>
          ))}
        </div>
        <p style={{ margin: '8px 0 0', color: proActive ? '#BFF7EA' : '#777', fontSize: 10, lineHeight: 1.45, fontFamily: 'monospace' }}>
          90-day activity history view: {proActive ? `${longHistory.activeRate}% active · top activity ${longHistory.topType} (${longHistory.topTypeSessions})` : 'unlock Pro to compare 90-day active days, sessions, points, and top activity'}.
        </p>
        {proActive && (
          <p style={{ margin: '6px 0 0', color: '#9CA3AF', fontSize: 10, lineHeight: 1.45 }}>
            {longHistory.nextAction}
          </p>
        )}
        <p style={{ margin: '6px 0 0', color: '#666', fontSize: 9, lineHeight: 1.4, fontFamily: 'monospace' }}>
          Uses existing app history only; does not export private history, create purchases, grant Pro, write entitlements, or imply paid access is live.
        </p>
      </div>
      <div style={{
        marginTop: 10,
        borderRadius: 10,
        padding: 10,
        background: proActive ? 'rgba(96,165,250,0.07)' : 'rgba(255,255,255,0.025)',
        border: `1px solid ${proActive ? 'rgba(96,165,250,0.20)' : 'rgba(255,255,255,0.06)'}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', marginBottom: 8 }}>
          <p style={{ margin: 0, color: '#fff', fontSize: 12, fontWeight: 900 }}>Health Sync Insight</p>
          <span style={{ color: proActive ? '#93C5FD' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
            {proActive ? healthInsight.status : 'PRO PREVIEW'}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            ['SYNCED', `${healthInsight.syncedSessions}`],
            ['MANUAL', `${healthInsight.manualSessions}`],
            ['SYNC RATE', `${healthInsight.syncRate}%`],
          ].map(([label, value]) => (
            <div key={label} style={{
              textAlign: 'center',
              borderRadius: 8,
              padding: '8px 5px',
              background: 'rgba(255,255,255,0.035)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <p style={{ margin: 0, color: '#fff', fontSize: 14, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>
                {proActive ? value : 'LOCKED'}
              </p>
              <p style={{ margin: '3px 0 0', color: '#777', fontSize: 8, fontWeight: 800, fontFamily: 'monospace' }}>{label}</p>
            </div>
          ))}
        </div>
        <p style={{ margin: '8px 0 0', color: proActive ? '#BFDBFE' : '#777', fontSize: 10, lineHeight: 1.45, fontFamily: 'monospace' }}>
          Optional HealthKit / Health Connect insight: {proActive ? `${healthInsight.syncedPoints} synced points from imported workouts in the last 30 days.` : 'unlock Pro to compare synced workouts with manual app logs.'}
        </p>
        {proActive && (
          <p style={{ margin: '6px 0 0', color: '#9CA3AF', fontSize: 10, lineHeight: 1.45 }}>
            {healthInsight.nextAction}
          </p>
        )}
        <p style={{ margin: '6px 0 0', color: '#666', fontSize: 9, lineHeight: 1.4, fontFamily: 'monospace' }}>
          Uses already-imported app logs only; does not request new health permissions, export raw health data, create diagnoses, promise medical results, create purchases, grant Pro, write entitlements, or imply paid access is live.
        </p>
      </div>
      <p style={{ margin: '8px 0 0', color: '#777', fontSize: 10, fontFamily: 'monospace' }}>
        STATUS: {proActive ? weeklyReport.status : 'LOCKED'} · TOP ACTIVITY: {proActive ? weeklyReport.bestType : 'LOCKED'}
      </p>
    </div>
  );
}

const ACCENT = '#FF6B35';

export default function OnboardingCompletionSummaryCard({ activities, rows }) {
  return (
    <div style={{
      width: '100%',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 20, padding: '4px 20px 16px', marginBottom: 24,
    }}>
      {rows.map((row, i) => (
        <div key={row.label} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '13px 0',
          borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
        }}>
          <span style={{ fontSize: 10, color: '#444', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1 }}>
            {row.label}
          </span>
          <span style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>{row.value}</span>
        </div>
      ))}

      {activities.length > 0 && (
        <div style={{ paddingTop: 14 }}>
          <span style={{ fontSize: 10, color: '#444', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 10 }}>
            ACTIVITIES
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {activities.map(a => (
              <span key={a} style={{
                padding: '5px 12px', borderRadius: 20,
                background: 'rgba(255,107,53,0.1)',
                border: '1px solid rgba(255,107,53,0.25)',
                color: ACCENT, fontSize: 12, fontWeight: 700,
              }}>
                {a}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

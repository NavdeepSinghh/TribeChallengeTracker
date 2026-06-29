const ACCENT = '#FF6B35';

export default function OnboardingCompletionSummaryCard({ activities, rows }) {
  return (
    <div style={{
      width: '100%',
      background: '#fff',
      border: '1px solid #e8e3da',
      borderRadius: 20, padding: '4px 20px 16px', marginBottom: 24,
      boxShadow: '0 12px 28px rgba(17,17,17,0.06)',
    }}>
      {rows.map((row, i) => (
        <div key={row.label} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '13px 0',
          borderBottom: i < rows.length - 1 ? '1px solid #f0ede7' : 'none',
          gap: 16,
        }}>
          <span style={{ fontSize: 11, color: '#706d66', fontWeight: 900, letterSpacing: 1 }}>
            {row.label}
          </span>
          <span style={{ fontSize: 14, color: '#050505', fontWeight: 900, textAlign: 'right' }}>{row.value}</span>
        </div>
      ))}

      {activities.length > 0 && (
        <div style={{ paddingTop: 14 }}>
          <span style={{ fontSize: 11, color: '#706d66', fontWeight: 900, letterSpacing: 1, display: 'block', marginBottom: 10 }}>
            ACTIVITIES
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {activities.map(a => (
              <span key={a} style={{
                padding: '7px 12px',
                borderRadius: 20,
                background: '#fff3ec',
                border: '1px solid #ffd6c3',
                color: ACCENT,
                fontSize: 13,
                fontWeight: 900,
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

export default function ProgressCompletionRecap({
  challenge,
  completedDays,
  completionLabel,
  memberData,
  shareCompletion,
}) {
  return (
    <div style={{
      marginBottom: 20, padding: '16px', borderRadius: 16,
      background: 'linear-gradient(135deg, rgba(52,211,153,0.12), rgba(255,215,0,0.07))',
      border: '1px solid rgba(52,211,153,0.28)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 15, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>
            {completionLabel}
          </p>
          <p style={{ margin: '4px 0 0', color: '#777', fontSize: 10, fontFamily: 'monospace' }}>
            {challenge.isPremium ? 'Premium pack recap ready to share' : 'Completion recap ready to share'}
          </p>
        </div>
        <span style={{ color: '#34D399', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>DONE</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
        {[
          ['PTS', memberData?.totalPoints || 0],
          ['DAYS', `${completedDays}/${challenge.duration}`],
          ['STREAK', memberData?.currentStreak || 0],
        ].map(([label, value]) => (
          <div key={label} style={{
            textAlign: 'center', borderRadius: 10, padding: '9px 6px',
            background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <p style={{ margin: 0, color: '#fff', fontSize: 16, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>{value}</p>
            <p style={{ margin: '3px 0 0', color: '#777', fontSize: 8, fontWeight: 800, fontFamily: 'monospace' }}>{label}</p>
          </div>
        ))}
      </div>
      <button onClick={shareCompletion} style={{
        width: '100%', border: 'none', borderRadius: 12, padding: '12px',
        background: '#34D399', color: '#06130D', fontSize: 12, fontWeight: 900,
        cursor: 'pointer',
      }}>
        Share Completion Recap
      </button>
    </div>
  );
}

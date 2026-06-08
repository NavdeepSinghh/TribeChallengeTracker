export function ReferralMetric({ label, value, color = '#fff', centered = false }) {
  return (
    <div style={{
      borderRadius: 10, padding: centered ? '9px 6px' : 9,
      background: centered ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.18)',
      border: '1px solid rgba(255,255,255,0.06)',
      textAlign: centered ? 'center' : 'left',
    }}>
      {centered ? (
        <>
          <p style={{ margin: 0, color: '#fff', fontSize: 15, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>{value}</p>
          <p style={{ margin: '3px 0 0', color: '#666', fontSize: 8, fontWeight: 800, fontFamily: 'monospace' }}>{label}</p>
        </>
      ) : (
        <>
          <p style={{ margin: 0, color, fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
          <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>{value}</p>
        </>
      )}
    </div>
  );
}

export function ReferralCopyCard({ title, subtitle, status, color, body, buttonLabel, onCopy, metrics = null }) {
  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: `${color}0D`, border: `1px solid ${color}29`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>{title}</p>
          <p style={{ margin: '4px 0 0', color, fontSize: 10, fontFamily: 'monospace' }}>
            {subtitle}
          </p>
        </div>
        <span style={{ color, fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
          {status}
        </span>
      </div>
      {metrics && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
          {metrics.map(metric => (
            <ReferralMetric key={metric.label} color={color} {...metric} />
          ))}
        </div>
      )}
      <p style={{ margin: '12px 0 0', color: '#d6fff0', fontSize: 12, lineHeight: 1.45 }}>
        {body}
      </p>
      <button
        onClick={onCopy}
        style={{
          width: '100%', marginTop: 12, padding: '12px',
          borderRadius: 14, border: `1px solid ${color}38`,
          background: `${color}1A`, color,
          fontWeight: 900, fontSize: 11, fontFamily: 'monospace',
        }}
      >
        {buttonLabel}
      </button>
    </div>
  );
}

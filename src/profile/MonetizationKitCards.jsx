export function MetricCard({ label, value, color }) {
  return (
    <div style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <p style={{ margin: 0, color, fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
      <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 14, fontWeight: 900 }}>{value}</p>
    </div>
  );
}

export function CopyKitPanel({
  title,
  subtitle,
  status,
  color,
  metrics,
  body,
  buttonLabel,
  copyText,
}) {
  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: `${color}0D`,
      border: `1px solid ${color}29`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {metrics.map(metric => (
          <MetricCard key={metric.label} color={color} {...metric} />
        ))}
      </div>
      <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
        {body}
      </p>
      <button
        onClick={() => navigator.clipboard?.writeText(copyText)}
        style={{
          marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
          border: `1px solid ${color}38`, background: `${color}1A`,
          color, fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
        }}
      >
        {buttonLabel}
      </button>
    </div>
  );
}

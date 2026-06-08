function CreatorPlanningMetricGrid({ color, metrics }) {
  if (!metrics?.length) return null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      {metrics.map(([label, value]) => (
        <div key={label} style={{ borderRadius: 10, padding: 8, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ margin: 0, color, fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
          <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 18, fontWeight: 900 }}>{value}</p>
        </div>
      ))}
    </div>
  );
}

export default function CreatorPlanningCopyKitCard({
  body,
  buttonLabel,
  color,
  copyText,
  metrics,
  preLine = false,
  proActive,
  status,
  statusActive,
  subtitle,
  title,
}) {
  return (
    <div style={{
      borderRadius: 12, padding: 12, marginBottom: 10,
      background: proActive ? `${color}14` : 'rgba(0,0,0,0.18)',
      border: `1px solid ${color}33`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start', marginBottom: metrics?.length ? 10 : 0 }}>
        <div>
          <p style={{ margin: 0, color, fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>{title}</p>
          <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>
            {subtitle}
          </p>
        </div>
        <span style={{ color: proActive && statusActive ? color : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
          {status}
        </span>
      </div>
      <CreatorPlanningMetricGrid color={color} metrics={metrics} />
      <p style={{ whiteSpace: preLine ? 'pre-line' : undefined, margin: metrics?.length ? '9px 0 0' : '9px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
        {body}
      </p>
      <button
        onClick={() => navigator.clipboard?.writeText(copyText)}
        disabled={!proActive}
        style={{
          marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
          border: `1px solid ${color}3D`, background: proActive ? `${color}1A` : 'rgba(255,255,255,0.05)',
          color: proActive ? color : '#666', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
          cursor: proActive ? 'pointer' : 'not-allowed',
        }}
      >
        {buttonLabel}
      </button>
    </div>
  );
}

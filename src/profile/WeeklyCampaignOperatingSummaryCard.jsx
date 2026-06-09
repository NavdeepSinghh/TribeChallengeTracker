export default function WeeklyCampaignOperatingSummaryCard({
  title,
  subtitle,
  status,
  accent,
  metrics,
  actionLanes,
  copyText,
}) {
  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: 'linear-gradient(135deg, rgba(56,189,248,0.16), rgba(34,197,94,0.08))',
      border: `1px solid ${accent}40`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>{title}</p>
          <p style={{ margin: '4px 0 0', color: '#8a96a8', fontSize: 10, fontFamily: 'monospace' }}>
            {subtitle}
          </p>
        </div>
        <span style={{ color: accent, fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
          {status}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
        {metrics.map(([label, value]) => (
          <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ margin: 0, color: accent, fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
            <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 13, fontWeight: 900 }}>{value}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        {actionLanes.map(lane => (
          <div key={lane.label} style={{ borderRadius: 10, padding: 10, background: 'rgba(255,255,255,0.04)' }}>
            <p style={{ margin: 0, color: accent, fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{lane.label}</p>
            <p style={{ margin: '4px 0 0', color: '#c7d2de', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              {lane.body}
            </p>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigator.clipboard?.writeText(copyText)}
        style={{
          marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
          border: `1px solid ${accent}38`, background: `${accent}1A`,
          color: accent, fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
        }}
      >
        COPY OPERATOR SUMMARY
      </button>
    </div>
  );
}

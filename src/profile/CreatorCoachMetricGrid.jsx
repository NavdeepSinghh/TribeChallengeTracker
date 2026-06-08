export default function CreatorCoachMetricGrid({ color, metrics, proActive }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${metrics.length}, 1fr)`, gap: 8, marginBottom: 10 }}>
      {metrics.map(([label, value]) => (
        <div key={label} style={{
          borderRadius: 10, padding: 9,
          background: proActive ? `${color}14` : 'rgba(0,0,0,0.18)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <p style={{ margin: 0, color: proActive ? color : '#666', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
          <p style={{ margin: '4px 0 0', color: proActive ? '#fff' : '#777', fontSize: 18, fontWeight: 900 }}>{proActive ? value : '•'}</p>
        </div>
      ))}
    </div>
  );
}

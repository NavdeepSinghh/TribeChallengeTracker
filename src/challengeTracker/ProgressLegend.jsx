const LEGEND_ITEMS = [
  { color: 'rgba(52,211,153,0.35)', label: 'Full day' },
  { color: 'rgba(255,215,0,0.25)', label: 'Partial' },
  { color: 'rgba(255,60,60,0.2)', label: 'Missed' },
  { color: 'rgba(255,255,255,0.06)', label: 'Upcoming' },
];

export default function ProgressLegend() {
  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
      {LEGEND_ITEMS.map(l => (
        <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
          <span style={{ fontSize: 9, color: '#555', fontFamily: 'monospace' }}>{l.label}</span>
        </div>
      ))}
    </div>
  );
}

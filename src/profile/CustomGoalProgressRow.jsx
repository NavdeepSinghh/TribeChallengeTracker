export default function CustomGoalProgressRow({
  disabled,
  label,
  max,
  min,
  pct,
  progressLabel,
  setter,
  value,
}) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <label style={{ flex: 1, color: '#bbb', fontSize: 11, fontWeight: 800 }}>{label}</label>
        <input
          type="number"
          min={min}
          max={max}
          disabled={disabled}
          value={value}
          onChange={e => setter(Number(e.target.value))}
          style={{
            width: 72, height: 34, borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.25)',
            color: disabled ? '#777' : '#fff', fontSize: 12, fontWeight: 900,
            textAlign: 'center',
          }}
        />
      </div>
      <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 999, background: '#34D399' }} />
      </div>
      <p style={{ margin: '5px 0 0', color: '#666', fontSize: 9, fontFamily: 'monospace' }}>{progressLabel}</p>
    </div>
  );
}

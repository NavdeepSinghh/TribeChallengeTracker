export default function ReferralRewardMetric({ label, value, color = '#14B8A6' }) {
  return (
    <div style={{
      borderRadius: 10, padding: 9,
      background: 'rgba(0,0,0,0.18)',
      border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <p style={{ margin: 0, color, fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
      <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>{value}</p>
    </div>
  );
}

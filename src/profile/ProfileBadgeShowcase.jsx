export default function ProfileBadgeShowcase({ earnedList }) {
  if (earnedList.length === 0) return null;

  return (
    <>
      <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>
        BADGES ({earnedList.length})
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {earnedList.map(b => (
          <div key={b.id} title={`${b.label} - ${b.desc}`} style={{
            width: 46, height: 46, borderRadius: 14, flexShrink: 0,
            background: `${b.color}18`, border: `1.5px solid ${b.color}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, boxShadow: `0 0 12px ${b.color}22`,
          }}>
            {b.icon}
          </div>
        ))}
      </div>
    </>
  );
}

export default function ProfileBadgeShowcase({ earnedList, onOpenBadges }) {
  if (earnedList.length === 0) return null;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, margin: '0 0 12px' }}>
        <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: 0 }}>
          EARNED BADGES ({earnedList.length})
        </p>
        {onOpenBadges && (
          <button
            type="button"
            onClick={onOpenBadges}
            style={{
              background: 'none',
              border: 'none',
              color: '#FF6B35',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: 10,
              fontWeight: 900,
              padding: 0,
            }}
          >
            VIEW ALL -&gt;
          </button>
        )}
      </div>
      <div
        onClick={onOpenBadges}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 24,
          cursor: onOpenBadges ? 'pointer' : 'default',
        }}
      >
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

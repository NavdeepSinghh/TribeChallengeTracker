export default function ChallengeTrackerHeaderActions({ onBack, onLeave }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12 }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 13, fontFamily: 'monospace', fontWeight: 700, padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
        ← CHALLENGES
      </button>
      <button
        onClick={onLeave}
        style={{
          background: 'none', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 8, padding: '5px 12px', cursor: 'pointer',
          color: 'rgba(239,68,68,0.7)', fontSize: 11,
          fontFamily: 'monospace', fontWeight: 700, letterSpacing: 0.5,
          transition: 'all .2s',
        }}
      >
        LEAVE
      </button>
    </div>
  );
}

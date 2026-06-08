import { ACCENT, PROFILE_FRAMES } from './profileConstants';

export default function ProfileFrameOptionGrid({
  onFrameSelect,
  selectedFrameId,
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
      {PROFILE_FRAMES.map(frame => {
        const selected = selectedFrameId === frame.id;
        const fill = frame.id === 'none' ? 'rgba(255,255,255,0.06)' : `linear-gradient(135deg, ${frame.colors[0]}, ${frame.colors[1]})`;
        return (
          <button
            key={frame.id}
            onClick={() => onFrameSelect(frame.id)}
            style={{
              minHeight: 66, borderRadius: 14, padding: 8,
              border: selected ? `2px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.08)',
              background: selected ? 'rgba(255,107,53,0.08)' : 'rgba(255,255,255,0.03)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 7, cursor: 'pointer',
            }}
          >
            <span style={{
              width: 26, height: 26, borderRadius: 999,
              background: fill, border: '1px solid rgba(255,255,255,0.18)',
            }} />
            <span style={{ color: '#ddd', fontSize: 10, fontWeight: 900 }}>{frame.label}</span>
          </button>
        );
      })}
    </div>
  );
}

import { AVATAR_OPTIONS } from './profileConstants';

export default function AvatarOptionGrid({ onPickAvatar }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
      {AVATAR_OPTIONS.map(([emoji, color]) => (
        <button
          key={`${emoji}-${color}`}
          onClick={() => onPickAvatar(emoji, color)}
          style={{
            border: `1.5px solid ${color}55`, borderRadius: 18,
            background: `${color}22`, height: 70,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 5, cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: 28 }}>{emoji}</span>
          <span style={{ width: 9, height: 9, borderRadius: 999, background: color }} />
        </button>
      ))}
    </div>
  );
}

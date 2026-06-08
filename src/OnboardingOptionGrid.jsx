const ACCENT = '#FF6B35';

export default function OnboardingOptionGrid({
  current,
  isMulti,
  question,
  select,
}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${question.cols}, 1fr)`,
      gap: 10,
    }}>
      {question.options.map(opt => {
        const selected = isMulti ? current.includes(opt.id) : current === opt.id;
        return (
          <button key={opt.id} onClick={() => select(opt.id)} style={{
            padding: question.cols === 3 ? '16px 8px' : '18px 12px',
            borderRadius: 16,
            border: `1.5px solid ${selected ? ACCENT : 'rgba(255,255,255,0.08)'}`,
            background: selected ? `rgba(255,107,53,0.12)` : 'rgba(255,255,255,0.03)',
            color: '#fff', cursor: 'pointer', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            boxShadow: selected ? `0 0 20px rgba(255,107,53,0.25)` : 'none',
            transform: selected ? 'scale(1.03)' : 'scale(1)',
            transition: 'all .2s ease',
          }}>
            <span style={{ fontSize: question.cols === 3 ? 28 : 26 }}>{opt.emoji}</span>
            <span style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.3, letterSpacing: 0.2 }}>
              {opt.label}
            </span>
            {opt.desc && (
              <span style={{ fontSize: 10, color: '#555', fontFamily: 'monospace' }}>{opt.desc}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

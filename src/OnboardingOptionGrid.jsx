const ACCENT = '#FF6B35';

export default function OnboardingOptionGrid({
  current,
  isMulti,
  question,
  select,
}) {
  const isGrid = question.layout === 'grid';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isGrid ? `repeat(${question.cols || 2}, 1fr)` : '1fr',
      gap: isGrid ? 12 : 14,
    }}>
      {question.options.map(opt => {
        const selected = isMulti ? current.includes(opt.id) : current === opt.id;
        return (
          <button key={opt.id} onClick={() => select(opt.id)} style={{
            minHeight: isGrid ? 106 : 'auto',
            padding: isGrid ? '18px 16px' : '20px 22px',
            borderRadius: 18,
            border: `1.5px solid ${selected ? '#050505' : '#efeee9'}`,
            background: selected ? '#050505' : '#f1f0ed',
            color: selected ? '#fff' : '#050505',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            position: 'relative',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: isGrid ? 'space-between' : 'center',
            gap: isGrid ? 12 : 6,
            boxShadow: selected ? '0 12px 28px rgba(0,0,0,0.16)' : 'none',
            transform: selected ? 'translateY(-1px)' : 'translateY(0)',
            transition: 'all .2s ease',
          }}>
            {opt.emoji && (
              <span style={{ fontSize: 28, lineHeight: 1 }}>{opt.emoji}</span>
            )}
            <span style={{
              fontSize: isGrid ? 18 : 20,
              fontWeight: 900,
              lineHeight: 1.2,
              letterSpacing: 0,
            }}>
              {opt.label}
            </span>
            {opt.desc && (
              <span style={{
                fontSize: 14,
                lineHeight: 1.35,
                color: selected ? 'rgba(255,255,255,0.78)' : '#55514a',
                fontWeight: 500,
              }}>
                {opt.desc}
              </span>
            )}
            {selected && (
              <span style={{
                position: 'absolute',
                right: 16,
                top: 14,
                width: 22,
                height: 22,
                borderRadius: 999,
                background: ACCENT,
                color: '#fff',
                fontSize: 14,
                fontWeight: 900,
                lineHeight: '22px',
                textAlign: 'center',
              }}>
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

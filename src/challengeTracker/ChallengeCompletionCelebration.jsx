export default function ChallengeCompletionCelebration({ completion, onDismiss }) {
  if (!completion) return null;

  const share = async () => {
    const text = completion.shareText || `I completed ${completion.challengeName} on TribeLog: ${completion.totalPoints} pts.`;
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard?.writeText(text);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(0,0,0,0.72)',
      display: 'grid', placeItems: 'center', padding: 22, overflow: 'hidden',
    }}>
      <style>{`
        @keyframes tribe-confetti-fall {
          0% { transform: translateY(-80px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(112vh) rotate(720deg); opacity: 0.12; }
        }
      `}</style>
      {Array.from({ length: 42 }).map((_, i) => (
        <span key={i} style={{
          position: 'absolute',
          top: -60,
          left: `${(i * 53) % 100}%`,
          width: 7 + (i % 3) * 3,
          height: 12 + (i % 4) * 4,
          borderRadius: 3,
          background: ['#FF6B35', '#FFD700', '#34D399', '#60A5FA', '#A78BFA'][i % 5],
          animation: `tribe-confetti-fall ${1.7 + (i % 5) * 0.14}s ease-out ${((i % 10) * 0.035)}s both`,
        }} />
      ))}
      <div style={{
        width: '100%', maxWidth: 360, padding: 22, borderRadius: 24,
        background: '#121212', border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.45)', textAlign: 'center',
      }}>
        <div style={{ fontSize: 58, marginBottom: 8 }}>🏁</div>
        <h2 style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontSize: 25, color: '#fff' }}>
          Challenge complete
        </h2>
        <p style={{ margin: '8px 0 16px', color: '#CFCFCF', fontWeight: 800 }}>
          {completion.emoji || '🏁'} {completion.challengeName}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
          {[
            ['PTS', completion.totalPoints || 0, '#FFD700'],
            ['DAYS', `${completion.daysCompleted || 0}/${completion.duration || 0}`, '#34D399'],
            ['RANK', completion.rank ? `#${completion.rank}` : '-', '#60A5FA'],
          ].map(([label, value, color]) => (
            <div key={label} style={{
              padding: '12px 6px', borderRadius: 14, background: `${color}17`,
              border: `1px solid ${color}44`,
            }}>
              <div style={{ color, fontSize: 18, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>{value}</div>
              <div style={{ color: '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</div>
            </div>
          ))}
        </div>
        <p style={{ margin: '0 0 16px', color: '#8B8B8B', fontSize: 13, fontWeight: 700, lineHeight: 1.35 }}>
          Saved to your profile as a completion keepsake and unlocked the Finisher badge.
        </p>
        <button onClick={share} style={{
          width: '100%', border: 0, borderRadius: 16, padding: '14px 16px',
          background: '#34D399', color: '#06130D', fontWeight: 900,
          fontFamily: "'Syne', sans-serif", fontSize: 15, cursor: 'pointer',
        }}>
          Share your finish
        </button>
        <button onClick={onDismiss} style={{
          marginTop: 12, border: 0, background: 'transparent', color: '#FF6B35',
          fontFamily: 'monospace', fontSize: 11, fontWeight: 900, cursor: 'pointer',
        }}>
          DONE
        </button>
      </div>
    </div>
  );
}

export default function StreakRescuePromptCard({
  copyText,
  currentStreak,
  goalStreak,
  streakRescuePromptCopy,
}) {
  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.16)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>STREAK RESCUE PROMPT KIT</p>
          <p style={{ margin: '4px 0 0', color: '#FDE68A', fontSize: 10, fontFamily: 'monospace' }}>
            Comeback copy after a missed day
          </p>
        </div>
        <span style={{ color: '#FBBF24', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
          {currentStreak}/{goalStreak}
        </span>
      </div>
      <p style={{ margin: '12px 0 0', color: '#FEF3C7', fontSize: 12, lineHeight: 1.45 }}>
        Copy a pressure-safe restart prompt that brings members back to honest logging without awarding points or spending recovery credits.
      </p>
      <button
        type="button"
        onClick={() => copyText(streakRescuePromptCopy, 'Streak rescue prompt copied')}
        style={{
          width: '100%', marginTop: 12, padding: '12px',
          borderRadius: 14, border: '1px solid rgba(251,191,36,0.22)',
          background: 'rgba(251,191,36,0.10)', color: '#FBBF24',
          fontWeight: 900, fontSize: 11, fontFamily: 'monospace',
        }}
      >
        COPY STREAK RESCUE PROMPT
      </button>
    </div>
  );
}

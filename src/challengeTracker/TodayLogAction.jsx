import { ACCENT, GOLD } from './challengeTrackerTheme';

export default function TodayLogAction({
  checked,
  dayNum,
  handleLog,
  memberData,
  preview,
  saving,
  todayLog,
}) {
  if (todayLog) {
    return (
      <div style={{
        textAlign: 'center', padding: '14px', borderRadius: 14,
        background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.25)',
      }}>
        <p style={{ margin: 0, fontSize: 13, color: '#34D399', fontWeight: 700 }}>
          ✅ Logged — see you tomorrow!
        </p>
        <p style={{ margin: '4px 0 0', fontSize: 11, color: '#555', fontFamily: 'monospace' }}>
          Total so far: {(memberData?.totalPoints || 0) + (todayLog?.points || 0)} pts
        </p>
      </div>
    );
  }

  return (
    <button onClick={handleLog} disabled={!checked.size || saving} style={{
      width: '100%', padding: '15px', borderRadius: 14, border: 'none',
      background: checked.size
        ? `linear-gradient(135deg, ${ACCENT}, ${GOLD})`
        : 'rgba(255,255,255,0.06)',
      color: checked.size ? '#000' : '#444',
      fontSize: 15, fontWeight: 800,
      cursor: checked.size ? 'pointer' : 'default',
      fontFamily: "'Syne', sans-serif", letterSpacing: 0.5,
      boxShadow: checked.size ? `0 4px 20px rgba(255,107,53,0.35)` : 'none',
      opacity: saving ? 0.7 : 1, transition: 'all .2s',
    }}>
      {saving ? '…' : `Log Day ${dayNum} → +${preview} pts`}
    </button>
  );
}

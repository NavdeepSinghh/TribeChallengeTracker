import { ACCENT, GOLD } from './profileConstants';

export default function StreakRecoveryCard({
  isSavingRecovery,
  onStreakRecovery,
  proActive,
  recoveryMessage,
  yesterdayRecovered,
}) {
  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: proActive ? 'rgba(255,107,53,0.06)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${proActive ? 'rgba(255,107,53,0.22)' : 'rgba(255,255,255,0.06)'}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Streak recovery</p>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
            Recover yesterday as a zero-point Pro credit
          </p>
        </div>
        <span style={{ color: proActive ? ACCENT : GOLD, fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
          {yesterdayRecovered ? 'USED' : 'PRO'}
        </span>
      </div>
      <button
        onClick={onStreakRecovery}
        disabled={isSavingRecovery}
        style={{
          width: '100%', marginTop: 12, padding: '12px',
          borderRadius: 14, border: 'none',
          background: proActive ? ACCENT : 'rgba(255,255,255,0.08)',
          color: proActive ? '#111' : '#aaa',
          fontWeight: 900, cursor: isSavingRecovery ? 'wait' : 'pointer',
        }}
      >
        {proActive ? (isSavingRecovery ? 'Recovering Streak' : 'Recover Yesterday') : 'Unlock with Tribe Pro'}
      </button>
      {recoveryMessage && (
        <p style={{ margin: '10px 0 0', color: proActive ? '#34D399' : GOLD, fontSize: 11, fontWeight: 800 }}>
          {recoveryMessage}
        </p>
      )}
    </div>
  );
}

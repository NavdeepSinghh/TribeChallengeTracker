import { ACCENT, GOLD } from './profileConstants';
import { V1_PAID_FEATURES_ENABLED } from '../proFeatures';

export default function StreakRecoveryCard({
  isSavingRecovery,
  onStreakRecovery,
  proActive,
  recoveryMessage,
  yesterdayRecovered,
}) {
  const enabled = V1_PAID_FEATURES_ENABLED && proActive;
  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: enabled ? 'rgba(255,107,53,0.06)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${enabled ? 'rgba(255,107,53,0.22)' : 'rgba(255,255,255,0.06)'}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Streak recovery</p>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
            Recover yesterday as a zero-point credit in a later release
          </p>
        </div>
        <span style={{ color: enabled ? ACCENT : GOLD, fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
          {yesterdayRecovered ? 'USED' : 'LATER'}
        </span>
      </div>
      <button
        onClick={onStreakRecovery}
        disabled={isSavingRecovery || !enabled}
        style={{
          width: '100%', marginTop: 12, padding: '12px',
          borderRadius: 14, border: 'none',
          background: enabled ? ACCENT : 'rgba(255,255,255,0.08)',
          color: enabled ? '#111' : '#aaa',
          fontWeight: 900, cursor: isSavingRecovery ? 'wait' : enabled ? 'pointer' : 'default',
        }}
      >
        {enabled ? (isSavingRecovery ? 'Recovering Streak' : 'Recover Yesterday') : 'Later Release'}
      </button>
      {recoveryMessage && (
        <p style={{ margin: '10px 0 0', color: enabled ? '#34D399' : GOLD, fontSize: 11, fontWeight: 800 }}>
          {recoveryMessage}
        </p>
      )}
    </div>
  );
}

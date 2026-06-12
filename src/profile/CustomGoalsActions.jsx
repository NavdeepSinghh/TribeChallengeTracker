import { V1_PAID_FEATURES_ENABLED } from '../proFeatures';

export default function CustomGoalsActions({
  goalsMessage,
  handleCustomGoalsSave,
  isSavingGoals,
  proActive,
}) {
  const enabled = !V1_PAID_FEATURES_ENABLED || proActive;
  return (
    <>
      <button onClick={handleCustomGoalsSave} disabled={isSavingGoals} style={{
        marginTop: 12, width: '100%', border: 'none', borderRadius: 12,
        background: enabled ? '#34D399' : 'rgba(255,255,255,0.08)',
        color: enabled ? '#07130d' : '#777', padding: '11px 12px',
        fontSize: 12, fontWeight: 900, cursor: isSavingGoals ? 'default' : 'pointer',
      }}>
        {enabled ? (isSavingGoals ? 'Saving goals' : 'Save Custom Goals') : 'Later Release'}
      </button>
      {goalsMessage && (
        <p style={{ margin: '8px 0 0', color: enabled ? '#34D399' : '#A78BFA', fontSize: 10, fontFamily: 'monospace' }}>
          {goalsMessage}
        </p>
      )}
    </>
  );
}

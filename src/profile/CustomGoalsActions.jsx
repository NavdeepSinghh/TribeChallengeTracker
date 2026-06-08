export default function CustomGoalsActions({
  goalsMessage,
  handleCustomGoalsSave,
  isSavingGoals,
  proActive,
}) {
  return (
    <>
      <button onClick={handleCustomGoalsSave} disabled={isSavingGoals} style={{
        marginTop: 12, width: '100%', border: 'none', borderRadius: 12,
        background: proActive ? '#34D399' : 'rgba(255,255,255,0.08)',
        color: proActive ? '#07130d' : '#777', padding: '11px 12px',
        fontSize: 12, fontWeight: 900, cursor: isSavingGoals ? 'default' : 'pointer',
      }}>
        {proActive ? (isSavingGoals ? 'Saving goals' : 'Save Custom Goals') : 'Unlock with Tribe Pro'}
      </button>
      {goalsMessage && (
        <p style={{ margin: '8px 0 0', color: proActive ? '#34D399' : '#A78BFA', fontSize: 10, fontFamily: 'monospace' }}>
          {goalsMessage}
        </p>
      )}
    </>
  );
}

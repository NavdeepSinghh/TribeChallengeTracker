import CustomGoalProgressRow from './CustomGoalProgressRow';
import CustomGoalsActions from './CustomGoalsActions';

export default function CustomGoalsSection({
  proActive,
  goalActiveDays,
  setGoalActiveDays,
  goalPoints,
  setGoalPoints,
  goalStreak,
  setGoalStreak,
  weeklyRecap,
  currentStreak,
  goalProgress,
  handleCustomGoalsSave,
  isSavingGoals,
  goalsMessage,
}) {
  const goalRows = [
    ['Active days/week', goalActiveDays, setGoalActiveDays, 1, 7, `${weeklyRecap.activeDays}/${goalActiveDays} days`, goalProgress.activeDays],
    ['Weekly points', goalPoints, setGoalPoints, 50, 10000, `${weeklyRecap.points}/${goalPoints} pts`, goalProgress.points],
    ['Streak target', goalStreak, setGoalStreak, 1, 365, `${currentStreak}/${goalStreak} days`, goalProgress.streak],
  ];

  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: proActive ? 'rgba(52,211,153,0.07)' : 'rgba(255,255,255,0.025)',
      border: `1px solid ${proActive ? 'rgba(52,211,153,0.24)' : 'rgba(255,255,255,0.06)'}`,
      opacity: proActive ? 1 : 0.82,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Custom goals</p>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
            Weekly targets and streak focus
          </p>
        </div>
        <span style={{ color: proActive ? '#34D399' : '#777', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
          {proActive ? 'EDITABLE' : 'PRO'}
        </span>
      </div>
      <div style={{ display: 'grid', gap: 10 }}>
        {goalRows.map(([label, value, setter, min, max, progressLabel, pct]) => (
          <CustomGoalProgressRow
            key={label}
            disabled={!proActive}
            label={label}
            max={max}
            min={min}
            pct={pct}
            progressLabel={progressLabel}
            setter={setter}
            value={value}
          />
        ))}
      </div>
      <CustomGoalsActions
        goalsMessage={goalsMessage}
        handleCustomGoalsSave={handleCustomGoalsSave}
        isSavingGoals={isSavingGoals}
        proActive={proActive}
      />
    </div>
  );
}

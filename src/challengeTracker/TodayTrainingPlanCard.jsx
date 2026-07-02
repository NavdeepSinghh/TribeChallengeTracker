import useTodayTrainingPlanCardState from './useTodayTrainingPlanCardState';

function exerciseCount(day) {
  return day?.workoutTemplate?.exercises?.length || 0;
}

function workoutMinutes(day, plan) {
  return day?.workoutTemplate?.estimatedMinutes || plan?.estimatedMinutesPerSession || 0;
}

function CardShell({ children }) {
  return (
    <section style={{
      background: 'linear-gradient(135deg, rgba(255,107,53,0.14), rgba(255,215,0,0.07))',
      border: '1px solid rgba(255,107,53,0.24)',
      borderRadius: 22,
      boxShadow: '0 20px 60px rgba(0,0,0,0.22)',
      marginBottom: 18,
      overflow: 'hidden',
      padding: 18,
    }}>
      {children}
    </section>
  );
}

function OpenWorkoutsButton({ children = 'Open Workouts', onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'linear-gradient(135deg, #FF6B35, #FFD700)',
        border: 'none',
        borderRadius: 14,
        color: '#040404',
        cursor: 'pointer',
        fontFamily: "'Syne', sans-serif",
        fontSize: 13,
        fontWeight: 900,
        minHeight: 42,
        padding: '0 15px',
      }}
    >
      {children}
    </button>
  );
}

function SupportiveRecovery({ missedCount }) {
  if (!missedCount) return null;
  return (
    <div style={{
      background: 'rgba(4,4,4,0.28)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 16,
      marginTop: 13,
      padding: 12,
    }}>
      <p style={{ color: '#FFD700', fontFamily: 'monospace', fontSize: 10, fontWeight: 900, letterSpacing: 1, margin: '0 0 5px' }}>
        COMEBACK PATH
      </p>
      <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 12, lineHeight: 1.45, margin: 0 }}>
        {missedCount === 1
          ? 'One plan workout is waiting when you are ready. No reset needed.'
          : `${missedCount} plan workouts are waiting when you are ready. Pick one steady session and keep moving.`}
      </p>
    </div>
  );
}

export default function TodayTrainingPlanCard({ onOpenWorkouts, useCases, viewModel }) {
  const liveViewModel = useTodayTrainingPlanCardState({ useCases });
  const vm = viewModel || liveViewModel;

  if (vm.status === 'loading' || vm.status === 'idle') {
    return (
      <CardShell>
        <p style={eyebrowStyle}>TODAY'S PLAN</p>
        <p style={{ color: 'rgba(255,255,255,0.64)', fontSize: 13, margin: 0 }}>Checking your active plan...</p>
      </CardShell>
    );
  }

  if (vm.status === 'failed') {
    return (
      <CardShell>
        <p style={eyebrowStyle}>TODAY'S PLAN</p>
        <h3 style={headingStyle}>Plan check unavailable</h3>
        <p style={bodyStyle}>{vm.errorMessage}</p>
        <button onClick={vm.refresh} style={secondaryButtonStyle}>Try again</button>
      </CardShell>
    );
  }

  if (!vm.plan || !vm.enrollment || vm.status === 'empty') {
    return (
      <CardShell>
        <p style={eyebrowStyle}>TODAY'S PLAN</p>
        <h3 style={headingStyle}>No active training plan yet.</h3>
        <p style={bodyStyle}>
          Your challenge tasks are ready below. When you want TribeLog to tell you what to train, start a free plan in Workouts.
        </p>
        {onOpenWorkouts ? <OpenWorkoutsButton onClick={onOpenWorkouts}>Browse plans</OpenWorkoutsButton> : null}
      </CardShell>
    );
  }

  const today = vm.todayWorkout;
  const isWorkoutDay = today?.isWorkoutDay;
  const completedToday = today?.dayKey && vm.enrollment.completedDayKeys?.includes(today.dayKey);
  const skippedToday = today?.dayKey && vm.enrollment.skippedDayKeys?.includes(today.dayKey);

  return (
    <CardShell>
      <div style={{ alignItems: 'start', display: 'flex', gap: 12, justifyContent: 'space-between' }}>
        <div>
          <p style={eyebrowStyle}>TODAY'S PLAN</p>
          <h3 style={headingStyle}>{vm.plan.name}</h3>
          <p style={bodyStyle}>Week {today?.weekIndex || 1} · {today?.label || 'Plan day'}</p>
        </div>
        <span style={{
          background: completedToday ? 'rgba(52,211,153,0.16)' : skippedToday ? 'rgba(255,215,0,0.14)' : 'rgba(255,107,53,0.16)',
          border: completedToday ? '1px solid rgba(52,211,153,0.34)' : '1px solid rgba(255,107,53,0.28)',
          borderRadius: 999,
          color: completedToday ? '#34D399' : '#FF8A65',
          fontFamily: 'monospace',
          fontSize: 10,
          fontWeight: 900,
          padding: '6px 9px',
          whiteSpace: 'nowrap',
        }}>
          {completedToday ? 'DONE' : skippedToday ? 'SKIPPED' : isWorkoutDay ? 'WORKOUT' : 'RECOVERY'}
        </span>
      </div>

      <div style={{
        background: 'rgba(4,4,4,0.30)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 18,
        marginTop: 15,
        padding: 14,
      }}>
        <p style={{ color: '#FFFFFF', fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 900, margin: '0 0 6px' }}>
          {isWorkoutDay ? today.workoutTemplate?.name : today?.notes ? 'Recovery day' : 'Rest day'}
        </p>
        <p style={bodyStyle}>
          {isWorkoutDay
            ? `${exerciseCount(today)} exercises · ${workoutMinutes(today, vm.plan)} min. Continue from Workouts when you are ready.`
            : today?.notes || 'No pressure today. Keep your challenge promise below or take the recovery day.'}
        </p>
        {isWorkoutDay ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {(today.workoutTemplate?.exercises || []).slice(0, 4).map(exercise => (
              <span key={exercise.exerciseId} style={movePillStyle}>{exercise.exerciseId.replace(/_/g, ' ')}</span>
            ))}
          </div>
        ) : null}
      </div>

      <SupportiveRecovery missedCount={vm.missedCount} />

      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        {onOpenWorkouts ? (
          <OpenWorkoutsButton onClick={onOpenWorkouts}>
            {isWorkoutDay ? 'Continue plan workout' : 'Open Workouts'}
          </OpenWorkoutsButton>
        ) : null}
      </div>
    </CardShell>
  );
}

const eyebrowStyle = {
  color: '#FF8A65',
  fontFamily: 'monospace',
  fontSize: 10,
  fontWeight: 900,
  letterSpacing: 1.4,
  margin: '0 0 8px',
};

const headingStyle = {
  color: '#FFFFFF',
  fontFamily: "'Syne', sans-serif",
  fontSize: 22,
  fontWeight: 900,
  lineHeight: 1.05,
  margin: '0 0 7px',
};

const bodyStyle = {
  color: 'rgba(255,255,255,0.70)',
  fontSize: 13,
  lineHeight: 1.45,
  margin: 0,
};

const movePillStyle = {
  background: 'rgba(255,107,53,0.12)',
  border: '1px solid rgba(255,107,53,0.24)',
  borderRadius: 999,
  color: '#FF8A65',
  fontFamily: 'monospace',
  fontSize: 9,
  fontWeight: 900,
  padding: '4px 7px',
  textTransform: 'uppercase',
};

const secondaryButtonStyle = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 14,
  color: '#FFFFFF',
  cursor: 'pointer',
  fontFamily: "'Syne', sans-serif",
  fontSize: 13,
  fontWeight: 900,
  minHeight: 40,
  padding: '0 15px',
};

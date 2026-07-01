import {
  buildFinalGuidedWorkoutPayload,
  completeCurrentSet,
  createGuidedWorkoutSession,
  guidedWorkoutSummary,
  isWorkoutSessionComplete,
  tickRestTimer,
  updateGuidedSet,
} from '../workouts/domain/guidedWorkoutModels';

const sampleExercises = [
  {
    id: 'goblet_squat',
    name: 'Goblet Squat',
    primaryMuscles: ['quads', 'glutes'],
    assetManifest: { assetHash: 'squat-hash' },
  },
  {
    id: 'push_up',
    name: 'Push-Up',
    primaryMuscles: ['chest', 'triceps'],
    assetManifest: { assetHash: 'push-hash' },
  },
];

describe('guided workout session model', () => {
  it('creates an active guided session with asset hash snapshots', () => {
    const session = createGuidedWorkoutSession({
      exercises: sampleExercises,
      name: 'Test workout',
      now: Date.UTC(2026, 5, 30, 10, 0, 0),
    });

    expect(session.id).toMatch(/^guided_/);
    expect(session.status).toBe('active');
    expect(session.exercises).toHaveLength(2);
    expect(session.exercises[0].assetHashSnapshot).toBe('squat-hash');
    expect(session.exercises[0].sets).toHaveLength(3);
    expect(session.dateStr).toBe('2026-06-30');
  });

  it('completes sets in order and starts a rest timer between unfinished sets', () => {
    let session = createGuidedWorkoutSession({
      exercises: sampleExercises.slice(0, 1),
      now: Date.UTC(2026, 5, 30, 10, 0, 0),
    });
    session = updateGuidedSet(session, 0, 0, { reps: '12', weightKg: '24' });
    session = completeCurrentSet(session, Date.UTC(2026, 5, 30, 10, 1, 0));

    expect(session.exercises[0].sets[0].completedAt).toBeTruthy();
    expect(session.activeSetIndex).toBe(1);
    expect(session.restRemainingSeconds).toBe(60);

    session = tickRestTimer(session);
    expect(session.restRemainingSeconds).toBe(59);
  });

  it('builds finishWorkoutSession payload with completed sets only', () => {
    let session = createGuidedWorkoutSession({
      exercises: sampleExercises.slice(0, 1),
      now: Date.UTC(2026, 5, 30, 10, 0, 0),
    });

    for (let index = 0; index < 3; index += 1) {
      session = updateGuidedSet(session, 0, index, { reps: String(10 + index), weightKg: '20' });
      session = completeCurrentSet(session, Date.UTC(2026, 5, 30, 10, 1 + index, 0));
    }

    expect(isWorkoutSessionComplete(session)).toBe(true);
    const payload = buildFinalGuidedWorkoutPayload(session, {
      shareVisibility: 'private',
      now: Date.UTC(2026, 5, 30, 10, 15, 0),
    });

    expect(payload.shareVisibility).toBe('private');
    expect(payload.sessionId).toBe(session.id);
    expect(payload.finalSession.source).toBe('guided');
    expect(payload.finalSession.exercises).toHaveLength(1);
    expect(payload.finalSession.exercises[0].sets).toHaveLength(3);
    expect(payload.finalSession.exercises[0].assetHashSnapshot).toBe('squat-hash');
    expect(payload.finalSession.totalVolumeKg).toBe(660);
    expect(payload.finalSession.points).toBeGreaterThanOrEqual(40);
  });

  it('summarizes duration, set count, and volume for finish screen', () => {
    let session = createGuidedWorkoutSession({
      exercises: sampleExercises.slice(0, 1),
      now: Date.UTC(2026, 5, 30, 10, 0, 0),
    });
    session = updateGuidedSet(session, 0, 0, { reps: '8', weightKg: '50' });
    session = completeCurrentSet(session, Date.UTC(2026, 5, 30, 10, 5, 0));

    const summary = guidedWorkoutSummary(session, Date.UTC(2026, 5, 30, 10, 10, 0));

    expect(summary.completedSets).toBe(1);
    expect(summary.totalSets).toBe(3);
    expect(summary.totalVolumeKg).toBe(400);
    expect(summary.durationSeconds).toBe(600);
  });
});

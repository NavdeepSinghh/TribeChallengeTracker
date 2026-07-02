const fs = require('fs');
const path = require('path');
const {
  aggregateDocIdForWeek,
  buildWeeklyMuscleVolumeAggregate,
  cleanWeekKey,
  normalizeAggregateSession,
  weekKeyForDate,
} = require('../../functions/workoutInsightAggregationHandlers');

const repoRoot = path.resolve(__dirname, '../..');

describe('workout insight aggregation', () => {
  it('builds deterministic owner-only weekly muscle volume aggregates', () => {
    const aggregate = buildWeeklyMuscleVolumeAggregate('user_123', '2026-W27', [
      {
        id: 'session_1',
        status: 'completed',
        dateStr: '2026-07-01',
        exercises: [
          {
            exerciseId: 'bench_press',
            primaryMusclesSnapshot: ['Chest', 'Triceps'],
            sets: [{ reps: 10, weightKg: 50 }, { reps: 8, weightKg: 60 }],
          },
        ],
      },
      {
        id: 'session_2',
        status: 'draft',
        dateStr: '2026-07-02',
        exercises: [
          {
            exerciseId: 'push_up',
            primaryMusclesSnapshot: ['Chest'],
            sets: [{ reps: 20, weightKg: 0 }],
          },
        ],
      },
    ]);

    expect(aggregate).toMatchObject({
      id: 'weekly_2026-W27',
      uid: 'user_123',
      periodType: 'week',
      periodKey: '2026-W27',
      sessionCount: 1,
      setCount: 2,
      exerciseCount: 1,
      totalVolumeKg: 980,
      insufficientData: true,
    });
    expect(aggregate.muscles.chest).toMatchObject({
      volumeKg: 490,
      exerciseIds: ['bench_press'],
    });
    expect(aggregate.muscles.triceps.volumeKg).toBe(490);
    expect(aggregate).not.toHaveProperty('sourceSessionIds');
    expect(aggregate.muscles.chest).not.toHaveProperty('sessionIds');
  });

  it('marks heat map data sufficient after three completed sessions in the target week', () => {
    const aggregate = buildWeeklyMuscleVolumeAggregate('user_123', '2026-W27', [
      { id: 's1', status: 'completed', dateStr: '2026-07-01', exercises: [{ exerciseId: 'a', primaryMuscles: ['legs'], sets: [{ reps: 10, weightKg: 10 }] }] },
      { id: 's2', status: 'completed', dateStr: '2026-07-02', exercises: [{ exerciseId: 'b', primaryMuscles: ['legs'], sets: [{ reps: 10, weightKg: 10 }] }] },
      { id: 's3', status: 'completed', dateStr: '2026-07-03', exercises: [{ exerciseId: 'c', primaryMuscles: ['back'], sets: [{ reps: 10, weightKg: 10 }] }] },
      { id: 'old', status: 'completed', dateStr: '2026-06-01', exercises: [{ exerciseId: 'd', primaryMuscles: ['chest'], sets: [{ reps: 10, weightKg: 10 }] }] },
    ]);

    expect(aggregate.sessionCount).toBe(3);
    expect(aggregate.insufficientData).toBe(false);
    expect(aggregate).not.toHaveProperty('sourceSessionIds');
    expect(aggregate.muscles.legs).not.toHaveProperty('sessionIds');
  });

  it('normalizes week keys and aggregate ids defensively', () => {
    expect(cleanWeekKey('2026-w27')).toBe('2026-W27');
    expect(cleanWeekKey('bad')).toBe('');
    expect(aggregateDocIdForWeek('2026-W27')).toBe('weekly_2026-W27');
    expect(weekKeyForDate('2026-07-01')).toBe('2026-W27');
    expect(normalizeAggregateSession('session_1', { status: 'completed', dateStr: '2026-07-01' })).toMatchObject({
      id: 'session_1',
      weekKey: '2026-W27',
    });
  });

  it('keeps aggregate writes behind admin/function privileges', () => {
    const rules = fs.readFileSync(path.join(repoRoot, 'firestore.rules'), 'utf8');
    const functionsIndex = fs.readFileSync(path.join(repoRoot, 'functions/index.js'), 'utf8');
    const deletionHandlers = fs.readFileSync(path.join(repoRoot, 'functions/accountDeletionCallableHandlers.js'), 'utf8');

    expect(rules).toContain('match /workoutInsightAggregates/{aggregateId}');
    expect(rules).toContain('allow read: if request.auth != null && (request.auth.uid == uid || isAdmin());');
    expect(rules).toContain('allow write: if request.auth != null && isAdmin();');
    expect(functionsIndex).toContain('syncWorkoutInsightAggregates');
    expect(deletionHandlers).toContain("'workoutInsightAggregates'");
  });
});

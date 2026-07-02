const fs = require('fs');
const path = require('path');
const {
  buildProgressiveOverloadSuggestion,
  buildWorkoutIntensityScore,
  exercisePerformances,
} = require('../../functions/workoutProgressionSuggestionHandlers');

const repoRoot = path.resolve(__dirname, '../..');

const benchSessions = [
  {
    id: 's1',
    status: 'completed',
    dateStr: '2026-06-24',
    durationMinutes: 42,
    totalVolumeKg: 1800,
    exercises: [
      {
        exerciseId: 'bench_press',
        sets: [
          { reps: 8, weightKg: 60 },
          { reps: 8, weightKg: 62.5 },
        ],
      },
    ],
  },
  {
    id: 's2',
    status: 'completed',
    dateStr: '2026-06-27',
    durationMinutes: 45,
    totalVolumeKg: 2100,
    exercises: [
      {
        exerciseId: 'bench_press',
        sets: [
          { reps: 10, weightKg: 62.5 },
          { reps: 10, weightKg: 62.5 },
        ],
      },
    ],
  },
  {
    id: 's3',
    status: 'completed',
    dateStr: '2026-07-01',
    durationMinutes: 44,
    totalVolumeKg: 2200,
    exercises: [
      {
        exerciseId: 'bench_press',
        sets: [
          { reps: 9, weightKg: 62.5 },
          { reps: 10, weightKg: 62.5 },
        ],
      },
    ],
  },
  {
    id: 's4',
    status: 'completed',
    dateStr: '2026-07-04',
    durationMinutes: 46,
    totalVolumeKg: 2300,
    exercises: [
      {
        exerciseId: 'bench_press',
        sets: [
          { reps: 10, weightKg: 62.5 },
          { reps: 10, weightKg: 62.5 },
        ],
      },
    ],
  },
];

describe('progressive overload suggestions', () => {
  it('waits for repeated exercise history before suggesting progression', () => {
    expect(buildProgressiveOverloadSuggestion({
      exerciseId: 'bench_press',
      sessions: benchSessions.slice(0, 1),
      level: 'beginner',
    })).toMatchObject({
      status: 'insufficient_data',
      observedSessions: 1,
      minimumSessions: 4,
      minimumTrainingWeeks: 2,
      explanation: 'Log this exercise across a couple of weeks before TribeLog suggests the next step.',
    });
  });

  it('waits for exercise history across at least two training weeks', () => {
    const sameWeekSessions = benchSessions.map(session => ({
      ...session,
      dateStr: '2026-07-01',
    }));

    expect(buildProgressiveOverloadSuggestion({
      exerciseId: 'bench_press',
      sessions: sameWeekSessions,
      level: 'beginner',
    })).toMatchObject({
      status: 'insufficient_data',
      observedSessions: 4,
      observedTrainingWeeks: 1,
      minimumTrainingWeeks: 2,
    });
  });

  it('suggests a conservative weight increase after stable high-rep progress', () => {
    const suggestion = buildProgressiveOverloadSuggestion({
      exerciseId: 'bench_press',
      sessions: benchSessions,
      level: 'intermediate',
    });

    expect(suggestion).toMatchObject({
      status: 'ready',
      observedSessions: 4,
      observedTrainingWeeks: 2,
      suggestion: {
        type: 'weight',
        targetWeightKg: 65,
        targetReps: 10,
      },
    });
    expect(suggestion.explanation).toContain('small weight increase');
  });

  it('suggests reps when weight increase is not yet justified', () => {
    const suggestion = buildProgressiveOverloadSuggestion({
      exerciseId: 'bench_press',
      sessions: [
        ...benchSessions.slice(0, 3),
        {
          ...benchSessions[3],
          exercises: [{ exerciseId: 'bench_press', sets: [{ reps: 8, weightKg: 62.5 }] }],
        },
      ],
      level: 'beginner',
    });

    expect(suggestion).toMatchObject({
      status: 'ready',
      suggestion: {
        type: 'reps',
        targetWeightKg: 62.5,
        targetReps: 9,
      },
    });
  });

  it('builds a transparent intensity score from volume, sets, and duration', () => {
    const score = buildWorkoutIntensityScore(benchSessions[1]);

    expect(score.score).toBeGreaterThan(40);
    expect(score.score).toBeLessThanOrEqual(100);
    expect(score.factors).toMatchObject({
      totalVolumeKg: 2100,
      setCount: 2,
      durationMinutes: 45,
    });
  });

  it('extracts completed exercise performances in date order', () => {
    const performances = exercisePerformances([
      { id: 'draft', status: 'draft', dateStr: '2026-07-06', exercises: [{ exerciseId: 'bench_press', sets: [{ reps: 20, weightKg: 100 }] }] },
      ...benchSessions,
    ], 'bench_press');

    expect(performances.map(performance => performance.sessionId)).toEqual(['s1', 's2', 's3', 's4']);
    expect(performances[3].bestSet).toMatchObject({ reps: 10, weightKg: 62.5 });
  });

  it('does not expose source session ids in owner-readable suggestions', () => {
    const suggestion = buildProgressiveOverloadSuggestion({
      exerciseId: 'bench_press',
      sessions: benchSessions,
      level: 'intermediate',
    });

    expect(suggestion).not.toHaveProperty('latestSessionId');
    expect(suggestion).not.toHaveProperty('previousSessionId');
  });

  it('keeps progression suggestion writes behind admin/function privileges', () => {
    const rules = fs.readFileSync(path.join(repoRoot, 'firestore.rules'), 'utf8');
    const functionsIndex = fs.readFileSync(path.join(repoRoot, 'functions/index.js'), 'utf8');
    const deletionHandlers = fs.readFileSync(path.join(repoRoot, 'functions/accountDeletionCallableHandlers.js'), 'utf8');

    expect(rules).toContain('match /workoutProgressionSuggestions/{exerciseId}');
    expect(rules).toContain('allow write: if request.auth != null && isAdmin();');
    expect(functionsIndex).toContain('syncWorkoutProgressionSuggestions');
    expect(deletionHandlers).toContain("'workoutProgressionSuggestions'");
  });
});

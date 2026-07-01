const fs = require('fs');
const path = require('path');
const {
  buildActivityEntry,
  buildActivityLogDocument,
  buildCopiedWorkoutTemplate,
  buildTribeFeedEntry,
  canViewerReadPublicWorkout,
  deterministicCopiedWorkoutTemplateId,
  buildPrUpdate,
  deterministicWorkoutIds,
  sanitizeFinalSession,
  summarizeExercisePerformance,
} = require('../../functions/workoutSessionCallableHandlers');
const {
  buildExerciseSeedPayload,
  parseArgs,
  validateExerciseSeed,
} = require('../../scripts/seed-workout-exercise-catalog');

const repoRoot = path.resolve(__dirname, '../..');

describe('workouts backend foundation', () => {
  it('uses deterministic mirror ids for retry-safe workout finish writes', () => {
    const ids = deterministicWorkoutIds('user-123', 'session-abc');

    expect(ids.activityLogId).toHaveLength(32);
    expect(ids.feedId).toHaveLength(32);
    expect(ids.publicWorkoutId).toMatch(/^user-123_[a-f0-9]{32}$/);
    expect(ids.activityLogId).toBe(deterministicWorkoutIds('user-123', 'session-abc').activityLogId);
    expect(ids.activityLogId).not.toBe(ids.feedId);
  });

  it('uses deterministic private template ids for copied public workouts', () => {
    const id = deterministicCopiedWorkoutTemplateId('viewer-123', 'public-workout-abc');

    expect(id).toMatch(/^viewer-123_[a-f0-9]{32}$/);
    expect(id).toBe(deterministicCopiedWorkoutTemplateId('viewer-123', 'public-workout-abc'));
    expect(id).not.toBe(deterministicCopiedWorkoutTemplateId('viewer-123', 'other-workout'));
  });

  it('replaces the same activity entry instead of appending duplicates on retry', () => {
    const ids = deterministicWorkoutIds('user-123', 'session-abc');
    const session = sanitizeFinalSession('user-123', 'session-abc', {
      name: 'Upper Body',
      dateStr: '2026-06-30',
      durationSeconds: 1800,
      exercises: [
        { exerciseId: 'bench_press', sets: [{ reps: 10, weightKg: 60 }] },
      ],
    });
    const entry = buildActivityEntry(session, ids);
    const existing = {
      activities: [
        { id: 'other-entry', points: 10 },
        { id: ids.activityLogId, points: 999 },
      ],
    };

    const next = buildActivityLogDocument(existing, entry);

    expect(next.activities.filter(activity => activity.id === ids.activityLogId)).toHaveLength(1);
    expect(next.activities).toHaveLength(2);
    expect(next.totalPoints).toBe(50);
  });

  it('keeps activity and feed point values consistent when a session provides points', () => {
    const ids = deterministicWorkoutIds('user-123', 'session-points');
    const session = sanitizeFinalSession('user-123', 'session-points', {
      name: 'Hard Strength Session',
      dateStr: '2026-06-30',
      durationSeconds: 2700,
      points: 65,
      exercises: [
        { exerciseId: 'goblet_squat', sets: [{ reps: 10, weightKg: 28 }] },
      ],
    });

    expect(buildActivityEntry(session, ids).points).toBe(65);
    expect(buildTribeFeedEntry('user-123', { displayName: 'Navdeep' }, session, ids, null).points).toBe(65);
  });

  it('enforces public workout read visibility before server-side copy', () => {
    const publicWorkout = { ownerUid: 'owner-1', visibility: 'public' };
    const tribeWorkout = { ownerUid: 'owner-1', visibility: 'tribe' };

    expect(canViewerReadPublicWorkout({ viewerUid: 'owner-1', workout: tribeWorkout })).toBe(true);
    expect(canViewerReadPublicWorkout({ viewerUid: 'viewer-1', workout: publicWorkout })).toBe(true);
    expect(canViewerReadPublicWorkout({ viewerUid: 'viewer-1', workout: tribeWorkout, isFollower: true })).toBe(true);
    expect(canViewerReadPublicWorkout({ viewerUid: 'viewer-1', workout: tribeWorkout, isFollower: false })).toBe(false);
    expect(canViewerReadPublicWorkout({ viewerUid: 'viewer-1', workout: publicWorkout, viewerBlockedOwner: true })).toBe(false);
    expect(canViewerReadPublicWorkout({ viewerUid: 'viewer-1', workout: publicWorkout, ownerBlockedViewer: true })).toBe(false);
  });

  it('builds copied private workout templates with permanent creator attribution', () => {
    const template = buildCopiedWorkoutTemplate('viewer-1', 'public-workout-1', {
      ownerUid: 'creator-1',
      ownerDisplayName: 'Coach Nav',
      visibility: 'public',
      sourceSessionId: 'session-1',
      name: 'Upper Body',
      summary: '3 exercises · 25 min',
      totalVolumeKg: 2400,
      durationSeconds: 1500,
      publishedAt: '2026-07-01T00:00:00.000Z',
      exercises: [
        {
          exerciseId: 'bench_press',
          name: 'Bench Press',
          primaryMuscles: ['chest'],
          setCount: 3,
          repSummary: '3 sets · 8-10 reps',
          bestWeightKg: 80,
        },
      ],
    });

    expect(template).toMatchObject({
      ownerUid: 'viewer-1',
      status: 'draft',
      visibility: 'private',
      source: 'copied_public_workout',
      sourcePublicWorkoutId: 'public-workout-1',
      originalCreatorUid: 'creator-1',
      originalCreatorDisplayName: 'Coach Nav',
      copiedFromPublicWorkoutId: 'public-workout-1',
    });
    expect(template.attribution).toMatchObject({
      originalCreatorUid: 'creator-1',
      originalCreatorDisplayName: 'Coach Nav',
      copiedFromOwnerUid: 'creator-1',
    });
    expect(template.exercises[0]).toMatchObject({
      exerciseId: 'bench_press',
      nameSnapshot: 'Bench Press',
      targetSetCount: 3,
      targetRepSummary: '3 sets · 8-10 reps',
      suggestedWeightKg: 80,
    });
  });

  it('calculates trusted PR updates from sanitized workout sets', () => {
    const session = sanitizeFinalSession('user-123', 'session-abc', {
      exercises: [
        {
          exerciseId: 'goblet_squat',
          name: 'Goblet Squat',
          primaryMuscles: ['quads', 'glutes'],
          sets: [
            { reps: 10, weightKg: 24 },
            { reps: 8, weightKg: 28 },
          ],
        },
      ],
    });
    const performance = summarizeExercisePerformance(session.exercises[0]);

    expect(performance).toMatchObject({
      exerciseId: 'goblet_squat',
      bestWeightKg: 28,
      bestVolumeKg: 240,
    });
    expect(performance.bestEstimatedOneRepMaxKg).toBeGreaterThan(35);

    const update = buildPrUpdate({
      bestWeightKg: 20,
      bestVolumeKg: 200,
      bestEstimatedOneRepMaxKg: 25,
      repRangePRs: { reps_7_10: 20 },
    }, performance, 'session-abc');

    expect(update).toMatchObject({
      exerciseId: 'goblet_squat',
      bestWeightKg: 28,
      bestVolumeKg: 240,
      updatedFromSessionId: 'session-abc',
    });
    expect(update.repRangePRs.reps_7_10).toBe(28);
  });

  it('keeps Firestore rules aligned with public workout visibility and block enforcement', () => {
    const rules = fs.readFileSync(path.join(repoRoot, 'firestore.rules'), 'utf8');

    expect(rules).toContain('match /exerciseCatalog/{exerciseId}');
    expect(rules).toContain('match /workoutTemplates/{templateId}');
    expect(rules).toContain('match /publicWorkouts/{publicWorkoutId}');
    expect(rules).toContain('match /exercisePRs/{exerciseId}');
    expect(rules).toContain('function noBlockBetween(ownerUid)');
    expect(rules).toContain('hasBlocked(request.auth.uid, ownerUid)');
    expect(rules).toContain('hasBlocked(ownerUid, request.auth.uid)');
    expect(rules).toContain('resource.data.visibility == "tribe"');
    expect(rules).toContain('isFollowerOf(resource.data.ownerUid)');
    expect(rules).toContain('users/$(request.auth.uid)/trainingSessions/$(request.resource.data.sourceSessionId)');
    expect(rules).toContain('allow write: if request.auth != null && isAdmin();');
  });

  it('declares composite indexes for catalog filtering and public workout discovery', () => {
    const indexes = JSON.parse(fs.readFileSync(path.join(repoRoot, 'firestore.indexes.json'), 'utf8'));
    const signature = indexes.indexes.map(index => [
      index.collectionGroup,
      ...index.fields.map(field => `${field.fieldPath}:${field.order || field.arrayConfig}`),
    ].join('|'));

    expect(signature).toContain('exerciseCatalog|status:ASCENDING|name:ASCENDING');
    expect(signature).toContain('exerciseCatalog|status:ASCENDING|level:ASCENDING|name:ASCENDING');
    expect(signature).toContain('exerciseCatalog|status:ASCENDING|primaryMuscles:CONTAINS|name:ASCENDING');
    expect(signature).toContain('exerciseCatalog|status:ASCENDING|equipment:CONTAINS|name:ASCENDING');
    expect(signature).toContain('workoutTemplates|status:ASCENDING|visibility:ASCENDING|updatedAt:DESCENDING');
    expect(signature).toContain('publicWorkouts|visibility:ASCENDING|publishedAt:DESCENDING');
    expect(signature).toContain('publicWorkouts|ownerUid:ASCENDING|publishedAt:DESCENDING');
  });

  it('validates the proof exercise seed records before any Firestore write', () => {
    const seed = JSON.parse(fs.readFileSync(path.join(repoRoot, 'scripts/workout-exercise-seed.json'), 'utf8'));

    expect(seed.map(exercise => exercise.id)).toEqual(['goblet_squat', 'push_up', 'plank']);
    seed.forEach(exercise => expect(validateExerciseSeed(exercise)).toBe(true));
    seed.forEach((exercise) => {
      expect(exercise.assetManifest.lottiePath).toMatch(/^workouts\/exercises\/v1\//);
      expect(exercise.assetManifest.assetHash).toContain('v1');
    });
  });

  it('requires explicit admin identity for live seed apply mode', () => {
    expect(parseArgs(['--apply', '--admin-uid', 'admin_123456'])).toMatchObject({
      apply: true,
      adminUid: 'admin_123456',
    });

    const seed = JSON.parse(fs.readFileSync(path.join(repoRoot, 'scripts/workout-exercise-seed.json'), 'utf8'));
    const payload = buildExerciseSeedPayload(seed[0], '2026-06-30T00:00:00.000Z', 'admin_123456');

    expect(payload).toMatchObject({
      id: 'goblet_squat',
      updatedBy: 'admin_123456',
      seededBy: 'seed-workout-exercise-catalog',
    });
    expect(payload.updatedAt).toBeUndefined();
  });
});

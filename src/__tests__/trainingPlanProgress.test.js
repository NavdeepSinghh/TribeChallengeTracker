const fs = require('fs');
const path = require('path');
const {
  buildCompletedPlanDayPatch,
  buildTrainingPlanAdherenceSummary,
  dayKeysDueThroughToday,
  totalPlanWorkoutDays,
  trainingPlanBadgeAwards,
  trainingPlanBadgeDocId,
} = require('../../functions/trainingPlanProgressCallableHandlers');
const {
  sanitizeFinalSession,
} = require('../../functions/workoutSessionCallableHandlers');
const planSeed = require('../../scripts/workout-training-plans-seed.json');

const repoRoot = path.resolve(__dirname, '../..');

describe('training plan progress and trusted badges', () => {
  it('summarizes adherence from enrollment day keys without shame-heavy scoring', () => {
    const plan = planSeed[0];
    const enrollment = {
      uid: 'user_123',
      planId: plan.id,
      planVersion: 1,
      status: 'active',
      startDate: '2026-07-01',
      completedDayKeys: ['w1-d1'],
      skippedDayKeys: ['w1-d3'],
    };

    expect(totalPlanWorkoutDays(plan)).toBe(12);
    expect(dayKeysDueThroughToday(plan, enrollment, '2026-07-05')).toEqual(['w1-d1', 'w1-d3', 'w1-d5']);
    expect(buildTrainingPlanAdherenceSummary(plan, enrollment, { today: '2026-07-05' })).toMatchObject({
      planId: plan.id,
      totalWorkoutDays: 12,
      completedCount: 1,
      dueCount: 3,
      completedDueCount: 1,
      skippedDueCount: 1,
      missedCount: 1,
      adherencePct: 33,
    });
  });

  it('awards deterministic plan badges from server-computed completed counts', () => {
    const plan = planSeed[0];
    const oneComplete = {
      uid: 'user_123',
      planId: plan.id,
      planVersion: 1,
      status: 'active',
      startDate: '2026-07-01',
      completedDayKeys: ['w1-d1'],
      skippedDayKeys: [],
    };
    const finished = {
      ...oneComplete,
      completedDayKeys: Array.from({ length: 12 }, (_, index) => `complete-${index + 1}`),
    };

    expect(trainingPlanBadgeAwards(plan, oneComplete).map(badge => badge.badgeId)).toEqual(['plan_first_workout']);
    expect(trainingPlanBadgeAwards(plan, finished).map(badge => badge.badgeId)).toEqual([
      'plan_first_workout',
      'plan_week_one',
      'plan_finisher',
    ]);
    expect(trainingPlanBadgeDocId(plan.id, 'plan_finisher')).toBe(`${plan.id}_plan_finisher`);
  });

  it('builds completed day patches that remove skip state for the same plan day', () => {
    const patch = buildCompletedPlanDayPatch({
      completedDayKeys: ['w1-d1'],
      skippedDayKeys: ['w1-d3'],
    }, 'w1-d3');

    expect(patch).toEqual({
      completedDayKeys: ['w1-d1', 'w1-d3'],
      skippedDayKeys: [],
    });
  });

  it('preserves training plan metadata in sanitized guided workout sessions', () => {
    const session = sanitizeFinalSession('user_123', 'session_123', {
      trainingPlanId: 'beginner_strength_foundation',
      trainingPlanDayKey: 'w1-d1',
      trainingPlanWeekIndex: 1,
      trainingPlanDayIndex: 1,
      exercises: [
        {
          exerciseId: 'goblet_squat',
          sets: [{ reps: 10, weightKg: 24 }],
        },
      ],
    });

    expect(session).toMatchObject({
      trainingPlanId: 'beginner_strength_foundation',
      trainingPlanDayKey: 'w1-d1',
      trainingPlanWeekIndex: 1,
      trainingPlanDayIndex: 1,
    });
  });

  it('keeps plan badge and adherence writes behind admin/function privileges', () => {
    const rules = fs.readFileSync(path.join(repoRoot, 'firestore.rules'), 'utf8');
    const functionsIndex = fs.readFileSync(path.join(repoRoot, 'functions/index.js'), 'utf8');

    expect(rules).toContain('match /trainingPlanAdherence/{planId}');
    expect(rules).toContain('match /trainingPlanBadges/{badgeId}');
    expect(rules).toContain('allow write: if request.auth != null && isAdmin();');
    expect(rules).toContain('"completedDayKeys" in request.resource.data');
    expect(rules).not.toContain('"completedDayKeys",\n            "skippedDayKeys"');
    expect(functionsIndex).toContain('syncTrainingPlanProgress');
  });
});

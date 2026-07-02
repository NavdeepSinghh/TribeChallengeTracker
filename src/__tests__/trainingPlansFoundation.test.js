import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { AppThemeProvider } from '../app/AppThemeContext';
import {
  applyTrainingPlanExerciseSwaps,
  buildTrainingPlanFilterOptions,
  buildTrainingPlanEnrollment,
  buildTrainingPlanAdherenceSnapshot,
  buildSkippedTrainingPlanDayEnrollment,
  buildTrainingPlanExerciseSwap,
  buildTrainingPlanFrequencyAdjustment,
  enrollmentForPlan,
  filterTrainingPlans,
  mapTrainingPlanDocument,
  mapTrainingPlanEnrollmentDocument,
  recommendExerciseSubstitutions,
  selectTodayTrainingPlanWorkout,
  trainingPlanExerciseCount,
  trainingPlanPreviewWorkouts,
  trainingPlanSummary,
} from '../workouts/domain/trainingPlanModels';
import {
  AdjustTrainingPlanFrequencyUseCase,
  EnrollInTrainingPlanUseCase,
  LoadTrainingPlansUseCase,
  SkipTrainingPlanDayUseCase,
  SwapTrainingPlanExerciseUseCase,
} from '../workouts/domain/trainingPlanUseCases';
import TrainingPlansSection from '../workouts/presentation/TrainingPlansSection';
import planSeed from '../../scripts/workout-training-plans-seed.json';
const fs = require('fs');
const path = require('path');
const { trainingPlanPayload } = require('../../scripts/apply-workout-training-plans');
const { loadOfficialExerciseIds, loadTrainingPlans, validateTrainingPlan } = require('../../scripts/validate-workout-training-plans');

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

async function renderWithTheme(element) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(<AppThemeProvider>{element}</AppThemeProvider>);
  });

  return { container, root };
}

function buildLoadedViewModel(overrides = {}) {
  const plans = planSeed.map(plan => mapTrainingPlanDocument(plan.id, plan));
  return {
    errorMessage: '',
    enrollmentByPlanId: {},
    enrollingPlanId: '',
    enrollInPlan: jest.fn(),
    filterOptions: buildTrainingPlanFilterOptions(plans),
    filters: { search: '', goal: 'all', level: 'all' },
    isEmpty: false,
    leavePlan: jest.fn(),
    refresh: jest.fn(),
    resetFilters: jest.fn(),
    selectedEnrollment: null,
    selectedPlan: plans[0],
    selectedPlanId: plans[0].id,
    setSelectedPlanId: jest.fn(),
    adjustFrequency: jest.fn(),
    customizingPlanId: '',
    skipTodayPlanDay: jest.fn(),
    status: 'loaded',
    swapExercise: jest.fn(),
    todayWorkout: null,
    updateFilter: jest.fn(),
    visiblePlans: plans,
    ...overrides,
  };
}

describe('training plans foundation', () => {
  it('validates official plan seed records against the approved exercise library', () => {
    const exerciseIds = loadOfficialExerciseIds();
    const plans = loadTrainingPlans(require.resolve('../../scripts/workout-training-plans-seed.json'), { exerciseIds });

    expect(exerciseIds.size).toBe(50);
    expect(plans).toHaveLength(3);
    expect(plans.map(plan => plan.id)).toEqual([
      'beginner_strength_foundation',
      'upper_lower_strength_builder',
      'run_walk_base_builder',
    ]);
    expect(plans.every(plan => plan.source === 'official')).toBe(true);
    expect(plans.every(plan => plan.visibility === 'public')).toBe(true);
  });

  it('rejects unknown exercise ids and unsupported claim language before apply', () => {
    const exerciseIds = loadOfficialExerciseIds();
    const invalidExercise = JSON.parse(JSON.stringify(planSeed[0]));
    invalidExercise.schedule[0].workoutTemplate.exercises[0].exerciseId = 'made_up_move';

    expect(() => validateTrainingPlan(invalidExercise, exerciseIds)).toThrow(/unknown exerciseId made_up_move/);

    const invalidClaim = JSON.parse(JSON.stringify(planSeed[0]));
    invalidClaim.description = 'A plan that treats injury pain.';
    expect(() => validateTrainingPlan(invalidClaim, exerciseIds)).toThrow(/unsupported health or medical claim/);
  });

  it('maps plan documents and derives summaries without Firestore', async () => {
    const plans = planSeed.map(plan => mapTrainingPlanDocument(plan.id, plan));
    const repo = {
      listPublishedTrainingPlans: jest.fn(async () => plans),
    };
    const useCase = new LoadTrainingPlansUseCase(repo);
    const strengthPlans = await useCase.execute({ search: 'bench', goal: 'strength', level: 'intermediate' });

    expect(strengthPlans.map(plan => plan.id)).toEqual(['upper_lower_strength_builder']);
    expect(trainingPlanSummary(plans[0])).toBe('3 days/week · 4 weeks · 38 min/session');
    expect(trainingPlanExerciseCount(plans[0])).toBe(12);
    expect(trainingPlanPreviewWorkouts(plans[1], 2).map(workout => workout.name)).toEqual([
      'Upper Push + Pull',
      'Squat Focus',
    ]);
    expect(filterTrainingPlans(plans, { search: 'bike', goal: 'endurance' }).map(plan => plan.id)).toEqual(['run_walk_base_builder']);
    expect(buildTrainingPlanFilterOptions(plans).goals.map(goal => goal.id)).toEqual(['endurance', 'strength']);
  });

  it('builds private enrollments and selects today without mutating the official plan', async () => {
    const plan = mapTrainingPlanDocument(planSeed[0].id, planSeed[0]);
    const repo = {
      saveTrainingPlanEnrollment: jest.fn(async enrollment => mapTrainingPlanEnrollmentDocument(enrollment.id, {
        ...enrollment,
        uid: 'user_123',
      })),
    };
    const useCase = new EnrollInTrainingPlanUseCase(repo, {
      now: () => new Date('2026-07-01T10:00:00.000Z'),
      timezone: () => 'Australia/Melbourne',
    });
    const enrollment = await useCase.execute(plan);
    const dayThree = selectTodayTrainingPlanWorkout(plan, enrollment, new Date('2026-07-03T10:00:00.000Z'));

    expect(enrollment).toMatchObject({
      id: 'beginner_strength_foundation',
      planId: 'beginner_strength_foundation',
      planVersion: 1,
      status: 'active',
      startDate: '2026-07-01',
      timezone: 'Australia/Melbourne',
    });
    expect(repo.saveTrainingPlanEnrollment).toHaveBeenCalledTimes(1);
    expect(dayThree).toMatchObject({
      dayIndex: 3,
      dayKey: 'w1-d3',
      isWorkoutDay: true,
      weekIndex: 1,
    });
    expect(enrollmentForPlan([enrollment], plan.id)).toBe(enrollment);
    expect(buildTrainingPlanEnrollment({ plan, today: '2026-07-04', timezone: 'UTC' }).startDate).toBe('2026-07-04');
  });

  it('builds user-owned customization patches for skip, frequency, and exercise swaps', () => {
    const plan = mapTrainingPlanDocument(planSeed[0].id, planSeed[0]);
    const enrollment = mapTrainingPlanEnrollmentDocument(plan.id, {
      id: plan.id,
      uid: 'user_123',
      planId: plan.id,
      planVersion: 1,
      status: 'active',
      startDate: '2026-07-01',
      timezone: 'Australia/Melbourne',
      completedDayKeys: ['w1-d1'],
      skippedDayKeys: [],
      currentDayIndex: 1,
    });
    const skipped = buildSkippedTrainingPlanDayEnrollment(enrollment, 'w1-d1');
    const frequency = buildTrainingPlanFrequencyAdjustment(enrollment, 4);
    const swapped = buildTrainingPlanExerciseSwap(enrollment, {
      dayKey: 'w1-d1',
      exerciseId: 'goblet_squat',
      replacementExerciseId: 'leg_press',
    });
    const todayWorkout = selectTodayTrainingPlanWorkout(plan, enrollment, new Date('2026-07-01T10:00:00.000Z'));
    const swappedDay = applyTrainingPlanExerciseSwaps(todayWorkout, swapped);

    expect(skipped.completedDayKeys).toEqual([]);
    expect(skipped.skippedDayKeys).toEqual(['w1-d1']);
    expect(frequency.customFrequencyDaysPerWeek).toBe(4);
    expect(() => buildTrainingPlanFrequencyAdjustment(enrollment, 8)).toThrow(/between 1 and 7/);
    expect(swapped.exerciseSwaps).toEqual({ 'w1-d1:goblet_squat': 'leg_press' });
    expect(swappedDay.workoutTemplate.exercises[0]).toMatchObject({
      exerciseId: 'leg_press',
      originalExerciseId: 'goblet_squat',
    });
    expect(todayWorkout.workoutTemplate.exercises[0].exerciseId).toBe('goblet_squat');
  });

  it('lets trusted adherence summaries override progress snapshot fields when provided', () => {
    const plan = mapTrainingPlanDocument(planSeed[0].id, planSeed[0]);
    const enrollment = mapTrainingPlanEnrollmentDocument(plan.id, {
      id: plan.id,
      uid: 'user_123',
      planId: plan.id,
      planVersion: 1,
      status: 'active',
      startDate: '2026-07-01',
      timezone: 'Australia/Melbourne',
      completedDayKeys: ['w1-d1'],
      skippedDayKeys: [],
      currentDayIndex: 1,
      adherence: {
        totalWorkoutDays: 12,
        completedCount: 3,
        dueCount: 5,
        completedDueCount: 3,
        skippedDueCount: 1,
        missedCount: 1,
        adherencePct: 60,
      },
    });

    expect(buildTrainingPlanAdherenceSnapshot(plan, enrollment, new Date('2026-07-05T10:00:00.000Z'))).toMatchObject({
      totalWorkoutDays: 12,
      completedCount: 3,
      dueCount: 5,
      completedDueCount: 3,
      skippedDueCount: 1,
      missedCount: 1,
      adherencePct: 60,
    });
  });

  it('keeps local progress fields when trusted adherence only provides missed count', () => {
    const plan = mapTrainingPlanDocument(planSeed[0].id, planSeed[0]);
    const enrollment = mapTrainingPlanEnrollmentDocument(plan.id, {
      id: plan.id,
      uid: 'user_123',
      planId: plan.id,
      planVersion: 1,
      status: 'active',
      startDate: '2026-07-01',
      timezone: 'Australia/Melbourne',
      completedDayKeys: ['w1-d1'],
      skippedDayKeys: [],
      currentDayIndex: 1,
      adherence: {
        missedCount: 4,
      },
    });

    expect(buildTrainingPlanAdherenceSnapshot(plan, enrollment, new Date('2026-07-05T10:00:00.000Z'))).toMatchObject({
      completedCount: 1,
      dueCount: 3,
      completedDueCount: 1,
      skippedDueCount: 0,
      missedCount: 4,
    });
  });

  it('recommends exercise substitutions by movement, muscle, equipment, and level', () => {
    const original = {
      id: 'goblet_squat',
      name: 'Goblet Squat',
      level: 'beginner',
      movementPattern: 'squat',
      primaryMuscles: ['quads', 'glutes'],
      equipment: ['kettlebell'],
    };
    const substitutions = recommendExerciseSubstitutions(original, [
      original,
      {
        id: 'leg_press',
        name: 'Leg Press',
        level: 'beginner',
        movementPattern: 'squat',
        primaryMuscles: ['quads', 'glutes'],
        equipment: ['machine'],
      },
      {
        id: 'bodyweight_squat',
        name: 'Bodyweight Squat',
        level: 'beginner',
        movementPattern: 'squat',
        primaryMuscles: ['quads'],
        equipment: ['bodyweight'],
      },
      {
        id: 'kettlebell_swing',
        name: 'Kettlebell Swing',
        level: 'intermediate',
        movementPattern: 'hinge',
        primaryMuscles: ['glutes', 'hamstrings'],
        equipment: ['kettlebell'],
      },
      {
        id: 'advanced_pistol_squat',
        name: 'Advanced Pistol Squat',
        level: 'advanced',
        movementPattern: 'squat',
        primaryMuscles: ['quads'],
        equipment: ['bodyweight'],
      },
      {
        id: 'unknown_equipment_squat',
        name: 'Unknown Equipment Squat',
        level: 'beginner',
        movementPattern: 'squat',
        primaryMuscles: ['quads'],
      },
    ]);

    expect(substitutions.map(exercise => exercise.id)).toEqual([
      'bodyweight_squat',
      'kettlebell_swing',
    ]);
  });

  it('saves customization updates through narrow enrollment patch use cases', async () => {
    const enrollment = mapTrainingPlanEnrollmentDocument('beginner_strength_foundation', {
      id: 'beginner_strength_foundation',
      uid: 'user_123',
      planId: 'beginner_strength_foundation',
      planVersion: 1,
      status: 'active',
      startDate: '2026-07-01',
      timezone: 'Australia/Melbourne',
      completedDayKeys: ['w1-d1'],
      skippedDayKeys: [],
      currentDayIndex: 1,
    });
    const repo = {
      saveTrainingPlanEnrollmentPatch: jest.fn(async (planId, patch) => mapTrainingPlanEnrollmentDocument(planId, {
        ...enrollment,
        ...patch,
      })),
    };

    const skipped = await new SkipTrainingPlanDayUseCase(repo).execute(enrollment, 'w1-d1');
    const frequency = await new AdjustTrainingPlanFrequencyUseCase(repo).execute(enrollment, 5);
    const swapped = await new SwapTrainingPlanExerciseUseCase(repo).execute(enrollment, {
      dayKey: 'w1-d1',
      exerciseId: 'goblet_squat',
      replacementExerciseId: 'leg_press',
    });

    expect(repo.saveTrainingPlanEnrollmentPatch).toHaveBeenNthCalledWith(1, enrollment.planId, {
      completedDayKeys: [],
      skippedDayKeys: ['w1-d1'],
    });
    expect(repo.saveTrainingPlanEnrollmentPatch).toHaveBeenNthCalledWith(2, enrollment.planId, {
      customFrequencyDaysPerWeek: 5,
    });
    expect(repo.saveTrainingPlanEnrollmentPatch).toHaveBeenNthCalledWith(3, enrollment.planId, {
      exerciseSwaps: { 'w1-d1:goblet_squat': 'leg_press' },
    });
    expect(skipped.skippedDayKeys).toEqual(['w1-d1']);
    expect(frequency.customFrequencyDaysPerWeek).toBe(5);
    expect(swapped.exerciseSwaps).toEqual({ 'w1-d1:goblet_squat': 'leg_press' });
  });

  it('renders loaded, empty, and failed states for the plans surface', async () => {
    const loaded = await renderWithTheme(
      <TrainingPlansSection viewModel={buildLoadedViewModel()} />
    );

    expect(loaded.container.textContent).toContain('TRAINING PLANS');
    expect(loaded.container.textContent).toContain('Beginner Strength Foundation');
    expect(loaded.container.textContent).toContain('Upper / Lower Strength Builder');
    expect(loaded.container.textContent).toContain('THIS WEEK');
    expect(loaded.container.textContent).toContain('Goblet Squat'.toLowerCase().replace(/ /g, '_').replace(/_/g, ' '));

    await act(async () => loaded.root.unmount());
    loaded.container.remove();

    const empty = await renderWithTheme(
      <TrainingPlansSection
        viewModel={buildLoadedViewModel({
          isEmpty: true,
          selectedPlan: null,
          selectedPlanId: '',
          status: 'empty',
          visiblePlans: [],
        })}
      />
    );

    expect(empty.container.textContent).toContain('No plans found');
    await act(async () => empty.root.unmount());
    empty.container.remove();

    const failed = await renderWithTheme(
      <TrainingPlansSection
        viewModel={buildLoadedViewModel({
          errorMessage: 'Permission denied',
          isEmpty: false,
          selectedPlan: null,
          selectedPlanId: '',
          status: 'failed',
          visiblePlans: [],
        })}
      />
    );

    expect(failed.container.textContent).toContain('Plans unavailable');
    expect(failed.container.textContent).toContain('Permission denied');
    await act(async () => failed.root.unmount());
    failed.container.remove();
  });

  it('renders active enrollment and today preview controls', async () => {
    const plans = planSeed.map(plan => mapTrainingPlanDocument(plan.id, plan));
    const enrollment = mapTrainingPlanEnrollmentDocument(plans[0].id, {
      id: plans[0].id,
      uid: 'user_123',
      planId: plans[0].id,
      planVersion: 1,
      status: 'active',
      startDate: '2026-07-01',
      timezone: 'Australia/Melbourne',
      completedDayKeys: [],
      skippedDayKeys: [],
      currentDayIndex: 1,
    });
    const todayWorkout = selectTodayTrainingPlanWorkout(plans[0], enrollment, new Date('2026-07-01T10:00:00.000Z'));
    const viewModel = buildLoadedViewModel({
      enrollmentByPlanId: { [plans[0].id]: enrollment },
      selectedEnrollment: enrollment,
      todayWorkout,
    });
    const { container, root } = await renderWithTheme(
      <TrainingPlansSection viewModel={viewModel} />
    );

    expect(container.textContent).toContain('ACTIVE');
    expect(container.textContent).toContain('Started 2026-07-01');
    expect(container.textContent).toContain('TODAY · WEEK 1');
    expect(container.textContent).toContain('Plan active');
    expect(container.textContent).toContain('Leave');
    expect(container.textContent).toContain('PLAN PROGRESS');
    expect(container.textContent).toContain('Plan Starter');
    expect(container.textContent).toContain('CUSTOMIZE YOUR COPY');
    expect(container.textContent).toContain('Skip today');

    await act(async () => root.unmount());
    container.remove();
  });

  it('uses neutral rest-day language after today is skipped', async () => {
    const plans = planSeed.map(plan => mapTrainingPlanDocument(plan.id, plan));
    const enrollment = mapTrainingPlanEnrollmentDocument(plans[0].id, {
      id: plans[0].id,
      uid: 'user_123',
      planId: plans[0].id,
      planVersion: 1,
      status: 'active',
      startDate: '2026-07-01',
      timezone: 'Australia/Melbourne',
      completedDayKeys: [],
      skippedDayKeys: ['w1-d1'],
      currentDayIndex: 1,
    });
    const todayWorkout = selectTodayTrainingPlanWorkout(plans[0], enrollment, new Date('2026-07-01T10:00:00.000Z'));
    const { container, root } = await renderWithTheme(
      <TrainingPlansSection
        viewModel={buildLoadedViewModel({
          enrollmentByPlanId: { [plans[0].id]: enrollment },
          selectedEnrollment: enrollment,
          todayWorkout,
        })}
      />
    );

    expect(container.textContent).toContain('Today is a rest day');
    expect(container.textContent).not.toContain('Today skipped');

    await act(async () => root.unmount());
    container.remove();
  });

  it('keeps the Firestore write payload narrow for admin-only apply mode', () => {
    const plan = mapTrainingPlanDocument(planSeed[0].id, planSeed[0]);
    const payload = trainingPlanPayload(plan);

    expect(payload).toMatchObject({
      id: 'beginner_strength_foundation',
      status: 'published',
      source: 'official',
      visibility: 'public',
      frequencyDaysPerWeek: 3,
      durationWeeks: 4,
    });
    expect(payload.schedule[0].workoutTemplate.exercises[0]).toMatchObject({
      exerciseId: 'goblet_squat',
      targetSets: 3,
      restSeconds: 75,
    });
    expect(payload.updatedAt).toBeUndefined();
    expect(payload.updatedBy).toBeUndefined();
  });

  it('declares training plan rules and indexes for Claude review', () => {
    const rules = fs.readFileSync(path.resolve(__dirname, '../../firestore.rules'), 'utf8');
    const indexes = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../firestore.indexes.json'), 'utf8'));
    const trainingPlanIndexes = indexes.indexes.filter(index => index.collectionGroup === 'trainingPlans');

    expect(rules).toContain('match /trainingPlans/{planId}');
    expect(rules).toContain('match /trainingPlanEnrollments/{planId}');
    expect(rules).toContain('resource.data.status == "published"');
    expect(rules).toContain('resource.data.visibility == "public"');
    expect(rules).toContain('request.resource.data.uid == request.auth.uid');
    expect(rules).toContain('&& isAdmin()');
    expect(trainingPlanIndexes).toHaveLength(2);
    expect(trainingPlanIndexes[0].fields.map(field => field.fieldPath)).toEqual(['status', 'visibility', 'updatedAt']);
    expect(indexes.indexes.some(index => index.collectionGroup === 'trainingPlanEnrollments')).toBe(true);
  });
});

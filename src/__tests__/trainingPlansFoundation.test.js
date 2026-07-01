import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { AppThemeProvider } from '../app/AppThemeContext';
import {
  buildTrainingPlanFilterOptions,
  filterTrainingPlans,
  mapTrainingPlanDocument,
  trainingPlanExerciseCount,
  trainingPlanPreviewWorkouts,
  trainingPlanSummary,
} from '../workouts/domain/trainingPlanModels';
import { LoadTrainingPlansUseCase } from '../workouts/domain/trainingPlanUseCases';
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
    filterOptions: buildTrainingPlanFilterOptions(plans),
    filters: { search: '', goal: 'all', level: 'all' },
    isEmpty: false,
    refresh: jest.fn(),
    resetFilters: jest.fn(),
    selectedPlan: plans[0],
    selectedPlanId: plans[0].id,
    setSelectedPlanId: jest.fn(),
    status: 'loaded',
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
    expect(rules).toContain('resource.data.status == "published"');
    expect(rules).toContain('resource.data.visibility == "public"');
    expect(rules).toContain('&& isAdmin()');
    expect(trainingPlanIndexes).toHaveLength(2);
    expect(trainingPlanIndexes[0].fields.map(field => field.fieldPath)).toEqual(['status', 'visibility', 'updatedAt']);
  });
});

import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { AppThemeProvider } from '../app/AppThemeContext';
import WorkoutsLibrarySection, { getLottieFrameCount, resolveWorkoutAssetUrl } from '../workouts/presentation/WorkoutsLibrarySection';
import { useWorkoutCatalogViewModel } from '../workouts/presentation/useWorkoutCatalogViewModel';
import {
  buildExerciseFilterOptions,
  filterExercises,
  mapExerciseDocument,
  selectBackendCatalogFilter,
} from '../workouts/domain/workoutCatalogModels';
import { LoadWorkoutExerciseCatalogUseCase } from '../workouts/domain/workoutCatalogUseCases';
import seedExercises from '../../scripts/workout-exercise-seed.json';

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
  const exercises = seedExercises.map(exercise => mapExerciseDocument(exercise.id, exercise));
  return {
    errorMessage: '',
    filterOptions: buildExerciseFilterOptions(exercises),
    filters: { search: '', muscle: 'all', equipment: 'all', level: 'all' },
    refresh: jest.fn(),
    resetFilters: jest.fn(),
    selectedExercise: exercises[0],
    selectedExerciseId: exercises[0].id,
    isEmpty: false,
    setSelectedExerciseId: jest.fn(),
    status: 'loaded',
    updateFilter: jest.fn(),
    visibleExercises: exercises,
    ...overrides,
  };
}

describe('web workouts read-only library', () => {
  it('maps backend exercise docs and applies search/filter rules without Firestore', async () => {
    const exercises = seedExercises.map(exercise => mapExerciseDocument(exercise.id, exercise));
    const repo = {
      listPublishedExercises: jest.fn(async () => exercises),
    };
    const useCase = new LoadWorkoutExerciseCatalogUseCase(repo);
    const results = await useCase.execute({ search: 'push', muscle: 'chest', equipment: 'bodyweight', level: 'beginner' });

    expect(results.map(exercise => exercise.id)).toEqual(['push_up']);
    expect(selectBackendCatalogFilter({ muscle: 'chest', equipment: 'bodyweight' })).toEqual({ type: 'muscle', value: 'chest' });
    expect(filterExercises(exercises, { search: 'plank', muscle: 'core' }).map(exercise => exercise.id)).toEqual(['plank']);
  });

  it('renders loaded exercise catalog state and keeps Quick Log available', async () => {
    const onQuickLog = jest.fn();
    const { container, root } = await renderWithTheme(
      <WorkoutsLibrarySection
        onQuickLog={onQuickLog}
        viewModel={buildLoadedViewModel()}
      />
    );

    expect(container.textContent).toContain('Exercise Library');
    expect(container.textContent).toContain('Goblet Squat');
    expect(container.textContent).toContain('Push-Up');
    expect(container.textContent).toContain('Plank');
    expect(container.textContent).toContain('FORM CUES');
    expect(resolveWorkoutAssetUrl('workouts/exercises/v1/plank/demo.lottie.json')).toBe('https://firebasestorage.googleapis.com/v0/b/tribechallengetracker.firebasestorage.app/o/workouts%2Fexercises%2Fv1%2Fplank%2Fdemo.lottie.json?alt=media');
    expect(resolveWorkoutAssetUrl('https://cdn.example.com/plank.json')).toBe('https://cdn.example.com/plank.json');
    expect(resolveWorkoutAssetUrl('/workouts/local-preview.json')).toBe('/workouts/local-preview.json');

    const quickLogButton = [...container.querySelectorAll('button')].find(button => button.textContent === 'Quick Log');
    quickLogButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onQuickLog).toHaveBeenCalledTimes(1);

    await act(async () => root.unmount());
    container.remove();
  });

  it('renders empty and error states for Claude visual review coverage', async () => {
    const empty = await renderWithTheme(
      <WorkoutsLibrarySection
        onQuickLog={() => {}}
        viewModel={buildLoadedViewModel({
          selectedExercise: null,
          selectedExerciseId: '',
          isEmpty: true,
          status: 'empty',
          visibleExercises: [],
        })}
      />
    );

    expect(empty.container.textContent).toContain('No exercises found');
    await act(async () => empty.root.unmount());
    empty.container.remove();

    const failed = await renderWithTheme(
      <WorkoutsLibrarySection
        onQuickLog={() => {}}
        viewModel={buildLoadedViewModel({
          errorMessage: 'Permission denied',
          selectedExercise: null,
          selectedExerciseId: '',
          status: 'failed',
          visibleExercises: [],
        })}
      />
    );

    expect(failed.container.textContent).toContain('Catalog unavailable');
    expect(failed.container.textContent).toContain('Permission denied');
    await act(async () => failed.root.unmount());
    failed.container.remove();
  });

  it('does not refetch full filter options when only indexed filters change', async () => {
    const exercises = seedExercises.map(exercise => mapExerciseDocument(exercise.id, exercise));
    const useCases = {
      loadCatalog: { execute: jest.fn(async () => exercises) },
      getFilterOptions: { execute: jest.fn(async () => buildExerciseFilterOptions(exercises)) },
    };
    let latestVm;

    function Harness() {
      latestVm = useWorkoutCatalogViewModel({ useCases });
      return (
        <button onClick={() => latestVm.updateFilter('muscle', 'chest')}>
          Muscle
        </button>
      );
    }

    const { container, root } = await renderWithTheme(<Harness />);

    await act(async () => {
      await Promise.resolve();
    });

    expect(useCases.loadCatalog.execute).toHaveBeenCalledTimes(1);
    expect(useCases.getFilterOptions.execute).toHaveBeenCalledTimes(1);

    const button = container.querySelector('button');
    await act(async () => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await Promise.resolve();
    });

    expect(useCases.loadCatalog.execute).toHaveBeenCalledTimes(2);
    expect(useCases.getFilterOptions.execute).toHaveBeenCalledTimes(1);

    await act(async () => root.unmount());
    container.remove();
  });

  it('exposes empty state from the ViewModel and calculates Lottie duration from in/out points', async () => {
    const exercises = seedExercises.map(exercise => mapExerciseDocument(exercise.id, exercise));
    const useCases = {
      loadCatalog: { execute: jest.fn(async () => exercises) },
      getFilterOptions: { execute: jest.fn(async () => buildExerciseFilterOptions(exercises)) },
    };
    let latestVm;

    function Harness() {
      latestVm = useWorkoutCatalogViewModel({ useCases });
      return (
        <button onClick={() => latestVm.updateFilter('search', 'no match')}>
          Search no match
        </button>
      );
    }

    const { container, root } = await renderWithTheme(<Harness />);

    await act(async () => {
      await Promise.resolve();
    });

    expect(latestVm.status).toBe('loaded');
    expect(latestVm.isEmpty).toBe(false);

    const button = container.querySelector('button');
    await act(async () => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(latestVm.status).toBe('loaded');
    expect(latestVm.visibleExercises).toHaveLength(0);
    expect(latestVm.isEmpty).toBe(true);
    expect(getLottieFrameCount({ ip: 12, op: 72 })).toBe(60);

    await act(async () => root.unmount());
    container.remove();
  });
});

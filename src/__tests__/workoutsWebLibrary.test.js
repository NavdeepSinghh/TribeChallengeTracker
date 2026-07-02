import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { AppThemeProvider } from '../app/AppThemeContext';
import WorkoutsLibrarySection, { getLottieFrameCount, getWorkoutMotionPlaybackMode, resolveWorkoutAssetUrl } from '../workouts/presentation/WorkoutsLibrarySection';
import { useWorkoutCatalogViewModel } from '../workouts/presentation/useWorkoutCatalogViewModel';
import {
  buildExerciseCoachingCues,
  buildExerciseFilterOptions,
  filterExercises,
  findExerciseCueForMotionProgress,
  mapExerciseDocument,
  selectExerciseMotionSource,
  selectBackendCatalogFilter,
} from '../workouts/domain/workoutCatalogModels';
import { LoadWorkoutExerciseCatalogUseCase } from '../workouts/domain/workoutCatalogUseCases';
import seedExercises from '../../scripts/workout-exercise-seed.json';
import pilotCoachingCues from '../../scripts/workout-coaching-cues-pilot.json';
const { loadCueFile, validateCueCoverage, validateCueRecord } = require('../../scripts/apply-workout-coaching-cues');
const { loadMediaApplyFile, mediaManifestPayload } = require('../../scripts/apply-workout-high-fidelity-media');
const { loadOfficialExerciseSeed } = require('../../scripts/generate-workout-coaching-cues-draft');
const { loadMediaManifest, validateRecords: validateHighFidelityMediaRecords } = require('../../scripts/validate-workout-high-fidelity-media');

jest.mock('lottie-web', () => ({
  __esModule: true,
  default: {
    loadAnimation: jest.fn(() => ({
      destroy: jest.fn(),
    })),
  },
}));

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
    expect(container.textContent).toContain('MOVEMENT COACH');
    expect(container.textContent).toContain('Watch the demo with the active cue.');
    expect(container.querySelector('[aria-live="off"]')).not.toBeNull();
    expect(resolveWorkoutAssetUrl('workouts/exercises/v1/plank/demo.lottie.json')).toBe('https://firebasestorage.googleapis.com/v0/b/tribechallengetracker.firebasestorage.app/o/workouts%2Fexercises%2Fv1%2Fplank%2Fdemo.lottie.json?alt=media');
    expect(resolveWorkoutAssetUrl('https://cdn.example.com/plank.json')).toBe('https://cdn.example.com/plank.json');
    expect(resolveWorkoutAssetUrl('/workouts/local-preview.json')).toBe('/workouts/local-preview.json');

    const quickLogButton = [...container.querySelectorAll('button')].find(button => button.textContent === 'Quick Log');
    quickLogButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onQuickLog).toHaveBeenCalledTimes(1);

    await act(async () => root.unmount());
    container.remove();
  });

  it('only announces active cue text when cue changes are user-initiated or motion is paused', async () => {
    const { container, root } = await renderWithTheme(
      <WorkoutsLibrarySection
        onQuickLog={jest.fn()}
        viewModel={buildLoadedViewModel()}
      />
    );

    expect(container.querySelector('[aria-live="off"]')).not.toBeNull();
    expect(container.querySelector('[aria-live="polite"]')).toBeNull();

    const cueButton = [...container.querySelectorAll('button')]
      .find(button => button.textContent.includes('Hold') || button.textContent.includes('Sit') || button.textContent.includes('Stand'));
    expect(cueButton).toBeTruthy();

    await act(async () => {
      cueButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(container.querySelector('[aria-live="polite"]')).not.toBeNull();

    await act(async () => root.unmount());
    container.remove();
  });

  it('keeps reduced-motion cue text polite because playback changes require user action', async () => {
    const previousMatchMedia = window.matchMedia;
    window.matchMedia = jest.fn(() => ({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

    const { container, root } = await renderWithTheme(
      <WorkoutsLibrarySection
        onQuickLog={jest.fn()}
        viewModel={buildLoadedViewModel()}
      />
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(container.textContent).toContain('PLAY MOTION');
    expect(container.querySelector('[aria-live="polite"]')).not.toBeNull();

    await act(async () => root.unmount());
    container.remove();
    window.matchMedia = previousMatchMedia;
  });

  it('builds backend-driven coaching cues with fallback from published guidance', () => {
    const exercise = mapExerciseDocument('goblet_squat', {
      name: 'Goblet Squat',
      slug: 'goblet-squat',
      formCues: ['Chest tall', 'Knees track over toes'],
      instructions: ['Descend with control'],
      primaryMuscles: ['quads', 'glutes'],
      secondaryMuscles: ['core'],
      assetManifest: {
        lottiePath: 'workouts/exercises/v1/goblet_squat/demo.lottie.json',
        thumbnailPath: 'workouts/exercises/v1/goblet_squat/thumbnail.webp',
        assetHash: 'legacy-hash',
      },
      mediaManifest: {
        preferredMotion: 'video',
        videoPath: 'workouts/exercises/v2/goblet_squat/demo.mp4',
        posterPath: 'workouts/exercises/v2/goblet_squat/poster.webp',
        previewPath: 'workouts/exercises/v2/goblet_squat/demo.webm',
        styleVersion: 'tribelog-3d-v1',
        mediaVersion: 2,
        mediaHash: 'sha256:media',
        durationMs: 3200,
        frameRate: 30,
      },
      coachingCues: [
        {
          id: 'setup',
          phase: 'setup',
          title: 'Weight close',
          body: 'Hold the weight at your chest.',
          startPercent: 0,
          endPercent: 20,
          focusMuscles: ['core'],
          view: 'front',
        },
      ],
    });

    expect(exercise.coachingCues).toHaveLength(1);
    expect(buildExerciseCoachingCues(exercise)[0]).toMatchObject({ id: 'setup', title: 'Weight close' });
    expect(exercise.mediaManifest).toMatchObject({
      preferredMotion: 'video',
      videoPath: 'workouts/exercises/v2/goblet_squat/demo.mp4',
      posterPath: 'workouts/exercises/v2/goblet_squat/poster.webp',
      styleVersion: 'tribelog-3d-v1',
      mediaVersion: 2,
      mediaHash: 'sha256:media',
      durationMs: 3200,
      frameRate: 30,
    });
    expect(selectExerciseMotionSource(exercise)).toEqual({
      type: 'video',
      path: 'workouts/exercises/v2/goblet_squat/demo.mp4',
      posterPath: 'workouts/exercises/v2/goblet_squat/poster.webp',
      previewPath: 'workouts/exercises/v2/goblet_squat/demo.webm',
      mediaHash: 'sha256:media',
      styleVersion: 'tribelog-3d-v1',
    });

    const fallback = buildExerciseCoachingCues({ ...exercise, coachingCues: [] });
    expect(fallback.map(cue => cue.body)).toEqual(['Chest tall', 'Knees track over toes', 'Descend with control']);
    expect(fallback[0].focusMuscles).toEqual(['quads', 'glutes']);
    expect(selectExerciseMotionSource({ ...exercise, mediaManifest: { preferredMotion: 'lottie' } })).toMatchObject({
      type: 'lottie',
      path: 'workouts/exercises/v1/goblet_squat/demo.lottie.json',
      mediaHash: 'legacy-hash',
    });
  });

  it('selects the coaching cue that matches motion playback progress', () => {
    const cues = [
      { id: 'setup', title: 'Setup', startPercent: 0, endPercent: 24 },
      { id: 'lower', title: 'Lower', startPercent: 24, endPercent: 52 },
      { id: 'drive', title: 'Drive', startPercent: 52, endPercent: 82 },
      { id: 'reset', title: 'Reset', startPercent: 82, endPercent: 100 },
    ];

    expect(findExerciseCueForMotionProgress(cues, 0)?.id).toBe('setup');
    expect(findExerciseCueForMotionProgress(cues, 24)?.id).toBe('lower');
    expect(findExerciseCueForMotionProgress(cues, 63)?.id).toBe('drive');
    expect(findExerciseCueForMotionProgress(cues, 100)?.id).toBe('reset');
    expect(findExerciseCueForMotionProgress(cues, Number.NaN, 'drive')?.id).toBe('setup');
    expect(findExerciseCueForMotionProgress([], 50)).toBeNull();
    expect(getWorkoutMotionPlaybackMode({ prefersReducedMotion: true })).toBe('paused');
    expect(getWorkoutMotionPlaybackMode({ prefersReducedMotion: true, forceMotion: true })).toBe('playing');
    expect(getWorkoutMotionPlaybackMode({ prefersReducedMotion: false })).toBe('playing');
  });

  it('validates the pilot coaching cue content before Firestore apply', () => {
    const loaded = loadCueFile(require.resolve('../../scripts/workout-coaching-cues-pilot.json'));
    expect(loaded).toHaveLength(5);
    expect(loaded.map(record => record.id)).toEqual([
      'goblet_squat',
      'push_up',
      'lat_pulldown',
      'dumbbell_biceps_curl',
      'romanian_deadlift',
    ]);
    expect(validateCueRecord(pilotCoachingCues[0]).coachingCues[0]).toMatchObject({
      id: 'setup',
      phase: 'setup',
      view: 'front',
    });
  });

  it('validates full draft coaching cue coverage for all official exercises', () => {
    const officialExercises = loadOfficialExerciseSeed();
    const draft = loadCueFile(require.resolve('../../scripts/workout-coaching-cues-full-draft.json'));
    const uniqueExerciseIds = new Set(draft.map(record => record.id));

    expect(officialExercises).toHaveLength(50);
    expect(draft).toHaveLength(50);
    expect(uniqueExerciseIds.size).toBe(50);
    expect(validateCueCoverage(draft, officialExercises)).toBe(true);
    expect(draft.every(record => record.coachingCues.length === 4)).toBe(true);
    expect(draft.find(record => record.id === 'bench_press').coachingCues.map(cue => cue.phase)).toEqual([
      'setup',
      'lowering',
      'pressing',
      'return',
    ]);
  });

  it('validates the planned high-fidelity media POC manifest before asset generation', () => {
    const records = loadMediaManifest(require.resolve('../../scripts/workout-high-fidelity-media-poc.json'));

    expect(records).toHaveLength(5);
    expect(records.map(record => record.id)).toEqual([
      'goblet_squat',
      'push_up',
      'lat_pulldown',
      'romanian_deadlift',
      'bulgarian_split_squat',
    ]);
    expect(records[0].mediaManifest).toMatchObject({
      preferredMotion: 'video',
      videoPath: 'workouts/exercises/v2/goblet_squat/demo.mp4',
      posterPath: 'workouts/exercises/v2/goblet_squat/poster.webp',
      previewPath: 'workouts/exercises/v2/goblet_squat/demo.webm',
      styleVersion: 'tribelog-3d-v1',
      mediaHash: 'pending',
    });
    expect(records[0].renderBrief.phaseTimeline.map(phase => phase.cueId)).toEqual([
      'setup',
      'descent',
      'depth',
      'drive',
    ]);
    expect(records[0].renderBrief.phaseTimeline.at(-1).endPercent).toBe(100);
    expect(() => validateHighFidelityMediaRecords([
      {
        ...records[0],
        renderBrief: {
          ...records[0].renderBrief,
          phaseTimeline: [
            { ...records[0].renderBrief.phaseTimeline[0], startPercent: 4 },
            ...records[0].renderBrief.phaseTimeline.slice(1),
          ],
        },
      },
      ...records.slice(1),
    ])).toThrow(/must start at 0%/);
    expect(() => validateHighFidelityMediaRecords([
      {
        ...records[0],
        renderBrief: {
          ...records[0].renderBrief,
          phaseTimeline: [
            records[0].renderBrief.phaseTimeline[0],
            {
              ...records[0].renderBrief.phaseTimeline[1],
              startPercent: records[0].renderBrief.phaseTimeline[0].endPercent - 5,
            },
            ...records[0].renderBrief.phaseTimeline.slice(2),
          ],
        },
      },
      ...records.slice(1),
    ])).toThrow(/chronological playback order/);
    expect(() => validateHighFidelityMediaRecords([
      {
        ...records[0],
        renderBrief: {
          ...records[0].renderBrief,
          phaseTimeline: [
            { ...records[0].renderBrief.phaseTimeline[0] },
            { ...records[0].renderBrief.phaseTimeline[1], cueId: 'lower' },
            ...records[0].renderBrief.phaseTimeline.slice(2),
          ],
        },
      },
      ...records.slice(1),
    ])).toThrow(/must be descent/);
    expect(() => validateHighFidelityMediaRecords(records, { requireReady: true })).toThrow(/planned media/);
    expect(() => loadMediaApplyFile(require.resolve('../../scripts/workout-high-fidelity-media-poc.json'))).toThrow(/planned media/);
    expect(mediaManifestPayload({
      mediaManifest: {
        preferredMotion: 'video',
        videoPath: 'workouts/exercises/v2/goblet_squat/demo.mp4',
        posterPath: 'workouts/exercises/v2/goblet_squat/poster.webp',
        previewPath: 'workouts/exercises/v2/goblet_squat/demo.webm',
        styleVersion: 'tribelog-3d-v1',
        mediaVersion: 1,
        mediaHash: 'sha256:abcdef1234567890',
        durationMs: 3400,
        frameRate: 30,
      },
    })).toEqual({
      preferredMotion: 'video',
      videoPath: 'workouts/exercises/v2/goblet_squat/demo.mp4',
      posterPath: 'workouts/exercises/v2/goblet_squat/poster.webp',
      previewPath: 'workouts/exercises/v2/goblet_squat/demo.webm',
      styleVersion: 'tribelog-3d-v1',
      mediaVersion: 1,
      mediaHash: 'sha256:abcdef1234567890',
      durationMs: 3400,
      frameRate: 30,
    });
  });

  it('renders future high-fidelity video demos with current Lottie fallback preserved', async () => {
    const [firstExercise, ...rest] = seedExercises.map(exercise => mapExerciseDocument(exercise.id, exercise));
    const videoExercise = mapExerciseDocument(firstExercise.id, {
      ...firstExercise,
      mediaManifest: {
        preferredMotion: 'video',
        videoPath: 'workouts/exercises/v2/goblet_squat/demo.mp4',
        posterPath: 'workouts/exercises/v2/goblet_squat/poster.webp',
        previewPath: 'workouts/exercises/v2/goblet_squat/demo.webm',
        styleVersion: 'tribelog-3d-v1',
        mediaVersion: 1,
        mediaHash: 'sha256:media',
        durationMs: 3400,
        frameRate: 30,
      },
    });
    const viewModel = buildLoadedViewModel({
      selectedExercise: videoExercise,
      selectedExerciseId: videoExercise.id,
      visibleExercises: [videoExercise, ...rest],
    });

    const { container, root } = await renderWithTheme(
      <WorkoutsLibrarySection
        onQuickLog={() => {}}
        viewModel={viewModel}
      />
    );

    const video = container.querySelector('video');
    const sources = [...container.querySelectorAll('video source')].map(source => ({
      src: source.getAttribute('src'),
      type: source.getAttribute('type'),
    }));

    expect(video).not.toBeNull();
    expect(video.getAttribute('poster')).toBe('https://firebasestorage.googleapis.com/v0/b/tribechallengetracker.firebasestorage.app/o/workouts%2Fexercises%2Fv2%2Fgoblet_squat%2Fposter.webp?alt=media');
    expect(sources).toEqual([
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/tribechallengetracker.firebasestorage.app/o/workouts%2Fexercises%2Fv2%2Fgoblet_squat%2Fdemo.webm?alt=media',
        type: 'video/webm',
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/tribechallengetracker.firebasestorage.app/o/workouts%2Fexercises%2Fv2%2Fgoblet_squat%2Fdemo.mp4?alt=media',
        type: 'video/mp4',
      },
    ]);
    expect(container.textContent).toContain('LOADING REALISTIC DEMO');

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

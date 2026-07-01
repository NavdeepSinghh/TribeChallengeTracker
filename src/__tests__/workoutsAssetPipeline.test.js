const fs = require('fs');
const path = require('path');
const {
  validateExerciseSeed,
} = require('../../scripts/seed-workout-exercise-catalog');
const {
  firebaseStorageMediaUrl,
  loadManifest,
  parseArgs,
} = require('../../scripts/upload-workout-assets');

const repoRoot = path.resolve(__dirname, '../..');

describe('workouts asset pipeline', () => {
  const batches = [
    {
      id: 1,
      expectedExercises: [
        'bench_press',
        'dumbbell_bench_press',
        'incline_dumbbell_press',
        'push_up',
        'machine_chest_press',
        'dumbbell_shoulder_press',
        'lateral_raise',
        'dumbbell_chest_fly',
        'triceps_pushdown',
        'bench_dip',
      ],
    },
    {
      id: 2,
      expectedExercises: [
        'lat_pulldown',
        'pull_up',
        'assisted_pull_up',
        'seated_cable_row',
        'one_arm_dumbbell_row',
        'barbell_bent_over_row',
        'face_pull',
        'rear_delt_fly',
        'dumbbell_biceps_curl',
        'hammer_curl',
      ],
    },
    {
      id: 3,
      expectedExercises: [
        'back_squat',
        'goblet_squat',
        'leg_press',
        'romanian_deadlift',
        'conventional_deadlift',
        'hip_thrust',
        'walking_lunge',
        'bulgarian_split_squat',
        'step_up',
        'leg_extension',
        'seated_leg_curl',
        'standing_calf_raise',
        'glute_bridge',
        'kettlebell_swing',
      ],
    },
    {
      id: 4,
      expectedExercises: [
        'plank',
        'side_plank',
        'dead_bug',
        'bird_dog',
        'bicycle_crunch',
        'hanging_knee_raise',
        'russian_twist',
        'mountain_climber',
      ],
    },
    {
      id: 5,
      expectedExercises: [
        'treadmill_run',
        'incline_walk',
        'stationary_bike',
        'rowing_machine',
        'cat_cow',
        'downward_dog',
        'childs_pose',
        'worlds_greatest_stretch',
      ],
    },
  ];

  it.each(batches)('validates batch $id exercise seed records for storage-backed assets', ({ id, expectedExercises }) => {
    const seed = JSON.parse(fs.readFileSync(path.join(repoRoot, `scripts/workout-exercise-seed-batch-${id}.json`), 'utf8'));

    expect(seed).toHaveLength(expectedExercises.length);
    expect(seed.map(exercise => exercise.id)).toEqual(expectedExercises);
    seed.forEach(exercise => {
      expect(validateExerciseSeed(exercise)).toBe(true);
      expect(exercise.assetManifest.lottiePath).toMatch(/^workouts\/exercises\/v1\/[a-z0-9_]+\/demo\.lottie\.json$/);
      expect(exercise.assetManifest.assetHash).toMatch(/^sha256:/);
    });
  });

  it.each(batches)('validates batch $id local asset manifest hashes before upload', ({ id, expectedExercises }) => {
    const manifest = loadManifest(path.join(repoRoot, `scripts/workout-assets-manifest-batch-${id}.json`), repoRoot);

    expect(manifest).toHaveLength(expectedExercises.length * 4);
    expect(manifest.map(entry => entry.storagePath)).toContain(`workouts/exercises/v1/${expectedExercises[0]}/demo.lottie.json`);
    manifest.forEach(entry => {
      expect(fs.existsSync(entry.localPath)).toBe(true);
      expect(entry.sha256).toHaveLength(64);
      expect(entry.storagePath).toMatch(/^workouts\/exercises\/v1\/[a-z0-9_]+\//);
    });
  });

  it.each(batches)('requires batch $id generated thumbnails to be real WebP images', ({ id, expectedExercises }) => {
    const manifest = loadManifest(path.join(repoRoot, `scripts/workout-assets-manifest-batch-${id}.json`), repoRoot);
    const thumbnails = manifest.filter(entry => entry.storagePath.endsWith('/thumbnail.webp'));

    expect(thumbnails).toHaveLength(expectedExercises.length);
    thumbnails.forEach(entry => {
      const bytes = fs.readFileSync(entry.localPath);
      expect(bytes.length).toBeGreaterThan(1024);
      expect(bytes.subarray(0, 4).toString('ascii')).toBe('RIFF');
      expect(bytes.subarray(8, 12).toString('ascii')).toBe('WEBP');
    });
  });

  it('parses upload dry-run and apply arguments', () => {
    expect(parseArgs(['--manifest', 'scripts/workout-assets-manifest-batch-1.json'])).toMatchObject({
      apply: false,
    });
    expect(parseArgs(['--apply', '--bucket=tribelog-assets.appspot.com'])).toMatchObject({
      apply: true,
      bucket: 'tribelog-assets.appspot.com',
    });
    expect(parseArgs(['--apply', '--auth=firebase-cli', '--bucket=tribelog-assets.appspot.com'])).toMatchObject({
      apply: true,
      auth: 'firebase-cli',
      bucket: 'tribelog-assets.appspot.com',
    });
    expect(firebaseStorageMediaUrl('tribelog-assets.appspot.com', 'workouts/exercises/v1/plank/demo.lottie.json')).toBe(
      'https://firebasestorage.googleapis.com/v0/b/tribelog-assets.appspot.com/o/workouts%2Fexercises%2Fv1%2Fplank%2Fdemo.lottie.json?alt=media',
    );
  });

  it('keeps Firebase Storage CORS configured for web asset fetches', () => {
    const corsConfig = JSON.parse(fs.readFileSync(path.join(repoRoot, 'storage.cors.json'), 'utf8'));

    expect(corsConfig).toEqual(expect.any(Array));
    expect(corsConfig[0].origin).toEqual(expect.arrayContaining([
      'https://tribechallengetracker.web.app',
      'https://tribechallengetracker.firebaseapp.com',
      'http://localhost:3000',
    ]));
    expect(corsConfig[0].method).toContain('GET');
    expect(corsConfig[0].responseHeader).toContain('Content-Type');
    expect(corsConfig[0].maxAgeSeconds).toBeGreaterThan(0);
  });
});

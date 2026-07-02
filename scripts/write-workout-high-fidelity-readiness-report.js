const fs = require('fs');
const path = require('path');
const { loadMediaManifest, parseArgs: parseMediaArgs } = require('./validate-workout-high-fidelity-media');
const { verifyAssetFiles } = require('./verify-workout-high-fidelity-asset-files');

const DEFAULT_FILE = path.resolve(__dirname, 'workout-high-fidelity-media-poc.json');
const DEFAULT_MEDIA_ROOT = path.resolve(__dirname, '../generated');
const DEFAULT_OUTPUT = path.resolve(__dirname, '../docs/workouts/review-packs/high-fidelity-real-asset-readiness-2026-07-02.json');

function parseArgs(argv = process.argv.slice(2)) {
  const mediaOptions = parseMediaArgs(argv);
  const options = {
    file: mediaOptions.file || DEFAULT_FILE,
    mediaRoot: DEFAULT_MEDIA_ROOT,
    output: DEFAULT_OUTPUT,
    requireMetadata: false,
  };

  argv.forEach((arg, index) => {
    if (arg === '--media-root') {
      options.mediaRoot = path.resolve(process.cwd(), argv[index + 1]);
    } else if (arg.startsWith('--media-root=')) {
      options.mediaRoot = path.resolve(process.cwd(), arg.split('=').slice(1).join('='));
    } else if (arg === '--output') {
      options.output = path.resolve(process.cwd(), argv[index + 1]);
    } else if (arg.startsWith('--output=')) {
      options.output = path.resolve(process.cwd(), arg.split('=').slice(1).join('='));
    } else if (arg === '--require-metadata') {
      options.requireMetadata = true;
    }
  });

  return options;
}

function fileReady(file) {
  return Boolean(file.check && file.check.ok && (!file.metadata || file.metadata.ok));
}

function metadataSummary(metadata) {
  if (!metadata) {
    return null;
  }
  if (!metadata.ok) {
    return {
      ok: false,
      reason: metadata.reason || metadata.failures?.join('; ') || 'metadata failed',
    };
  }
  return {
    ok: true,
    width: metadata.width,
    height: metadata.height,
    durationMs: metadata.durationMs,
    frameRate: metadata.frameRate,
  };
}

function buildReadinessReport(records, options = {}) {
  const mediaRoot = options.mediaRoot || DEFAULT_MEDIA_ROOT;
  const report = verifyAssetFiles(records, {
    mediaRoot,
    requireFiles: false,
    requireMetadata: Boolean(options.requireMetadata),
  });
  const exercises = report.results.map((result) => {
    const files = result.files.map((file) => ({
      kind: file.kind,
      storagePath: file.path,
      localPath: path.relative(path.resolve(__dirname, '..'), file.absolutePath).split(path.sep).join('/'),
      ready: fileReady(file),
      exists: Boolean(file.check.exists),
      reason: file.metadata && !file.metadata.ok
        ? metadataSummary(file.metadata).reason
        : file.check.reason,
      bytes: file.check.bytes || 0,
      metadata: metadataSummary(file.metadata),
    }));
    return {
      id: result.id,
      ready: files.every((file) => file.ready),
      files,
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    mediaRoot,
    ok: exercises.every((exercise) => exercise.ready),
    readyExercises: exercises.filter((exercise) => exercise.ready).length,
    totalExercises: exercises.length,
    failures: report.failures,
    exercises,
  };
}

function main() {
  const options = parseArgs();
  const records = loadMediaManifest(options.file);
  const readiness = buildReadinessReport(records, options);
  fs.mkdirSync(path.dirname(options.output), { recursive: true });
  fs.writeFileSync(options.output, `${JSON.stringify(readiness, null, 2)}\n`);
  console.log(`Wrote high-fidelity readiness report to ${options.output}`);
  console.log(`${readiness.readyExercises}/${readiness.totalExercises} exercises ready`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = {
  buildReadinessReport,
  parseArgs,
};

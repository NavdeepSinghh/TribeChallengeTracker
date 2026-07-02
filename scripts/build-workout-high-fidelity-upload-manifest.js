const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { loadMediaManifest, parseArgs: parseMediaArgs } = require('./validate-workout-high-fidelity-media');
const { verifyAssetFiles } = require('./verify-workout-high-fidelity-asset-files');

const DEFAULT_FILE = 'workout-high-fidelity-media-poc.json';
const DEFAULT_MEDIA_ROOT = path.resolve(__dirname, '../generated');
const DEFAULT_OUTPUT = path.resolve(__dirname, 'workout-high-fidelity-upload-manifest.json');

const CONTENT_TYPES = {
  mp4: 'video/mp4',
  webm: 'video/webm',
  poster: 'image/webp',
};

function cleanString(value) {
  return String(value || '').trim();
}

function parseArgs(argv = process.argv.slice(2)) {
  const mediaOptions = parseMediaArgs(argv);
  const options = {
    file: mediaOptions.file || path.resolve(__dirname, DEFAULT_FILE),
    mediaRoot: DEFAULT_MEDIA_ROOT,
    output: DEFAULT_OUTPUT,
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
    }
  });

  return options;
}

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function relativeToRepo(filePath, repoRoot = path.resolve(__dirname, '..')) {
  return path.relative(repoRoot, filePath).split(path.sep).join('/');
}

function uploadManifestEntriesFromVerification(report, repoRoot = path.resolve(__dirname, '..')) {
  return report.results.flatMap((result) => result.files.map((file) => ({
    exerciseId: result.id,
    localPath: relativeToRepo(file.absolutePath, repoRoot),
    storagePath: file.path,
    contentType: CONTENT_TYPES[file.kind],
    sha256: sha256(file.absolutePath),
  })));
}

function buildHighFidelityUploadManifest(records, options = {}) {
  const mediaRoot = options.mediaRoot || DEFAULT_MEDIA_ROOT;
  const report = verifyAssetFiles(records, { mediaRoot, requireFiles: true });
  return uploadManifestEntriesFromVerification(report, options.repoRoot);
}

function main() {
  const options = parseArgs();
  const records = loadMediaManifest(options.file);
  const manifest = buildHighFidelityUploadManifest(records, { mediaRoot: options.mediaRoot });
  fs.writeFileSync(options.output, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Wrote ${manifest.length} high-fidelity upload manifest entries to ${options.output}`);
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
  buildHighFidelityUploadManifest,
  parseArgs,
  uploadManifestEntriesFromVerification,
};

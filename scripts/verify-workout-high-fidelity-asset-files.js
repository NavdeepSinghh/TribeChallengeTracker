const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { loadMediaManifest, parseArgs: parseMediaArgs } = require('./validate-workout-high-fidelity-media');

const DEFAULT_FILE = 'workout-high-fidelity-media-poc.json';
const DEFAULT_MEDIA_ROOT = path.resolve(__dirname, '../generated');
const SIZE_LIMITS = {
  mp4Bytes: 3 * 1024 * 1024,
  webmBytes: 2 * 1024 * 1024,
  posterBytes: 250 * 1024,
};
const VIDEO_DIMENSION_LIMITS = {
  minWidth: 640,
  minHeight: 360,
  maxWidth: 1920,
  maxHeight: 1080,
};
const DURATION_TOLERANCE_MS = 350;

function parseArgs(argv = process.argv.slice(2)) {
  const mediaOptions = parseMediaArgs(argv);
  const options = {
    file: mediaOptions.file || path.resolve(__dirname, DEFAULT_FILE),
    mediaRoot: DEFAULT_MEDIA_ROOT,
    requireFiles: false,
    requireMetadata: false,
  };

  argv.forEach((arg, index) => {
    if (arg === '--media-root') {
      options.mediaRoot = path.resolve(process.cwd(), argv[index + 1]);
    } else if (arg.startsWith('--media-root=')) {
      options.mediaRoot = path.resolve(process.cwd(), arg.split('=').slice(1).join('='));
    } else if (arg === '--require-files') {
      options.requireFiles = true;
    } else if (arg === '--require-metadata') {
      options.requireMetadata = true;
    }
  });

  return options;
}

function readHeader(filePath, length = 16) {
  const fd = fs.openSync(filePath, 'r');
  try {
    const buffer = Buffer.alloc(length);
    const bytesRead = fs.readSync(fd, buffer, 0, length, 0);
    return buffer.subarray(0, bytesRead);
  } finally {
    fs.closeSync(fd);
  }
}

function isMp4(buffer) {
  return buffer.length >= 12 && buffer.toString('ascii', 4, 8) === 'ftyp';
}

function isWebm(buffer) {
  return buffer.length >= 4 && buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3;
}

function isWebp(buffer) {
  return buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP';
}

function parseFrameRate(value) {
  const text = String(value || '').trim();
  if (!text) {
    return 0;
  }
  if (text.includes('/')) {
    const [numerator, denominator] = text.split('/').map(Number);
    return denominator ? numerator / denominator : 0;
  }
  return Number(text) || 0;
}

function validateVideoMetadata(metadata, expected = {}) {
  const stream = Array.isArray(metadata && metadata.streams) ? metadata.streams[0] : {};
  const format = metadata && metadata.format ? metadata.format : {};
  const width = Number(stream.width);
  const height = Number(stream.height);
  const durationMs = Number(format.duration) * 1000;
  const frameRate = parseFrameRate(stream.r_frame_rate || stream.avg_frame_rate);
  const expectedDurationMs = Number(expected.durationMs);
  const expectedFrameRate = Number(expected.frameRate);
  const failures = [];

  if (!Number.isFinite(width) || width < VIDEO_DIMENSION_LIMITS.minWidth || width > VIDEO_DIMENSION_LIMITS.maxWidth) {
    failures.push(`width must be ${VIDEO_DIMENSION_LIMITS.minWidth}-${VIDEO_DIMENSION_LIMITS.maxWidth}`);
  }
  if (!Number.isFinite(height) || height < VIDEO_DIMENSION_LIMITS.minHeight || height > VIDEO_DIMENSION_LIMITS.maxHeight) {
    failures.push(`height must be ${VIDEO_DIMENSION_LIMITS.minHeight}-${VIDEO_DIMENSION_LIMITS.maxHeight}`);
  }
  if (!Number.isFinite(durationMs) || Math.abs(durationMs - expectedDurationMs) > DURATION_TOLERANCE_MS) {
    failures.push(`duration must be within ${DURATION_TOLERANCE_MS}ms of ${expectedDurationMs}ms`);
  }
  if (expectedFrameRate && (!Number.isFinite(frameRate) || Math.abs(frameRate - expectedFrameRate) > 0.5)) {
    failures.push(`frame rate must be near ${expectedFrameRate}fps`);
  }

  return {
    ok: failures.length === 0,
    failures,
    width,
    height,
    durationMs: Number.isFinite(durationMs) ? Math.round(durationMs) : 0,
    frameRate: Number.isFinite(frameRate) ? Number(frameRate.toFixed(2)) : 0,
  };
}

function probeVideoFile(filePath, expected = {}) {
  const result = spawnSync('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height,r_frame_rate,avg_frame_rate:format=duration',
    '-of', 'json',
    filePath,
  ], { encoding: 'utf8' });

  if (result.error) {
    return { ok: false, reason: `ffprobe unavailable: ${result.error.message}` };
  }
  if (result.status !== 0) {
    return { ok: false, reason: `ffprobe failed: ${result.stderr || result.stdout || result.status}` };
  }
  try {
    return validateVideoMetadata(JSON.parse(result.stdout), expected);
  } catch (error) {
    return { ok: false, reason: `ffprobe JSON parse failed: ${error.message}` };
  }
}

function relativeAssetPath(mediaRoot, storagePath) {
  return path.resolve(mediaRoot, storagePath);
}

function checkAssetFile(filePath, kind, maxBytes) {
  if (!fs.existsSync(filePath)) {
    return { exists: false, ok: false, reason: 'missing' };
  }

  const stats = fs.statSync(filePath);
  if (!stats.isFile()) {
    return { exists: true, ok: false, reason: 'not a file', bytes: stats.size };
  }
  if (stats.size <= 0) {
    return { exists: true, ok: false, reason: 'empty file', bytes: stats.size };
  }
  if (stats.size > maxBytes) {
    return { exists: true, ok: false, reason: `exceeds ${maxBytes} byte budget`, bytes: stats.size };
  }

  const header = readHeader(filePath, 16);
  const validHeader = kind === 'mp4' ? isMp4(header) : kind === 'webm' ? isWebm(header) : isWebp(header);
  if (!validHeader) {
    return { exists: true, ok: false, reason: `invalid ${kind} header`, bytes: stats.size };
  }

  return { exists: true, ok: true, reason: 'ok', bytes: stats.size };
}

function verifyRecordAssets(record, mediaRoot, options = {}) {
  const files = [
    {
      kind: 'mp4',
      path: record.mediaManifest.videoPath,
      absolutePath: relativeAssetPath(mediaRoot, record.mediaManifest.videoPath),
      maxBytes: SIZE_LIMITS.mp4Bytes,
    },
    {
      kind: 'webm',
      path: record.mediaManifest.previewPath,
      absolutePath: relativeAssetPath(mediaRoot, record.mediaManifest.previewPath),
      maxBytes: SIZE_LIMITS.webmBytes,
    },
    {
      kind: 'poster',
      path: record.mediaManifest.posterPath,
      absolutePath: relativeAssetPath(mediaRoot, record.mediaManifest.posterPath),
      maxBytes: SIZE_LIMITS.posterBytes,
    },
  ];

  return {
    id: record.id,
    files: files.map((file) => ({
      ...file,
      check: checkAssetFile(file.absolutePath, file.kind === 'poster' ? 'webp' : file.kind, file.maxBytes),
    })).map((file) => {
      if (!options.requireMetadata || !file.check.ok || (file.kind !== 'mp4' && file.kind !== 'webm')) {
        return file;
      }
      return {
        ...file,
        metadata: probeVideoFile(file.absolutePath, {
          durationMs: record.mediaManifest.durationMs,
          frameRate: record.mediaManifest.frameRate,
        }),
      };
    }),
  };
}

function verifyAssetFiles(records, options = {}) {
  const mediaRoot = options.mediaRoot || DEFAULT_MEDIA_ROOT;
  const results = records.map((record) => verifyRecordAssets(record, mediaRoot, options));
  const failures = results.flatMap((result) => result.files
    .filter((file) => !file.check.ok || (file.metadata && !file.metadata.ok))
    .flatMap((file) => {
      if (!file.check.ok) {
        return [`${result.id}:${file.kind}:${file.check.reason}`];
      }
      const metadataReason = file.metadata.reason || file.metadata.failures.join('; ');
      return [`${result.id}:${file.kind}:${metadataReason}`];
    }));

  if (failures.length > 0 && options.requireFiles) {
    throw new Error(`High-fidelity asset file verification failed: ${failures.join(', ')}`);
  }

  return {
    mediaRoot,
    results,
    failures,
    ok: failures.length === 0,
  };
}

function main() {
  const options = parseArgs();
  const records = loadMediaManifest(options.file);
  const report = verifyAssetFiles(records, options);

  console.log(`Checked high-fidelity asset files under ${report.mediaRoot}`);
  report.results.forEach((result) => {
    result.files.forEach((file) => {
      const metadataSuffix = file.metadata
        ? `, metadata ${file.metadata.ok ? 'OK' : 'FAILED'}`
        : '';
      const status = file.check.ok && (!file.metadata || file.metadata.ok) ? 'OK' : 'PENDING';
      console.log(`- ${result.id} ${file.kind}: ${status} ${file.path} (${file.check.reason}${metadataSuffix})`);
    });
  });
  if (!report.ok && !options.requireFiles) {
    console.log('Missing or invalid files are allowed in planning mode. Add --require-files for release gating.');
  }
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
  DURATION_TOLERANCE_MS,
  SIZE_LIMITS,
  VIDEO_DIMENSION_LIMITS,
  checkAssetFile,
  isMp4,
  isWebm,
  isWebp,
  parseArgs,
  parseFrameRate,
  probeVideoFile,
  validateVideoMetadata,
  verifyAssetFiles,
  verifyRecordAssets,
};

const fs = require('fs');
const path = require('path');

const DEFAULT_FILE = 'workout-high-fidelity-media-poc.json';
const POC_IDS = new Set(['goblet_squat', 'push_up', 'lat_pulldown', 'romanian_deadlift', 'bulgarian_split_squat']);
const VALID_STATUS = new Set(['planned', 'ready', 'approved']);
const VALID_MOTION = new Set(['video']);
const VALID_FRAME_RATE = new Set([24, 30, 60]);
const EXPECTED_PHASE_CUE_IDS = {
  goblet_squat: ['setup', 'descent', 'depth', 'drive'],
  push_up: ['plank', 'lower', 'bottom', 'press'],
  lat_pulldown: ['setup', 'initiate', 'finish', 'return'],
  romanian_deadlift: ['setup', 'hinge', 'stretch', 'stand'],
  bulgarian_split_squat: ['setup', 'descend', 'bottom', 'stand'],
};
const UNSUPPORTED_CLAIM_PATTERN = /\b(cure|treat|diagnose|heal|rehab|therapy|injury|pain[- ]?free|guarantee|medical|doctor|clinical)\b/i;

function cleanString(value) {
  return String(value || '').trim();
}

function parseArgs(argv = process.argv.slice(2)) {
  const options = {
    file: path.resolve(__dirname, DEFAULT_FILE),
    requireReady: false,
  };

  argv.forEach((arg, index) => {
    if (arg === '--file') {
      options.file = path.resolve(process.cwd(), argv[index + 1]);
    } else if (arg.startsWith('--file=')) {
      options.file = path.resolve(process.cwd(), arg.split('=').slice(1).join('='));
    } else if (arg === '--require-ready') {
      options.requireReady = true;
    }
  });

  return options;
}

function ensureStoragePath(id, value, filename, fieldName) {
  const pathValue = cleanString(value);
  const expected = `workouts/exercises/v2/${id}/${filename}`;
  if (pathValue !== expected) {
    throw new Error(`${id}: mediaManifest.${fieldName} must be ${expected}`);
  }
  return pathValue;
}

function cleanStringList(value, id, fieldName) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${id}: renderBrief.${fieldName} must be a non-empty array.`);
  }
  return value.map(cleanString).filter(Boolean);
}

function validateSafeText(id, label, value) {
  const text = Array.isArray(value) ? value.join(' ') : cleanString(value);
  if (UNSUPPORTED_CLAIM_PATTERN.test(text)) {
    throw new Error(`${id}: ${label} contains medical or unsupported claim language.`);
  }
  return text;
}

function validatePhaseTimeline(id, value) {
  if (!Array.isArray(value) || value.length < 3) {
    throw new Error(`${id}: renderBrief.phaseTimeline must include at least 3 motion cue phases.`);
  }
  const expectedCueIds = EXPECTED_PHASE_CUE_IDS[id] || [];
  if (value.length !== expectedCueIds.length) {
    throw new Error(`${id}: renderBrief.phaseTimeline must include exactly these cue ids: ${expectedCueIds.join(', ')}.`);
  }

  let previousEnd = 0;
  return value.map((phase, index) => {
    const cueId = cleanString(phase && phase.cueId);
    const label = validateSafeText(id, `renderBrief.phaseTimeline[${index}].label`, phase && phase.label);
    const startPercent = Number(phase && phase.startPercent);
    const endPercent = Number(phase && phase.endPercent);
    if (!/^[a-z0-9_-]{2,40}$/.test(cueId)) {
      throw new Error(`${id}: renderBrief.phaseTimeline[${index}].cueId must be a stable id.`);
    }
    if (expectedCueIds[index] && cueId !== expectedCueIds[index]) {
      throw new Error(`${id}: renderBrief.phaseTimeline[${index}].cueId must be ${expectedCueIds[index]} to match the approved coach cue draft.`);
    }
    if (!label) {
      throw new Error(`${id}: renderBrief.phaseTimeline[${index}].label is required.`);
    }
    if (!Number.isFinite(startPercent) || !Number.isFinite(endPercent)) {
      throw new Error(`${id}: renderBrief.phaseTimeline[${index}] must include numeric startPercent/endPercent.`);
    }
    if (startPercent < 0 || endPercent > 100 || endPercent <= startPercent) {
      throw new Error(`${id}: renderBrief.phaseTimeline[${index}] must be an ordered 0-100 percent range.`);
    }
    if (index === 0 && startPercent !== 0) {
      throw new Error(`${id}: renderBrief.phaseTimeline must start at 0%.`);
    }
    if (index > 0 && startPercent !== previousEnd) {
      throw new Error(`${id}: renderBrief.phaseTimeline[${index}] must start where the previous phase ended to preserve chronological playback order.`);
    }
    previousEnd = endPercent;
    return { cueId, label, startPercent, endPercent };
  }).map((phase, index, phases) => {
    if (index === phases.length - 1 && phase.endPercent !== 100) {
      throw new Error(`${id}: renderBrief.phaseTimeline must end at 100%.`);
    }
    return phase;
  });
}

function validateMediaManifest(id, manifest, status, requireReady) {
  if (!manifest || typeof manifest !== 'object') {
    throw new Error(`${id}: mediaManifest is required.`);
  }

  const preferredMotion = cleanString(manifest.preferredMotion || 'video');
  if (!VALID_MOTION.has(preferredMotion)) {
    throw new Error(`${id}: mediaManifest.preferredMotion must be video.`);
  }

  const styleVersion = cleanString(manifest.styleVersion);
  if (!/^tribelog-3d-v\d+$/.test(styleVersion)) {
    throw new Error(`${id}: mediaManifest.styleVersion must look like tribelog-3d-v1.`);
  }

  const mediaVersion = Number(manifest.mediaVersion);
  if (!Number.isInteger(mediaVersion) || mediaVersion < 1) {
    throw new Error(`${id}: mediaManifest.mediaVersion must be a positive integer.`);
  }

  const durationMs = Number(manifest.durationMs);
  if (!Number.isInteger(durationMs) || durationMs < 1000 || durationMs > 8000) {
    throw new Error(`${id}: mediaManifest.durationMs must be an integer between 1000 and 8000.`);
  }

  const frameRate = Number(manifest.frameRate);
  if (!VALID_FRAME_RATE.has(frameRate)) {
    throw new Error(`${id}: mediaManifest.frameRate must be 24, 30, or 60.`);
  }

  const mediaHash = cleanString(manifest.mediaHash);
  if (status === 'planned') {
    if (mediaHash !== 'pending') {
      throw new Error(`${id}: planned mediaManifest.mediaHash must be pending.`);
    }
  } else if (!/^sha256:[a-f0-9]{16,128}$/i.test(mediaHash)) {
    throw new Error(`${id}: ready/approved mediaManifest.mediaHash must be a sha256 hash.`);
  }

  if (requireReady && status === 'planned') {
    throw new Error(`${id}: --require-ready does not allow planned media.`);
  }

  return {
    preferredMotion,
    videoPath: ensureStoragePath(id, manifest.videoPath, 'demo.mp4', 'videoPath'),
    posterPath: ensureStoragePath(id, manifest.posterPath, 'poster.webp', 'posterPath'),
    previewPath: ensureStoragePath(id, manifest.previewPath, 'demo.webm', 'previewPath'),
    styleVersion,
    mediaVersion,
    mediaHash,
    durationMs,
    frameRate,
  };
}

function validateRenderBrief(id, brief) {
  if (!brief || typeof brief !== 'object') {
    throw new Error(`${id}: renderBrief is required.`);
  }
  const cameraAngle = cleanString(brief.cameraAngle);
  if (!/^[a-z0-9_-]{3,40}$/.test(cameraAngle)) {
    throw new Error(`${id}: renderBrief.cameraAngle must be a stable id.`);
  }
  const movementFocus = validateSafeText(id, 'renderBrief.movementFocus', brief.movementFocus);
  const avoid = cleanStringList(brief.avoid, id, 'avoid');
  validateSafeText(id, 'renderBrief.avoid', avoid);
  return {
    cameraAngle,
    primaryMuscles: cleanStringList(brief.primaryMuscles, id, 'primaryMuscles'),
    secondaryMuscles: cleanStringList(brief.secondaryMuscles, id, 'secondaryMuscles'),
    equipment: cleanStringList(brief.equipment, id, 'equipment'),
    movementFocus,
    phaseTimeline: validatePhaseTimeline(id, brief.phaseTimeline),
    avoid,
  };
}

function validateRecord(record) {
  const id = cleanString(record && record.id);
  if (!POC_IDS.has(id)) {
    throw new Error(`${id || 'record'}: id must be one of the five high-fidelity POC exercises.`);
  }
  const status = cleanString(record.status || 'planned');
  if (!VALID_STATUS.has(status)) {
    throw new Error(`${id}: status must be planned, ready, or approved.`);
  }
  return {
    id,
    status,
    mediaManifest: validateMediaManifest(id, record.mediaManifest, status, false),
    renderBrief: validateRenderBrief(id, record.renderBrief),
  };
}

function validateRecords(records, options = {}) {
  if (!Array.isArray(records)) {
    throw new Error('High-fidelity media manifest file must be an array.');
  }

  const seen = new Set();
  const validated = records.map((record) => {
    const result = validateRecord(record);
    if (seen.has(result.id)) {
      throw new Error(`${result.id}: duplicate high-fidelity media record.`);
    }
    seen.add(result.id);
    if (options.requireReady && result.status === 'planned') {
      throw new Error(`${result.id}: --require-ready does not allow planned media.`);
    }
    return result;
  });

  const missing = [...POC_IDS].filter((id) => !seen.has(id));
  if (missing.length > 0) {
    throw new Error(`Missing high-fidelity POC media records: ${missing.join(', ')}`);
  }

  return validated;
}

function loadMediaManifest(filePath, options = {}) {
  const records = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return validateRecords(records, options);
}

function main() {
  const options = parseArgs();
  const records = loadMediaManifest(options.file, { requireReady: options.requireReady });
  console.log(`Validated ${records.length} high-fidelity workout media POC records.`);
  records.forEach((record) => {
    console.log(`- ${record.id}: ${record.status}, ${record.mediaManifest.styleVersion}, ${record.mediaManifest.durationMs}ms`);
  });
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
  loadMediaManifest,
  parseArgs,
  validateRecords,
  validateRecord,
};

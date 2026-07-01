const fs = require('fs');
const path = require('path');

const DEFAULT_FILE = 'workout-coaching-cues-pilot.json';
const VALID_VIEW = new Set(['front', 'back', 'side']);
const UNSUPPORTED_CLAIM_PATTERN = /\b(cure|treat|diagnose|heal|rehab|therapy|injury|pain[- ]?free|guarantee|medical|doctor|clinical)\b/i;

function cleanString(value) {
  return String(value || '').trim();
}

function parseArgs(argv = process.argv.slice(2)) {
  const options = {
    apply: false,
    adminUid: '',
    file: path.resolve(__dirname, DEFAULT_FILE),
  };

  argv.forEach((arg, index) => {
    if (arg === '--apply') {
      options.apply = true;
    } else if (arg === '--admin-uid') {
      options.adminUid = cleanString(argv[index + 1]);
    } else if (arg.startsWith('--admin-uid=')) {
      options.adminUid = cleanString(arg.split('=').slice(1).join('='));
    } else if (arg === '--file') {
      options.file = path.resolve(process.cwd(), argv[index + 1]);
    } else if (arg.startsWith('--file=')) {
      options.file = path.resolve(process.cwd(), arg.split('=').slice(1).join('='));
    }
  });

  return options;
}

function validateAdminUid(adminUid) {
  const uid = cleanString(adminUid);
  if (!/^[A-Za-z0-9_-]{6,128}$/.test(uid)) {
    throw new Error('--admin-uid is required in --apply mode and must be a valid Firebase uid.');
  }
  return uid;
}

function validateCue(cue, exerciseId, index) {
  if (!cue || typeof cue !== 'object') {
    throw new Error(`${exerciseId}: coachingCues[${index}] must be an object.`);
  }
  const id = cleanString(cue.id);
  const phase = cleanString(cue.phase);
  const title = cleanString(cue.title);
  const body = cleanString(cue.body);
  const view = cleanString(cue.view || 'front');

  if (!/^[a-z0-9_]{2,60}$/.test(id)) {
    throw new Error(`${exerciseId}: coachingCues[${index}].id must be snake_case.`);
  }
  if (!phase) throw new Error(`${exerciseId}: coachingCues[${index}].phase is required.`);
  if (title.length < 4) throw new Error(`${exerciseId}: coachingCues[${index}].title is too short.`);
  if (body.length < 12) throw new Error(`${exerciseId}: coachingCues[${index}].body is too short.`);
  if (UNSUPPORTED_CLAIM_PATTERN.test(`${title} ${body}`)) {
    throw new Error(`${exerciseId}: coachingCues[${index}] contains medical or unsupported claim language.`);
  }
  if (!VALID_VIEW.has(view)) throw new Error(`${exerciseId}: coachingCues[${index}].view must be front, back, or side.`);

  const start = Number(cue.startPercent);
  const end = Number(cue.endPercent);
  if (!Number.isInteger(start) || start < 0 || start > 100) {
    throw new Error(`${exerciseId}: coachingCues[${index}].startPercent must be an integer between 0 and 100.`);
  }
  if (!Number.isInteger(end) || end < start || end > 100) {
    throw new Error(`${exerciseId}: coachingCues[${index}].endPercent must be an integer between startPercent and 100.`);
  }
  const hasStartFrame = cue.startFrame !== undefined && cue.startFrame !== null;
  const hasEndFrame = cue.endFrame !== undefined && cue.endFrame !== null;
  const startFrame = hasStartFrame ? Number(cue.startFrame) : null;
  const endFrame = hasEndFrame ? Number(cue.endFrame) : null;
  if (hasStartFrame !== hasEndFrame) {
    throw new Error(`${exerciseId}: coachingCues[${index}] must provide both startFrame and endFrame, or neither.`);
  }
  if (hasStartFrame && (!Number.isInteger(startFrame) || startFrame < 0 || !Number.isInteger(endFrame) || endFrame < startFrame)) {
    throw new Error(`${exerciseId}: coachingCues[${index}] frame range is invalid.`);
  }
  if (!Array.isArray(cue.focusMuscles) || cue.focusMuscles.length === 0) {
    throw new Error(`${exerciseId}: coachingCues[${index}].focusMuscles must be a non-empty array.`);
  }
  cue.focusMuscles.forEach((muscle) => {
    if (!/^[a-z0-9_]{2,60}$/.test(cleanString(muscle))) {
      throw new Error(`${exerciseId}: coachingCues[${index}].focusMuscles must contain muscle ids.`);
    }
  });

  const validatedCue = {
    id,
    phase,
    title,
    body,
    startPercent: start,
    endPercent: end,
    focusMuscles: cue.focusMuscles.map(cleanString),
    view,
  };
  if (hasStartFrame) {
    validatedCue.startFrame = startFrame;
    validatedCue.endFrame = endFrame;
  }
  return validatedCue;
}

function validateCueRecord(record) {
  const id = cleanString(record && record.id);
  if (!/^[a-z0-9_]{3,80}$/.test(id)) {
    throw new Error(`${id || 'record'}: id must be snake_case.`);
  }
  if (!Array.isArray(record.coachingCues) || record.coachingCues.length < 3) {
    throw new Error(`${id}: coachingCues must contain at least three cues.`);
  }
  return {
    id,
    coachingCues: record.coachingCues.map((cue, index) => validateCue(cue, id, index)),
  };
}

function validateCueCoverage(records, seedExercises) {
  const seedIds = new Set(seedExercises.map((exercise) => cleanString(exercise.id)).filter(Boolean));
  const recordIds = new Set();
  records.forEach((record) => {
    if (recordIds.has(record.id)) {
      throw new Error(`${record.id}: duplicate cue record.`);
    }
    recordIds.add(record.id);
    if (!seedIds.has(record.id)) {
      throw new Error(`${record.id}: cue record does not match an official exercise id.`);
    }
  });

  const missing = [...seedIds].filter((id) => !recordIds.has(id));
  if (missing.length > 0) {
    throw new Error(`Missing coaching cues for official exercises: ${missing.join(', ')}`);
  }

  return true;
}

function loadCueFile(filePath) {
  const records = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!Array.isArray(records)) {
    throw new Error('Cue file must be an array.');
  }
  return records.map(validateCueRecord);
}

async function loadAdmin() {
  try {
    return require('firebase-admin');
  } catch (error) {
    return require(path.resolve(__dirname, '../functions/node_modules/firebase-admin'));
  }
}

async function assertSeedAdmin(db, adminUid) {
  const snap = await db.collection('admins').doc(adminUid).get();
  if (!snap.exists) {
    throw new Error(`Admin uid ${adminUid} was not found in /admins. Refusing to apply workout coaching cues.`);
  }
}

async function main() {
  const options = parseArgs();
  const records = loadCueFile(options.file);
  const adminUid = options.apply ? validateAdminUid(options.adminUid) : '';

  if (!options.apply) {
    console.log(`Validated ${records.length} workout coaching cue records. Use --apply to write to Firestore.`);
    console.log('Apply mode requires --admin-uid <uid> and verifies that uid exists in /admins.');
    records.forEach((record) => console.log(`- ${record.id}: ${record.coachingCues.length} cues`));
    return;
  }

  const admin = await loadAdmin();
  if (!admin.apps.length) {
    admin.initializeApp();
  }

  const db = admin.firestore();
  await assertSeedAdmin(db, adminUid);
  const batch = db.batch();
  records.forEach((record) => {
    batch.set(db.collection('exerciseCatalog').doc(record.id), {
      coachingCues: record.coachingCues,
      coachingCuesUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
      coachingCuesUpdatedBy: adminUid,
    }, { merge: true });
  });
  await batch.commit();
  console.log(`Applied coaching cues for ${records.length} exercises as admin ${adminUid}.`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = {
  loadCueFile,
  parseArgs,
  validateCueCoverage,
  validateCueRecord,
};

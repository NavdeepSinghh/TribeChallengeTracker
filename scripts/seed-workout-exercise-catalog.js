const fs = require('fs');
const path = require('path');

const VALID_STATUS = new Set(['draft', 'published', 'archived']);
const VALID_LEVEL = new Set(['beginner', 'intermediate', 'advanced']);
const VALID_PATTERN = new Set(['push', 'pull', 'squat', 'hinge', 'carry', 'core', 'cardio', 'mobility']);
const DEFAULT_SEED_FILE = 'workout-exercise-seed.json';

function cleanString(value) {
  return String(value || '').trim();
}

function parseArgs(argv = process.argv.slice(2)) {
  const options = {
    apply: false,
    adminUid: '',
    file: path.resolve(__dirname, DEFAULT_SEED_FILE),
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

function assertList(value, field, id) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${id}: ${field} must be a non-empty array.`);
  }
}

function assertStringList(value, field, id) {
  assertList(value, field, id);
  value.forEach((item) => {
    if (!cleanString(item)) {
      throw new Error(`${id}: ${field} must contain only non-empty strings.`);
    }
  });
}

function validateAssetPath(value, field, id) {
  const next = cleanString(value);
  if (!next) {
    throw new Error(`${id}: assetManifest.${field} is required.`);
  }
  if (!/^workouts\/exercises\/v\d+\/[a-z0-9_]+\/.+/.test(next)) {
    throw new Error(`${id}: assetManifest.${field} must use workouts/exercises/vN/{exerciseId}/... storage convention.`);
  }
}

function validateExerciseSeed(exercise) {
  const id = cleanString(exercise.id);
  if (!/^[a-z0-9_]{3,80}$/.test(id)) {
    throw new Error(`${id || 'exercise'}: id must be snake_case.`);
  }
  if (!VALID_STATUS.has(exercise.status)) {
    throw new Error(`${id}: invalid status.`);
  }
  if (!VALID_LEVEL.has(exercise.level)) {
    throw new Error(`${id}: invalid level.`);
  }
  if (!VALID_PATTERN.has(exercise.movementPattern)) {
    throw new Error(`${id}: invalid movementPattern.`);
  }
  if (cleanString(exercise.name).length < 2) {
    throw new Error(`${id}: name is required.`);
  }
  if (!Number.isInteger(exercise.version) || exercise.version < 1) {
    throw new Error(`${id}: version must be a positive integer.`);
  }
  if (!/^[a-z0-9-]{3,100}$/.test(cleanString(exercise.slug))) {
    throw new Error(`${id}: slug must be kebab-case.`);
  }
  assertStringList(exercise.primaryMuscles, 'primaryMuscles', id);
  assertStringList(exercise.equipment, 'equipment', id);
  assertStringList(exercise.instructions, 'instructions', id);
  assertStringList(exercise.formCues, 'formCues', id);
  assertStringList(exercise.commonMistakes, 'commonMistakes', id);
  if (!Array.isArray(exercise.secondaryMuscles)) {
    throw new Error(`${id}: secondaryMuscles must be an array.`);
  }
  if (!Array.isArray(exercise.substitutions)) {
    throw new Error(`${id}: substitutions must be an array.`);
  }

  const manifest = exercise.assetManifest || {};
  ['lottiePath', 'thumbnailPath', 'muscleMapFrontPath', 'muscleMapBackPath'].forEach((field) => {
    validateAssetPath(manifest[field], field, id);
  });
  if (!/^[A-Za-z0-9._:-]{6,160}$/.test(cleanString(manifest.assetHash))) {
    throw new Error(`${id}: assetManifest.assetHash is required and must be stable.`);
  }
  if (!Number.isInteger(manifest.assetVersion) || manifest.assetVersion < 1) {
    throw new Error(`${id}: assetManifest.assetVersion must be a positive integer.`);
  }

  return true;
}

function buildExerciseSeedPayload(exercise, now = new Date().toISOString(), adminUid = '') {
  validateExerciseSeed(exercise);
  void now;
  return {
    ...exercise,
    updatedBy: adminUid || 'dry-run',
    seededBy: 'seed-workout-exercise-catalog',
  };
}

function loadSeedFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

async function loadAdmin() {
  try {
    return require('firebase-admin');
  } catch (error) {
    return require(path.resolve(__dirname, '../functions/node_modules/firebase-admin'));
  }
}

function validateAdminUid(adminUid) {
  if (!/^[A-Za-z0-9_-]{6,128}$/.test(cleanString(adminUid))) {
    throw new Error('--admin-uid is required in --apply mode and must be a valid Firebase uid.');
  }
  return cleanString(adminUid);
}

async function assertSeedAdmin(db, adminUid) {
  const snap = await db.collection('admins').doc(adminUid).get();
  if (!snap.exists) {
    throw new Error(`Admin uid ${adminUid} was not found in /admins. Refusing to seed official workout content.`);
  }
}

async function main() {
  const options = parseArgs();
  const exercises = loadSeedFile(options.file);
  const adminUid = options.apply ? validateAdminUid(options.adminUid) : '';
  const payloads = exercises.map((exercise) => buildExerciseSeedPayload(exercise, new Date().toISOString(), adminUid));

  if (!options.apply) {
    console.log(`Validated ${payloads.length} workout exercise seed records. Use --apply to write to Firestore.`);
    console.log('Apply mode requires --admin-uid <uid> and verifies that uid exists in /admins.');
    payloads.forEach((exercise) => console.log(`- ${exercise.id}: ${exercise.name}`));
    return;
  }

  const admin = await loadAdmin();
  if (!admin.apps.length) {
    admin.initializeApp();
  }
  const db = admin.firestore();
  await assertSeedAdmin(db, adminUid);
  const batch = db.batch();
  payloads.forEach((exercise) => {
    batch.set(db.collection('exerciseCatalog').doc(exercise.id), {
      ...exercise,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: adminUid,
    }, { merge: true });
  });
  await batch.commit();
  console.log(`Seeded ${payloads.length} workout exercise records to exerciseCatalog as admin ${adminUid}.`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = {
  assertSeedAdmin,
  buildExerciseSeedPayload,
  parseArgs,
  validateExerciseSeed,
};

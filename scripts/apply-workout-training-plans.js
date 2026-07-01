const path = require('path');
const { loadTrainingPlans, parseArgs: parseValidationArgs } = require('./validate-workout-training-plans');

const DEFAULT_FILE = 'workout-training-plans-seed.json';

function cleanString(value) {
  return String(value || '').trim();
}

function parseArgs(argv = process.argv.slice(2)) {
  const validationOptions = parseValidationArgs(argv);
  const options = {
    apply: false,
    adminUid: '',
    file: validationOptions.file || path.resolve(__dirname, DEFAULT_FILE),
  };

  argv.forEach((arg, index) => {
    if (arg === '--apply') {
      options.apply = true;
    } else if (arg === '--admin-uid') {
      options.adminUid = cleanString(argv[index + 1]);
    } else if (arg.startsWith('--admin-uid=')) {
      options.adminUid = cleanString(arg.split('=').slice(1).join('='));
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

function trainingPlanPayload(plan) {
  return {
    id: plan.id,
    slug: plan.slug,
    name: plan.name,
    status: plan.status,
    source: plan.source,
    visibility: plan.visibility,
    version: plan.version,
    goal: plan.goal,
    level: plan.level,
    frequencyDaysPerWeek: plan.frequencyDaysPerWeek,
    durationWeeks: plan.durationWeeks,
    estimatedMinutesPerSession: plan.estimatedMinutesPerSession,
    equipment: plan.equipment,
    focusMuscles: plan.focusMuscles,
    tags: plan.tags,
    description: plan.description,
    attribution: plan.attribution,
    progression: plan.progression,
    schedule: plan.schedule,
  };
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
    throw new Error(`Admin uid ${adminUid} was not found in /admins. Refusing to apply workout training plans.`);
  }
}

async function main() {
  const options = parseArgs();
  const plans = loadTrainingPlans(options.file);
  const adminUid = options.apply ? validateAdminUid(options.adminUid) : '';

  if (!options.apply) {
    console.log(`Validated ${plans.length} official workout training plans. Use --apply to write to Firestore.`);
    console.log('Apply mode requires --admin-uid <uid> and verifies that uid exists in /admins.');
    plans.forEach((plan) => console.log(`- ${plan.id}: ${plan.goal}, ${plan.level}, ${plan.frequencyDaysPerWeek} days/week`));
    return;
  }

  const admin = await loadAdmin();
  if (!admin.apps.length) {
    admin.initializeApp();
  }

  const db = admin.firestore();
  await assertSeedAdmin(db, adminUid);
  const batch = db.batch();
  plans.forEach((plan) => {
    batch.set(db.collection('trainingPlans').doc(plan.id), {
      ...trainingPlanPayload(plan),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: adminUid,
    }, { merge: true });
  });
  await batch.commit();
  console.log(`Applied ${plans.length} workout training plans as admin ${adminUid}.`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = {
  parseArgs,
  trainingPlanPayload,
  validateAdminUid,
};

const path = require('path');
const fs = require('fs');
const { loadTrainingPlans, parseArgs: parseValidationArgs } = require('./validate-workout-training-plans');

const DEFAULT_FILE = 'workout-training-plans-seed.json';
const DEFAULT_PROJECT_ID = 'tribechallengetracker';
const FIREBASE_CLI_CONFIG = path.join(process.env.HOME || '', '.config/configstore/firebase-tools.json');
const FIREBASE_CLI_CLIENT_ID = process.env.FIREBASE_CLIENT_ID || '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com';
const FIREBASE_CLI_CLIENT_SECRET = process.env.FIREBASE_CLIENT_SECRET || 'j9iVZfS8kkCEFUPaAeJV0sAi';

function cleanString(value) {
  return String(value || '').trim();
}

function parseArgs(argv = process.argv.slice(2)) {
  const validationOptions = parseValidationArgs(argv);
  const options = {
    apply: false,
    adminUid: '',
    auth: 'admin',
    file: validationOptions.file || path.resolve(__dirname, DEFAULT_FILE),
    projectId: process.env.GCLOUD_PROJECT || process.env.FIREBASE_PROJECT || DEFAULT_PROJECT_ID,
  };

  argv.forEach((arg, index) => {
    if (arg === '--apply') {
      options.apply = true;
    } else if (arg === '--admin-uid') {
      options.adminUid = cleanString(argv[index + 1]);
    } else if (arg.startsWith('--admin-uid=')) {
      options.adminUid = cleanString(arg.split('=').slice(1).join('='));
    } else if (arg === '--auth') {
      options.auth = cleanString(argv[index + 1]) || 'admin';
    } else if (arg.startsWith('--auth=')) {
      options.auth = cleanString(arg.split('=').slice(1).join('=')) || 'admin';
    } else if (arg === '--project') {
      options.projectId = cleanString(argv[index + 1]) || DEFAULT_PROJECT_ID;
    } else if (arg.startsWith('--project=')) {
      options.projectId = cleanString(arg.split('=').slice(1).join('=')) || DEFAULT_PROJECT_ID;
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

function firestoreValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(firestoreValue) } };
  }
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (typeof value === 'object') {
    return {
      mapValue: {
        fields: Object.entries(value).reduce((fields, [key, entryValue]) => {
          fields[key] = firestoreValue(entryValue);
          return fields;
        }, {}),
      },
    };
  }
  return { stringValue: cleanString(value) };
}

function firestoreDocument(fields) {
  return {
    fields: Object.entries(fields).reduce((memo, [key, value]) => {
      memo[key] = firestoreValue(value);
      return memo;
    }, {}),
  };
}

async function refreshFirebaseCliAccessToken() {
  if (!fs.existsSync(FIREBASE_CLI_CONFIG)) {
    throw new Error('Firebase CLI credentials were not found. Run `firebase login` or use Application Default Credentials.');
  }
  const config = JSON.parse(fs.readFileSync(FIREBASE_CLI_CONFIG, 'utf8'));
  const refreshToken = config.tokens?.refresh_token;
  if (!refreshToken) {
    throw new Error('Firebase CLI refresh token was not found. Run `firebase login --reauth`.');
  }

  const body = new URLSearchParams({
    client_id: FIREBASE_CLI_CLIENT_ID,
    client_secret: FIREBASE_CLI_CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token) {
    throw new Error(`Firebase CLI token refresh failed: ${payload.error_description || payload.error || response.status}`);
  }
  return payload.access_token;
}

async function firebaseCliFetch(accessToken, url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const body = await response.text();
  const payload = body ? JSON.parse(body) : {};
  if (!response.ok) {
    throw new Error(`${options.method || 'GET'} ${url} failed (${response.status}): ${payload.error?.message || body}`);
  }
  return payload;
}

async function assertSeedAdminWithFirebaseCli({ accessToken, projectId, adminUid }) {
  const adminUrl = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/admins/${encodeURIComponent(adminUid)}`;
  await firebaseCliFetch(accessToken, adminUrl);
}

async function applyPlansWithFirebaseCliAuth({ adminUid, plans, projectId }) {
  const accessToken = await refreshFirebaseCliAccessToken();
  await assertSeedAdminWithFirebaseCli({ accessToken, projectId, adminUid });
  for (const plan of plans) {
    const documentUrl = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/trainingPlans/${encodeURIComponent(plan.id)}`;
    await firebaseCliFetch(accessToken, documentUrl, {
      method: 'PATCH',
      body: JSON.stringify(firestoreDocument({
        ...trainingPlanPayload(plan),
        updatedAt: new Date(),
        updatedBy: adminUid,
      })),
    });
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

  if (options.auth === 'firebase-cli') {
    await applyPlansWithFirebaseCliAuth({ adminUid, plans, projectId: options.projectId });
    console.log(`Applied ${plans.length} workout training plans as admin ${adminUid} using Firebase CLI auth.`);
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

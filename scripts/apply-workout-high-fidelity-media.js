const path = require('path');
const { loadMediaManifest, parseArgs: parseMediaArgs } = require('./validate-workout-high-fidelity-media');

const DEFAULT_FILE = 'workout-high-fidelity-media-poc.json';

function cleanString(value) {
  return String(value || '').trim();
}

function parseArgs(argv = process.argv.slice(2)) {
  const mediaOptions = parseMediaArgs(argv);
  const options = {
    apply: false,
    adminUid: '',
    file: mediaOptions.file || path.resolve(__dirname, DEFAULT_FILE),
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

function loadMediaApplyFile(filePath) {
  return loadMediaManifest(filePath, { requireReady: true });
}

function mediaManifestPayload(record) {
  return {
    preferredMotion: record.mediaManifest.preferredMotion,
    videoPath: record.mediaManifest.videoPath,
    posterPath: record.mediaManifest.posterPath,
    previewPath: record.mediaManifest.previewPath,
    styleVersion: record.mediaManifest.styleVersion,
    mediaVersion: record.mediaManifest.mediaVersion,
    mediaHash: record.mediaManifest.mediaHash,
    durationMs: record.mediaManifest.durationMs,
    frameRate: record.mediaManifest.frameRate,
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
    throw new Error(`Admin uid ${adminUid} was not found in /admins. Refusing to apply high-fidelity workout media.`);
  }
}

async function main() {
  const options = parseArgs();
  const records = loadMediaApplyFile(options.file);
  const adminUid = options.apply ? validateAdminUid(options.adminUid) : '';

  if (!options.apply) {
    console.log(`Validated ${records.length} release-ready high-fidelity workout media records. Use --apply to write to Firestore.`);
    console.log('Apply mode requires --admin-uid <uid> and verifies that uid exists in /admins.');
    records.forEach((record) => console.log(`- ${record.id}: ${record.mediaManifest.styleVersion}, ${record.mediaManifest.mediaHash}`));
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
      mediaManifest: mediaManifestPayload(record),
      mediaManifestUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
      mediaManifestUpdatedBy: adminUid,
    }, { merge: true });
  });
  await batch.commit();
  console.log(`Applied high-fidelity workout media for ${records.length} exercises as admin ${adminUid}.`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = {
  loadMediaApplyFile,
  mediaManifestPayload,
  parseArgs,
  validateAdminUid,
};

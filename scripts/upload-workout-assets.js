const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DEFAULT_MANIFEST = path.resolve(__dirname, 'workout-assets-manifest-batch-1.json');
const FIREBASE_CLI_CONFIG = path.join(process.env.HOME || '', '.config/configstore/firebase-tools.json');
const FIREBASE_CLI_CLIENT_ID = process.env.FIREBASE_CLIENT_ID || '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com';
const FIREBASE_CLI_CLIENT_SECRET = process.env.FIREBASE_CLIENT_SECRET || 'j9iVZfS8kkCEFUPaAeJV0sAi';

function cleanString(value) {
  return String(value || '').trim();
}

function parseArgs(argv = process.argv.slice(2)) {
  const options = {
    apply: false,
    auth: 'admin',
    bucket: '',
    manifest: DEFAULT_MANIFEST,
  };

  argv.forEach((arg, index) => {
    if (arg === '--apply') {
      options.apply = true;
    } else if (arg === '--bucket') {
      options.bucket = cleanString(argv[index + 1]);
    } else if (arg.startsWith('--bucket=')) {
      options.bucket = cleanString(arg.split('=').slice(1).join('='));
    } else if (arg === '--auth') {
      options.auth = cleanString(argv[index + 1]) || 'admin';
    } else if (arg.startsWith('--auth=')) {
      options.auth = cleanString(arg.split('=').slice(1).join('=')) || 'admin';
    } else if (arg === '--manifest') {
      options.manifest = path.resolve(process.cwd(), argv[index + 1]);
    } else if (arg.startsWith('--manifest=')) {
      options.manifest = path.resolve(process.cwd(), arg.split('=').slice(1).join('='));
    }
  });

  return options;
}

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function validateManifestEntry(entry, repoRoot) {
  const localPath = path.resolve(repoRoot, cleanString(entry.localPath));
  if (!fs.existsSync(localPath)) {
    throw new Error(`${entry.exerciseId}: missing local asset ${entry.localPath}`);
  }
  if (!/^workouts\/exercises\/v\d+\/[a-z0-9_]+\/.+/.test(cleanString(entry.storagePath))) {
    throw new Error(`${entry.exerciseId}: invalid storagePath ${entry.storagePath}`);
  }
  const actualHash = sha256(localPath);
  if (cleanString(entry.sha256) && cleanString(entry.sha256) !== actualHash) {
    throw new Error(`${entry.exerciseId}: sha256 mismatch for ${entry.localPath}`);
  }
  if (!cleanString(entry.contentType)) {
    throw new Error(`${entry.exerciseId}: contentType is required.`);
  }
  return { ...entry, localPath, sha256: actualHash };
}

function loadManifest(manifestPath, repoRoot = path.resolve(__dirname, '..')) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (!Array.isArray(manifest) || manifest.length === 0) {
    throw new Error('Asset manifest must be a non-empty array.');
  }
  return manifest.map(entry => validateManifestEntry(entry, repoRoot));
}

async function loadAdmin() {
  try {
    return require('firebase-admin');
  } catch (_) {
    return require(path.resolve(__dirname, '../functions/node_modules/firebase-admin'));
  }
}

async function uploadAssets({ bucket, manifest }) {
  const admin = await loadAdmin();
  if (!admin.apps.length) {
    admin.initializeApp(bucket ? { storageBucket: bucket } : undefined);
  }
  const storageBucket = bucket ? admin.storage().bucket(bucket) : admin.storage().bucket();

  await Promise.all(manifest.map(entry => storageBucket.upload(entry.localPath, {
    destination: entry.storagePath,
    metadata: {
      contentType: entry.contentType,
      metadata: {
        sha256: entry.sha256,
        exerciseId: entry.exerciseId,
      },
    },
  })));
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

function firebaseStorageMediaUrl(bucket, storagePath) {
  return `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucket)}/o/${encodeURIComponent(storagePath)}?alt=media`;
}

function multipartUploadBody(entry) {
  const boundary = `tribelog-workout-asset-${crypto.randomBytes(12).toString('hex')}`;
  const metadata = {
    name: entry.storagePath,
    contentType: entry.contentType,
    metadata: {
      sha256: entry.sha256,
      exerciseId: entry.exerciseId,
    },
  };
  const prefix = Buffer.from(
    `--${boundary}\r\n` +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    `${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: ${entry.contentType}\r\n\r\n`,
    'utf8',
  );
  const file = fs.readFileSync(entry.localPath);
  const suffix = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8');
  return {
    boundary,
    body: Buffer.concat([prefix, file, suffix]),
  };
}

async function uploadAssetWithFirebaseCliToken({ accessToken, bucket, entry }) {
  const { boundary, body } = multipartUploadBody(entry);
  const uploadUrl = `https://storage.googleapis.com/upload/storage/v1/b/${encodeURIComponent(bucket)}/o?uploadType=multipart&name=${encodeURIComponent(entry.storagePath)}`;
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
      'Content-Length': String(body.length),
    },
    body,
  });
  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(`${entry.storagePath}: upload failed (${response.status}) ${message}`);
  }
  return firebaseStorageMediaUrl(bucket, entry.storagePath);
}

async function uploadAssetsWithFirebaseCliAuth({ bucket, manifest }) {
  if (!bucket) {
    throw new Error('Firebase CLI auth upload requires --bucket <firebase-storage-bucket>.');
  }
  const accessToken = await refreshFirebaseCliAccessToken();
  for (const entry of manifest) {
    await uploadAssetWithFirebaseCliToken({ accessToken, bucket, entry });
  }
}

async function main() {
  const options = parseArgs();
  const repoRoot = path.resolve(__dirname, '..');
  const manifest = loadManifest(options.manifest, repoRoot);
  console.log(`Validated ${manifest.length} workout asset entries.`);
  manifest.forEach(entry => console.log(`- ${entry.storagePath} (${entry.contentType})`));

  if (!options.apply) {
    console.log('Dry run only. Use --apply --bucket <firebase-storage-bucket> to upload.');
    return;
  }
  if (options.auth === 'firebase-cli') {
    await uploadAssetsWithFirebaseCliAuth({ bucket: options.bucket, manifest });
  } else {
    await uploadAssets({ bucket: options.bucket, manifest });
  }
  console.log(`Uploaded ${manifest.length} workout assets.`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = {
  firebaseStorageMediaUrl,
  loadManifest,
  parseArgs,
  validateManifestEntry,
};

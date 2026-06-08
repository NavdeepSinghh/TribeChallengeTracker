const path = require("path");
const {
  assert,
  assertIncludes,
  exists,
  parseJson,
} = require("./verify-release-utils");

const TEAM_ID = "69JKTAE887";
const IOS_BUNDLE_ID = "com.risewiththetribe.challengetracker";
const ANDROID_PACKAGE = "com.risewiththetribe.challengetracker";
const DOMAIN = "risewiththetribe.app";

function verifyFirebaseHostingConfig(repoRoot) {
  const firebase = parseJson(path.join(repoRoot, "firebase.json"));
  assert(firebase.hosting?.public === "build", "Firebase Hosting must deploy the React build directory");
  const headers = JSON.stringify(firebase.hosting?.headers || []);
  assert(headers.includes("/.well-known/apple-app-site-association"), "AASA header is required");
  assert(headers.includes("/.well-known/assetlinks.json"), "assetlinks.json header is required");
  assert(headers.includes("application/json"), "well-known files must be served as application/json");
}

function verifyIosUniversalLinksArtifact(repoRoot) {
  const aasaPath = path.join(repoRoot, "public", ".well-known", "apple-app-site-association");
  const aasa = parseJson(aasaPath);
  const details = aasa.applinks?.details || [];
  const appIds = details.flatMap((detail) => detail.appIDs || []);
  assert(appIds.includes(`${TEAM_ID}.${IOS_BUNDLE_ID}`), "AASA must include the iOS Team ID and bundle ID");
  assert(JSON.stringify(aasa).includes("join"), "AASA must allow challenge invite query links");
}

function verifyAndroidAppLinksArtifact(repoRoot) {
  const examplePath = path.join(repoRoot, "public", ".well-known", "assetlinks.json.example");
  const example = parseJson(examplePath);
  assert(example[0]?.target?.package_name === ANDROID_PACKAGE, "assetlinks example must use the Android package name");

  const productionPath = path.join(repoRoot, "public", ".well-known", "assetlinks.json");
  if (exists(productionPath)) {
    const assetLinks = parseJson(productionPath);
    const fingerprints = assetLinks[0]?.target?.sha256_cert_fingerprints || [];
    assert(assetLinks[0]?.target?.package_name === ANDROID_PACKAGE, "assetlinks.json package name mismatch");
    assert(fingerprints.length > 0, "assetlinks.json must include at least one SHA-256 fingerprint");
    fingerprints.forEach((fingerprint) => {
      assert(
        /^([0-9A-F]{2}:){31}[0-9A-F]{2}$/.test(fingerprint),
        `invalid SHA-256 fingerprint: ${fingerprint}`
      );
    });
  }
}

function verifyIosDeepLinkHooks(iosRoot) {
  assertIncludes(path.join(iosRoot, "TribeChallenge", "Info.plist"), "tribechallenge");
  assertIncludes(path.join(iosRoot, "TribeChallenge", "TribeChallenge.entitlements"), `applinks:${DOMAIN}`);
  assertIncludes(path.join(iosRoot, "TribeChallenge", "Services", "DeepLinkRouter.swift"), DOMAIN);
  assertIncludes(path.join(iosRoot, "TribeChallenge", "Services", "DeepLinkRouter.swift"), "pendingInviteCode");
  assertIncludes(path.join(iosRoot, "TribeChallenge", "Views", "MainTabView.swift"), "selectedTab = 1");
  assertIncludes(path.join(iosRoot, "TribeChallenge", "Views", "ChallengesView.swift"), "consumePendingInvite");
}

function verifyAndroidDeepLinkHooks(androidRoot) {
  const manifestPath = path.join(androidRoot, "app", "src", "main", "AndroidManifest.xml");
  assertIncludes(manifestPath, `android:host="${DOMAIN}"`);
  assertIncludes(manifestPath, 'android:scheme="tribechallenge"');
  assertIncludes(manifestPath, 'android:autoVerify="true"');
  assertIncludes(path.join(androidRoot, "app", "src", "main", "java", "com", "risewiththetribe", "challengetracker", "MainActivity.kt"), 'getQueryParameter("join")');
}

module.exports = {
  verifyAndroidAppLinksArtifact,
  verifyAndroidDeepLinkHooks,
  verifyFirebaseHostingConfig,
  verifyIosDeepLinkHooks,
  verifyIosUniversalLinksArtifact,
};

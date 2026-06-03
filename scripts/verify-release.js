const fs = require("fs");
const path = require("path");

const TEAM_ID = "69JKTAE887";
const IOS_BUNDLE_ID = "com.risewiththetribe.challengetracker";
const ANDROID_PACKAGE = "com.risewiththetribe.challengetracker";
const DOMAIN = "risewiththetribe.app";

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function exists(filePath) {
  return fs.existsSync(filePath);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertIncludes(filePath, expected, label = expected) {
  const content = read(filePath);
  assert(content.includes(expected), `${filePath} is missing ${label}`);
}

function parseJson(filePath) {
  try {
    return JSON.parse(read(filePath));
  } catch (error) {
    throw new Error(`${filePath} must contain valid JSON: ${error.message}`);
  }
}

function verifyRelease(options = {}) {
  const repoRoot = options.repoRoot || path.resolve(__dirname, "..");
  const iosRoot = options.iosRoot || path.resolve(repoRoot, "..", "TribeChallengeTrackerIOS");
  const androidRoot = options.androidRoot || path.resolve(repoRoot, "..", "TribeChallengeTrackerAndroid");
  const failures = [];

  function check(name, fn) {
    try {
      fn();
    } catch (error) {
      failures.push(`${name}: ${error.message}`);
    }
  }

  check("feature documentation", () => {
    const docPath = path.join(repoRoot, "docs", "FEATURE_CATALOG.md");
    const storePath = path.join(repoRoot, "docs", "STORE_READINESS.md");
    assert(exists(docPath), "docs/FEATURE_CATALOG.md is required");
    assert(exists(storePath), "docs/STORE_READINESS.md is required");
    [
      "Authentication and Onboarding",
      "Home Dashboard",
      "Activity Logging",
      "Challenges",
      "Badges",
      "Leaderboard",
      "Profile Appearance",
      "Wearable Health Sync",
      "Progress Sharing",
      "Notifications",
      "Deep Links",
      "Release Safety",
    ].forEach((section) => assertIncludes(docPath, section));
    [
      "Android Google Play",
      "iOS App Store",
      "Web / Firebase Hosting",
      "Privacy and Data Safety",
      "Release Checklist",
    ].forEach((section) => assertIncludes(storePath, section));
  });

  check("shared parity ledger", () => {
    const parityPath = path.join(repoRoot, "FEATURE_PARITY.md");
    [
      "Daily log reminders",
      "Wearable health sync",
      "Progress sharing",
      "Challenge leaving",
      "Challenge invite flow",
      "Challenge invite deep links",
      "Challenge daily tracking",
      "Challenge badge stats",
    ].forEach((feature) => assertIncludes(parityPath, feature));
  });

  check("firebase hosting config", () => {
    const firebase = parseJson(path.join(repoRoot, "firebase.json"));
    assert(firebase.hosting?.public === "build", "Firebase Hosting must deploy the React build directory");
    const headers = JSON.stringify(firebase.hosting?.headers || []);
    assert(headers.includes("/.well-known/apple-app-site-association"), "AASA header is required");
    assert(headers.includes("/.well-known/assetlinks.json"), "assetlinks.json header is required");
    assert(headers.includes("application/json"), "well-known files must be served as application/json");
  });

  check("iOS universal links artifact", () => {
    const aasaPath = path.join(repoRoot, "public", ".well-known", "apple-app-site-association");
    const aasa = parseJson(aasaPath);
    const details = aasa.applinks?.details || [];
    const appIds = details.flatMap((detail) => detail.appIDs || []);
    assert(appIds.includes(`${TEAM_ID}.${IOS_BUNDLE_ID}`), "AASA must include the iOS Team ID and bundle ID");
    assert(JSON.stringify(aasa).includes("join"), "AASA must allow challenge invite query links");
  });

  check("Android app links artifact", () => {
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
  });

  check("iOS deep-link hooks", () => {
    assertIncludes(path.join(iosRoot, "TribeChallenge", "Info.plist"), "tribechallenge");
    assertIncludes(path.join(iosRoot, "TribeChallenge", "TribeChallenge.entitlements"), `applinks:${DOMAIN}`);
    assertIncludes(path.join(iosRoot, "TribeChallenge", "Services", "DeepLinkRouter.swift"), DOMAIN);
    assertIncludes(path.join(iosRoot, "TribeChallenge", "Services", "DeepLinkRouter.swift"), "pendingInviteCode");
    assertIncludes(path.join(iosRoot, "TribeChallenge", "Views", "MainTabView.swift"), "selectedTab = 1");
    assertIncludes(path.join(iosRoot, "TribeChallenge", "Views", "ChallengesView.swift"), "consumePendingInvite");
  });

  check("Android deep-link hooks", () => {
    const manifestPath = path.join(androidRoot, "app", "src", "main", "AndroidManifest.xml");
    assertIncludes(manifestPath, `android:host="${DOMAIN}"`);
    assertIncludes(manifestPath, 'android:scheme="tribechallenge"');
    assertIncludes(manifestPath, 'android:autoVerify="true"');
    assertIncludes(path.join(androidRoot, "app", "src", "main", "java", "com", "risewiththetribe", "challengetracker", "MainActivity.kt"), 'getQueryParameter("join")');
  });

  if (failures.length > 0) {
    throw new Error(`Release verification failed:\n- ${failures.join("\n- ")}`);
  }

  return true;
}

if (require.main === module) {
  try {
    verifyRelease();
    console.log("Release verification passed.");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = { verifyRelease };

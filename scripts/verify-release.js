const path = require("path");
const { verifyReleaseDocumentationContracts } = require("./verify-release-documentation-contracts");
const { verifyInstagramCampaignContracts } = require("./verify-instagram-campaign-contracts");
const { verifyMonetizationEngagementContracts } = require("./verify-monetization-engagement-contracts");
const {
  verifyAndroidAppLinksArtifact,
  verifyAndroidDeepLinkHooks,
  verifyFirebaseHostingConfig,
  verifyIosDeepLinkHooks,
  verifyIosUniversalLinksArtifact,
} = require("./verify-platform-link-contracts");
const { verifyStoreReadinessContracts } = require("./verify-store-readiness-contracts");

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
    verifyReleaseDocumentationContracts({ repoRoot });
  });

  check("shared monetization and engagement contracts", () => {
    verifyMonetizationEngagementContracts({ repoRoot, iosRoot, androidRoot });
  });

  check("store validation credential template", () => {
    verifyStoreReadinessContracts({ repoRoot });
  });

  check("instagram campaign content contracts", () => {
    verifyInstagramCampaignContracts({
      repoRoot,
      iosRoot,
      androidRoot,
    });
  });

  check("firebase hosting config", () => {
    verifyFirebaseHostingConfig(repoRoot);
  });

  check("iOS universal links artifact", () => {
    verifyIosUniversalLinksArtifact(repoRoot);
  });

  check("Android app links artifact", () => {
    verifyAndroidAppLinksArtifact(repoRoot);
  });

  check("iOS deep-link hooks", () => {
    verifyIosDeepLinkHooks(iosRoot);
  });

  check("Android deep-link hooks", () => {
    verifyAndroidDeepLinkHooks(androidRoot);
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

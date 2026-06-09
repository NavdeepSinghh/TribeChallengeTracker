const path = require("path");
const {
  androidProfileContractPaths,
  appShellModulePaths,
  assert,
  assertIncludes,
  assertMarkdownIncludes,
  challengeModulePaths,
  iosProfileContractPaths,
  profileModulePaths,
  read,
  readExistingFiles,
} = require("./verify-release-utils");
const { CROSS_PLATFORM_PROFILE_COPY_TOKENS } = require("./monetization-engagement-copy-contracts");
const { verifyWebSurfaceContracts } = require("./verify-web-surface-contracts");

function verifyRoadmapFeatureDocs({ parityPath, catalogPath, roadmapPath }) {
  [
    "Feature Submission Review Notes",
    "Account Deletion Decision Reply Kit",
    "Support Decision Reply Kit",
    "Entitlement Recovery Decision Reply Kit",
    "Store Test Evidence Decision Reply Kit",
    "Paid Launch Decision Reply Kit",
    "Creator Challenge Template Draft Kit",
    "Creator Payout Readiness Kit",
    "Creator Identity Verification Prep Kit",
    "Creator Moderation Readiness Kit",
    "Creator Paid Hosting Launch Gate Kit",
    "Creator Hosting Decision Reply Kit",
    "Partner Campaign Decision Reply Kit",
    "Referral Reward Decision Reply Kit",
    "Partner Perk Fulfillment Handoff Kit",
    "Partner Perk Handoff Audit Kit",
    "Partner Contract Readiness Kit",
    "Store Credential Setup Kit",
    "Subscription Management Guidance Kit",
    "Billing Support Escalation Kit",
    "Renewal Recovery Kit",
    "Cancellation Feedback Kit",
    "Lapsed Member Winback Kit",
    "Store Launch Dry-Run Kit",
    "Store Demo Account Kit",
    "Store Review Pack",
    "Community Event Interest Kit",
    "Community Highlight Roundup Kit",
    "UGC Consent Reminder Kit",
  ].forEach((feature) => {
    assertIncludes(parityPath, feature);
    assertMarkdownIncludes(catalogPath, feature);
    assertMarkdownIncludes(roadmapPath, feature);
  });
}

function verifyCrossPlatformProfileCopyContracts({
  webProfileContracts,
  iosProfileContracts,
  androidProfileContracts,
}) {
  CROSS_PLATFORM_PROFILE_COPY_TOKENS.forEach((token) => {
    assert(webProfileContracts.includes(token), `web profile contracts are missing ${token}`);
    assert(iosProfileContracts.includes(token), `iOS profile contract files are missing ${token}`);
    assert(androidProfileContracts.includes(token), `Android profile contract files are missing ${token}`);
  });
}

function verifyCampaignShareHelperContracts({ repoRoot, iosRoot, androidRoot }) {
  const webShareHelper = read(path.join(repoRoot, "src", "challenges", "challengeShare.js"));
  const iosShareContracts = [
    path.join(iosRoot, "TribeChallenge", "Models", "Challenge.swift"),
    path.join(iosRoot, "TribeChallenge", "Views", "ChallengeTrackerView.swift"),
    path.join(iosRoot, "TribeChallenge", "Views", "HomeView.swift"),
  ].map(read).join("\n");
  const androidShareContracts = read(path.join(
    androidRoot,
    "app",
    "src",
    "main",
    "java",
    "com",
    "risewiththetribe",
    "challengetracker",
    "ui",
    "TribeApp.kt"
  ));

  [
    "buildChallengeShareLink",
    "campaignShareText",
    "launchCardFileName",
    "launch-card-shared",
    "invite-shared",
    "campaign-copy-copied",
  ].forEach((token) => assert(webShareHelper.includes(token), `web campaign share helper is missing ${token}`));

  [
    "ChallengeShareHelper",
    "buildChallengeShareLink",
    "campaignShareText",
    "launchCardFileName",
    "UIActivityViewController",
    "UIPasteboard.general.string",
  ].forEach((token) => assert(iosShareContracts.includes(token), `iOS campaign share contracts are missing ${token}`));

  [
    "challengeInviteLink",
    "challengeCampaignShareText",
    "launchCardFileName",
    "shareChallengeLaunchCard",
    "Intent.ACTION_SEND",
    "ClipboardManager",
  ].forEach((token) => assert(androidShareContracts.includes(token), `Android campaign share contracts are missing ${token}`));
}

function verifyMonetizationEngagementContracts({ repoRoot, iosRoot, androidRoot }) {
  const parityPath = path.join(repoRoot, "FEATURE_PARITY.md");
  const catalogPath = path.join(repoRoot, "docs", "FEATURE_CATALOG.md");
  const roadmapPath = path.join(repoRoot, "docs", "MONETIZATION_ROADMAP.md");
  const webProfilePath = path.join(repoRoot, "src", "ProfileScreen.jsx");
  const webProfileModulePaths = profileModulePaths(repoRoot);
  const webAppShellModulePaths = appShellModulePaths(repoRoot);
  const webChallengeModulePaths = challengeModulePaths(repoRoot);
  const iosProfilePaths = iosProfileContractPaths(iosRoot);
  const androidProfilePaths = androidProfileContractPaths(androidRoot);
  const firestoreRulesPath = path.join(repoRoot, "firestore.rules");
  const purchaseEntitlementsPath = path.join(repoRoot, "functions", "purchaseEntitlements.js");
  const webProfileContracts = [
    webProfilePath,
    path.join(repoRoot, "src", "communityEvents.js"),
    ...webProfileModulePaths,
  ].map(read).join("\n");
  const iosProfileContracts = readExistingFiles(iosProfilePaths);
  const androidProfileContracts = readExistingFiles(androidProfilePaths);

  verifyWebSurfaceContracts({
    repoRoot,
    webProfileContracts,
    webAppShellModulePaths,
    webChallengeModulePaths,
  });
  verifyRoadmapFeatureDocs({ parityPath, catalogPath, roadmapPath });
  verifyCrossPlatformProfileCopyContracts({
    webProfileContracts,
    iosProfileContracts,
    androidProfileContracts,
  });
  verifyCampaignShareHelperContracts({ repoRoot, iosRoot, androidRoot });

  [
    "match /featureSubmissions/{submissionId}",
    "consentToFeature == true",
    'resource.data.status == "featured"',
    '["pending", "approved", "featured", "declined"]',
  ].forEach((token) => assertIncludes(firestoreRulesPath, token));

  [
    "validation_configured",
    "ready to call the provider",
    "sandbox/license-test purchases",
    "unsupported_platform",
  ].forEach((token) => assertIncludes(purchaseEntitlementsPath, token));
}

module.exports = { verifyMonetizationEngagementContracts };

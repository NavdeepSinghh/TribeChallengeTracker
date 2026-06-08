const path = require("path");
const {
  assert,
  exists,
  parseJson,
} = require("./verify-release-utils");
const {
  PARITY_TEST_FILES,
  parityTestCommand,
} = require("./parity-test-contracts");

function verifyRequiredStoreReadinessFiles(repoRoot) {
  const requiredPaths = [
    path.join(repoRoot, "functions", ".env.example"),
    path.join(repoRoot, "scripts", "write-monetization-release-audit.js"),
    path.join(repoRoot, "scripts", "monetization-release-audit-local-recheck-items.js"),
    path.join(repoRoot, "scripts", "check-store-launch-readiness.js"),
    path.join(repoRoot, "scripts", "verify-release-documentation-contracts.js"),
    path.join(repoRoot, "scripts", "store-readiness-release-contracts.js"),
    path.join(repoRoot, "scripts", "store-readiness-document-contracts.js"),
    path.join(repoRoot, "scripts", "store-readiness-document-token-groups.js"),
    path.join(repoRoot, "scripts", "store-readiness-core-document-tokens.js"),
    path.join(repoRoot, "scripts", "store-readiness-release-audit-document-tokens.js"),
    path.join(repoRoot, "scripts", "store-readiness-roadmap-document-tokens.js"),
    path.join(repoRoot, "scripts", "release-audit-script-document-tokens.js"),
    path.join(repoRoot, "scripts", "release-audit-output-document-tokens.js"),
    path.join(repoRoot, "scripts", "store-test-purchase-runbook-document-tokens.js"),
    path.join(repoRoot, "scripts", "verify-platform-link-contracts.js"),
    path.join(repoRoot, "scripts", "support-store-profile-copy-tokens.js"),
    path.join(repoRoot, "scripts", "creator-partner-profile-copy-tokens.js"),
    path.join(repoRoot, "scripts", "referral-community-profile-copy-tokens.js"),
    path.join(repoRoot, "src", "__tests__", "storeLaunchReadinessScript.test.js"),
    path.join(repoRoot, "src", "__tests__", "purchaseEntitlements.test.js"),
    path.join(repoRoot, "src", "__tests__", "purchaseValidationReadiness.test.js"),
    path.join(repoRoot, "src", "__tests__", "badgeCatalog.test.js"),
    path.join(repoRoot, "src", "__tests__", "badgeService.test.js"),
    path.join(repoRoot, "src", "__tests__", "badgeProgress.test.js"),
    path.join(repoRoot, "src", "__tests__", "challengeTemplates.test.js"),
    path.join(repoRoot, "src", "coreCampaignChallengeTemplates.js"),
    path.join(repoRoot, "src", "coreLongFormChallengeTemplates.js"),
    path.join(repoRoot, "src", "__tests__", "challengeShare.test.js"),
    path.join(repoRoot, "src", "__tests__", "creatorPartnerCopy.test.js"),
    path.join(repoRoot, "src", "__tests__", "engagementCopy.test.js"),
    path.join(repoRoot, "src", "__tests__", "monetizationModel.test.js"),
    path.join(repoRoot, "src", "__tests__", "monetizationPreLaunchCopy.test.js"),
    path.join(repoRoot, "src", "__tests__", "partnerMonetizationCopy.test.js"),
    path.join(repoRoot, "src", "__tests__", "partnerPerksProps.test.js"),
    path.join(repoRoot, "src", "__tests__", "profileShareCardSharing.test.js"),
    path.join(repoRoot, "src", "__tests__", "profileShareCards.test.js"),
    path.join(repoRoot, "src", "__tests__", "referralCopy.test.js"),
    path.join(repoRoot, "src", "__tests__", "referralRewardDecisionCopy.test.js"),
    path.join(repoRoot, "src", "__tests__", "referralRewardSocialProofCopy.test.js"),
    path.join(repoRoot, "src", "__tests__", "storeBillingSupportCopy.test.js"),
    path.join(repoRoot, "src", "__tests__", "storeLifecycleCopy.test.js"),
    path.join(repoRoot, "src", "__tests__", "supportBillingCopy.test.js"),
    path.join(repoRoot, "src", "__tests__", "weeklyCampaignDerivedData.test.js"),
    path.join(repoRoot, "src", "__tests__", "weeklyCampaignMarketingProps.test.js"),
    path.join(repoRoot, "src", "__tests__", "reactBuildTimeoutScript.test.js"),
    path.join(repoRoot, "src", "__tests__", "buildRuntimeGuard.test.js"),
    path.join(repoRoot, "src", "__tests__", "monetizationReleaseAuditScript.test.js"),
    path.join(repoRoot, "docs", "MONETIZATION_RELEASE_AUDIT.md"),
    path.join(repoRoot, "docs", "STORE_TEST_PURCHASE_RUNBOOK.md"),
  ];

  requiredPaths.forEach((filePath) => assert(exists(filePath), `${filePath} is required`));
  PARITY_TEST_FILES.forEach((fileName) => {
    const filePath = path.join(repoRoot, "src", "__tests__", fileName);
    assert(exists(filePath), `${filePath} is required`);
  });
}

function verifyReleaseScriptContracts(packageJson) {
  assert(packageJson.scripts?.["store:readiness"] === "node scripts/check-store-launch-readiness.js", "package.json must define store:readiness");
  assert(packageJson.scripts?.["test:store-readiness"] === "react-scripts test --runTestsByPath src/__tests__/storeLaunchReadinessScript.test.js --watchAll=false --runInBand", "package.json must define test:store-readiness");
  assert(packageJson.scripts?.["test:purchase-entitlements"] === "react-scripts test --runTestsByPath src/__tests__/purchaseEntitlements.test.js src/__tests__/purchaseValidationReadiness.test.js --watchAll=false --runInBand", "package.json must define test:purchase-entitlements");
  assert(packageJson.scripts?.["test:badges"] === "react-scripts test --runTestsByPath src/__tests__/badgeCatalog.test.js src/__tests__/badgeService.test.js src/__tests__/badgeProgress.test.js --watchAll=false --runInBand", "package.json must define test:badges");
  assert(packageJson.scripts?.["test:challenge-templates"] === "react-scripts test --runTestsByPath src/__tests__/challengeTemplates.test.js --watchAll=false --runInBand", "package.json must define test:challenge-templates");
  assert(packageJson.scripts?.["test:campaign-share"] === "react-scripts test --runTestsByPath src/__tests__/challengeShare.test.js --watchAll=false --runInBand", "package.json must define test:campaign-share");
  assert(packageJson.scripts?.["test:creator-partner-copy"] === "react-scripts test --runTestsByPath src/__tests__/creatorPartnerCopy.test.js src/__tests__/partnerMonetizationCopy.test.js --watchAll=false --runInBand", "package.json must define test:creator-partner-copy");
  assert(packageJson.scripts?.["test:engagement-copy"] === "react-scripts test --runTestsByPath src/__tests__/engagementCopy.test.js src/__tests__/monetizationPreLaunchCopy.test.js --watchAll=false --runInBand", "package.json must define test:engagement-copy");
  assert(packageJson.scripts?.["test:monetization-model"] === "react-scripts test --runTestsByPath src/__tests__/monetizationModel.test.js src/__tests__/partnerPerksProps.test.js --watchAll=false --runInBand", "package.json must define test:monetization-model");
  assert(packageJson.scripts?.["test:profile-share"] === "react-scripts test --runTestsByPath src/__tests__/profileShareCards.test.js src/__tests__/profileShareCardSharing.test.js --watchAll=false --runInBand", "package.json must define test:profile-share");
  assert(packageJson.scripts?.["test:referral-copy"] === "react-scripts test --runTestsByPath src/__tests__/referralCopy.test.js src/__tests__/referralRewardSocialProofCopy.test.js src/__tests__/referralRewardDecisionCopy.test.js --watchAll=false --runInBand", "package.json must define test:referral-copy");
  assert(packageJson.scripts?.["test:support-billing-copy"] === "react-scripts test --runTestsByPath src/__tests__/supportBillingCopy.test.js src/__tests__/storeBillingSupportCopy.test.js src/__tests__/storeLifecycleCopy.test.js --watchAll=false --runInBand", "package.json must define test:support-billing-copy");
  assert(packageJson.scripts?.["test:weekly-campaign"] === "react-scripts test --runTestsByPath src/__tests__/weeklyCampaignDerivedData.test.js src/__tests__/weeklyCampaignMarketingProps.test.js --watchAll=false --runInBand", "package.json must define test:weekly-campaign");
  assert(packageJson.scripts?.["test:build-wrapper"] === "react-scripts test --runTestsByPath src/__tests__/reactBuildTimeoutScript.test.js --watchAll=false --runInBand", "package.json must define test:build-wrapper");
  assert(packageJson.scripts?.["test:build-runtime"] === "react-scripts test --runTestsByPath src/__tests__/buildRuntimeGuard.test.js --watchAll=false --runInBand", "package.json must define test:build-runtime");
  assert(packageJson.scripts?.["test:release-audit"] === "react-scripts test --runTestsByPath src/__tests__/monetizationReleaseAuditScript.test.js --watchAll=false --runInBand", "package.json must define test:release-audit");
  assert(packageJson.scripts?.["test:parity"] === parityTestCommand(), "package.json must include every focused cross-platform parity suite in test:parity");
  assert(packageJson.scripts?.["test:release"] === "node scripts/verify-release.js && npm run test:store-readiness && npm run test:purchase-entitlements && npm run test:badges && npm run test:challenge-templates && npm run test:campaign-share && npm run test:profile-share && npm run test:weekly-campaign && npm run test:monetization-model && npm run test:engagement-copy && npm run test:referral-copy && npm run test:support-billing-copy && npm run test:creator-partner-copy && npm run test:build-wrapper && npm run test:build-runtime && npm run test:release-audit && npm run test:parity", "package.json must include store readiness, purchase-entitlements, badges, challenge-templates, campaign-share, profile-share, weekly-campaign, monetization-model, engagement-copy, referral-copy, support-billing-copy, creator-partner-copy, build-wrapper, build-runtime, and release-audit tests in test:release");
  assert(packageJson.scripts?.["release:audit"] === "node scripts/write-monetization-release-audit.js", "package.json must define release:audit");
  assert(packageJson.scripts?.["release:check:all:audit"] === "npm run release:check:all && npm run release:audit", "package.json must define release:check:all:audit");
  assert(packageJson.scripts?.["native:ios:build"]?.includes("generic/platform=iOS Simulator"), "native:ios:build must use the generic iOS Simulator destination");
  assert(packageJson.scripts?.["native:ios:build"]?.includes("/private/tmp/TribeChallengeDerivedData"), "native:ios:build must use tmp DerivedData");
  assert(packageJson.scripts?.["native:ios:build"]?.includes("/private/tmp/TribeChallengeSPM"), "native:ios:build must use tmp SwiftPM checkouts");
  assert(packageJson.scripts?.["native:android:build"]?.includes("./gradlew assembleDebug"), "native:android:build must assemble the Android debug build");
  assert(packageJson.scripts?.["release:check:all"] === "npm run release:check && npm run native:ios:build && npm run native:android:build", "release:check:all must compose web, iOS, and Android gates");
}

function verifyStoreReadinessReleaseContracts({ repoRoot }) {
  const packagePath = path.join(repoRoot, "package.json");
  verifyRequiredStoreReadinessFiles(repoRoot);
  verifyReleaseScriptContracts(parseJson(packagePath));
}

module.exports = { verifyStoreReadinessReleaseContracts };

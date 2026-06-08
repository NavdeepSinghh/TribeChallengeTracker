const path = require("path");
const {
  assert,
  assertIncludes,
  assertMarkdownIncludes,
  exists,
  parseJson,
  read,
} = require("./verify-release-utils");

function verifyFeatureDocumentationContracts({ repoRoot }) {
  const docPath = path.join(repoRoot, "docs", "FEATURE_CATALOG.md");
  const marketingStrategyPath = path.join(repoRoot, "docs", "MARKETING_CONTENT_STRATEGY.md");
  const storePath = path.join(repoRoot, "docs", "STORE_READINESS.md");
  const nvmrcPath = path.join(repoRoot, ".nvmrc");
  const packageJson = parseJson(path.join(repoRoot, "package.json"));

  assert(exists(docPath), "docs/FEATURE_CATALOG.md is required");
  assert(exists(marketingStrategyPath), "docs/MARKETING_CONTENT_STRATEGY.md is required");
  assert(exists(storePath), "docs/STORE_READINESS.md is required");
  assert(exists(nvmrcPath), ".nvmrc is required so the CRA production build runs on a supported LTS runtime");
  assert(exists(path.join(repoRoot, "scripts", "run-react-build-with-timeout.js")), "scripts/run-react-build-with-timeout.js is required");
  assert(read(nvmrcPath).trim() === "20", ".nvmrc must pin Node 20 for release builds");
  assert(packageJson.scripts?.prebuild === "node scripts/check-build-runtime.js", "npm build must run the Node runtime guard before react-scripts");
  assert(packageJson.scripts?.build === "node scripts/run-react-build-with-timeout.js", "npm build must run the bounded React build wrapper");
  assertMarkdownIncludes(storePath, "Node 24 has been observed to hang", "Node 24 build-runtime warning");
  assertMarkdownIncludes(storePath, "BUILD_IDLE_TIMEOUT_MS", "bounded build timeout guidance");

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
  ].forEach((section) => assertMarkdownIncludes(docPath, section));

  [
    "Android Google Play",
    "iOS App Store",
    "Web / Firebase Hosting",
    "Privacy and Data Safety",
    "Release Checklist",
  ].forEach((section) => assertMarkdownIncludes(storePath, section));

  [
    "Audience Lane Index",
    "Instagram Growth Loop Index",
    "docs/marketing-content-strategy/instagram-growth-loops.md",
    "Weekly Challenge Campaign",
    "Share Cards and Progress Proof",
    "Community Highlights",
    "Referral Prompts",
    "Creator and Admin Prompts",
    "Engagement and Retention Index",
    "docs/marketing-content-strategy/engagement-retention.md",
    "First 7 Days",
    "Comeback Flows",
    "Challenge Momentum",
    "Renewal Recovery and Cancellation Feedback",
    "Monetization Pathway Index",
    "docs/marketing-content-strategy/monetization-pathways.md",
    "Subscriptions",
    "Premium Challenges",
    "Coaching-Style Bundles",
    "Sponsor and Partner Offers",
    "Paid Community Tiers",
    "Merch and Event Tie-Ins",
    "Launch Phase Index",
    "docs/marketing-content-strategy/launch-phases.md",
    "Phase 1: Release Foundation",
    "Phase 3: Paid Value Validation",
    "Phase 4: Paid Launch",
    "Phase 5: Creator and Partner Expansion",
    "New Members",
    "Returning Members",
    "Community Contributors",
    "Creators, Coaches, and Partners",
    "Feature Me submissions",
    "Creator Hosting Application",
    "Partner Campaign Application",
  ].forEach((section) => assertMarkdownIncludes(marketingStrategyPath, section));
}

function verifySharedParityLedger({ repoRoot }) {
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
}

function verifyReleaseDocumentationContracts({ repoRoot }) {
  verifyFeatureDocumentationContracts({ repoRoot });
  verifySharedParityLedger({ repoRoot });
}

module.exports = {
  verifyFeatureDocumentationContracts,
  verifyReleaseDocumentationContracts,
  verifySharedParityLedger,
};

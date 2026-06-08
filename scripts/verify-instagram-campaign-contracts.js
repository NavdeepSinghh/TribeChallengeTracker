const path = require("path");
const {
  androidProfileContractPaths,
  assert,
  assertIncludes,
  assertMarkdownIncludes,
  iosProfileContractPaths,
  profileModulePaths,
  read,
  readExistingFiles,
} = require("./verify-release-utils");
const {
  INSTAGRAM_CAMPAIGN_FEATURE_TOKENS,
  INSTAGRAM_CONTENT_BANK_TOKEN_GROUPS,
} = require("./instagram-campaign-document-tokens");
const {
  INSTAGRAM_CAMPAIGN_PROFILE_CONTRACT_TOKENS,
} = require("./instagram-campaign-profile-contract-tokens");

function verifyInstagramCampaignContracts({
  repoRoot,
  iosRoot,
  androidRoot,
}) {
  const parityPath = path.join(repoRoot, "FEATURE_PARITY.md");
  const catalogPath = path.join(repoRoot, "docs", "FEATURE_CATALOG.md");
  const contentBankPath = path.join(repoRoot, "docs", "INSTAGRAM_CONTENT_BANK.md");
  const roadmapPath = path.join(repoRoot, "docs", "MONETIZATION_ROADMAP.md");
  const webProfilePath = path.join(repoRoot, "src", "ProfileScreen.jsx");
  const webProfileModulePaths = profileModulePaths(repoRoot);
  const webProfileSource = [
    webProfilePath,
    path.join(repoRoot, "src", "communityEvents.js"),
    ...webProfileModulePaths,
  ].map(read).join("\n");
  const iosProfileSource = readExistingFiles(iosProfileContractPaths(iosRoot));
  const androidProfileSource = readExistingFiles(androidProfileContractPaths(androidRoot));

  INSTAGRAM_CAMPAIGN_FEATURE_TOKENS.forEach((feature) => {
    assertIncludes(parityPath, feature);
    assertMarkdownIncludes(catalogPath, feature);
    assertMarkdownIncludes(roadmapPath, feature);
  });

  INSTAGRAM_CONTENT_BANK_TOKEN_GROUPS.flat().forEach((token) => {
    assertMarkdownIncludes(contentBankPath, token);
  });

  INSTAGRAM_CAMPAIGN_PROFILE_CONTRACT_TOKENS.forEach((token) => {
    assert(webProfileSource.includes(token), `web profile contracts are missing ${token}`);
    assert(iosProfileSource.includes(token), `iOS profile contract files are missing ${token}`);
    assert(androidProfileSource.includes(token), `Android profile contract files are missing ${token}`);
  });
}

module.exports = { verifyInstagramCampaignContracts };

const path = require("path");
const {
  assert,
  assertIncludes,
  exists,
  read,
} = require("./verify-release-utils");
const {
  WEB_APP_SHELL_TOKENS,
  WEB_CHALLENGE_SURFACE_TOKENS,
  WEB_DERIVED_DATA_TOKENS,
  WEB_PROFILE_MODULE_TOKENS,
  WEB_PROFILE_STATS_TOKENS,
} = require("./web-surface-contract-tokens");

function verifyWebSurfaceContracts({
  repoRoot,
  webProfileContracts,
  webAppShellModulePaths,
  webChallengeModulePaths,
}) {
  const webStatsBuilderPath = path.join(repoRoot, "src", "profile", "buildProfileScreenStats.js");
  const webStatsHelperPath = path.join(repoRoot, "src", "profile", "profileScreenActivityStats.js");
  const webStatsPresentationPath = path.join(repoRoot, "src", "profile", "profileScreenStatsPresentation.js");
  const webStatsResultPath = path.join(repoRoot, "src", "profile", "profileScreenStatsResult.js");
  const webDerivedDataPath = path.join(repoRoot, "src", "profile", "profileScreenDerivedData.js");
  const webDerivedDataBundleInputsPath = path.join(repoRoot, "src", "profile", "profileScreenBundleInputs.js");
  const webDerivedDataMonetizationInputsPath = path.join(repoRoot, "src", "profile", "profileScreenMonetizationCampaignInputs.js");
  const webMonetizationCampaignDerivedDataPath = path.join(repoRoot, "src", "profile", "profileMonetizationCampaignDerivedData.js");
  const webWeeklyCampaignDerivedDataPath = path.join(repoRoot, "src", "profile", "profileWeeklyCampaignDerivedData.js");
  const webScreenStatePath = path.join(repoRoot, "src", "profile", "useProfileScreenState.js");
  const webShareActionsPath = path.join(repoRoot, "src", "profile", "useProfileShareActions.js");

  [
    webStatsBuilderPath,
    webStatsHelperPath,
    webStatsPresentationPath,
    webStatsResultPath,
    webDerivedDataPath,
    webDerivedDataBundleInputsPath,
    webDerivedDataMonetizationInputsPath,
    webMonetizationCampaignDerivedDataPath,
    webWeeklyCampaignDerivedDataPath,
    webScreenStatePath,
    webShareActionsPath,
    ...webAppShellModulePaths,
    ...webChallengeModulePaths,
  ].forEach((filePath) => assert(exists(filePath), `${filePath} is required`));

  const webDerivedDataContracts = [
    webDerivedDataPath,
    webDerivedDataBundleInputsPath,
    webDerivedDataMonetizationInputsPath,
    webMonetizationCampaignDerivedDataPath,
    webWeeklyCampaignDerivedDataPath,
  ].map(read).join("\n");

  WEB_DERIVED_DATA_TOKENS.forEach((token) => {
    assert(webDerivedDataContracts.includes(token), `web derived-data contracts are missing ${token}`);
  });

  WEB_PROFILE_MODULE_TOKENS.forEach((token) => {
    assert(webProfileContracts.includes(token), `web profile modules are missing ${token}`);
  });

  const webStatsContracts = [
    webStatsBuilderPath,
    webStatsHelperPath,
    webStatsPresentationPath,
    webStatsResultPath,
  ].map(read).join("\n");

  WEB_PROFILE_STATS_TOKENS.forEach((token) => {
    assert(webStatsContracts.includes(token), `web profile stats contracts are missing ${token}`);
  });

  WEB_APP_SHELL_TOKENS.forEach((token) => {
    assert(webAppShellModulePaths.some((filePath) => read(filePath).includes(token)), `App shell modules are missing ${token}`);
  });

  WEB_CHALLENGE_SURFACE_TOKENS.forEach((token) => {
    assert(webChallengeModulePaths.some((filePath) => read(filePath).includes(token)), `Challenge modules are missing ${token}`);
  });
}

module.exports = { verifyWebSurfaceContracts };

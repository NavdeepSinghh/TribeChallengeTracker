const fs = require("fs");
const path = require("path");

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function readMarkdownWithIncludes(filePath, seen = new Set()) {
  const absolutePath = path.resolve(filePath);
  if (seen.has(absolutePath)) {
    throw new Error(`Markdown include cycle detected at ${absolutePath}`);
  }
  seen.add(absolutePath);
  const content = read(absolutePath);
  const resolved = content.replace(/^<!-- include: (.+) -->$/gm, (_match, includePath) => {
    const nextPath = path.resolve(path.dirname(absolutePath), includePath.trim());
    return readMarkdownWithIncludes(nextPath, seen).trimEnd();
  });
  seen.delete(absolutePath);
  return resolved;
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

function assertMarkdownIncludes(filePath, expected, label = expected) {
  const content = readMarkdownWithIncludes(filePath);
  assert(content.includes(expected), `${filePath} is missing ${label}`);
}

function readExistingFiles(filePaths) {
  return filePaths.filter(exists).map(read).join("\n");
}

function readJsModulePaths(rootPath) {
  return fs.readdirSync(rootPath)
    .filter(fileName => /\.(jsx|js)$/.test(fileName))
    .sort()
    .map(fileName => path.join(rootPath, fileName));
}

function profileModulePaths(repoRoot) {
  return readJsModulePaths(path.join(repoRoot, "src", "profile"));
}

function appShellModulePaths(repoRoot) {
  return readJsModulePaths(path.join(repoRoot, "src", "app"));
}

function challengeModulePaths(repoRoot) {
  return [
    ...readJsModulePaths(path.join(repoRoot, "src", "challenges")),
    ...readJsModulePaths(path.join(repoRoot, "src", "challengeTracker")),
  ];
}

function iosProfileContractPaths(iosRoot) {
  const viewsRoot = path.join(iosRoot, "TribeChallenge", "Views");
  return [
    path.join(viewsRoot, "ProfileView.swift"),
    path.join(viewsRoot, "ProfileCopyModels.swift"),
    path.join(viewsRoot, "PartnerPerkAdminReviewSection.swift"),
    path.join(viewsRoot, "WeeklyCampaignCopyKitCard.swift"),
    path.join(viewsRoot, "CreatorLaunchKitSection.swift"),
    path.join(viewsRoot, "CreatorHostingApplicationReviewRow.swift"),
    path.join(viewsRoot, "CreatorHostingApplicationSection.swift"),
    path.join(viewsRoot, "CreatorProfileFormSection.swift"),
    path.join(viewsRoot, "CreatorProfileOverviewSection.swift"),
    path.join(viewsRoot, "CreatorPlanningCopyKits.swift"),
    path.join(viewsRoot, "CreatorPlanningCopyKitsSection.swift"),
  ];
}

function androidProfileContractPaths(androidRoot) {
  const uiRoot = path.join(androidRoot, "app", "src", "main", "java", "com", "risewiththetribe", "challengetracker", "ui");
  return [
    path.join(uiRoot, "TribeApp.kt"),
    path.join(uiRoot, "ProfileCopyModels.kt"),
    path.join(uiRoot, "PartnerPerkAdminReviewSection.kt"),
    path.join(uiRoot, "WeeklyCampaignCopyKitCard.kt"),
    path.join(uiRoot, "WeeklyCampaignCopyKits.kt"),
    path.join(uiRoot, "CreatorLaunchKitSection.kt"),
    path.join(uiRoot, "CreatorHostingApplicationReviewRow.kt"),
    path.join(uiRoot, "CreatorHostingApplicationSection.kt"),
    path.join(uiRoot, "CreatorProfileFormSection.kt"),
    path.join(uiRoot, "CreatorProfileOverviewSection.kt"),
    path.join(uiRoot, "CreatorPlanningCopyKits.kt"),
    path.join(uiRoot, "CreatorPlanningCopyKitsSection.kt"),
  ];
}

function parseJson(filePath) {
  try {
    return JSON.parse(read(filePath));
  } catch (error) {
    throw new Error(`${filePath} must contain valid JSON: ${error.message}`);
  }
}

module.exports = {
  androidProfileContractPaths,
  appShellModulePaths,
  assert,
  assertIncludes,
  assertMarkdownIncludes,
  challengeModulePaths,
  exists,
  iosProfileContractPaths,
  parseJson,
  profileModulePaths,
  read,
  readExistingFiles,
  readMarkdownWithIncludes,
};

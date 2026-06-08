const path = require("path");
const {
  assert,
  assertIncludes,
  assertMarkdownIncludes,
  readExistingFiles,
} = require("./verify-release-utils");
const {
  ENV_TEMPLATE_TOKENS,
  FEATURE_CATALOG_TOKENS,
  RELEASE_AUDIT_DOC_TOKENS,
  RELEASE_AUDIT_SCRIPT_TOKENS,
  ROADMAP_TOKENS,
  STORE_READINESS_DOC_TOKENS,
  STORE_READINESS_SCRIPT_TOKENS,
  STORE_READINESS_TEST_TOKENS,
  STORE_TEST_PURCHASE_RUNBOOK_TOKENS,
} = require("./store-readiness-document-token-groups");

function verifyStoreReadinessDocumentContracts({ repoRoot }) {
  const envExamplePath = path.join(repoRoot, "functions", ".env.example");
  const storeReadinessPath = path.join(repoRoot, "docs", "STORE_READINESS.md");
  const roadmapPath = path.join(repoRoot, "docs", "MONETIZATION_ROADMAP.md");
  const catalogPath = path.join(repoRoot, "docs", "FEATURE_CATALOG.md");
  const releaseAuditPath = path.join(repoRoot, "docs", "MONETIZATION_RELEASE_AUDIT.md");
  const storeTestPurchaseRunbookPath = path.join(repoRoot, "docs", "STORE_TEST_PURCHASE_RUNBOOK.md");
  const storeReadinessScriptPath = path.join(repoRoot, "scripts", "check-store-launch-readiness.js");
  const storeReadinessTestPath = path.join(repoRoot, "src", "__tests__", "storeLaunchReadinessScript.test.js");
  const releaseAuditScriptPath = path.join(repoRoot, "scripts", "write-monetization-release-audit.js");
  const releaseAuditSourcePaths = [
    releaseAuditScriptPath,
    path.join(repoRoot, "scripts", "monetization-release-audit-local-recheck-items.js"),
  ];
  const releaseAuditSource = readExistingFiles(releaseAuditSourcePaths);

  ENV_TEMPLATE_TOKENS.forEach((token) => assertIncludes(envExamplePath, token));
  STORE_READINESS_DOC_TOKENS.forEach((token) => assertMarkdownIncludes(storeReadinessPath, token));
  STORE_READINESS_SCRIPT_TOKENS.forEach((token) => assertIncludes(storeReadinessScriptPath, token));
  STORE_READINESS_TEST_TOKENS.forEach((token) => assertIncludes(storeReadinessTestPath, token));
  RELEASE_AUDIT_SCRIPT_TOKENS.forEach((token) => {
    assert(releaseAuditSource.includes(token), `release audit generator sources are missing ${token}`);
  });
  STORE_TEST_PURCHASE_RUNBOOK_TOKENS.forEach((token) => assertIncludes(storeTestPurchaseRunbookPath, token));
  RELEASE_AUDIT_DOC_TOKENS.forEach((token) => assertIncludes(releaseAuditPath, token));
  ROADMAP_TOKENS.forEach((token) => assertMarkdownIncludes(roadmapPath, token));
  FEATURE_CATALOG_TOKENS.forEach((token) => assertMarkdownIncludes(catalogPath, token));
}

module.exports = { verifyStoreReadinessDocumentContracts };

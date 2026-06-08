const { verifyStoreReadinessDocumentContracts } = require("./store-readiness-document-contracts");
const { verifyStoreReadinessReleaseContracts } = require("./store-readiness-release-contracts");

function verifyStoreReadinessContracts({ repoRoot }) {
  verifyStoreReadinessReleaseContracts({ repoRoot });
  verifyStoreReadinessDocumentContracts({ repoRoot });
}

module.exports = { verifyStoreReadinessContracts };

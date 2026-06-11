const ENV_TEMPLATE_TOKENS = [
  "APP_STORE_ISSUER_ID",
  "APP_STORE_KEY_ID",
  "APP_STORE_PRIVATE_KEY",
  "APP_STORE_BUNDLE_ID=com.risewiththetribe.challengetracker",
  "PLAY_DEVELOPER_SERVICE_ACCOUNT_JSON",
  "PLAY_PACKAGE_NAME=com.risewiththetribe.challengetracker",
  "REPLACE_WITH_APP_STORE_CONNECT_PRIVATE_KEY",
  "REPLACE_WITH_PLAY_SERVICE_ACCOUNT_PRIVATE_KEY",
  "Do not commit real secrets",
];

const STORE_READINESS_DOC_TOKENS = [
  "functions/.env.example",
  "Keep real service account JSON and private keys outside git",
  "Keep real App Store Connect private keys outside git",
  "npm run release:check:all:audit",
  "docs/MONETIZATION_RELEASE_AUDIT.md",
  "docs/STORE_TEST_PURCHASE_RUNBOOK.md",
  "docs/store-readiness/android-google-play.md",
  "Android Google Play Index",
  "docs/store-readiness/ios-app-store.md",
  "iOS App Store Index",
  "npm run store:readiness",
  "Store Product Parity Guard",
  "campaign-share",
  "build-wrapper",
  "build-runtime guard",
  "release-audit generator",
  "purchase-entitlements",
  "badges",
  "challenge-templates",
  "validation_configured",
];

const STORE_READINESS_SCRIPT_TOKENS = [
  "Store launch readiness",
  "Required external evidence",
  "Missing or placeholder config keys",
  "Missing config keys",
  "Placeholder config keys",
  "PRODUCT_CATALOG",
  "getValidationReadiness",
  "--strict",
  "--json",
  "credentials_missing_or_placeholder",
  "Store Test Purchase Evidence Log",
  "Not ready for paid launch review",
];

const STORE_READINESS_TEST_TOKENS = [
  "check-store-launch-readiness.js",
  "storeProductParity.test.js",
  "verifyStoreProductParity",
  "--strict",
  "--json",
  "credentials_missing_or_placeholder",
  "placeholderConfigKeys",
  "missingConfigKeysOnly",
  "credentials_configured",
  "external evidence matrix",
];

module.exports = {
  ENV_TEMPLATE_TOKENS,
  STORE_READINESS_DOC_TOKENS,
  STORE_READINESS_SCRIPT_TOKENS,
  STORE_READINESS_TEST_TOKENS,
};

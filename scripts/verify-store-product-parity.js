const fs = require('fs');
const path = require('path');
const { PRODUCT_CATALOG } = require('../functions/purchaseEntitlements');
const { STORE_PRODUCTS } = require('../src/proFeatures');

const repoRoot = path.resolve(__dirname, '..');
const iosRoot = path.resolve(repoRoot, '../TribeChallengeTrackerIOS');
const androidRoot = path.resolve(repoRoot, '../TribeChallengeTrackerAndroid');

function productMetadataFromBackend() {
  return Object.entries(PRODUCT_CATALOG).map(([productId, product]) => ({
    productId,
    kind: product.kind,
    entitlement: product.entitlement,
    cadence: product.cadence || '',
    packId: product.packId || '',
  }));
}

function productMetadataFromWeb() {
  return Object.values(STORE_PRODUCTS).map((product) => ({
    productId: product.id,
    kind: product.kind,
    entitlement: product.entitlement,
    cadence: product.cadence || '',
    packId: product.packId || '',
  }));
}

function valueFromBlock(block, fieldName) {
  const match = block.match(new RegExp(`${fieldName}\\s*[:=]\\s*"?([A-Za-z0-9_]+|nil)"?`));
  const value = match?.[1] || '';
  return value === 'nil' ? '' : value;
}

function extractProductBlocks(source) {
  const blocks = [];
  const regex = /(?:static let|val)\s+(\w+)\s*=\s*StoreProduct\(([\s\S]*?)\n\s*\)/g;
  let match;
  while ((match = regex.exec(source)) !== null) {
    blocks.push({ symbol: match[1], block: match[2] });
  }
  return blocks;
}

function extractProductMetadataFromBlock({ symbol, block }) {
  const productId = (block.match(/id\s*[:=]\s*"([^"]+)"/) || [])[1] || '';
  if (!productId) return null;
  return {
    symbol,
    productId,
    kind: block.includes('challengePack') || block.includes('ChallengePack') ? 'challengePack' : 'subscription',
    entitlement: (block.match(/entitlement\s*[:=]\s*"([^"]+)"/) || [])[1] || '',
    cadence: valueFromBlock(block, 'cadence'),
    packId: valueFromBlock(block, 'packId'),
  };
}

function productMetadataFromNative(filePath, expectedProducts) {
  const source = fs.readFileSync(filePath, 'utf8');
  const nativeProducts = extractProductBlocks(source)
    .map(extractProductMetadataFromBlock)
    .filter(Boolean);
  const expectedProductIds = new Set(expectedProducts.map((product) => product.productId));
  return nativeProducts.filter((product) => expectedProductIds.has(product.productId));
}

function normalize(products) {
  return products
    .map((product) => ({
      productId: product.productId,
      kind: product.kind,
      entitlement: product.entitlement,
      cadence: product.cadence || '',
      packId: product.packId || '',
    }))
    .sort((a, b) => a.productId.localeCompare(b.productId));
}

function compareProductSets(expected, actual, label) {
  const expectedJson = JSON.stringify(normalize(expected));
  const actualJson = JSON.stringify(normalize(actual));
  if (expectedJson !== actualJson) {
    return [`${label} product catalog does not match backend PRODUCT_CATALOG.`, { expected: normalize(expected), actual: normalize(actual) }];
  }
  return null;
}

function verifyStoreProductParity() {
  const backendProducts = productMetadataFromBackend();
  const webProducts = productMetadataFromWeb();
  const iosProducts = productMetadataFromNative(
    path.join(iosRoot, 'TribeChallenge/Models/UserProfile.swift'),
    backendProducts,
  );
  const androidProducts = productMetadataFromNative(
    path.join(androidRoot, 'app/src/main/java/com/risewiththetribe/challengetracker/model/Models.kt'),
    backendProducts,
  );
  const androidBillingSource = fs.readFileSync(
    path.join(androidRoot, 'app/src/main/java/com/risewiththetribe/challengetracker/data/PlayBillingService.kt'),
    'utf8',
  );
  const failures = [
    compareProductSets(backendProducts, webProducts, 'Web'),
    compareProductSets(backendProducts, iosProducts, 'iOS'),
    compareProductSets(backendProducts, androidProducts, 'Android'),
  ].filter(Boolean);

  androidProducts.forEach((product) => {
    if (product.kind === 'challengePack' && !androidBillingSource.includes(`StoreProducts.${product.symbol}.id`)) {
      failures.push([`Android PlayBillingService does not query ${product.productId}.`, {}]);
    }
  });

  return {
    ok: failures.length === 0,
    productCount: backendProducts.length,
    products: normalize(backendProducts),
    failures,
  };
}

if (require.main === module) {
  const result = verifyStoreProductParity();
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Store product parity: ${result.ok ? 'ok' : 'failed'}`);
    console.log(`Products checked: ${result.productCount}`);
    result.products.forEach((product) => {
      const detail = product.packId ? `pack=${product.packId}` : `cadence=${product.cadence}`;
      console.log(`- ${product.productId} (${product.kind}; ${product.entitlement}; ${detail})`);
    });
    result.failures.forEach(([message]) => console.error(message));
  }
  process.exit(result.ok ? 0 : 1);
}

module.exports = {
  verifyStoreProductParity,
};

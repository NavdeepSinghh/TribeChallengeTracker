const { onCall, HttpsError } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const {
  PRODUCT_CATALOG,
  buildEntitlementData,
  buildPurchaseRecord,
  getValidationReadiness,
  hashForAudit,
  purchaseRecordId,
} = require('./purchaseEntitlements');
const { validateStorePurchase } = require('./storeValidation');

admin.initializeApp();

exports.verifyPurchase = onCall({ region: 'us-central1' }, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError('unauthenticated', 'Sign in is required to verify purchases.');
  }

  const { platform, productId, transactionId, purchaseToken, environment } = request.data || {};
  const product = PRODUCT_CATALOG[productId];
  if (!product) {
    throw new HttpsError('invalid-argument', 'Unknown product id.');
  }
  if (!product.platformTypes.includes(platform)) {
    throw new HttpsError('invalid-argument', 'Product is not available on this platform.');
  }
  if (!transactionId && !purchaseToken) {
    throw new HttpsError('invalid-argument', 'A transaction id or purchase token is required.');
  }

  const {
    validationConfig,
    missingConfigKeys,
    validationConfigured,
    status,
    message,
    nextAction,
  } = getValidationReadiness(platform);

  const validationResult = validationConfigured
    ? await validateStorePurchase({
      platform,
      product,
      productId,
      transactionId: transactionId || '',
      purchaseToken: purchaseToken || '',
      environment: environment || 'production',
    })
    : {
      verified: false,
      status,
      message,
    };
  await admin.firestore().collection('purchaseVerificationAttempts').add({
    uid,
    platform,
    productId,
    productKind: product.kind,
    entitlement: product.entitlement,
    packId: product.packId || '',
    cadence: product.cadence || '',
    transactionId: transactionId || '',
    purchaseTokenHash: purchaseToken ? hashForAudit(purchaseToken) : '',
    environment: environment || 'production',
    status: validationResult.status || status,
    validationConfigured,
    missingConfigKeys,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  if (!validationResult.verified) {
    return {
      verified: false,
      entitlementUpdated: false,
      status: validationResult.status || status,
      reason: validationResult.status || status,
      message: validationResult.message || message,
      productId,
      productKind: product.kind,
      entitlement: product.entitlement,
      packId: product.packId || '',
      validationConfigured,
      missingConfigKeys,
      requiredConfigKeys: validationConfig?.requiredKeys || [],
      nextAction: validationConfigured ? 'Review store validation response and product setup.' : nextAction,
    };
  }

  await applyVerifiedEntitlement({
    uid,
    platform,
    product,
    productId,
    transactionId: transactionId || '',
    purchaseToken: purchaseToken || '',
    environment: environment || 'production',
    validationResult,
  });

  return {
    verified: true,
    entitlementUpdated: true,
    status: 'verified',
    reason: 'verified',
    message: validationResult.message || 'Purchase verified.',
    productId,
    productKind: product.kind,
    entitlement: product.entitlement,
    packId: product.packId || '',
    validationConfigured,
    missingConfigKeys,
    requiredConfigKeys: validationConfig?.requiredKeys || [],
    nextAction: 'Refresh profile and entitlements on the client.',
  };
});

exports.getPurchaseValidationReadiness = onCall({ region: 'us-central1' }, async (request) => {
  if (!request.auth?.uid) {
    throw new HttpsError('unauthenticated', 'Sign in is required to inspect purchase validation readiness.');
  }

  const platforms = ['ios', 'android'];
  return {
    status: 'readiness_checked',
    message: 'Purchase validation readiness checked. No entitlements were changed.',
    platforms: platforms.reduce((result, platform) => {
      const {
        validationConfig,
        missingConfigKeys,
        validationConfigured,
        status,
        message,
        nextAction,
      } = getValidationReadiness(platform);
      result[platform] = {
        validationConfigured,
        status,
        message,
        nextAction,
        missingConfigKeys,
        requiredConfigKeys: validationConfig?.requiredKeys || [],
      };
      return result;
    }, {}),
  };
});

async function applyVerifiedEntitlement({
  uid,
  platform,
  product,
  productId,
  transactionId,
  purchaseToken,
  environment,
  validationResult,
}) {
  const now = admin.firestore.FieldValue.serverTimestamp();
  const firestore = admin.firestore();
  const userRef = firestore.collection('users').doc(uid);
  const purchaseRef = firestore.collection('purchaseEntitlements').doc(purchaseRecordId({
    platform,
    productId,
    transactionId,
    purchaseToken,
  }));

  await firestore.runTransaction(async (transaction) => {
    const existingPurchase = await transaction.get(purchaseRef);
    if (existingPurchase.exists && existingPurchase.data()?.uid !== uid) {
      throw new HttpsError('failed-precondition', 'Purchase is already linked to another account.');
    }

    transaction.set(userRef, buildEntitlementData({
      product,
      productId,
      platform,
      transactionId,
      validationResult,
      now,
    }), { merge: true });

    transaction.set(purchaseRef, buildPurchaseRecord({
      uid,
      platform,
      product,
      productId,
      transactionId,
      purchaseToken,
      environment,
      status: 'verified',
      validationConfigured: true,
      missingConfigKeys: [],
      now,
    }), { merge: true });
  });
}

const { HttpsError } = require('firebase-functions/v2/https');
const {
  buildEntitlementData,
  buildPurchaseRecord,
  hashForAudit,
  purchaseRecordId,
} = require('./purchaseEntitlements');

async function recordPurchaseVerificationAttempt({
  admin,
  uid,
  platform,
  product,
  productId,
  transactionId,
  purchaseToken,
  environment,
  validationResult,
  validationConfigured,
  missingConfigKeys,
  fallbackStatus,
}) {
  await admin.firestore().collection('purchaseVerificationAttempts').add({
    uid,
    platform,
    productId,
    productKind: product.kind,
    entitlement: product.entitlement,
    packId: product.packId || '',
    cadence: product.cadence || '',
    transactionId,
    purchaseTokenHash: purchaseToken ? hashForAudit(purchaseToken) : '',
    environment,
    status: validationResult.status || fallbackStatus,
    validationConfigured,
    missingConfigKeys,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

async function applyVerifiedEntitlement({
  admin,
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

module.exports = {
  applyVerifiedEntitlement,
  recordPurchaseVerificationAttempt,
};

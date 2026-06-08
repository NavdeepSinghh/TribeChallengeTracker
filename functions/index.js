const { onCall } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const {
  handlePurchaseValidationReadinessRequest,
  handleVerifyPurchaseRequest,
} = require('./purchaseCallableHandlers');

admin.initializeApp();

const storeLaunchCallableContract = {
  validationConfigured: 'validationConfigured',
  readinessMessage: 'No entitlements were changed',
};

exports.verifyPurchase = onCall({ region: 'us-central1' }, async (request) => {
  return handleVerifyPurchaseRequest({ admin, request });
});

exports.getPurchaseValidationReadiness = onCall({ region: 'us-central1' }, async (request) => {
  return handlePurchaseValidationReadinessRequest({ request });
});

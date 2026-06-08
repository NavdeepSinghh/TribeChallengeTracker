const { readJsonResponse, validationFailure } = require('./storeValidationHttp');
const { createJwt, decodeJwtPayload } = require('./storeValidationJwt');

async function validateApplePurchase({ productId, transactionId, environment, env }) {
  const token = createAppleServerJwt(env);
  const host = environment === 'sandbox'
    ? 'https://api.storekit-sandbox.apple.com'
    : 'https://api.storekit.apple.com';
  const response = await fetch(`${host}/inApps/v1/transactions/${encodeURIComponent(transactionId)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const body = await readJsonResponse(response);
  if (!response.ok) {
    return validationFailure('app_store_validation_failed', body, response.status);
  }

  const transactionInfo = decodeJwtPayload(body.signedTransactionInfo);
  if (transactionInfo.bundleId !== env.APP_STORE_BUNDLE_ID) {
    return {
      verified: false,
      status: 'bundle_mismatch',
      message: 'App Store transaction bundle id does not match this app.',
    };
  }
  if (transactionInfo.productId !== productId) {
    return {
      verified: false,
      status: 'product_mismatch',
      message: 'App Store transaction product id does not match the requested product.',
    };
  }
  if (String(transactionInfo.transactionId) !== String(transactionId)) {
    return {
      verified: false,
      status: 'transaction_mismatch',
      message: 'App Store transaction id does not match the requested transaction.',
    };
  }

  return {
    verified: true,
    status: 'verified',
    message: 'App Store transaction verified.',
    expiresAt: transactionInfo.expiresDate ? new Date(Number(transactionInfo.expiresDate)).toISOString() : undefined,
    rawStatus: transactionInfo.type || '',
  };
}

function createAppleServerJwt(env) {
  const now = Math.floor(Date.now() / 1000);
  return createJwt({
    header: {
      alg: 'ES256',
      kid: env.APP_STORE_KEY_ID,
      typ: 'JWT',
    },
    payload: {
      iss: env.APP_STORE_ISSUER_ID,
      iat: now,
      exp: now + 1200,
      aud: 'appstoreconnect-v1',
      bid: env.APP_STORE_BUNDLE_ID,
    },
    privateKey: env.APP_STORE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    algorithm: 'sha256',
    dsaEncoding: 'ieee-p1363',
  });
}

module.exports = {
  createAppleServerJwt,
  validateApplePurchase,
};

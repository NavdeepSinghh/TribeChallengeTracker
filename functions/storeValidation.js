const crypto = require('crypto');

async function validateStorePurchase({ platform, product, productId, transactionId = '', purchaseToken = '', environment = 'production', env = process.env }) {
  try {
    if (platform === 'ios') {
      return validateApplePurchase({ product, productId, transactionId, environment, env });
    }
    if (platform === 'android') {
      return validateGooglePlayPurchase({ product, productId, purchaseToken, env });
    }
    return {
      verified: false,
      status: 'unsupported_platform',
      message: `Unsupported purchase platform: ${platform}.`,
    };
  } catch (error) {
    return {
      verified: false,
      status: 'validation_request_failed',
      message: error?.message || 'Purchase validation request failed.',
    };
  }
}

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

async function validateGooglePlayPurchase({ product, productId, purchaseToken, env }) {
  const accessToken = await getGoogleAccessToken(env);
  if (product.kind === 'subscription') {
    const response = await fetch(
      `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(env.PLAY_PACKAGE_NAME)}/purchases/subscriptionsv2/tokens/${encodeURIComponent(purchaseToken)}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const body = await readJsonResponse(response);
    if (!response.ok) {
      return validationFailure('play_subscription_validation_failed', body, response.status);
    }
    return normalizeGoogleSubscription(body, productId);
  }

  const response = await fetch(
    `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(env.PLAY_PACKAGE_NAME)}/purchases/productsv2/tokens/${encodeURIComponent(purchaseToken)}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const body = await readJsonResponse(response);
  if (!response.ok) {
    return validationFailure('play_product_validation_failed', body, response.status);
  }
  return normalizeGoogleProduct(body, productId);
}

function normalizeGoogleSubscription(body, productId) {
  const lineItems = body.lineItems || body.lineItem || [];
  const matchingLine = lineItems.find((lineItem) => lineItem.productId === productId);
  if (!matchingLine) {
    return {
      verified: false,
      status: 'product_mismatch',
      message: 'Google Play subscription product id does not match the requested product.',
    };
  }

  const activeStates = new Set(['SUBSCRIPTION_STATE_ACTIVE', 'SUBSCRIPTION_STATE_IN_GRACE_PERIOD']);
  if (!activeStates.has(body.subscriptionState)) {
    return {
      verified: false,
      status: 'subscription_not_active',
      message: `Google Play subscription state is ${body.subscriptionState || 'unknown'}.`,
    };
  }

  return {
    verified: true,
    status: 'verified',
    message: 'Google Play subscription verified.',
    expiresAt: matchingLine.expiryTime,
    rawStatus: body.subscriptionState || '',
  };
}

function normalizeGoogleProduct(body, productId) {
  const lineItems = body.productLineItem || body.productLineItems || [];
  const matchingLine = lineItems.find((lineItem) => lineItem.productId === productId);
  if (!matchingLine) {
    return {
      verified: false,
      status: 'product_mismatch',
      message: 'Google Play product id does not match the requested product.',
    };
  }

  const purchaseState = body.purchaseStateContext?.purchaseState || '';
  if (purchaseState !== 'PURCHASED') {
    return {
      verified: false,
      status: 'product_not_purchased',
      message: `Google Play product purchase state is ${purchaseState || 'unknown'}.`,
    };
  }

  return {
    verified: true,
    status: 'verified',
    message: 'Google Play product purchase verified.',
    rawStatus: purchaseState,
  };
}

async function getGoogleAccessToken(env) {
  const credentials = JSON.parse(env.PLAY_DEVELOPER_SERVICE_ACCOUNT_JSON);
  const now = Math.floor(Date.now() / 1000);
  const assertion = createJwt({
    header: { alg: 'RS256', typ: 'JWT' },
    payload: {
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/androidpublisher',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    },
    privateKey: credentials.private_key,
    algorithm: 'RSA-SHA256',
  });
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }).toString(),
  });
  const body = await readJsonResponse(response);
  if (!response.ok || !body.access_token) {
    throw new Error(body.error_description || body.error || 'Unable to get Google Play access token.');
  }
  return body.access_token;
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

function createJwt({ header, payload, privateKey, algorithm, dsaEncoding }) {
  const signingInput = `${base64UrlJson(header)}.${base64UrlJson(payload)}`;
  const signature = crypto.sign(algorithm, Buffer.from(signingInput), {
    key: privateKey,
    dsaEncoding,
  });
  return `${signingInput}.${base64Url(signature)}`;
}

function decodeJwtPayload(jwt) {
  if (!jwt) return {};
  const [, payload] = jwt.split('.');
  if (!payload) return {};
  return JSON.parse(Buffer.from(base64UrlToBase64(payload), 'base64').toString('utf8'));
}

async function readJsonResponse(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch (error) {
    return { raw: text };
  }
}

function validationFailure(status, body, httpStatus) {
  return {
    verified: false,
    status,
    message: body.error_description || body.error?.message || body.error || `Store validation failed with HTTP ${httpStatus}.`,
  };
}

function base64UrlJson(value) {
  return base64Url(Buffer.from(JSON.stringify(value)));
}

function base64Url(value) {
  return Buffer.from(value).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToBase64(value) {
  const padded = value.padEnd(value.length + ((4 - (value.length % 4)) % 4), '=');
  return padded.replace(/-/g, '+').replace(/_/g, '/');
}

module.exports = {
  createAppleServerJwt,
  decodeJwtPayload,
  normalizeGoogleProduct,
  normalizeGoogleSubscription,
  validateStorePurchase,
};

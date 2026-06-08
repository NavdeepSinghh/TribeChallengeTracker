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

module.exports = {
  normalizeGoogleProduct,
  normalizeGoogleSubscription,
};

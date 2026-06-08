const {
  getValidationReadiness,
  isPlaceholderConfigValue,
} = require('../../functions/purchaseEntitlements');

describe('purchase validation readiness backend contract', () => {
  it('reports validation readiness without granting entitlements when credentials are missing', () => {
    const readiness = getValidationReadiness('ios', {});

    expect(readiness.validationConfigured).toBe(false);
    expect(readiness.status).toBe('validation_not_configured');
    expect(readiness.missingConfigKeys).toEqual([
      'APP_STORE_ISSUER_ID',
      'APP_STORE_KEY_ID',
      'APP_STORE_PRIVATE_KEY',
      'APP_STORE_BUNDLE_ID',
    ]);
  });

  it('treats copied template placeholder credentials as not configured', () => {
    const iosReadiness = getValidationReadiness('ios', {
      APP_STORE_ISSUER_ID: '00000000-0000-0000-0000-000000000000',
      APP_STORE_KEY_ID: 'ABC123DEFG',
      APP_STORE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\\nREPLACE_WITH_APP_STORE_CONNECT_PRIVATE_KEY\\n-----END PRIVATE KEY-----',
      APP_STORE_BUNDLE_ID: 'com.risewiththetribe.challengetracker',
    });
    const androidReadiness = getValidationReadiness('android', {
      PLAY_DEVELOPER_SERVICE_ACCOUNT_JSON: '{"type":"service_account","project_id":"replace-me","private_key":"-----BEGIN PRIVATE KEY-----\\nREPLACE_WITH_PLAY_SERVICE_ACCOUNT_PRIVATE_KEY\\n-----END PRIVATE KEY-----\\n","client_email":"play-validation@example.iam.gserviceaccount.com"}',
      PLAY_PACKAGE_NAME: 'com.risewiththetribe.challengetracker',
    });

    expect(iosReadiness.validationConfigured).toBe(false);
    expect(iosReadiness.missingConfigKeys).toEqual([
      'APP_STORE_ISSUER_ID',
      'APP_STORE_KEY_ID',
      'APP_STORE_PRIVATE_KEY',
    ]);
    expect(androidReadiness.validationConfigured).toBe(false);
    expect(androidReadiness.missingConfigKeys).toEqual([
      'PLAY_DEVELOPER_SERVICE_ACCOUNT_JSON',
    ]);
    expect(isPlaceholderConfigValue('real-looking-value')).toBe(false);
  });

  it('reports App Store validation as provider-ready when all credentials are configured', () => {
    const readiness = getValidationReadiness('ios', {
      APP_STORE_ISSUER_ID: 'issuer-id',
      APP_STORE_KEY_ID: 'key-id',
      APP_STORE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----',
      APP_STORE_BUNDLE_ID: 'com.risewiththetribe.challengetracker',
    });

    expect(readiness.validationConfigured).toBe(true);
    expect(readiness.status).toBe('validation_configured');
    expect(readiness.missingConfigKeys).toEqual([]);
    expect(readiness.message).toContain('ready to call the provider');
    expect(readiness.nextAction).toContain('sandbox/license-test purchases');
  });

  it('reports Play validation as provider-ready when all credentials are configured', () => {
    const readiness = getValidationReadiness('android', {
      PLAY_DEVELOPER_SERVICE_ACCOUNT_JSON: '{"client_email":"service@example.com","private_key":"key"}',
      PLAY_PACKAGE_NAME: 'com.risewiththetribe.challengetracker',
    });

    expect(readiness.validationConfigured).toBe(true);
    expect(readiness.status).toBe('validation_configured');
    expect(readiness.missingConfigKeys).toEqual([]);
    expect(readiness.requiredKeys).toBeUndefined();
    expect(readiness.nextAction).toContain('verifyPurchase');
  });

  it('rejects unsupported validation readiness platforms', () => {
    const readiness = getValidationReadiness('web', {});

    expect(readiness.validationConfigured).toBe(false);
    expect(readiness.status).toBe('unsupported_platform');
    expect(readiness.nextAction).toContain('ios or android');
  });
});

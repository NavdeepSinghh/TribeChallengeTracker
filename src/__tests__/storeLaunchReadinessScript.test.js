const path = require('path');
const { execFileSync } = require('child_process');

const scriptPath = path.resolve(__dirname, '../../scripts/check-store-launch-readiness.js');
const storeCredentialKeys = [
  'APP_STORE_ISSUER_ID',
  'APP_STORE_KEY_ID',
  'APP_STORE_PRIVATE_KEY',
  'APP_STORE_BUNDLE_ID',
  'PLAY_DEVELOPER_SERVICE_ACCOUNT_JSON',
  'PLAY_PACKAGE_NAME',
];

const buildEnv = (overrides = {}) => {
  const env = { ...process.env };
  storeCredentialKeys.forEach((key) => {
    delete env[key];
  });
  return { ...env, ...overrides };
};

const runReadinessJson = ({ args = [], env = buildEnv(), expectFailure = false } = {}) => {
  try {
    const stdout = execFileSync(process.execPath, [scriptPath, ...args, '--json'], {
      encoding: 'utf8',
      env,
    });
    return { failed: false, data: JSON.parse(stdout) };
  } catch (error) {
    if (!expectFailure) {
      throw error;
    }
    return { failed: true, data: JSON.parse(error.stdout.toString()) };
  }
};

describe('store launch readiness script', () => {
  it('emits the credential and external evidence gaps as parseable JSON', () => {
    const { failed, data } = runReadinessJson();

    expect(failed).toBe(false);
    expect(data.launchReady).toBe(false);
    expect(data.credentialReady).toBe(false);
    expect(data.status).toBe('credentials_missing_or_placeholder');
    expect(data.readiness).toHaveLength(2);
    expect(data.readiness.flatMap((platform) => platform.missingConfigKeysOnly)).toEqual(storeCredentialKeys);
    expect(data.readiness.flatMap((platform) => platform.placeholderConfigKeys)).toEqual([]);
    expect(data.products).toHaveLength(9);
    expect(data.requiredEvidence).toHaveLength(20);
    expect(data.requiredEvidence.filter((item) => item.safeDenialRequired)).toHaveLength(2);
    expect(data.requiredEvidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          platform: 'ios',
          productId: 'com.risewiththetribe.pack.event_prep_21',
          testCase: 'sandbox_purchase',
        }),
        expect.objectContaining({
          platform: 'android',
          productId: 'com.risewiththetribe.pack.event_prep_21',
          testCase: 'sandbox_purchase',
        }),
      ])
    );
    expect(data.requiredEvidence.find((item) => item.testCase === 'negative_validation_or_wrong_account')).toEqual(
      expect.objectContaining({
        acceptedResults: ['failed', 'verified_safe_denial'],
        requiredResult: 'failed or verified_safe_denial',
        safeDenialRequired: true,
      })
    );
    expect(data.decision).toContain('Not ready for paid launch review');
    expect(JSON.stringify(data)).not.toContain('raw-secret-token');
  });

  it('keeps strict mode machine-readable while failing on missing credentials', () => {
    const { failed, data } = runReadinessJson({
      args: ['--strict'],
      expectFailure: true,
    });

    expect(failed).toBe(true);
    expect(data.launchReady).toBe(false);
    expect(data.status).toBe('credentials_missing_or_placeholder');
  });

  it('separates placeholder credential values from missing keys', () => {
    const { failed, data } = runReadinessJson({
      env: buildEnv({
        APP_STORE_ISSUER_ID: '00000000-0000-0000-0000-000000000000',
        APP_STORE_KEY_ID: 'ABC123DEFG',
        APP_STORE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\\nREPLACE_WITH_APP_STORE_CONNECT_PRIVATE_KEY\\n-----END PRIVATE KEY-----',
        APP_STORE_BUNDLE_ID: 'com.risewiththetribe.challengetracker',
        PLAY_DEVELOPER_SERVICE_ACCOUNT_JSON: '{"client_email":"play-validation@example.iam.gserviceaccount.com","private_key":"-----BEGIN PRIVATE KEY-----\\nREPLACE_WITH_PLAY_SERVICE_ACCOUNT_PRIVATE_KEY\\n-----END PRIVATE KEY-----\\n"}',
        PLAY_PACKAGE_NAME: 'com.risewiththetribe.challengetracker',
      }),
    });

    expect(failed).toBe(false);
    expect(data.launchReady).toBe(false);
    expect(data.readiness.flatMap((platform) => platform.missingConfigKeysOnly)).toEqual([]);
    expect(data.readiness.flatMap((platform) => platform.placeholderConfigKeys)).toEqual([
      'APP_STORE_ISSUER_ID',
      'APP_STORE_KEY_ID',
      'APP_STORE_PRIVATE_KEY',
      'PLAY_DEVELOPER_SERVICE_ACCOUNT_JSON',
    ]);
  });

  it('reports credentials configured when every store validation key is present and non-placeholder', () => {
    const { failed, data } = runReadinessJson({
      env: buildEnv({
        APP_STORE_ISSUER_ID: 'issuer-id',
        APP_STORE_KEY_ID: 'key-id',
        APP_STORE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----',
        APP_STORE_BUNDLE_ID: 'com.risewiththetribe.challengetracker',
        PLAY_DEVELOPER_SERVICE_ACCOUNT_JSON: '{"client_email":"service@example.com","private_key":"key"}',
        PLAY_PACKAGE_NAME: 'com.risewiththetribe.challengetracker',
      }),
    });

    expect(failed).toBe(false);
    expect(data.launchReady).toBe(true);
    expect(data.credentialReady).toBe(true);
    expect(data.status).toBe('credentials_configured');
    expect(data.readiness.every((platform) => platform.validationConfigured)).toBe(true);
    expect(data.readiness.flatMap((platform) => platform.missingConfigKeys)).toEqual([]);
    expect(data.readiness.flatMap((platform) => platform.missingConfigKeysOnly)).toEqual([]);
    expect(data.readiness.flatMap((platform) => platform.placeholderConfigKeys)).toEqual([]);
    expect(data.decision).toContain('external evidence matrix');
  });
});

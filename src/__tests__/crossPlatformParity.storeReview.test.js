const {
  iosProfile,
  androidApp,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform store review and evidence parity source checks', () => {
  it('keeps Release QA Checklist wired across admin and creator profile surfaces', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('RELEASE QA CHECKLIST');
      expect(source).toContain('COPY RELEASE QA CHECKLIST');
      expect(source).toContain('Manual cross-platform guardrails before launch');
      expect(source).toContain('PRODUCT IDS');
      expect(source).toContain('STORE TESTS');
      expect(source).toContain('ENTITLEMENTS');
      expect(source).toContain('SOCIAL SHARE');
      expect(source).toContain('receipt-validation credentials');
      expect(source).toContain('feature parity docs');
      expect(source).toContain('Web, iOS, and Android');
    });
  });

  it('keeps Store Launch Dry-Run Kit copy-only across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('STORE LAUNCH DRY-RUN KIT');
      expect(source).toContain('COPY STORE DRY RUN');
      expect(source).toContain('storeLaunchDryRunCopy');
      expect(source).toContain('Manual release rehearsal before paid access');
      expect(source).toContain('Run the full signup, onboarding, challenge join, activity log, share, support, and restore/sync path');
      expect(source).toContain('validation credentials, sandbox/license-test evidence, entitlement recovery, support links');
      expect(source).toContain('Do not flip paid access live');
      expect(source).toContain('write entitlements');
      expect(source).toContain('create purchases');
      expect(source).toContain('process payments');
      expect(source).toContain('process refunds');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('collect payment details');
      expect(source).toContain('submit store review');
      expect(source).toContain('mark validation complete without credentials');
      expect(source).toContain('claim sandbox/license-test purchases passed without evidence');
      expect(source).toContain('announce launch readiness');
    });
  });

  it('keeps Store Demo Account Kit reviewer-safe across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('STORE DEMO ACCOUNT KIT');
      expect(source).toContain('COPY DEMO ACCOUNT KIT');
      expect(source).toContain('storeDemoAccountCopy');
      expect(source).toContain('Reviewer-safe demo account notes');
      expect(source).toContain('Prepare one reviewer-safe demo account');
      expect(source).toContain('Seed visible free flows');
      expect(source).toContain('optional HealthKit / Health Connect');
      expect(source).toContain('Do not create accounts from client code');
      expect(source).toContain('store reviewer passwords in git');
      expect(source).toContain('expose real user data');
      expect(source).toContain('grant Pro');
      expect(source).toContain('unlock packs');
      expect(source).toContain('write entitlements');
      expect(source).toContain('create purchases');
      expect(source).toContain('bypass StoreKit or Play Billing');
      expect(source).toContain('collect payment details');
      expect(source).toContain('include private credentials');
    });
  });

  it('keeps Store Review Pack prep-only across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('STORE REVIEW PACK');
      expect(source).toContain('COPY STORE REVIEW PACK');
      expect(source).toContain('storeReviewPackCopy');
      expect(source).toContain('Reviewer notes and policy evidence');
      expect(source).toContain('Draft App Store and Play reviewer notes');
      expect(source).toContain('Attach data safety, privacy, terms, data deletion');
      expect(source).toContain('sandbox/license-test evidence');
      expect(source).toContain('Do not submit store review');
      expect(source).toContain('store reviewer passwords in git');
      expect(source).toContain('expose personal user data');
      expect(source).toContain('unlock paid access');
      expect(source).toContain('grant Pro');
      expect(source).toContain('unlock packs');
      expect(source).toContain('write entitlements');
      expect(source).toContain('create purchases');
      expect(source).toContain('bypass StoreKit or Play Billing');
      expect(source).toContain('mark review readiness without evidence');
      expect(source).toContain('include private credentials');
    });
  });
});

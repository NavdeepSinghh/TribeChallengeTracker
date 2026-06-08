const {
  fs,
  path,
  repoRoot,
  iosChallengeService,
  iosProfile,
  androidRepository,
  androidApp,
  androidModels,
  readWebProfileContracts,
  readWebUserServiceContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform store evidence parity source checks', () => {
  it('keeps Store Test Purchase Evidence Log admin-only without entitlement side effects', () => {
    const webProfile = readWebProfileContracts();
    const webUserService = readWebUserServiceContracts();
    const androidViewModel = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/AppViewModel.kt'), 'utf8');
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');
    [
      webUserService,
      iosChallengeService,
      androidRepository,
      firestoreRules,
    ].forEach((source) => {
      expect(source).toContain('storeTestPurchaseEvidence');
      expect(source).toContain('sandbox_purchase');
      expect(source).toContain('restore_sync');
      expect(source).toContain('needs_review');
      expect(source).toContain('recorded');
      expect(source).toContain('reviewNote');
      expect(source).toContain('reviewedBy');
      expect(source).toContain('reviewedAt');
      expect(source).toContain('verified');
      expect(source).toContain('archived');
    });
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('storeTestPurchaseEvidence');
      expect(source).toContain('sandbox_purchase');
      expect(source).toContain('restore_sync');
      expect(source).toContain('needs_review');
      expect(source).toContain('recorded');
      expect(source).toContain('reviewNote');
      expect(source).toContain('verified');
      expect(source).toContain('archived');
    });
    [androidModels, androidViewModel].forEach((source) => {
      expect(source).toContain('StoreTestPurchaseEvidence');
      expect(source).toContain('reviewNote');
    });
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('STORE TEST PURCHASE EVIDENCE LOG');
      expect(source).toContain('Sandbox and license-test proof before paid launch');
      expect(source).toContain('Manual store test evidence review note');
      expect(source).toContain('VERIFIED');
      expect(source).toContain('NEEDS REVIEW');
      expect(source).toContain('FAILED');
      expect(source).toContain('ARCHIVE');
      expect(source).toContain('must not write entitlements');
      expect(source).toContain('create purchases');
      expect(source).toContain('process refunds');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('mark paid access live');
    });
    expect(webUserService).toContain('recordStoreTestPurchaseEvidence');
    expect(webUserService).toContain('reviewStoreTestPurchaseEvidence');
    expect(iosChallengeService).toContain('recordStoreTestPurchaseEvidence');
    expect(iosChallengeService).toContain('reviewStoreTestPurchaseEvidence');
    expect(androidRepository).toContain('recordStoreTestPurchaseEvidence');
    expect(androidRepository).toContain('reviewStoreTestPurchaseEvidence');
    expect(androidViewModel).toContain('reviewStoreTestPurchaseEvidence');
  });

  it('keeps Store Test Evidence Decision Reply Kit copy-only across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('STORE TEST EVIDENCE DECISION REPLY KIT');
      expect(source).toContain('COPY STORE TEST EVIDENCE REPLIES');
      expect(source).toContain('storeTestEvidenceDecisionReplyCopy');
      expect(source).toContain('Manual sandbox/license-test evidence replies');
      expect(source).toContain('VERIFIED FOR LAUNCH REVIEW');
      expect(source).toContain('NEEDS MORE EVIDENCE');
      expect(source).toContain('FAILED TEST CASE');
      expect(source).toContain('ARCHIVED FOR RECORDKEEPING');
      expect(source).toContain('Do not write entitlements');
      expect(source).toContain('create purchases');
      expect(source).toContain('process refunds');
      expect(source).toContain('bypass App Store or Google Play policy');
      expect(source).toContain('mark paid access live');
      expect(source).toContain('submit store review');
      expect(source).toContain('claim sandbox/license-test purchases passed without evidence');
      expect(source).toContain('collect payment details');
      expect(source).toContain('expose private tester data');
      expect(source).toContain('promise restored access');
      expect(source).toContain('auto-message users');
      expect(source).toContain('scrape/store DMs');
      expect(source).toContain('pressure members');
    });
  });
});

const {
  fs,
  path,
  repoRoot,
  iosChallengeService,
  iosProfile,
  androidRepository,
  androidModels,
  androidApp,
  readWebProfileContracts,
  readWebUserServiceContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform store review planning parity source checks', () => {
  it('keeps Store Listing Copy Kit wired without paid-live or policy side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('STORE LISTING COPY KIT');
      expect(source).toContain('COPY STORE LISTING');
      expect(source).toContain('storeListingCopy');
      expect(source).toContain('Fitness challenges, streaks, and accountability');
      expect(source).toContain('free challenge loop');
      expect(source).toContain('store-backed experiences');
      expect(source).toContain('store-listing planning copy');
      expect(source).toContain('Do not claim paid access is live');
      expect(source).toContain('advertise unconfigured prices');
      expect(source).toContain('promise outcomes');
      expect(source).toContain('imply medical results');
      expect(source).toContain('mention refunds outside marketplace policy');
      expect(source).toContain('unlock entitlements');
      expect(source).toContain('submit store copy that conflicts');
    });
  });

  it('keeps Store Review Submission Kit wired without reviewer or entitlement side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('STORE REVIEW SUBMISSION KIT');
      expect(source).toContain('COPY REVIEW NOTES');
      expect(source).toContain('storeReviewSubmissionCopy');
      expect(source).toContain('Reviewer notes and permission checklist');
      expect(source).toContain('Demo account checklist');
      expect(source).toContain('Permission explanations');
      expect(source).toContain('HealthKit on iOS and Health Connect on Android');
      expect(source).toContain('privacy policy, terms, and account/data deletion');
      expect(source).toContain('store-review planning copy');
      expect(source).toContain('Do not submit inaccurate permission claims');
      expect(source).toContain('provide personal user data in reviewer notes');
      expect(source).toContain('bypass marketplace purchase review');
      expect(source).toContain('claim medical or guaranteed fitness outcomes');
      expect(source).toContain('unlock paid access from client code');
      expect(source).toContain('mark the app ready for review');
    });
  });

  it('keeps Store Review Evidence Pack copy-only across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('STORE REVIEW EVIDENCE PACK');
      expect(source).toContain('COPY REVIEW EVIDENCE PACK');
      expect(source).toContain('storeReviewEvidencePackCopy');
      expect(source).toContain('Reviewer proof package from release checks');
      expect(source).toContain('Store test evidence:');
      expect(source).toContain('Policy and support links');
      expect(source).toContain('HealthKit / Health Connect explanations');
      expect(source).toContain('sandbox/license-test evidence status');
      expect(source).toContain('This is a reviewer evidence pack only');
      expect(source).toContain('Do not submit store review');
      expect(source).toContain('expose personal user data');
      expect(source).toContain('unlock paid access');
      expect(source).toContain('write entitlements');
      expect(source).toContain('create purchases');
      expect(source).toContain('process refunds');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('mark paid access live');
      expect(source).toContain('claim review readiness');
    });
  });

  it('keeps Store Review Response Kit copy-only across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('STORE REVIEW RESPONSE KIT');
      expect(source).toContain('COPY REVIEW RESPONSE');
      expect(source).toContain('storeReviewResponseCopy');
      expect(source).toContain('Reviewer follow-up and rejection reply checklist');
      expect(source).toContain('Reviewer follow-up checklist');
      expect(source).toContain('If rejected, record the rejection reason');
      expect(source).toContain('This is a manual Store Review Response Kit only');
      expect(source).toContain('Do not submit store review');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('expose private user data');
      expect(source).toContain('include passwords or secret keys');
      expect(source).toContain('unlock paid access');
      expect(source).toContain('write entitlements');
      expect(source).toContain('create purchases');
      expect(source).toContain('process refunds');
      expect(source).toContain('claim review approval');
      expect(source).toContain('mark paid access live');
    });
  });

  it('keeps Store Review Response Review Records wired on all platforms as manual evidence only', () => {
    const webProfile = readWebProfileContracts();
    const webUserService = readWebUserServiceContracts();
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');
    const uiSources = [webProfile, iosProfile, androidApp];
    const serviceSources = [webUserService, iosChallengeService, androidRepository, firestoreRules];
    const modelSources = [iosChallengeService, androidModels];
    const labels = [
      'STORE REVIEW RESPONSE REVIEW RECORD',
      'SAVE REVIEW RESPONSE REVIEW',
      'STORE REVIEW RESPONSE REVIEW QUEUE',
      'APPROVED STORE REVIEW RESPONSE REVIEWS',
    ];
    const guardrails = [
      'manualReviewOnly',
      'submitsStoreReview',
      'bypassesMarketplacePolicy',
      'exposesPrivateUserData',
      'includesSecrets',
      'unlocksPaidAccess',
      'writesEntitlements',
      'createsPurchases',
      'processesRefunds',
      'claimsReviewApproval',
      'isPaidAccessLive',
      'hasTrackingPixels',
      'scrapesMessages',
    ];

    uiSources.forEach((source) => {
      labels.forEach(label => expect(source).toContain(label));
      guardrails.forEach(flag => expect(source).toContain(flag));
    });
    serviceSources.forEach((source) => {
      expect(source).toContain('storeReviewResponseReviews');
      guardrails.forEach(flag => expect(source).toContain(flag));
    });
    modelSources.forEach((source) => {
      guardrails.forEach(flag => expect(source).toContain(flag));
    });
    expect(webUserService).toContain('submitStoreReviewResponseReview');
    expect(webUserService).toContain('reviewStoreReviewResponseReview');
    expect(iosChallengeService).toContain('submitStoreReviewResponseReview');
    expect(iosChallengeService).toContain('reviewStoreReviewResponseReview');
    expect(androidRepository).toContain('submitStoreReviewResponseReview');
    expect(androidRepository).toContain('reviewStoreReviewResponseReview');
    expect(firestoreRules).toContain('match /storeReviewResponseReviews/{reviewId}');
  });

  it('keeps Store Review Response Review Decision Reply Kit copy-only across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('STORE REVIEW RESPONSE REVIEW DECISION REPLY KIT');
      expect(source).toContain('COPY REVIEW RESPONSE DECISION REPLIES');
      expect(source).toContain('storeReviewResponseReviewDecisionReplyCopy');
      expect(source).toContain('Manual reviewer response decision replies');
      expect(source).toContain('APPROVED FOR REVIEWER RESPONSE');
      expect(source).toContain('WAITING ON REVIEW EVIDENCE');
      expect(source).toContain('NOT READY FOR REVIEWER FOLLOW-UP');
      expect(source).toContain('DECLINED FOR REVIEW RESPONSE');
      expect(source).toContain('manual Store Review Response Review Decision Reply Kit only');
      expect(source).toContain('Do not submit store review');
      expect(source).toContain('expose private user data');
      expect(source).toContain('include passwords or secret keys');
      expect(source).toContain('unlock paid access');
      expect(source).toContain('write entitlements');
      expect(source).toContain('create purchases');
      expect(source).toContain('process refunds');
      expect(source).toContain('claim review approval');
      expect(source).toContain('mark paid access live');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('scrape messages');
      expect(source).toContain('bypass App Store or Google Play policy');
      expect(source).toContain('pressure reviewers or members');
    });
  });
});

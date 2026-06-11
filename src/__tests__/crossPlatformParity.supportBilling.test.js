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


describe('cross-platform support and billing parity source checks', () => {
  it('keeps Support Refund Readiness Kit wired without refund or entitlement side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('SUPPORT REFUND READINESS KIT');
      expect(source).toContain('COPY SUPPORT KIT');
      expect(source).toContain('supportRefundReadinessCopy');
      expect(source).toContain('restore purchases');
      expect(source).toContain('marketplace refunds');
      expect(source).toContain('missing entitlements');
      expect(source).toContain('support-readiness brief');
      expect(source).toContain('Do not process refunds in-app');
      expect(source).toContain('override App Store or Play refund policy');
      expect(source).toContain('write entitlements manually');
      expect(source).toContain('promise outcomes');
      expect(source).toContain('imply medical results');
      expect(source).toContain('promote paid access as live');
    });
  });

  it('keeps Entitlement Recovery Decision Reply Kit copy-only across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('ENTITLEMENT RECOVERY DECISION REPLY KIT');
      expect(source).toContain('COPY ENTITLEMENT RECOVERY REPLIES');
      expect(source).toContain('entitlementRecoveryDecisionReplyCopy');
      expect(source).toContain('Manual missing-purchase support replies');
      expect(source).toContain('WAITING ON STORE CONTEXT');
      expect(source).toContain('RESOLVED AFTER RECOVERY REVIEW');
      expect(source).toContain('CLOSED FOR NOW');
      expect(source).toContain('ESCALATE TO MARKETPLACE SUPPORT');
      expect(source).toContain('Do not write entitlements');
      expect(source).toContain('process refunds');
      expect(source).toContain('cancel subscriptions');
      expect(source).toContain('create purchases');
      expect(source).toContain('retry charges');
      expect(source).toContain('collect payment details');
      expect(source).toContain('bypass App Store or Google Play policy');
      expect(source).toContain('override marketplace decisions');
      expect(source).toContain('expose private user data');
      expect(source).toContain('promise restored access');
      expect(source).toContain('auto-message users');
      expect(source).toContain('scrape/store DMs');
      expect(source).toContain('pressure members');
    });
  });

  it('keeps Support Refund Readiness Review Records wired on all platforms as manual evidence only', () => {
    const webProfile = readWebProfileContracts();
    const webUserService = readWebUserServiceContracts();
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');
    const uiSources = [webProfile, iosProfile, androidApp];
    const serviceSources = [webUserService, iosChallengeService, androidRepository, firestoreRules];
    const modelSources = [iosChallengeService, androidModels];
    const labels = [
      'SUPPORT REFUND READINESS REVIEW RECORD',
      'SAVE SUPPORT READINESS REVIEW',
      'SUPPORT REFUND READINESS REVIEW QUEUE',
      'APPROVED SUPPORT REFUND READINESS REVIEWS',
    ];
    const guardrails = [
      'manualReviewOnly',
      'processesRefunds',
      'cancelsSubscriptions',
      'writesEntitlements',
      'createsPurchases',
      'bypassesMarketplacePolicy',
      'collectsPaymentDetails',
      'isPaidAccessLive',
    ];

    uiSources.forEach((source) => {
      labels.forEach(label => expect(source).toContain(label));
      guardrails.forEach(flag => expect(source).toContain(flag));
    });
    serviceSources.forEach((source) => {
      expect(source).toContain('supportRefundReadinessReviews');
      guardrails.forEach(flag => expect(source).toContain(flag));
    });
    modelSources.forEach((source) => {
      guardrails.forEach(flag => expect(source).toContain(flag));
    });
    expect(webUserService).toContain('submitSupportRefundReadinessReview');
    expect(webUserService).toContain('reviewSupportRefundReadinessReview');
    expect(iosChallengeService).toContain('submitSupportRefundReadinessReview');
    expect(iosChallengeService).toContain('reviewSupportRefundReadinessReview');
    expect(androidRepository).toContain('submitSupportRefundReadinessReview');
    expect(androidRepository).toContain('reviewSupportRefundReadinessReview');
    expect(firestoreRules).toContain('match /supportRefundReadinessReviews/{reviewId}');
  });

  it('keeps Support Refund Readiness Review Decision Reply Kit copy-only across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('SUPPORT REFUND READINESS REVIEW DECISION REPLY KIT');
      expect(source).toContain('COPY SUPPORT READINESS DECISION REPLIES');
      expect(source).toContain('supportRefundReadinessReviewDecisionReplyCopy');
      expect(source).toContain('Manual support readiness decision replies');
      expect(source).toContain('APPROVED FOR SUPPORT READINESS');
      expect(source).toContain('WAITING ON SUPPORT EVIDENCE');
      expect(source).toContain('NOT READY FOR SUPPORT HANDOFF');
      expect(source).toContain('DECLINED FOR LAUNCH SUPPORT');
      expect(source).toContain('manual Support Refund Readiness Review Decision Reply Kit only');
      expect(source).toContain('Do not process refunds');
      expect(source).toContain('cancel subscriptions');
      expect(source).toContain('write entitlements');
      expect(source).toContain('create purchases');
      expect(source).toContain('collect payment details');
      expect(source).toContain('bypass App Store or Google Play policy');
      expect(source).toContain('promote paid access as live');
      expect(source).toContain('auto-message users');
      expect(source).toContain('scrape/store DMs');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('pressure members');
    });
  });
});

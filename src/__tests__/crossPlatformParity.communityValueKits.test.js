const {
  fs,
  path,
  repoRoot,
  iosChallengeService,
  iosProfile,
  androidApp,
  androidModels,
  androidRepository,
  readWebProfileContracts,
  readWebUserServiceContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform community value kit parity source checks', () => {
  it('keeps Community Ambassador Kit wired on all platforms without payout or affiliate side effects', () => {
    const webProfile = readWebProfileContracts();
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('COMMUNITY AMBASSADOR KIT');
      expect(source).toContain('COPY AMBASSADOR KIT');
      expect(source).toContain('communityAmbassadorCopy');
      expect(source).toContain('invite one accountability partner');
      expect(source).toContain('free community loop');
      expect(source).toContain('community-recognition brief');
      expect(source).toContain('Do not create commissions');
      expect(source).toContain('payouts');
      expect(source).toContain('paid roles');
      expect(source).toContain('affiliate links');
      expect(source).toContain('partner tracking');
      expect(source).toContain('revenue-share promises');
    });
  });

  it('keeps Customer Value Checklist wired on all platforms without paid-access side effects', () => {
    const webProfile = readWebProfileContracts();
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('CUSTOMER VALUE CHECKLIST');
      expect(source).toContain('COPY VALUE CHECKLIST');
      expect(source).toContain('customerValueChecklistCopy');
      expect(source).toContain('Charge only after value is visible');
      expect(source).toContain('free challenge loop must create visible consistency');
      expect(source).toContain('paid offer must add measurable accountability');
      expect(source).toContain('value-readiness brief');
      expect(source).toContain('Do not charge users');
      expect(source).toContain('unlock paid access');
      expect(source).toContain('promise outcomes');
      expect(source).toContain('imply medical results');
      expect(source).toContain('write entitlements');
      expect(source).toContain('promote paid features as live');
    });
  });

  it('keeps Customer Value Review Records wired on all platforms as manual evidence only', () => {
    const webProfile = readWebProfileContracts();
    const webUserService = readWebUserServiceContracts();
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');

    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CUSTOMER VALUE REVIEW RECORD');
      expect(source).toContain('SAVE CUSTOMER VALUE REVIEW');
      expect(source).toContain('CUSTOMER VALUE REVIEW QUEUE');
      expect(source).toContain('APPROVED CUSTOMER VALUE REVIEWS');
      expect(source).toContain('manualReviewOnly');
      expect(source).toContain('chargesUsers');
      expect(source).toContain('unlocksPaidAccess');
      expect(source).toContain('writesEntitlements');
      expect(source).toContain('createsDiscounts');
      expect(source).toContain('isPaidAccessLive');
      expect(source).toContain('promotesPaidFeatures');
    });

    [
      webUserService,
      iosChallengeService,
      androidRepository,
      firestoreRules,
    ].forEach((source) => {
      expect(source).toContain('customerValueReviews');
    });

    [
      webUserService,
      iosChallengeService,
      androidRepository,
      androidModels,
      firestoreRules,
    ].forEach((source) => {
      expect(source).toContain('manualReviewOnly');
      expect(source).toContain('chargesUsers');
      expect(source).toContain('unlocksPaidAccess');
      expect(source).toContain('writesEntitlements');
      expect(source).toContain('createsDiscounts');
      expect(source).toContain('isPaidAccessLive');
      expect(source).toContain('promotesPaidFeatures');
    });

    expect(firestoreRules).toContain('match /customerValueReviews/{reviewId}');
  });

  it('keeps Customer Value Review Decision Reply Kit copy-only across platforms', () => {
    const webProfile = readWebProfileContracts();

    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('CUSTOMER VALUE REVIEW DECISION REPLY KIT');
      expect(source).toContain('COPY VALUE REVIEW DECISION REPLIES');
      expect(source).toContain('customerValueReviewDecisionReplyCopy');
      expect(source).toContain('Customer Value Review Decision Reply Kit');
      expect(source).toContain('APPROVED FOR VALUE LEARNING');
      expect(source).toContain('WAITING ON VALUE PROOF');
      expect(source).toContain('NOT READY FOR PAID HANDOFF');
      expect(source).toContain('DECLINED FOR VALUE HANDOFF');
      expect(source).toContain('Do not charge users');
      expect(source).toContain('unlock paid access');
      expect(source).toContain('create discounts');
      expect(source).toContain('collect payment details');
      expect(source).toContain('create purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('process refunds');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('promote paid features as live');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('scrape/store DMs');
      expect(source).toContain('auto-message users');
      expect(source).toContain('pressure members');
    });
  });
});

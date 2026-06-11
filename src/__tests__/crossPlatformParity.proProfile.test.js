const {
  iosChallengeService,
  iosProfile,
  iosUserProfile,
  androidRepository,
  androidApp,
  androidModels,
  readWebProfileContracts,
  readWebUserServiceContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform Pro profile parity source checks', () => {
  it('keeps monthly Pro report surfaces on iOS and Android', () => {
    ['monthlyReport', 'MONTH SCORE', '30D ACTIVE', '30D POINTS'].forEach((contract) => {
      expect(iosProfile).toContain(contract);
      expect(androidApp).toContain(contract);
    });
    expect(iosProfile).toContain('Share 30-Day Recap');
    expect(androidApp).toContain('SHARE 30-DAY RECAP');
    expect(iosProfile).toContain('monthlyRecapShareText');
    expect(androidApp).toContain('shareMonthlyRecap');
  });

  it('keeps 90-day Pro history insight read-only across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('90-day history insight');
      expect(source).toContain('90-day activity history view');
      expect(source).toContain('90D ACTIVE');
      expect(source).toContain('90D SESSIONS');
      expect(source).toContain('90D POINTS');
      expect(source).toContain('DEEP BASE');
      expect(source).toContain('BUILDING BASE');
      expect(source).toContain('RESET WINDOW');
      expect(source).toContain('PRO PREVIEW');
      expect(source).toContain('Uses existing app history only');
      expect(source).toContain('does not export private history');
      expect(source).toContain('create purchases');
      expect(source).toContain('grant Pro');
      expect(source).toContain('write entitlements');
      expect(source).toContain('imply paid access is live');
    });
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Longer activity history views');
    });
  });

  it('keeps Pro Value Snapshot wired on all platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('PRO VALUE SNAPSHOT');
      expect(source).toContain('Best fit:');
      expect(source).toContain('WEEK SCORE');
      expect(source).toContain('30D ACTIVE');
      expect(source).toContain('CHAL PTS');
      expect(source).toContain('VALUE PROOF STORY KIT');
      expect(source).toContain('COPY VALUE PROOF STORY');
      expect(source).toContain('valueProofStoryCopy');
      expect(source).toContain('Copy a progress-proof Story');
      expect(source).toContain('Do not auto-post');
      expect(source).toContain('export private history');
      expect(source).toContain('grant Pro');
      expect(source).toContain('STORY POSTING CHECKLIST KIT');
      expect(source).toContain('COPY STORY POSTING CHECKLIST');
      expect(source).toContain('storyPostingChecklistCopy');
      expect(source).toContain('Manual weekly Story sequence');
      expect(source).toContain('store inbound DMs');
      expect(source).toContain('share unreviewed submissions');
      expect(source).toContain('write referral state');
      expect(source).toContain('STREAK RESCUE PROMPT KIT');
      expect(source).toContain('COPY STREAK RESCUE PROMPT');
      expect(source).toContain('streakRescuePromptCopy');
      expect(source).toContain('Comeback copy after a missed day');
      expect(source).toContain('Do not award points');
      expect(source).toContain('spend recovery credits');
      expect(source).toContain('pressure users after missed days');
      expect(source).toContain('COMEBACK CHALLENGE INVITE KIT');
      expect(source).toContain('COPY COMEBACK CHALLENGE INVITE');
      expect(source).toContain('comebackChallengeInviteCopy');
      expect(source).toContain("Restart invite for this week's campaign");
      expect(source).toContain('Do not auto-message users');
      expect(source).toContain('create challenge joins');
      expect(source).toContain('write referral state');
    });
  });

  it('keeps Pro Trial Interest capture wired on all platforms', () => {
    const webProfile = readWebProfileContracts();
    const webUserService = readWebUserServiceContracts();
    [
      webProfile,
      webUserService,
      iosProfile,
      iosUserProfile,
      iosChallengeService,
      androidApp,
      androidModels,
      androidRepository,
    ].forEach((source) => {
      expect(source).toContain('proTrialInterest');
    });
    [
      webProfile,
      webUserService,
      iosProfile,
      iosChallengeService,
      androidApp,
      androidRepository,
    ].forEach((source) => {
      expect(source).toContain('reports');
      expect(source).toContain('challenge_packs');
      expect(source).toContain('creator_tools');
    });
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('PRO TRIAL INTEREST');
      expect(source).toContain('first-party demand signal');
    });
  });

  it('keeps Pro Trial Review Records manual and no-commerce across platforms', () => {
    const webProfile = readWebProfileContracts();
    const webUserService = readWebUserServiceContracts();
    const firestoreRules = require('fs').readFileSync(require('path').resolve(__dirname, '../../firestore.rules'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('PRO TRIAL REVIEW RECORD');
      expect(source).toContain('SAVE PRO TRIAL REVIEW');
      expect(source).toContain('PRO TRIAL REVIEW QUEUE');
      expect(source).toContain('APPROVED PRO TRIAL REVIEWS');
    });
    [webProfile, webUserService, iosChallengeService, androidApp, androidRepository, firestoreRules].forEach((source) => {
      expect(source).toContain('proTrialReviews');
    });
    [webProfile, webUserService, iosChallengeService, androidApp, androidModels, androidRepository, firestoreRules].forEach((source) => {
      expect(source).toContain('manualReviewOnly');
      expect(source).toContain('startsTrial');
      expect(source).toContain('createsPurchase');
      expect(source).toContain('writesEntitlements');
      expect(source).toContain('isPaidAccessLive');
    });
    expect(firestoreRules).toContain('match /proTrialReviews/{reviewId}');
  });

  it('keeps Pro Trial Review Decision Reply Kit copy-only across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('PRO TRIAL REVIEW DECISION REPLY KIT');
      expect(source).toContain('COPY PRO TRIAL DECISION REPLIES');
      expect(source).toContain('proTrialReviewDecisionReplyCopy');
      expect(source).toContain('Manual Pro trial decision replies');
      expect(source).toContain('APPROVED FOR MANUAL TRIAL READINESS');
      expect(source).toContain('WAITING ON STORE TRIAL READINESS');
      expect(source).toContain('NOT READY FOR TRIAL HANDOFF');
      expect(source).toContain('DECLINED FOR TRIAL HANDOFF');
      expect(source).toContain('manual Pro Trial Review Decision Reply Kit only');
      expect(source).toContain('Do not start trials');
      expect(source).toContain('create purchases');
      expect(source).toContain('grant Pro');
      expect(source).toContain('write entitlements');
      expect(source).toContain('unlock paid access');
      expect(source).toContain('collect payment details');
      expect(source).toContain('offer discounts');
      expect(source).toContain('process refunds');
      expect(source).toContain('bypass App Store or Google Play policy');
      expect(source).toContain('claim store-backed trials are live');
      expect(source).toContain('auto-message users');
      expect(source).toContain('scrape/store DMs');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('pressure members');
    });
  });
});

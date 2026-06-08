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

describe('cross-platform support request parity source checks', () => {
  it('keeps support request flow wired across platforms without refund or entitlement side effects', () => {
    const webProfile = readWebProfileContracts();
    const webUserService = readWebUserServiceContracts();
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');
    const androidViewModel = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/AppViewModel.kt'), 'utf8');

    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('SUPPORT REQUEST');
      expect(source).toContain('SEND SUPPORT REQUEST');
      expect(source).toContain('supportRequests');
      expect(source).toContain('does not process refunds');
      expect(source).toContain('cancel subscriptions');
      expect(source).toContain('change entitlements');
      expect(source).toContain('SUPPORT REVIEW QUEUE');
      expect(source).toContain('Admin-only queue');
      expect(source).toContain('do not resolve refunds');
      expect(source).toContain('Manual support review note');
      expect(source).toContain('WAIT');
      expect(source).toContain('RESOLVE');
      expect(source).toContain('CLOSE');
    });
    [webUserService, iosChallengeService, androidRepository, firestoreRules].forEach((source) => {
      expect(source).toContain('supportRequests');
      expect(source).toContain('reviewSupportRequest');
      expect(source).toContain('reviewNote');
      expect(source).toContain('reviewedBy');
      expect(source).toContain('reviewedAt');
      expect(source).toContain('status');
      expect(source).toContain('open');
      expect(source).toContain('waiting');
      expect(source).toContain('resolved');
      expect(source).toContain('closed');
      expect(source).toContain('category');
      expect(source).toContain('message');
    });
    [iosChallengeService, androidModels].forEach((source) => {
      expect(source).toContain('SupportRequest');
    });
    expect(webProfile).toContain('submitSupportRequest');
    expect(webProfile).toContain('getSupportReviewQueue');
    expect(iosProfile).toContain('sendSupportRequest');
    expect(iosChallengeService).toContain('getSupportReviewQueue');
    expect(androidViewModel).toContain('submitSupportRequest');
    expect(androidViewModel).toContain('supportReviewQueue');
    expect(firestoreRules).toContain('request.resource.data.status == "open"');
  });

  it('keeps Support Decision Reply Kit copy-only across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('SUPPORT DECISION REPLY KIT');
      expect(source).toContain('COPY SUPPORT DECISION REPLIES');
      expect(source).toContain('supportDecisionReplyCopy');
      expect(source).toContain('Manual support-reviewed status replies');
      expect(source).toContain('WAITING ON SUPPORT FOLLOW-UP');
      expect(source).toContain('RESOLVED AFTER SUPPORT REVIEW');
      expect(source).toContain('CLOSED FOR NOW');
      expect(source).toContain('ESCALATE TO MARKETPLACE SUPPORT');
      expect(source).toContain('Do not process refunds');
      expect(source).toContain('cancel subscriptions');
      expect(source).toContain('resolve purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('delete accounts');
      expect(source).toContain('erase activity records');
      expect(source).toContain('collect payment details');
      expect(source).toContain('bypass App Store or Google Play policy');
      expect(source).toContain('expose private user data');
      expect(source).toContain('promise immediate resolution');
      expect(source).toContain('auto-message users');
      expect(source).toContain('scrape/store DMs');
      expect(source).toContain('pressure members');
    });
  });
});

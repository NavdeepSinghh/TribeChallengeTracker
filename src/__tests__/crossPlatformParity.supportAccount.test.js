const {
  fs,
  path,
  repoRoot,
  iosChallengeService,
  iosProfile,
  iosUserProfile,
  androidRepository,
  androidApp,
  androidModels,
  readWebProfileContracts,
  readWebUserServiceContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform support and account parity source checks', () => {
  it('keeps account deletion request flow wired across platforms without destructive side effects', () => {
    const webProfile = readWebProfileContracts();
    const webUserService = readWebUserServiceContracts();
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');
    const androidViewModel = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/AppViewModel.kt'), 'utf8');

    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('ACCOUNT DELETION REQUEST');
      expect(source).toContain('REQUEST ACCOUNT DELETION');
      expect(source).toContain('Deletion request recorded');
      expect(source).toContain('does not immediately delete your account');
      expect(source).toContain('marketplace refund policy');
      expect(source).toContain('ACCOUNT DELETION REVIEW QUEUE');
      expect(source).toContain('Admin-only support queue');
      expect(source).toContain('backend deletion work');
      expect(source).toContain('Manual account deletion review note');
      expect(source).toContain('VERIFIED');
      expect(source).toContain('CONTACTED');
      expect(source).toContain('BLOCKED');
      expect(source).toContain('CLOSED');
      expect(source).toContain('does not delete the account');
    });
    [webUserService, iosChallengeService, androidRepository, firestoreRules].forEach((source) => {
      expect(source).toContain('accountDeletionRequests');
      expect(source).toContain('accountDeletionRequest');
      expect(source).toContain('status');
      expect(source).toContain('requested');
      expect(source).toContain('reviewAccountDeletionRequest');
      expect(source).toContain('reviewNote');
      expect(source).toContain('reviewedBy');
      expect(source).toContain('reviewedAt');
      expect(source).toContain('contacted');
      expect(source).toContain('verified');
      expect(source).toContain('blocked');
      expect(source).toContain('closed');
    });
    [iosUserProfile, androidModels].forEach((source) => {
      expect(source).toContain('AccountDeletionRequestStatus');
      expect(source).toContain('accountDeletionRequest');
    });
    expect(webProfile).toContain('requestAccountDeletion');
    expect(webProfile).toContain('getAccountDeletionReviewQueue');
    expect(webProfile).toContain('handleAccountDeletionReview');
    expect(iosProfile).toContain('submitAccountDeletionRequest');
    expect(iosProfile).toContain('submitAccountDeletionReview');
    expect(iosProfile).toContain('accountDeletionReviewQueue');
    expect(iosChallengeService).toContain('getAccountDeletionReviewQueue');
    expect(androidViewModel).toContain('requestAccountDeletion');
    expect(androidViewModel).toContain('reviewAccountDeletionRequest');
    expect(androidViewModel).toContain('accountDeletionReviewQueue');
    expect(firestoreRules).toContain('request.resource.data.uid == request.auth.uid');
    expect(firestoreRules).toContain('affectedKeys().hasOnly(["accountDeletionRequest"])');
  });

  it('keeps Account Deletion Decision Reply Kit copy-only across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('ACCOUNT DELETION DECISION REPLY KIT');
      expect(source).toContain('COPY ACCOUNT DELETION DECISION REPLIES');
      expect(source).toContain('accountDeletionDecisionReplyCopy');
      expect(source).toContain('Manual support-reviewed deletion replies');
      expect(source).toContain('VERIFIED FOR SUPPORT FOLLOW-UP');
      expect(source).toContain('CONTACTED FOR MORE INFO');
      expect(source).toContain('BLOCKED FOR NOW');
      expect(source).toContain('CLOSED AFTER SUPPORT REVIEW');
      expect(source).toContain('Do not delete Firebase Auth accounts');
      expect(source).toContain('erase activity records');
      expect(source).toContain('erase purchase records');
      expect(source).toContain('cancel subscriptions');
      expect(source).toContain('process refunds');
      expect(source).toContain('write entitlements');
      expect(source).toContain('bypass App Store or Google Play policy');
      expect(source).toContain('collect payment details');
      expect(source).toContain('expose private user data');
      expect(source).toContain('promise immediate deletion');
      expect(source).toContain('auto-message users');
      expect(source).toContain('scrape/store DMs');
      expect(source).toContain('pressure members');
    });
  });
});

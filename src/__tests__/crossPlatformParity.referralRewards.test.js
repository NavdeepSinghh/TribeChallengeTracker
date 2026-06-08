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

describe('cross-platform referral rewards parity source checks', () => {
  it('keeps referral reward claim flow wired across platforms without granting rewards client-side', () => {
    const webProfile = readWebProfileContracts();
    const webUserService = readWebUserServiceContracts();
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');
    const androidViewModel = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/AppViewModel.kt'), 'utf8');

    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('REFERRAL REWARD CLAIM');
      expect(source).toContain('CLAIM REFERRAL REWARD');
      expect(source).toContain('referralRewardClaims');
      expect(source).toContain('request-only');
      expect(source).toContain('does not grant Pro');
      expect(source).toContain('entitlements');
      expect(source).toContain('discounts');
      expect(source).toContain('payouts');
      expect(source).toContain('REFERRAL REWARD REVIEW QUEUE');
      expect(source).toContain('Admin-only queue');
      expect(source).toContain('meaningful challenge joins');
      expect(source).toContain('Manual referral reward review note');
      expect(source).toContain('APPROVE');
      expect(source).toContain('WAIT');
      expect(source).toContain('NOT READY');
      expect(source).toContain('DECLINE');
    });
    [webUserService, iosChallengeService, androidRepository, firestoreRules].forEach((source) => {
      expect(source).toContain('referralRewardClaims');
      expect(source).toContain('reviewReferralRewardClaim');
      expect(source).toContain('reviewNote');
      expect(source).toContain('reviewedBy');
      expect(source).toContain('reviewedAt');
      expect(source).toContain('tierTarget');
      expect(source).toContain('referralJoins');
      expect(source).toContain('status');
      expect(source).toContain('open');
      expect(source).toContain('approved');
      expect(source).toContain('waiting');
      expect(source).toContain('not_ready');
      expect(source).toContain('declined');
    });
    [iosChallengeService, androidModels].forEach((source) => {
      expect(source).toContain('ReferralRewardClaim');
      expect(source).toContain('reviewNote');
    });
    expect(webProfile).toContain('claimReferralReward');
    expect(webProfile).toContain('getReferralRewardReviewQueue');
    expect(webProfile).toContain('handleReferralRewardClaimReview');
    expect(iosProfile).toContain('submitReferralRewardClaim');
    expect(iosProfile).toContain('submitReferralRewardClaimReview');
    expect(iosChallengeService).toContain('getReferralRewardReviewQueue');
    expect(androidViewModel).toContain('claimReferralReward');
    expect(androidViewModel).toContain('reviewReferralRewardClaim');
    expect(androidViewModel).toContain('referralRewardReviewQueue');
    expect(firestoreRules).toContain('request.resource.data.referralJoins >= request.resource.data.tierTarget');
  });

  it('keeps Referral Reward Decision Reply Kit copy-only across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('REFERRAL REWARD DECISION REPLY KIT');
      expect(source).toContain('COPY REFERRAL REWARD DECISION REPLIES');
      expect(source).toContain('referralRewardDecisionReplyCopy');
      expect(source).toContain('Manual referral-claim decision replies');
      expect(source).toContain('APPROVED FOR MANUAL RECOGNITION');
      expect(source).toContain('WAITING ON REVIEW');
      expect(source).toContain('NOT READY YET');
      expect(source).toContain('DECLINED FOR NOW');
      expect(source).toContain('Do not grant Pro');
      expect(source).toContain('write entitlements');
      expect(source).toContain('unlock challenge packs');
      expect(source).toContain('create discounts');
      expect(source).toContain('create payouts');
      expect(source).toContain('create purchases');
      expect(source).toContain('create affiliate rewards');
      expect(source).toContain('write referral state');
      expect(source).toContain('count link opens');
      expect(source).toContain('claim fulfillment');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('auto-message users');
      expect(source).toContain('pressure members');
    });
  });
});

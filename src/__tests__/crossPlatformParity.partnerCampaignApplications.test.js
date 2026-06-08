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

describe('cross-platform partner campaign application parity source checks', () => {
  it('keeps Partner Campaign Application Admin Review Updates wired on all platforms without fulfillment side effects', () => {
    const webProfile = readWebProfileContracts();
    const webUserService = readWebUserServiceContracts();
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');
    [
      webUserService,
      iosChallengeService,
      androidRepository,
      firestoreRules,
    ].forEach((source) => {
      expect(source).toContain('reviewPartnerCampaignApplication');
      expect(source).toContain('reviewNote');
      expect(source).toContain('reviewedBy');
      expect(source).toContain('reviewedAt');
      expect(source).toContain('approved');
      expect(source).toContain('waiting');
      expect(source).toContain('not_ready');
      expect(source).toContain('declined');
    });
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('Manual campaign review note');
      expect(source).toContain('APPROVE');
      expect(source).toContain('WAIT');
      expect(source).toContain('NOT READY');
      expect(source).toContain('DECLINE');
      expect(source).toContain('partner terms');
      expect(source).toContain('destination safety');
      expect(source).toContain('without adding partner links');
      expect(source).toContain('tracking pixels');
      expect(source).toContain('ad targeting');
      expect(source).toContain('affiliate payouts');
      expect(source).toContain('purchases');
      expect(source).toContain('entitlements');
      expect(source).toContain('revenue-share');
      expect(source).toContain('paid-access claims');
    });
    expect(androidModels).toContain('reviewNote');
    expect(iosChallengeService).toContain('reviewNote');
  });

  it('keeps Partner Campaign Application review wired across platforms without partner monetization side effects', () => {
    const webProfile = readWebProfileContracts();
    const webUserService = readWebUserServiceContracts();
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');
    const androidViewModel = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/AppViewModel.kt'), 'utf8');

    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('PARTNER CAMPAIGN APPLICATION');
      expect(source).toContain('APPLY FOR PARTNER PILOT REVIEW');
      expect(source).toContain('partnerCampaignApplications');
      expect(source).toContain('manual review');
      expect(source).toContain('PARTNER CAMPAIGN APPLICATION REVIEW QUEUE');
      expect(source).toContain('Admin-only queue');
      expect(source).toContain('do not add partner links');
      expect(source).toContain('tracking pixels');
      expect(source).toContain('ad targeting');
      expect(source).toContain('affiliate payouts');
      expect(source).toContain('purchases');
      expect(source).toContain('entitlements');
      expect(source).toContain('revenue-share');
      expect(source).toContain('paid-access claims');
    });
    [webUserService, iosChallengeService, androidRepository, firestoreRules].forEach((source) => {
      expect(source).toContain('partnerCampaignApplications');
      expect(source).toContain('topPerkId');
      expect(source).toContain('topPerkLabel');
      expect(source).toContain('demandCount');
      expect(source).toContain('totalDemand');
      expect(source).toContain('campaignReach');
      expect(source).toContain('referralJoins');
      expect(source).toContain('status');
      expect(source).toContain('open');
    });
    [iosChallengeService, androidModels].forEach((source) => {
      expect(source).toContain('PartnerCampaignApplication');
    });
    expect(webProfile).toContain('submitPartnerCampaignApplication');
    expect(webProfile).toContain('getPartnerCampaignApplicationReviewQueue');
    expect(iosProfile).toContain('submitPartnerCampaignReview');
    expect(iosChallengeService).toContain('getPartnerCampaignApplicationReviewQueue');
    expect(androidViewModel).toContain('submitPartnerCampaignApplication');
    expect(androidViewModel).toContain('partnerCampaignApplicationReviewQueue');
    expect(firestoreRules).toContain('request.resource.data.demandCount >= 0');
  });
});

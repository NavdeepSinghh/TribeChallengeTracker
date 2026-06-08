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

describe('cross-platform feature submission parity source checks', () => {
  it('keeps Feature Submission Review Notes wired across platforms without auto-posting', () => {
    const webProfile = readWebProfileContracts();
    const webUserService = readWebUserServiceContracts();
    const androidViewModel = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/AppViewModel.kt'), 'utf8');
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');

    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Manual feature submission review note');
      expect(source).toContain('APPROVE');
      expect(source).toContain('FEATURED');
      expect(source).toContain('DECLINE');
      expect(source).toContain('Manual UGC/content review only');
      expect(source).toContain('do not auto-post');
      expect(source).toContain('override consent');
      expect(source).toContain('share unreviewed submissions');
    });
    [webUserService, iosChallengeService, androidRepository].forEach((source) => {
      expect(source).toContain('reviewFeatureSubmission');
      expect(source).toContain('reviewNote');
      expect(source).toContain('reviewedBy');
      expect(source).toContain('reviewedAt');
      expect(source).toContain('approved');
      expect(source).toContain('featured');
      expect(source).toContain('declined');
    });
    expect(androidModels).toContain('FeatureSubmission');
    expect(androidModels).toContain('reviewNote');
    expect(androidModels).toContain('reviewedBy');
    expect(androidModels).toContain('reviewedAt');
    expect(androidModels).toContain('featured');
    expect(androidViewModel).toContain('reviewFeatureSubmission');
    expect(androidViewModel).toContain('reviewNote');
    expect(firestoreRules).toContain('match /featureSubmissions/{submissionId}');
    expect(firestoreRules).toContain('consentToFeature == true');
    expect(firestoreRules).toContain('resource.data.status == "featured"');
    expect(firestoreRules).toContain('["pending", "approved", "featured", "declined"]');
  });
});

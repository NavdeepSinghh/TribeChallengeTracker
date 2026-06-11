const {
  fs,
  path,
  repoRoot,
  webChallengeService,
  webChallengesTab,
  iosChallengeModel,
  iosChallengeService,
  iosChallengeTracker,
  iosProfile,
  iosUserProfile,
  androidRepository,
  androidBilling,
  androidApp,
  iosProducts,
  androidModels,
  readWebProfileContracts,
  readWebUserServiceContracts,
} = require('../testUtils/crossPlatformParityFixtures');


describe('cross-platform challenge pack parity source checks', () => {
  it('keeps Challenge Pack Launch Kit wired on all platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CHALLENGE PACK LAUNCH KIT');
      expect(source).toContain('COPY PACK LAUNCH COPY');
      expect(source).toContain('challengePackLaunchCopy');
      expect(source).toContain('Copy for paid-pack demand before store launch');
      expect(source).toContain('Store credentials and test purchases');
      expect(source).toContain('CHALLENGE PACK OBJECTION REPLY KIT');
      expect(source).toContain('COPY PACK REPLIES');
      expect(source).toContain('challengePackObjectionReplyCopy');
      expect(source).toContain('Do not claim challenge packs are live');
      expect(source).toContain('quote unconfigured prices');
      expect(source).toContain('unlock packs');
      expect(source).toContain('bypass marketplace policy');
    });
    [fs.readFileSync(path.resolve(repoRoot, 'src/proFeatures.js'), 'utf8'), iosProducts, androidModels].forEach((source) => {
      expect(source).toContain('com.risewiththetribe.pack.21_day_reset');
      expect(source).toContain('com.risewiththetribe.pack.summer_shred');
      expect(source).toContain('com.risewiththetribe.pack.beginner_consistency');
    });
  });

  it('keeps paid pack product IDs in native store catalogs', () => {
    [
      'com.risewiththetribe.pack.21_day_reset',
      'com.risewiththetribe.pack.summer_shred',
      'com.risewiththetribe.pack.beginner_consistency',
    ].forEach((productId) => {
      expect(iosProducts).toContain(productId);
      expect(androidModels).toContain(productId);
    });
  });

  it('keeps premium pack accountability prompts wired on all platforms', () => {
    [
      webChallengeService,
      webChallengesTab,
      iosChallengeModel,
      iosChallengeService,
      iosChallengeTracker,
      androidModels,
      androidRepository,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('dailyPrompts');
    });

    [webChallengesTab, iosChallengeTracker, androidApp].forEach((source) => {
      expect(source).toContain('PACK ACCOUNTABILITY PROMPTS');
    });
  });

  it('keeps paid pack value preview visible on challenge templates', () => {
    const iosCreateChallenge = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Views/CreateChallengeView.swift'), 'utf8');
    [
      webChallengesTab,
      iosCreateChallenge,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('PACK VALUE PREVIEW');
      expect(source).toContain('DAYS');
      expect(source).toContain('TASKS');
      expect(source).toContain('PROMPTS');
      expect(source).toContain('Unlock with Tribe Pro or this pack');
    });
  });
});

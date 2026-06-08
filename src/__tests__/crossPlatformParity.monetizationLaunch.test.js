const {
  iosChallengeService,
  iosProfile,
  androidRepository,
  androidApp,
  readWebProfileContracts,
  readWebUserServiceContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform monetization launch parity source checks', () => {
  it('keeps Pro Trial demand summary admin-only and aggregate on all platforms', () => {
    const webProfile = readWebProfileContracts();
    const webUserService = readWebUserServiceContracts();
    [
      webUserService,
      iosChallengeService,
      androidRepository,
    ].forEach((source) => {
      expect(source).toContain('getProTrialInterestSummary');
      expect(source).toContain('proTrialInterest');
      expect(source).toContain('selectedIds');
    });
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('Pro trial demand summary');
      expect(source).toContain('TRIAL LAUNCH KIT');
      expect(source).toContain('proTrialPitchCopy');
      expect(source).toContain('PRO TRIAL OBJECTION REPLY KIT');
      expect(source).toContain('COPY PRO TRIAL REPLIES');
      expect(source).toContain('proTrialObjectionReplyCopy');
      expect(source).toContain('Do not claim a store-backed trial is live');
      expect(source).toContain('quote unconfigured prices');
      expect(source).toContain('promise founder pricing');
    });
  });

  it('keeps Creator revenue-share demand summary admin-only and aggregate on all platforms', () => {
    const webProfile = readWebProfileContracts();
    const webUserService = readWebUserServiceContracts();
    [
      webUserService,
      iosChallengeService,
      androidRepository,
    ].forEach((source) => {
      expect(source).toContain('getCreatorRevenueShareSummary');
      expect(source).toContain('revenueShareInterest');
      expect(source).toContain('branded');
    });
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('CREATOR DEMAND SUMMARY');
      expect(source).toContain('COPY CREATOR BETA COPY');
      expect(source).toContain('creatorRevenueSharePitchCopy');
    });
  });

  it('keeps Monetization Launch Board admin-only on all platforms', () => {
    const webProfile = readWebProfileContracts();
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('Monetization Launch Board');
      expect(source).toContain('monetizationLaunchCopy');
      expect(source).toContain('COPY LAUNCH BOARD COPY');
      expect(source).toContain('first-party monetization signals');
    });
  });

});

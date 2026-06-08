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

describe('cross-platform community event interest parity source checks', () => {
  it('keeps Community Event Interest Kit wired on all platforms without ticket, merch, venue, payment, or tracking side effects', () => {
    const webProfile = readWebProfileContracts();
    const webUserService = readWebUserServiceContracts();

    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('COMMUNITY EVENT INTEREST KIT');
      expect(source).toContain('COMMUNITY EVENT INTEREST');
      expect(source).toContain('COPY EVENT INTEREST KIT');
      expect(source).toContain('communityEventInterestCopy');
      expect(source).toContain('Local meetup, merch, and finisher-moment validation');
      expect(source).toContain('first-party app signals');
      expect(source).toContain('Do not sell tickets');
      expect(source).toContain('collect payments');
      expect(source).toContain('create orders');
      expect(source).toContain('promise merch');
      expect(source).toContain('book venues');
      expect(source).toContain('create partner links');
      expect(source).toContain('create payouts');
      expect(source).toContain('write entitlements');
      expect(source).toContain('export private member data');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('scrape DMs');
    });
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
      expect(source).toContain('communityEventInterest');
      expect(source).toContain('local_meetup');
      expect(source).toContain('milestone_merch');
      expect(source).toContain('studio_popup');
      expect(source).toContain('finisher_moment');
    });
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('First-party event demand, no commerce');
      expect(source).toContain('TAP TO SAVE');
      expect(source).toContain('DEMAND');
    });
  });
});

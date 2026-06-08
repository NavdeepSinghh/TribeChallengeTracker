const {
  iosProfile,
  androidApp,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');


describe('cross-platform community launch parity source checks', () => {
  it('keeps Referral Launch Kit wired on all platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('REFERRAL LAUNCH KIT');
      expect(source).toContain('COPY REFERRAL LAUNCH COPY');
      expect(source).toContain('Next-tier invite launch plan');
      expect(source).toContain('referralLaunchCopy');
      expect(source).toContain('Current tribe momentum');
      expect(source).toContain('Launch checklist');
      expect(source).toContain('Use the invite link from the app');
      expect(source).toContain('Review progress from first-party challenge joins only');
      expect(source).toContain('Caption draft');
      expect(source).toContain('Manual comment reply');
      expect(source).toContain('completed joins, not link clicks');
      expect(source).toContain('@risewiththetribe');
      expect(source).toContain('REFERRAL STORY SPRINT KIT');
      expect(source).toContain('COPY REFERRAL STORY SPRINT');
      expect(source).toContain('Story/Reel invite around your next tier');
      expect(source).toContain('referralStorySprintCopy');
      expect(source).toContain('Story sprint');
      expect(source).toContain('Reel hook');
      expect(source).toContain('REFERRAL REWARD SOCIAL PROOF KIT');
      expect(source).toContain('COPY REFERRAL SOCIAL PROOF');
      expect(source).toContain('Reward-tier celebration copy');
      expect(source).toContain('referralRewardSocialProofCopy');
      expect(source).toContain('Story caption');
      expect(source).toContain('Carousel beats');
      expect(source).toContain('Do not count link opens');
      expect(source).toContain('grant rewards');
      expect(source).toContain('write referral state');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('pressure invites');
      expect(source).toContain('claim fulfillment before admin review');
    });
  });

});

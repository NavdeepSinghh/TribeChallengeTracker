const {
  iosProfile,
  androidApp,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform community experiment parity source checks', () => {
  it('keeps Launch Experiment Kit wired across admin and creator profile surfaces', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('LAUNCH EXPERIMENT KIT');
      expect(source).toContain('COPY EXPERIMENT BRIEF');
      expect(source).toContain('Pro Trial CTA');
      expect(source).toContain('Pack Drop Tease');
      expect(source).toContain('Referral Sprint');
      expect(source).toContain('Partner Perk Poll');
      expect(source).toContain('manual Instagram/app experiment');
      expect(source).toContain('do not add tracking pixels');
      expect(source).toContain('do not promote paid access as live');
    });
  });

  it('keeps Launch Experiment Scorecard wired across admin and creator profile surfaces', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('LAUNCH EXPERIMENT SCORECARD');
      expect(source).toContain('COPY EXPERIMENT SCORECARD');
      expect(source).toContain('First-party signal readout for the next test');
      expect(source).toContain('Demand signal');
      expect(source).toContain('Campaign reach');
      expect(source).toContain('Community loop');
      expect(source).toContain('manual planning score');
      expect(source).toContain('does not add tracking pixels');
      expect(source).toContain('does not grant or imply paid access');
    });
  });

  it('keeps Lapsed Member Winback Kit free-first across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('LAPSED MEMBER WINBACK KIT');
      expect(source).toContain('COPY LAPSED WINBACK');
      expect(source).toContain('lapsedMemberWinbackCopy');
      expect(source).toContain('Free comeback challenge and app-first return copy');
      expect(source).toContain('FREE FIRST');
      expect(source).toContain('Lead with a free comeback challenge');
      expect(source).toContain('streak rescue prompts');
      expect(source).toContain('Review first-party re-engagement signals only');
      expect(source).toContain('Do not auto-message users');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('offer unconfigured discounts');
      expect(source).toContain('retry charges');
      expect(source).toContain('collect payment details');
      expect(source).toContain('create purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('pressure members to return');
    });
  });

  it('keeps Launch Retrospective Kit wired across admin and creator profile surfaces', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('LAUNCH RETROSPECTIVE KIT');
      expect(source).toContain('COPY RETROSPECTIVE KIT');
      expect(source).toContain('Manual first-party review after a campaign push');
      expect(source).toContain('Experiment reviewed');
      expect(source).toContain('Planning score');
      expect(source).toContain('Referral joins');
      expect(source).toContain('challenge joins');
      expect(source).toContain('feature submissions');
      expect(source).toContain('does not add tracking pixels');
      expect(source).toContain('automated attribution');
      expect(source).toContain('paid-access changes');
    });
  });
});

const {
  iosProfile,
  androidApp,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform weekly campaign live content parity source checks', () => {
  it('keeps Weekly Campaign Live Q&A Kit wired on all platforms without off-platform identity or consent side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign Live Q&A Kit');
      expect(source).toContain('COPY LIVE Q&A');
      expect(source).toContain('weeklyCampaignLiveQaCopy');
      expect(source).toContain('Live setup');
      expect(source).toContain('Question lanes');
      expect(source).toContain('Close');
      expect(source).toContain('app-first actions');
      expect(source).toContain('Feature Me with consent');
      expect(source).toContain('paid packs, Pro, or creator hosting');
      expect(source).toContain('Do not auto-host');
      expect(source).toContain('record private replies');
      expect(source).toContain('scrape comments');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store Instagram identities');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('create attribution records');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('treat Live questions as app consent');
      expect(source).toContain('share private responses');
      expect(source).toContain('pressure users');
    });
  });

  it('keeps Weekly Campaign Live Recap Kit wired on all platforms without off-platform attribution or consent side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign Live Recap Kit');
      expect(source).toContain('COPY LIVE RECAP');
      expect(source).toContain('weeklyCampaignLiveRecapCopy');
      expect(source).toContain('Manual recap prompts');
      expect(source).toContain('What question came up more than once');
      expect(source).toContain('Which app-first action answered it best');
      expect(source).toContain('Which first-party signal should confirm momentum after the Live');
      expect(source).toContain('Public recap copy');
      expect(source).toContain('Use the Live as directional content feedback only');
      expect(source).toContain('Do not auto-post');
      expect(source).toContain('record private replies');
      expect(source).toContain('scrape comments');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store Instagram identities');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('create attribution records');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('treat Live questions as app consent');
      expect(source).toContain('share private responses');
      expect(source).toContain('pressure users');
    });
  });
});

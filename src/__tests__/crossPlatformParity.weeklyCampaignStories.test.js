const {
  iosProfile,
  androidApp,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform weekly campaign story parity source checks', () => {
  it('keeps Weekly Campaign Countdown Story Kit wired on all platforms without scheduling, scraping, or consent side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign Countdown Story Kit');
      expect(source).toContain('COPY COUNTDOWN STORIES');
      expect(source).toContain('weeklyCampaignCountdownStoryCopy');
      expect(source).toContain('Manual Story sequence');
      expect(source).toContain('Frame 1: Countdown sticker');
      expect(source).toContain('Frame 3: Join CTA');
      expect(source).toContain('Sticker text');
      expect(source).toContain('What would make you show up on day one?');
      expect(source).toContain('Use visible Story engagement as directional content feedback only');
      expect(source).toContain('Do not auto-post');
      expect(source).toContain('schedule Stories');
      expect(source).toContain('scrape Story responses');
      expect(source).toContain('scrape comments');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store Instagram identities');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('create attribution records');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('treat Story interactions as app consent');
      expect(source).toContain('share private responses');
      expect(source).toContain('pressure users');
    });
  });

  it('keeps Weekly Campaign Start-Day Story Kit wired on all platforms without scheduling, scraping, or consent side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign Start-Day Story Kit');
      expect(source).toContain('COPY START-DAY STORIES');
      expect(source).toContain('weeklyCampaignStartDayStoryCopy');
      expect(source).toContain('Manual Story sequence');
      expect(source).toContain('Frame 1: It starts today');
      expect(source).toContain('Frame 4: Proof');
      expect(source).toContain('CTA sticker: Open Rise With The Tribe');
      expect(source).toContain('Use Story reactions as directional content feedback only');
      expect(source).toContain('first-party challenge joins');
      expect(source).toContain('saved activity logs');
      expect(source).toContain('Do not auto-post');
      expect(source).toContain('schedule Stories');
      expect(source).toContain('scrape Story responses');
      expect(source).toContain('scrape comments');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store Instagram identities');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('create attribution records');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('treat Story reactions as app consent');
      expect(source).toContain('share private responses');
      expect(source).toContain('pressure users');
    });
  });

});

const {
  iosProfile,
  androidApp,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform weekly campaign content bank parity source checks', () => {
  it('keeps Weekly Campaign FAQ Carousel Kit wired on all platforms without scraping, scheduling, or consent side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign FAQ Carousel Kit');
      expect(source).toContain('COPY FAQ CAROUSEL');
      expect(source).toContain('weeklyCampaignFaqCarouselCopy');
      expect(source).toContain('Carousel outline');
      expect(source).toContain('Slide 1');
      expect(source).toContain('Q: How do I join?');
      expect(source).toContain('Q: Are Pro, paid packs, or creator hosting live?');
      expect(source).toContain('Review note');
      expect(source).toContain('Use repeated questions as directional content input only');
      expect(source).toContain('Do not auto-post');
      expect(source).toContain('schedule posts');
      expect(source).toContain('scrape comments');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store Instagram identities');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('create attribution records');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('treat Instagram questions as app consent');
      expect(source).toContain('share private responses');
      expect(source).toContain('pressure users');
    });
  });

  it('keeps Weekly Campaign Caption Bank Kit wired on all platforms without posting or tracking side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Weekly Campaign Caption Bank Kit');
      expect(source).toContain('COPY CAPTION BANK');
      expect(source).toContain('weeklyCampaignCaptionBankCopy');
      expect(source).toContain('Reel caption');
      expect(source).toContain('Carousel caption');
      expect(source).toContain('Story caption');
      expect(source).toContain('Pinned comment');
      expect(source).toContain('Use the Story Poll Kit and Poll Review Kit');
      expect(source).toContain('Do not auto-post');
      expect(source).toContain('schedule posts');
      expect(source).toContain('scrape comments');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('store inbound replies');
      expect(source).toContain('create attribution records');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('share private responses');
      expect(source).toContain('pressure users');
    });
  });
});

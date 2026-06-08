const {
  iosProfile,
  androidApp,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform weekly campaign review planning parity source checks', () => {
  it('keeps Weekly Campaign review, storyboard, and experiment kits wired without automation or attribution side effects', () => {
    const webProfile = readWebProfileContracts();
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('Weekly Campaign Review Kit');
      expect(source).toContain('weeklyCampaignReviewCopy');
      expect(source).toContain('COPY CAMPAIGN REVIEW');
      expect(source).toContain('First-party weekly campaign review');
      expect(source).toContain('Review notes');
      expect(source).toContain('Share-card usage');
      expect(source).toContain('consent-cleared for Instagram review');
      expect(source).toContain('Do not create attribution records');
      expect(source).toContain('scrape or store Instagram DMs');
      expect(source).toContain('Weekly Campaign Storyboard Kit');
      expect(source).toContain('weeklyCampaignStoryboardCopy');
      expect(source).toContain('COPY STORYBOARD KIT');
      expect(source).toContain('Reels, Stories, and carousel outline');
      expect(source).toContain('Reel storyboard');
      expect(source).toContain('Story frames');
      expect(source).toContain('Carousel outline');
      expect(source).toContain('manual content storyboard only');
      expect(source).toContain('schedule posts from the app');
      expect(source).toContain('Weekly Campaign Experiment Brief Kit');
      expect(source).toContain('weeklyCampaignExperimentBriefCopy');
      expect(source).toContain('COPY EXPERIMENT BRIEF');
      expect(source).toContain('Manual experiment from weekly campaign signals');
      expect(source).toContain('Recommended experiment');
      expect(source).toContain('Experiment brief');
      expect(source).toContain('Measure only first-party app movement');
      expect(source).toContain('Do not create experiment records');
    });
  });
});

const {
  webChallengeService,
  iosChallengeModel,
  iosChallengeService,
  iosProfile,
  androidRepository,
  androidApp,
  androidModels,
  readWebProfileContracts,
  readWebUserServiceContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform weekly campaign core parity source checks', () => {
  it('keeps Campaign Performance Board admin-only and aggregate on all platforms', () => {
    const webProfile = readWebProfileContracts();
    const webUserService = readWebUserServiceContracts();
    expect(webUserService).toContain('getCampaignPerformanceSummary');
    [
      webUserService,
      iosChallengeService,
      androidRepository,
    ].forEach((source) => {
      expect(source).toContain('getCampaignPerformanceSummary');
      expect(source).toContain('campaignId');
      expect(source).toContain('memberReach');
    });
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('Campaign Performance Board');
      expect(source).toContain('campaignPerformanceCopy');
      expect(source).toContain('COPY CAMPAIGN BOARD COPY');
      expect(source).toContain('weekly campaign engine summary');
    });
  });

  it('keeps Weekly Campaign Scheduler wired on all platforms', () => {
    const webProfile = readWebProfileContracts();
    [webChallengeService, iosChallengeModel, androidModels].forEach((source) => {
      expect(source).toContain('getWeeklyCampaignPrompt');
      expect(source).toContain('campaignId');
    });
    [iosChallengeModel, androidModels].forEach((source) => {
      expect(source).toContain('WeeklyCampaignPrompt');
    });
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('Weekly Campaign Scheduler');
      expect(source).toContain('campaignSchedulerCopy');
      expect(source).toContain('COPY WEEKLY CAMPAIGN COPY');
      expect(source).toContain('Creator/admin Instagram cadence prompt');
      expect(source).toContain('Weekly Campaign Launch Card Kit');
      expect(source).toContain('weeklyCampaignLaunchCardCopy');
      expect(source).toContain('COPY LAUNCH CARD KIT');
      expect(source).toContain('Shareable campaign card brief');
      expect(source).toContain('Card headline');
      expect(source).toContain('Design notes');
      expect(source).toContain('Caption draft');
      expect(source).toContain('Do not auto-post to Instagram');
      expect(source).toContain('scrape DMs');
      expect(source).toContain('tracking pixels');
      expect(source).toContain('share user activity without consent');
      expect(source).toContain('Weekly Campaign Preflight Checklist');
      expect(source).toContain('weeklyCampaignPreflightCopy');
      expect(source).toContain('COPY CAMPAIGN PREFLIGHT');
      expect(source).toContain('Manual launch readiness before posting');
      expect(source).toContain('Preflight checks');
      expect(source).toContain('DM keyword replies for TRIBE, COMEBACK, PRO, and FEATURE');
      expect(source).toContain('Seven-day content calendar');
      expect(source).toContain('Feature submissions and user activity are shared only with consent and manual review');
      expect(source).toContain('first-party challenge joins');
      expect(source).toContain('Do not schedule posts');
      expect(source).toContain('auto-post to Instagram');
      expect(source).toContain('store inbound DMs');
      expect(source).toContain('export per-user activity');
      expect(source).toContain('share user content without consent');
      expect(source).toContain('imply paid access is live');
    });
  });

});

const {
  iosChallengeService,
  iosProfile,
  androidRepository,
  androidApp,
  androidModels,
  readWebProfileContracts,
  readWebUserServiceContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform community content parity source checks', () => {
  it('keeps Instagram Content Calendar wired on all platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('INSTAGRAM CONTENT CALENDAR');
      expect(source).toContain('COPY CONTENT CALENDAR');
      expect(source).toContain('Seven-day creator/admin cadence');
      expect(source).toContain('instagramContentCalendarCopy');
      expect(source).toContain('SUNDAY COUNTDOWN');
      expect(source).toContain('FOUNDER NOTE');
      expect(source).toContain('@risewiththetribe');
    });
  });

  it('keeps Community Highlight and UGC Consent kits wired on all platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Community Highlight Roundup Kit');
      expect(source).toContain('COPY HIGHLIGHT ROUNDUP');
      expect(source).toContain('communityHighlightRoundupCopy');
      expect(source).toContain('Use featured submissions with consent only');
      expect(source).toContain('Do not auto-post');
      expect(source).toContain('schedule posts');
      expect(source).toContain('share unreviewed submissions');
      expect(source).toContain('UGC Consent Reminder Kit');
      expect(source).toContain('COPY UGC CONSENT REMINDER');
      expect(source).toContain('ugcConsentReminderCopy');
      expect(source).toContain('Confirm the member opted in through the Feature Me consent gate');
      expect(source).toContain('Avoid before/after, medical, weight-loss, or guaranteed outcome claims');
      expect(source).toContain('override consent');
      expect(source).toContain('edit member claims into outcomes');
    });
  });

  it('keeps community highlights for featured submissions wired on all platforms', () => {
    const webProfile = readWebProfileContracts();
    const webUserService = readWebUserServiceContracts();
    [
      webUserService,
      iosChallengeService,
      androidRepository,
    ].forEach((source) => {
      expect(source).toMatch(/getFeaturedSubmissions|featuredSubmissions/);
      expect(source).toContain('featured');
    });
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source.toLowerCase()).toContain('community highlights');
      expect(source).toContain('COPY REPOST CAPTION');
      expect(source).toContain('COMMUNITY HIGHLIGHT ROUNDUP KIT');
      expect(source).toContain('COPY HIGHLIGHT ROUNDUP');
      expect(source).toContain('Weekly featured-win roundup copy');
      expect(source).toContain('communityHighlightRoundupCopy');
      expect(source).toContain('UGC CONSENT REMINDER KIT');
      expect(source).toContain('COPY UGC CONSENT REMINDER');
      expect(source).toContain('ugcConsentReminderCopy');
      expect(source).toContain('Manual repost safety checklist');
      expect(source).toContain('Feature Me consent gate');
      expect(source).toContain('override consent');
      expect(source).toContain('Use featured submissions with consent only');
      expect(source).toContain('share unreviewed submissions');
      expect(source).toContain('@risewiththetribe');
    });
    expect(iosProfile).toContain('getFeaturedSubmissions');
    expect(androidModels).toContain('reviewedAt');
  });

  it('keeps Instagram Weekly Prompt Kit wired on all platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Instagram Weekly Prompt Kit');
      expect(source).toContain('COPY INSTAGRAM PROMPT');
      expect(source).toContain('Tag @risewiththetribe');
      expect(source).toContain('WEEKLY CHALLENGE LAUNCH');
      expect(source).toContain('COMMUNITY WIN');
    });
  });
});

const {
  webChallengesTab,
  iosChallengeTracker,
  androidApp,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform challenge completion recap parity source checks', () => {
  it('keeps completion recap surfaces wired with stats and share copy on all platforms', () => {
    [
      webChallengesTab,
      iosChallengeTracker,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('Completion recap ready to share');
      expect(source).toContain('Premium pack recap ready to share');
      expect(source).toContain('Share Completion Recap');
      expect(source).toContain('I completed');
      expect(source).toContain('on Rise With The Tribe');
      expect(source).toContain('Tag @risewiththetribe and join the next challenge');
      expect(source).toContain('PTS');
      expect(source).toContain('DAYS');
      expect(source).toContain('STREAK');
      expect(source).toContain('day streak');
    });
  });
});

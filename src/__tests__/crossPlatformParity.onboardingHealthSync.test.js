const {
  fs,
  path,
  repoRoot,
} = require('../testUtils/crossPlatformParityFixtures');

const webOnboarding = [
  'src/AuthWelcomeCarousel.jsx',
  'src/OnboardingBackButton.jsx',
  'src/OnboardingProgress.jsx',
  'src/OnboardingScreen.jsx',
  'src/onboardingQuestions.js',
  'src/onboardingLabels.js',
  'src/onboardingCompletionData.js',
  'src/profile/profileDerivedState.js',
].map(file => fs.readFileSync(path.resolve(repoRoot, file), 'utf8')).join('\n');

const androidOnboarding = [
  '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/TribeApp.kt',
  '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/model/Models.kt',
  '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/data/TribeRepository.kt',
].map(file => fs.readFileSync(path.resolve(repoRoot, file), 'utf8')).join('\n');

const iosOnboarding = [
  '../TribeChallengeTrackerIOS/TribeChallenge/Views/AuthView.swift',
  '../TribeChallengeTrackerIOS/TribeChallenge/Views/OnboardingView.swift',
  '../TribeChallengeTrackerIOS/TribeChallenge/Services/FirebaseService.swift',
].map(file => fs.readFileSync(path.resolve(repoRoot, file), 'utf8')).join('\n');

describe('cross-platform onboarding health-sync parity source checks', () => {
  it('keeps guided intro, privacy, data source, and sync preference wired across platforms', () => {
    [webOnboarding, androidOnboarding, iosOnboarding].forEach(source => {
      expect(source).toContain('Join challenges that make the next action obvious');
      expect(source).toContain('Sync workouts and steps when you choose');
      expect(source).toContain('You control what TribeLog can use');
      expect(source).toContain('sync_data');
      expect(source).toContain('dataSource');
      expect(source).toContain('apple_watch');
      expect(source).toContain('health_connect');
      expect(source).toContain('garmin');
      expect(source).toContain('oura');
      expect(source).toContain('workouts_steps');
      expect(source).toContain('advanced_later');
      expect(source).toContain('manual_first');
    });
  });

  it('keeps health permission copy optional and non-medical across platforms', () => {
    [webOnboarding, androidOnboarding, iosOnboarding].forEach(source => {
      expect(source).toContain('Manual logging');
      expect(source).toContain('only ask');
      expect(source).toContain('not medical advice');
    });
  });

  it('keeps onboarding back navigation available across platforms', () => {
    [webOnboarding, androidOnboarding, iosOnboarding].forEach(source => {
      expect(source).toContain('Go back to previous onboarding card');
    });
  });
});

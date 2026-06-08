const {
  fs,
  path,
  repoRoot,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform weekly campaign architecture parity source checks', () => {
  it('keeps the web Weekly Campaign Engine derivation behind the profile derived-data module', () => {
    const webProfileScreen = fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8');
    const webProfileController = fs.readFileSync(path.resolve(repoRoot, 'src/profile/useProfileScreenController.js'), 'utf8');
    const webComputedData = fs.readFileSync(path.resolve(repoRoot, 'src/profile/useProfileComputedData.js'), 'utf8');
    const webDerivedData = fs.readFileSync(path.resolve(repoRoot, 'src/profile/profileScreenDerivedData.js'), 'utf8');
    const webWeeklyCampaignDerivedData = fs.readFileSync(path.resolve(repoRoot, 'src/profile/profileWeeklyCampaignDerivedData.js'), 'utf8');
    const webWeeklyCampaignDerivedResult = fs.readFileSync(path.resolve(repoRoot, 'src/profile/profileWeeklyCampaignDerivedResult.js'), 'utf8');
    const webCampaignDerivationSource = `${webDerivedData}\n${webWeeklyCampaignDerivedData}\n${webWeeklyCampaignDerivedResult}`;

    expect(webProfileScreen).toContain("import useProfileScreenController from './profile/useProfileScreenController'");
    expect(webProfileController).toContain("import useProfileComputedData from './useProfileComputedData'");
    expect(webProfileController).toContain('useProfileComputedData({');
    expect(webComputedData).toContain("import { buildProfileScreenDerivedData } from './profileScreenDerivedData'");
    expect(webComputedData).toContain('buildProfileScreenDerivedData({');
    expect(webProfileScreen).not.toContain("from './profile/weeklyCampaignCoreCopy'");
    expect(webProfileScreen).not.toContain("from './profile/weeklyCampaignEngagementCopy'");
    expect(webProfileScreen).not.toContain("from './profile/launchExperimentCopy'");

    [
      'buildWeeklyCampaignCoreCopy',
      'buildWeeklyCampaignEngagementCopy',
      'buildLaunchExperimentCopy',
      'weeklyCampaignLaunchCardCopy',
      'weeklyCampaignCaptionBankCopy',
      'weeklyCampaignCollabCopyCards',
    ].forEach((token) => {
      expect(webCampaignDerivationSource).toContain(token);
    });
  });
});

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');

const webChallengeService = [
  fs.readFileSync(path.resolve(repoRoot, 'src/challengeService.js'), 'utf8'),
  fs.readFileSync(path.resolve(repoRoot, 'src/challengeBadgeService.js'), 'utf8'),
  fs.readFileSync(path.resolve(repoRoot, 'src/challengeCreationService.js'), 'utf8'),
  fs.readFileSync(path.resolve(repoRoot, 'src/challengeMembershipJoinHelpers.js'), 'utf8'),
  fs.readFileSync(path.resolve(repoRoot, 'src/challengeMembershipJoinService.js'), 'utf8'),
  fs.readFileSync(path.resolve(repoRoot, 'src/challengeMembershipLeaveHelpers.js'), 'utf8'),
  fs.readFileSync(path.resolve(repoRoot, 'src/challengeMembershipLeaveService.js'), 'utf8'),
  fs.readFileSync(path.resolve(repoRoot, 'src/challengeMembershipService.js'), 'utf8'),
  fs.readFileSync(path.resolve(repoRoot, 'src/challengeQueries.js'), 'utf8'),
  fs.readFileSync(path.resolve(repoRoot, 'src/challengeTemplates.js'), 'utf8'),
].join('\n');
const webChallengesTab = [
  fs.readFileSync(path.resolve(repoRoot, 'src/ChallengesTab.jsx'), 'utf8'),
  ...fs.readdirSync(path.resolve(repoRoot, 'src/challenges'))
    .filter(fileName => /\.(jsx|js)$/.test(fileName))
    .sort()
    .map(fileName => fs.readFileSync(path.resolve(repoRoot, 'src/challenges', fileName), 'utf8')),
  ...fs.readdirSync(path.resolve(repoRoot, 'src/challengeTracker'))
    .filter(fileName => /\.(jsx|js)$/.test(fileName))
    .sort()
    .map(fileName => fs.readFileSync(path.resolve(repoRoot, 'src/challengeTracker', fileName), 'utf8')),
].join('\n');

const iosChallengeModel = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Models/Challenge.swift'), 'utf8');
const iosChallengeService = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Services/FirebaseService.swift'), 'utf8');
const iosChallengeTracker = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Views/ChallengeTrackerView.swift'), 'utf8');
const iosProfileViewModel = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/ViewModels/ProfileViewModel.swift'), 'utf8');
const iosProfileView = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Views/ProfileView.swift'), 'utf8');
const iosProfileSectionSources = fs.readdirSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Views/Profile'))
  .filter(fileName => /\.swift$/.test(fileName))
  .sort()
  .map(fileName => fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Views/Profile', fileName), 'utf8'));
const iosPartnerPerkAdminReviewSection = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Views/PartnerPerkAdminReviewSection.swift'), 'utf8');
const iosProfileCopyModels = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Views/ProfileCopyModels.swift'), 'utf8');
const iosWeeklyCampaignCopyKitCard = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Views/WeeklyCampaignCopyKitCard.swift'), 'utf8');
const iosCreatorLaunchKitSection = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Views/CreatorLaunchKitSection.swift'), 'utf8');
const iosCreatorHostingApplicationReviewRow = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Views/CreatorHostingApplicationReviewRow.swift'), 'utf8');
const iosCreatorHostingApplicationSection = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Views/CreatorHostingApplicationSection.swift'), 'utf8');
const iosCreatorProfileFormSection = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Views/CreatorProfileFormSection.swift'), 'utf8');
const iosCreatorProfileOverviewSection = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Views/CreatorProfileOverviewSection.swift'), 'utf8');
const iosCreatorPlanningCopyKits = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Views/CreatorPlanningCopyKits.swift'), 'utf8');
const iosCreatorPlanningCopyKitsSection = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Views/CreatorPlanningCopyKitsSection.swift'), 'utf8');
const iosProfile = `${iosProfileViewModel}\n${iosProfileView}\n${iosProfileSectionSources.join('\n')}\n${iosPartnerPerkAdminReviewSection}\n${iosProfileCopyModels}\n${iosWeeklyCampaignCopyKitCard}\n${iosCreatorLaunchKitSection}\n${iosCreatorHostingApplicationReviewRow}\n${iosCreatorHostingApplicationSection}\n${iosCreatorProfileFormSection}\n${iosCreatorProfileOverviewSection}\n${iosCreatorPlanningCopyKits}\n${iosCreatorPlanningCopyKitsSection}`;
const iosUserProfile = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Models/UserProfile.swift'), 'utf8');

const androidRepository = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/data/TribeRepository.kt'), 'utf8');
const androidBilling = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/data/PlayBillingService.kt'), 'utf8');
const androidTribeApp = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/TribeApp.kt'), 'utf8');
const androidPartnerPerkAdminReviewSection = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/PartnerPerkAdminReviewSection.kt'), 'utf8');
const androidProfileCopyModels = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/ProfileCopyModels.kt'), 'utf8');
const androidWeeklyCampaignCopyKitCard = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/WeeklyCampaignCopyKitCard.kt'), 'utf8');
const androidWeeklyCampaignCopyKits = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/WeeklyCampaignCopyKits.kt'), 'utf8');
const androidCreatorLaunchKitSection = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/CreatorLaunchKitSection.kt'), 'utf8');
const androidCreatorHostingApplicationReviewRow = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/CreatorHostingApplicationReviewRow.kt'), 'utf8');
const androidCreatorHostingApplicationSection = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/CreatorHostingApplicationSection.kt'), 'utf8');
const androidCreatorProfileFormSection = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/CreatorProfileFormSection.kt'), 'utf8');
const androidCreatorProfileOverviewSection = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/CreatorProfileOverviewSection.kt'), 'utf8');
const androidCreatorPlanningCopyKits = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/CreatorPlanningCopyKits.kt'), 'utf8');
const androidCreatorPlanningCopyKitsSection = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/CreatorPlanningCopyKitsSection.kt'), 'utf8');
const androidApp = `${androidTribeApp}\n${androidPartnerPerkAdminReviewSection}\n${androidProfileCopyModels}\n${androidWeeklyCampaignCopyKitCard}\n${androidWeeklyCampaignCopyKits}\n${androidCreatorLaunchKitSection}\n${androidCreatorHostingApplicationReviewRow}\n${androidCreatorHostingApplicationSection}\n${androidCreatorProfileFormSection}\n${androidCreatorProfileOverviewSection}\n${androidCreatorPlanningCopyKits}\n${androidCreatorPlanningCopyKitsSection}`;
const iosProducts = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerIOS/TribeChallenge/Models/UserProfile.swift'), 'utf8');
const androidModels = fs.readFileSync(path.resolve(repoRoot, '../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/model/Models.kt'), 'utf8');

const webProfileModuleSources = fs.readdirSync(path.resolve(repoRoot, 'src/profile'))
  .filter(fileName => /\.(jsx|js)$/.test(fileName))
  .sort()
  .map(fileName => fs.readFileSync(path.resolve(repoRoot, 'src/profile', fileName), 'utf8'));

const webProfileContractSources = [
  fs.readFileSync(path.resolve(repoRoot, 'src/ProfileScreen.jsx'), 'utf8'),
  fs.readFileSync(path.resolve(repoRoot, 'src/communityEvents.js'), 'utf8'),
  ...webProfileModuleSources,
];

const webUserServiceSources = [
  fs.readFileSync(path.resolve(repoRoot, 'src/userService.js'), 'utf8'),
  ...fs.readdirSync(path.resolve(repoRoot, 'src/userServices'))
    .filter(fileName => /\.js$/.test(fileName))
    .sort()
    .map(fileName => fs.readFileSync(path.resolve(repoRoot, 'src/userServices', fileName), 'utf8')),
];

function readWebProfileContracts() {
  return webProfileContractSources.join('\n');
}

function readWebUserServiceContracts() {
  return webUserServiceSources.join('\n');
}

module.exports = {
  fs,
  path,
  repoRoot,
  webChallengeService,
  webChallengesTab,
  iosChallengeModel,
  iosChallengeService,
  iosChallengeTracker,
  iosProfile,
  iosUserProfile,
  androidRepository,
  androidBilling,
  androidApp,
  iosProducts,
  androidModels,
  readWebProfileContracts,
  readWebUserServiceContracts,
};

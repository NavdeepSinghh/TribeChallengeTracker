import { buildCreatorHostingCopyKits } from './creatorHostingCopyKits';

export function buildCreatorHostingCopy({
  creatorOwnedChallenges,
  creatorSpecialty,
  creatorBio,
  creatorCtaUrl = '',
  creatorAnalytics,
  creatorRevenueShareInterest,
  creatorHostingApplicationReviewQueue,
  userId,
}) {
  const creatorLaunchChallenge = creatorOwnedChallenges
    .filter(challenge => !challenge.endDate || new Date(challenge.endDate) >= new Date())
    .sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''))[0] || creatorOwnedChallenges[0];
  const creatorLaunchLink = creatorLaunchChallenge?.inviteCode ? `https://risewiththetribe.app?join=${creatorLaunchChallenge.inviteCode}&ref=${userId}` : '';
  const creatorLaunchCopy = creatorLaunchChallenge
    ? [
        `I am hosting ${creatorLaunchChallenge.name} inside Rise With The Tribe.`,
        creatorSpecialty ? `Focus: ${creatorSpecialty}.` : '',
        creatorBio || creatorLaunchChallenge.tagline || 'Come build consistency with us.',
        creatorLaunchLink ? `Join here: ${creatorLaunchLink}` : '',
        'Tag @risewiththetribe when you join and bring someone with you.',
      ].filter(Boolean).join('\n\n')
    : 'Create your first hosted challenge, then copy a launch post here for Instagram and your community.';
  const creatorHostingCopyKits = buildCreatorHostingCopyKits({
    creatorAnalytics,
    creatorBio,
    creatorCtaUrl,
    creatorHostingApplicationReviewQueue,
    creatorLaunchChallenge,
    creatorRevenueShareInterest,
    creatorSpecialty,
  });

  return {
    creatorLaunchChallenge,
    creatorLaunchLink,
    creatorLaunchCopy,
    ...creatorHostingCopyKits,
  };
}

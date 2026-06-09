import { buildCreatorHostingReadinessCopyKits } from './creatorHostingReadinessCopyKits';
import { buildCreatorHostingReplyCopyKits } from './creatorHostingReplyCopyKits';

function buildCreatorHostingContext({
  creatorAnalytics,
  creatorBio = '',
  creatorCtaUrl = '',
  creatorHostingApplicationReviewQueue,
  creatorLaunchChallenge,
  creatorRevenueShareInterest,
  creatorSpecialty,
}) {
  return {
    candidateChallengeLine: creatorLaunchChallenge
      ? `Candidate challenge: ${creatorLaunchChallenge.name}`
      : 'Candidate challenge: create or choose a hosted challenge first',
    creatorBetaInterestLine: `Creator beta interest: ${creatorRevenueShareInterest ? 'opted in' : 'not opted in yet'}`,
    creatorBioLine: `Creator bio: ${creatorBio || 'add a short proof-first bio before sharing'}`,
    creatorCtaLine: `Creator CTA: ${creatorCtaUrl || 'add an app-first CTA link before sharing'}`,
    creatorFocusLine: `Creator focus: ${creatorSpecialty || 'Accountability challenge host'}`,
    hostedChallengesLine: `Hosted challenges: ${creatorAnalytics.hosted}`,
    memberReachLine: `Member reach: ${creatorAnalytics.members}`,
    openApplicationsLine: `Open hosted-review applications: ${creatorHostingApplicationReviewQueue.length}`,
    revenueReadyLine: `Revenue-ready signals: ${creatorAnalytics.revenueReady}`,
  };
}

export function buildCreatorHostingCopyKits({
  creatorAnalytics,
  creatorBio = '',
  creatorCtaUrl = '',
  creatorHostingApplicationReviewQueue,
  creatorLaunchChallenge,
  creatorRevenueShareInterest,
  creatorSpecialty,
}) {
  const {
    candidateChallengeLine,
    creatorBetaInterestLine,
    creatorBioLine,
    creatorCtaLine,
    creatorFocusLine,
    hostedChallengesLine,
    memberReachLine,
    openApplicationsLine,
    revenueReadyLine,
  } = buildCreatorHostingContext({
    creatorAnalytics,
    creatorBio,
    creatorCtaUrl,
    creatorHostingApplicationReviewQueue,
    creatorLaunchChallenge,
    creatorRevenueShareInterest,
    creatorSpecialty,
  });

  const creatorHostingReadinessCopyKits = buildCreatorHostingReadinessCopyKits({
    candidateChallengeLine,
    creatorBetaInterestLine,
    creatorBioLine,
    creatorCtaLine,
    creatorFocusLine,
    hostedChallengesLine,
    memberReachLine,
    revenueReadyLine,
  });
  const creatorHostingReplyCopyKits = buildCreatorHostingReplyCopyKits({
    candidateChallengeLine,
    creatorBetaInterestLine,
    creatorFocusLine,
    hostedChallengesLine,
    memberReachLine,
    openApplicationsLine,
    revenueReadyLine,
  });

  return {
    ...creatorHostingReadinessCopyKits,
    ...creatorHostingReplyCopyKits,
  };
}

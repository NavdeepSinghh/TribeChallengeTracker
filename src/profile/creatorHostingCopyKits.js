import { buildCreatorHostingReadinessCopyKits } from './creatorHostingReadinessCopyKits';
import { buildCreatorHostingReplyCopyKits } from './creatorHostingReplyCopyKits';

function buildCreatorHostingContext({
  creatorAnalytics,
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
    creatorFocusLine: `Creator focus: ${creatorSpecialty || 'Accountability challenge host'}`,
    hostedChallengesLine: `Hosted challenges: ${creatorAnalytics.hosted}`,
    memberReachLine: `Member reach: ${creatorAnalytics.members}`,
    openApplicationsLine: `Open hosted-review applications: ${creatorHostingApplicationReviewQueue.length}`,
    revenueReadyLine: `Revenue-ready signals: ${creatorAnalytics.revenueReady}`,
  };
}

export function buildCreatorHostingCopyKits({
  creatorAnalytics,
  creatorHostingApplicationReviewQueue,
  creatorLaunchChallenge,
  creatorRevenueShareInterest,
  creatorSpecialty,
}) {
  const {
    candidateChallengeLine,
    creatorBetaInterestLine,
    creatorFocusLine,
    hostedChallengesLine,
    memberReachLine,
    openApplicationsLine,
    revenueReadyLine,
  } = buildCreatorHostingContext({
    creatorAnalytics,
    creatorHostingApplicationReviewQueue,
    creatorLaunchChallenge,
    creatorRevenueShareInterest,
    creatorSpecialty,
  });

  const creatorHostingReadinessCopyKits = buildCreatorHostingReadinessCopyKits({
    candidateChallengeLine,
    creatorBetaInterestLine,
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

import { useState } from 'react';

export default function useCreatorRevenueState() {
  const [creatorEnabled, setCreatorEnabled] = useState(false);
  const [creatorSpecialty, setCreatorSpecialty] = useState('');
  const [creatorBio, setCreatorBio] = useState('');
  const [creatorCtaUrl, setCreatorCtaUrl] = useState('');
  const [creatorRevenueShareInterest, setCreatorRevenueShareInterest] = useState(false);
  const [creatorMessage, setCreatorMessage] = useState('');
  const [isSavingCreator, setIsSavingCreator] = useState(false);
  const [creatorRevenueShareSummary, setCreatorRevenueShareSummary] = useState({});
  const [creatorHostingApplicationReviewQueue, setCreatorHostingApplicationReviewQueue] = useState([]);
  const [creatorHostingApplicationMessage, setCreatorHostingApplicationMessage] = useState('');
  const [isSubmittingCreatorHostingApplication, setIsSubmittingCreatorHostingApplication] = useState(false);
  const [creatorHostingApplicationReviewNotes, setCreatorHostingApplicationReviewNotes] = useState({});
  const [reviewingCreatorHostingApplicationId, setReviewingCreatorHostingApplicationId] = useState('');
  const [creatorTemplateDraftReviewQueue, setCreatorTemplateDraftReviewQueue] = useState([]);
  const [publishedCreatorChallengeTemplates, setPublishedCreatorChallengeTemplates] = useState([]);
  const [creatorBrandedPageReviewQueue, setCreatorBrandedPageReviewQueue] = useState([]);
  const [publishedCreatorBrandedPages, setPublishedCreatorBrandedPages] = useState([]);
  const [creatorBrandedPageMessage, setCreatorBrandedPageMessage] = useState('');
  const [isSubmittingCreatorBrandedPage, setIsSubmittingCreatorBrandedPage] = useState(false);
  const [creatorBrandedPageReviewNotes, setCreatorBrandedPageReviewNotes] = useState({});
  const [reviewingCreatorBrandedPageId, setReviewingCreatorBrandedPageId] = useState('');
  const [creatorPrivateInviteLaunchReviewQueue, setCreatorPrivateInviteLaunchReviewQueue] = useState([]);
  const [approvedCreatorPrivateInviteLaunches, setApprovedCreatorPrivateInviteLaunches] = useState([]);
  const [creatorPrivateInviteLaunchMessage, setCreatorPrivateInviteLaunchMessage] = useState('');
  const [isSubmittingCreatorPrivateInviteLaunch, setIsSubmittingCreatorPrivateInviteLaunch] = useState(false);
  const [creatorPrivateInviteLaunchReviewNotes, setCreatorPrivateInviteLaunchReviewNotes] = useState({});
  const [reviewingCreatorPrivateInviteLaunchId, setReviewingCreatorPrivateInviteLaunchId] = useState('');
  const [creatorPaidHostingLaunchGateReviewQueue, setCreatorPaidHostingLaunchGateReviewQueue] = useState([]);
  const [approvedCreatorPaidHostingLaunchGateReviews, setApprovedCreatorPaidHostingLaunchGateReviews] = useState([]);
  const [creatorPaidHostingLaunchGateMessage, setCreatorPaidHostingLaunchGateMessage] = useState('');
  const [isSubmittingCreatorPaidHostingLaunchGate, setIsSubmittingCreatorPaidHostingLaunchGate] = useState(false);
  const [creatorPaidHostingLaunchGateReviewNotes, setCreatorPaidHostingLaunchGateReviewNotes] = useState({});
  const [reviewingCreatorPaidHostingLaunchGateId, setReviewingCreatorPaidHostingLaunchGateId] = useState('');
  const [creatorPayoutExceptionReviewQueue, setCreatorPayoutExceptionReviewQueue] = useState([]);
  const [approvedCreatorPayoutExceptionReviews, setApprovedCreatorPayoutExceptionReviews] = useState([]);
  const [creatorPayoutExceptionMessage, setCreatorPayoutExceptionMessage] = useState('');
  const [isSubmittingCreatorPayoutExceptionReview, setIsSubmittingCreatorPayoutExceptionReview] = useState(false);
  const [creatorPayoutExceptionReviewNotes, setCreatorPayoutExceptionReviewNotes] = useState({});
  const [reviewingCreatorPayoutExceptionReviewId, setReviewingCreatorPayoutExceptionReviewId] = useState('');
  const [creatorLeaderboardSnapshotReviewQueue, setCreatorLeaderboardSnapshotReviewQueue] = useState([]);
  const [publishedCreatorLeaderboardSnapshots, setPublishedCreatorLeaderboardSnapshots] = useState([]);
  const [creatorLeaderboardSnapshotMessage, setCreatorLeaderboardSnapshotMessage] = useState('');
  const [isSubmittingCreatorLeaderboardSnapshot, setIsSubmittingCreatorLeaderboardSnapshot] = useState(false);
  const [creatorLeaderboardSnapshotReviewNotes, setCreatorLeaderboardSnapshotReviewNotes] = useState({});
  const [reviewingCreatorLeaderboardSnapshotId, setReviewingCreatorLeaderboardSnapshotId] = useState('');
  const [creatorTemplateDraftMessage, setCreatorTemplateDraftMessage] = useState('');
  const [isSubmittingCreatorTemplateDraft, setIsSubmittingCreatorTemplateDraft] = useState(false);
  const [creatorTemplateDraftReviewNotes, setCreatorTemplateDraftReviewNotes] = useState({});
  const [reviewingCreatorTemplateDraftId, setReviewingCreatorTemplateDraftId] = useState('');

  return {
    approvedCreatorPrivateInviteLaunches,
    approvedCreatorPaidHostingLaunchGateReviews,
    approvedCreatorPayoutExceptionReviews,
    creatorBio,
    creatorCtaUrl,
    creatorEnabled,
    creatorHostingApplicationMessage,
    creatorHostingApplicationReviewNotes,
    creatorHostingApplicationReviewQueue,
    creatorBrandedPageMessage,
    creatorBrandedPageReviewNotes,
    creatorBrandedPageReviewQueue,
    creatorPrivateInviteLaunchMessage,
    creatorPrivateInviteLaunchReviewNotes,
    creatorPrivateInviteLaunchReviewQueue,
    creatorPaidHostingLaunchGateMessage,
    creatorPaidHostingLaunchGateReviewNotes,
    creatorPaidHostingLaunchGateReviewQueue,
    creatorPayoutExceptionMessage,
    creatorPayoutExceptionReviewNotes,
    creatorPayoutExceptionReviewQueue,
    creatorMessage,
    creatorRevenueShareInterest,
    creatorRevenueShareSummary,
    creatorSpecialty,
    creatorLeaderboardSnapshotMessage,
    creatorLeaderboardSnapshotReviewNotes,
    creatorLeaderboardSnapshotReviewQueue,
    creatorTemplateDraftMessage,
    creatorTemplateDraftReviewNotes,
    creatorTemplateDraftReviewQueue,
    publishedCreatorChallengeTemplates,
    publishedCreatorBrandedPages,
    publishedCreatorLeaderboardSnapshots,
    isSavingCreator,
    isSubmittingCreatorBrandedPage,
    isSubmittingCreatorHostingApplication,
    isSubmittingCreatorPrivateInviteLaunch,
    isSubmittingCreatorPaidHostingLaunchGate,
    isSubmittingCreatorPayoutExceptionReview,
    isSubmittingCreatorLeaderboardSnapshot,
    isSubmittingCreatorTemplateDraft,
    reviewingCreatorHostingApplicationId,
    reviewingCreatorBrandedPageId,
    reviewingCreatorPrivateInviteLaunchId,
    reviewingCreatorPaidHostingLaunchGateId,
    reviewingCreatorPayoutExceptionReviewId,
    reviewingCreatorLeaderboardSnapshotId,
    reviewingCreatorTemplateDraftId,
    setCreatorBio,
    setCreatorCtaUrl,
    setCreatorEnabled,
    setCreatorHostingApplicationMessage,
    setCreatorHostingApplicationReviewNotes,
    setCreatorHostingApplicationReviewQueue,
    setApprovedCreatorPrivateInviteLaunches,
    setApprovedCreatorPaidHostingLaunchGateReviews,
    setApprovedCreatorPayoutExceptionReviews,
    setCreatorBrandedPageMessage,
    setCreatorBrandedPageReviewNotes,
    setCreatorBrandedPageReviewQueue,
    setCreatorPrivateInviteLaunchMessage,
    setCreatorPrivateInviteLaunchReviewNotes,
    setCreatorPrivateInviteLaunchReviewQueue,
    setCreatorPaidHostingLaunchGateMessage,
    setCreatorPaidHostingLaunchGateReviewNotes,
    setCreatorPaidHostingLaunchGateReviewQueue,
    setCreatorPayoutExceptionMessage,
    setCreatorPayoutExceptionReviewNotes,
    setCreatorPayoutExceptionReviewQueue,
    setCreatorMessage,
    setCreatorRevenueShareInterest,
    setCreatorRevenueShareSummary,
    setCreatorSpecialty,
    setCreatorLeaderboardSnapshotMessage,
    setCreatorLeaderboardSnapshotReviewNotes,
    setCreatorLeaderboardSnapshotReviewQueue,
    setCreatorTemplateDraftMessage,
    setCreatorTemplateDraftReviewNotes,
    setCreatorTemplateDraftReviewQueue,
    setPublishedCreatorChallengeTemplates,
    setPublishedCreatorBrandedPages,
    setPublishedCreatorLeaderboardSnapshots,
    setIsSavingCreator,
    setIsSubmittingCreatorBrandedPage,
    setIsSubmittingCreatorHostingApplication,
    setIsSubmittingCreatorPrivateInviteLaunch,
    setIsSubmittingCreatorPaidHostingLaunchGate,
    setIsSubmittingCreatorPayoutExceptionReview,
    setIsSubmittingCreatorLeaderboardSnapshot,
    setIsSubmittingCreatorTemplateDraft,
    setReviewingCreatorHostingApplicationId,
    setReviewingCreatorBrandedPageId,
    setReviewingCreatorPrivateInviteLaunchId,
    setReviewingCreatorPaidHostingLaunchGateId,
    setReviewingCreatorPayoutExceptionReviewId,
    setReviewingCreatorLeaderboardSnapshotId,
    setReviewingCreatorTemplateDraftId,
  };
}

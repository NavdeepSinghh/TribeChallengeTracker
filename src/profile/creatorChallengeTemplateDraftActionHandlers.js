import {
  getCreatorChallengeTemplateDraftReviewQueue,
  getPublishedCreatorChallengeTemplates,
  reviewCreatorChallengeTemplateDraft,
  submitCreatorChallengeTemplateDraft,
} from '../userService';

export function buildCreatorChallengeTemplateDraftActionHandlers({
  creatorAnalytics,
  creatorEnabled,
  creatorLaunchChallenge,
  creatorTemplateDraftReviewNotes,
  isAdmin,
  isSubmittingCreatorTemplateDraft,
  proActive,
  profile,
  reviewingCreatorTemplateDraftId,
  setCreatorTemplateDraftMessage,
  setCreatorTemplateDraftReviewQueue,
  setPublishedCreatorChallengeTemplates,
  setIsSubmittingCreatorTemplateDraft,
  setReviewingCreatorTemplateDraftId,
  user,
}) {
  const handleCreatorTemplateDraftSubmit = async () => {
    if (isSubmittingCreatorTemplateDraft) return;
    setCreatorTemplateDraftMessage('');
    if (!proActive || !creatorEnabled) {
      setCreatorTemplateDraftMessage('Enable Pro Creator / Coach Mode before saving a template draft.');
      return;
    }
    setIsSubmittingCreatorTemplateDraft(true);
    try {
      await submitCreatorChallengeTemplateDraft(user.uid, {
        activeHostedCount: creatorAnalytics.active,
        candidateChallengeName: creatorLaunchChallenge?.name || '',
        hostedCount: creatorAnalytics.hosted,
        memberReach: creatorAnalytics.members,
        revenueReadyCount: creatorAnalytics.revenueReady,
      });
      setCreatorTemplateDraftMessage('Creator challenge template draft saved for admin review. This does not publish templates, create contracts, collect payments, create purchases, write entitlements, start revenue-share, or expose private member activity.');
      if (isAdmin) {
        getCreatorChallengeTemplateDraftReviewQueue().then(setCreatorTemplateDraftReviewQueue).catch(() => setCreatorTemplateDraftReviewQueue([]));
      }
    } catch (err) {
      setCreatorTemplateDraftMessage(err?.message || 'Could not save creator template draft.');
    } finally {
      setIsSubmittingCreatorTemplateDraft(false);
    }
  };

  const handleCreatorTemplateDraftReview = async (draftId, status) => {
    if (reviewingCreatorTemplateDraftId) return;
    setReviewingCreatorTemplateDraftId(draftId);
    try {
      await reviewCreatorChallengeTemplateDraft(draftId, {
        status,
        reviewNote: creatorTemplateDraftReviewNotes[draftId] || '',
        reviewedBy: profile?.displayName || profile?.email || 'admin',
      });
      setCreatorTemplateDraftMessage(
        status === 'published'
          ? 'Creator template draft published to the reviewed creatorChallengeTemplates catalog without contracts, payouts, purchases, entitlements, revenue-share, tracking, or paid-hosting claims.'
          : `Creator template draft marked ${status}. Manual review note saved without publishing templates, creating contracts, purchases, entitlements, revenue-share, tracking, or paid-access claims.`
      );
      getCreatorChallengeTemplateDraftReviewQueue().then(setCreatorTemplateDraftReviewQueue).catch(() => setCreatorTemplateDraftReviewQueue([]));
      if (status === 'published' && setPublishedCreatorChallengeTemplates) {
        getPublishedCreatorChallengeTemplates().then(setPublishedCreatorChallengeTemplates).catch(() => setPublishedCreatorChallengeTemplates([]));
      }
    } catch (err) {
      setCreatorTemplateDraftMessage(err?.message || 'Could not update creator template draft review.');
    } finally {
      setReviewingCreatorTemplateDraftId('');
    }
  };

  return {
    handleCreatorTemplateDraftReview,
    handleCreatorTemplateDraftSubmit,
  };
}

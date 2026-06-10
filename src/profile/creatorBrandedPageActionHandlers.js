import {
  getCreatorBrandedPageReviewQueue,
  getPublishedCreatorBrandedPages,
  reviewCreatorBrandedPage,
  submitCreatorBrandedPageDraft,
} from '../userService';

export function buildCreatorBrandedPageActionHandlers({
  creatorBrandedPageReviewNotes,
  creatorEnabled,
  isAdmin,
  isSubmittingCreatorBrandedPage,
  proActive,
  reviewingCreatorBrandedPageId,
  setCreatorBrandedPageMessage,
  setCreatorBrandedPageReviewQueue,
  setIsSubmittingCreatorBrandedPage,
  setPublishedCreatorBrandedPages,
  setReviewingCreatorBrandedPageId,
  user,
}) {
  const handleCreatorBrandedPageSubmit = async () => {
    if (!user?.uid || !proActive || !creatorEnabled || isSubmittingCreatorBrandedPage) {
      setCreatorBrandedPageMessage('Enable Pro Creator / Coach Mode before saving a branded page draft.');
      return;
    }
    setIsSubmittingCreatorBrandedPage(true);
    try {
      await submitCreatorBrandedPageDraft(user.uid);
      setCreatorBrandedPageMessage('Creator branded page draft saved for admin review. This stores profile, CTA, and hosted challenge summary only, without tracking, payments, purchases, entitlements, revenue-share, or paid-hosting claims.');
      if (isAdmin) {
        getCreatorBrandedPageReviewQueue().then(setCreatorBrandedPageReviewQueue).catch(() => {});
      }
    } catch (err) {
      setCreatorBrandedPageMessage(err?.message || 'Could not save creator branded page draft.');
    } finally {
      setIsSubmittingCreatorBrandedPage(false);
    }
  };

  const handleCreatorBrandedPageReview = async (page, status) => {
    if (!isAdmin || !page?.id || reviewingCreatorBrandedPageId) return;
    setReviewingCreatorBrandedPageId(page.id);
    try {
      await reviewCreatorBrandedPage(page.id, {
        status,
        reviewNote: creatorBrandedPageReviewNotes[page.id] || '',
        reviewedBy: user?.email || user?.uid || 'admin',
      });
      setCreatorBrandedPageMessage(`Creator branded page marked ${status}. Manual review note saved without tracking pixels, private member exports, payments, purchases, entitlements, revenue-share, or paid-hosting claims.`);
      getCreatorBrandedPageReviewQueue().then(setCreatorBrandedPageReviewQueue).catch(() => {});
      getPublishedCreatorBrandedPages().then(setPublishedCreatorBrandedPages).catch(() => {});
    } catch (err) {
      setCreatorBrandedPageMessage(err?.message || 'Could not update creator branded page review.');
    } finally {
      setReviewingCreatorBrandedPageId('');
    }
  };

  return {
    handleCreatorBrandedPageReview,
    handleCreatorBrandedPageSubmit,
  };
}

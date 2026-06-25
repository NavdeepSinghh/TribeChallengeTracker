import {
  getContentReportQueue,
  reviewContentReport,
} from '../userService';

export function buildContentReportActionHandlers({
  contentReportReviewNotes,
  profile,
  reviewingContentReportId,
  setContentReportQueue,
  setReviewingContentReportId,
  setSupportStatusMessage,
}) {
  const handleContentReportReview = async (report, status, removeContent = false) => {
    if (!report?.id || reviewingContentReportId) return;
    setReviewingContentReportId(report.id);
    try {
      await reviewContentReport(report.id, {
        status,
        reviewNote: contentReportReviewNotes[report.id] || '',
        reviewedBy: profile?.displayName || profile?.email || 'admin',
        removeContent,
      });
      setSupportStatusMessage(
        removeContent
          ? 'Content report resolved and removable content was deleted.'
          : `Content report marked ${status}. Moderation note saved without removing content.`,
      );
      getContentReportQueue().then(setContentReportQueue).catch(() => setContentReportQueue([]));
    } catch (err) {
      setSupportStatusMessage(err?.message || 'Could not update content report.');
    } finally {
      setReviewingContentReportId('');
    }
  };

  return {
    handleContentReportReview,
  };
}

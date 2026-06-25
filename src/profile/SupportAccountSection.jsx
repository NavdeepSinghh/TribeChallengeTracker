import AccountDeletionAdminReviewSection from './AccountDeletionAdminReviewSection';
import AccountDeletionRequestCard from './AccountDeletionRequestCard';
import ContentReportReviewSection from './ContentReportReviewSection';
import { buildSupportAccountProps } from './supportAccountSectionProps';
import SupportRequestCard from './SupportRequestCard';
import SupportReviewAdminSection from './SupportReviewAdminSection';

export default function SupportAccountSection(props) {
  const {
    accountDeletionAdminReviewSectionProps,
    accountDeletionRequestCardProps,
    contentReportReviewSectionProps,
    isAdmin,
    supportRequestCardProps,
    supportReviewAdminSectionProps,
  } = buildSupportAccountProps(props);
  const { theme } = props;

  return (
    <>
      <SupportRequestCard {...supportRequestCardProps} theme={theme} />

      {isAdmin && (
        <>
          <SupportReviewAdminSection {...supportReviewAdminSectionProps} />
          <ContentReportReviewSection {...contentReportReviewSectionProps} />
        </>
      )}

      <AccountDeletionRequestCard {...accountDeletionRequestCardProps} theme={theme} />

      {isAdmin && (
        <AccountDeletionAdminReviewSection {...accountDeletionAdminReviewSectionProps} />
      )}
    </>
  );
}

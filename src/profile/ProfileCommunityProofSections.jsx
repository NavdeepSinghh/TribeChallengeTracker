import CommunityHighlightsSection from './CommunityHighlightsSection';
import FeatureSubmissionSection from './FeatureSubmissionSection';
import {
  buildCommunityHighlightsSectionProps,
  buildFeatureSubmissionSectionProps,
  buildProfileActivitySummarySectionProps,
} from './profileCommunityProofSectionProps';
import ProfileActivitySummarySection from './ProfileActivitySummarySection';

export default function ProfileCommunityProofSections({ model }) {
  const {
    badgeXP,
    communityHighlightRoundupCopy,
    communityHighlightRoundupItems,
    copyText,
    earnedList,
    featureCategory,
    featureConsent,
    featureFileInputRef,
    featureMediaData,
    featureMessage,
    featureReviewQueue,
    featureStory,
    featureSubmissions,
    featuredSubmissions,
    handleFeatureMediaUpload,
    handleFeatureSubmit,
    isSubmittingFeature,
    prefRows,
    rank,
    rankedPct,
    setFeatureCategory,
    setFeatureConsent,
    setFeatureMediaData,
    setFeatureStory,
    statsGrid,
    ugcConsentReminderCopy,
  } = model;
  const communityHighlightsSectionProps = buildCommunityHighlightsSectionProps({
    communityHighlightRoundupCopy,
    communityHighlightRoundupItems,
    copyText,
    featureReviewQueue,
    featuredSubmissions,
    ugcConsentReminderCopy,
  });
  const featureSubmissionSectionProps = buildFeatureSubmissionSectionProps({
    featureCategory,
    featureConsent,
    featureFileInputRef,
    featureMediaData,
    featureMessage,
    featureStory,
    featureSubmissions,
    handleFeatureMediaUpload,
    handleFeatureSubmit,
    isSubmittingFeature,
    setFeatureCategory,
    setFeatureConsent,
    setFeatureMediaData,
    setFeatureStory,
  });
  const profileActivitySummarySectionProps = buildProfileActivitySummarySectionProps({
    badgeXP,
    earnedList,
    prefRows,
    rank,
    rankedPct,
    statsGrid,
  });

  return (
    <>
      <CommunityHighlightsSection {...communityHighlightsSectionProps} />

      <FeatureSubmissionSection {...featureSubmissionSectionProps} />

      <ProfileActivitySummarySection {...profileActivitySummarySectionProps} />
    </>
  );
}

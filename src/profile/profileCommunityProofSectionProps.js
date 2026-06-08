export function buildCommunityHighlightsSectionProps({
  communityHighlightRoundupCopy,
  communityHighlightRoundupItems,
  copyText,
  featureReviewQueue,
  featuredSubmissions,
  ugcConsentReminderCopy,
}) {
  return {
    featuredSubmissions,
    communityHighlightRoundupItems,
    communityHighlightRoundupCopy,
    ugcConsentReminderCopy,
    featureReviewQueue,
    copyText,
  };
}

export function buildFeatureSubmissionSectionProps({
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
}) {
  return {
    featureCategory,
    setFeatureCategory,
    featureStory,
    setFeatureStory,
    featureFileInputRef,
    handleFeatureMediaUpload,
    featureMediaData,
    setFeatureMediaData,
    featureConsent,
    setFeatureConsent,
    handleFeatureSubmit,
    isSubmittingFeature,
    featureMessage,
    featureSubmissions,
  };
}

export function buildProfileActivitySummarySectionProps({
  badgeXP,
  earnedList,
  prefRows,
  rank,
  rankedPct,
  statsGrid,
}) {
  return {
    rank,
    badgeXP,
    rankedPct,
    statsGrid,
    earnedList,
    prefRows,
  };
}

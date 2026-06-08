import FeatureReviewQueueSection from './FeatureReviewQueueSection';
import InstagramEngagementSection from './InstagramEngagementSection';
import WinCardShareSection from './WinCardShareSection';

export default function ProfileSocialEngagementSections({ model }) {
  const {
    currentStreak,
    daysActive,
    featureReviewNotes,
    featureReviewQueue,
    handleMonthlyRecapShare,
    handleReviewSubmission,
    handleSocialSave,
    handleWeeklyRecapShare,
    handleWinCardShare,
    instagramHandle,
    instagramPromptCopy,
    instagramWeeklyPrompt,
    isAdmin,
    isSavingSocial,
    monthlyReport,
    proActive,
    profile,
    rank,
    reviewMessage,
    setFeatureReviewNotes,
    setInstagramHandle,
    socialMessage,
    totalWinPoints,
    weeklyRecap,
    winCardMessage,
  } = model;

  return (
    <>
      <InstagramEngagementSection
        profile={profile}
        instagramHandle={instagramHandle}
        setInstagramHandle={setInstagramHandle}
        handleSocialSave={handleSocialSave}
        isSavingSocial={isSavingSocial}
        socialMessage={socialMessage}
        instagramWeeklyPrompt={instagramWeeklyPrompt}
        instagramPromptCopy={instagramPromptCopy}
      />

      <FeatureReviewQueueSection
        isAdmin={isAdmin}
        featureReviewQueue={featureReviewQueue}
        featureReviewNotes={featureReviewNotes}
        setFeatureReviewNotes={setFeatureReviewNotes}
        handleReviewSubmission={handleReviewSubmission}
        reviewMessage={reviewMessage}
      />

      <WinCardShareSection
        totalWinPoints={totalWinPoints}
        currentStreak={currentStreak}
        daysActive={daysActive}
        rank={rank}
        handleWinCardShare={handleWinCardShare}
        handleWeeklyRecapShare={handleWeeklyRecapShare}
        handleMonthlyRecapShare={handleMonthlyRecapShare}
        proActive={proActive}
        weeklyRecap={weeklyRecap}
        monthlyReport={monthlyReport}
        winCardMessage={winCardMessage}
      />
    </>
  );
}

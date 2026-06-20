import HomeActivityBreakdown from "./HomeActivityBreakdown";
import HomeCalendarSection from "./HomeCalendarSection";
import HomeHero from "./HomeHero";
import HomeLogActivityButton from "./HomeLogActivityButton";
import HomeMobilePitch from "./HomeMobilePitch";
import HomeShareProgressPanel from "./HomeShareProgressPanel";
import HomeStatsCards from "./HomeStatsCards";

export default function HomeTab({
  actCounts,
  challengeStats,
  earnedBadges,
  handleProgressShare,
  handleShareTemplateSelect,
  hasActivePro,
  myChallenges,
  myHistory,
  savingShareTemplate,
  setSelectedDay,
  setShowLog,
  setShowProfile,
  setTab,
  shareTemplateId,
  streak,
  totalPts,
  userProfile,
}) {
  return (
    <div>
      <HomeHero
        earnedBadges={earnedBadges}
        setShowProfile={setShowProfile}
        streak={streak}
        totalPts={totalPts}
        userProfile={userProfile}
      />
      <HomeStatsCards myHistory={myHistory} streak={streak} totalPts={totalPts} />
      <HomeLogActivityButton setShowLog={setShowLog} />
      <HomeActivityBreakdown actCounts={actCounts} />
      <HomeCalendarSection
        challengeStats={challengeStats}
        myChallenges={myChallenges}
        myHistory={myHistory}
        setSelectedDay={setSelectedDay}
        setTab={setTab}
      />
      <HomeShareProgressPanel
        handleProgressShare={handleProgressShare}
        handleShareTemplateSelect={handleShareTemplateSelect}
        hasActivePro={hasActivePro}
        savingShareTemplate={savingShareTemplate}
        shareTemplateId={shareTemplateId}
      />
      <HomeMobilePitch />
    </div>
  );
}

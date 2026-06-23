import HomeChallengesSection from "./HomeChallengesSection";
import HomeCalendarSection from "./HomeCalendarSection";
import HomeHero from "./HomeHero";
import HomeLogActivityButton from "./HomeLogActivityButton";
import HomeMobilePitch from "./HomeMobilePitch";
import HomeShareProgressPanel from "./HomeShareProgressPanel";
import HomeStatsCards from "./HomeStatsCards";
import TribeFeedSection from "./TribeFeedSection";
import { FEATURE_FLAGS } from "../featureFlags";

export default function HomeTab({
  actCounts,
  challengeStats,
  handleProgressShare,
  handleShareTemplateSelect,
  hasActivePro,
  myChallenges,
  myHistory,
  rankRules,
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
        myHistory={myHistory}
        rankRules={rankRules}
        setShowProfile={setShowProfile}
        streak={streak}
        totalPts={totalPts}
        userProfile={userProfile}
      />
      <HomeStatsCards myHistory={myHistory} streak={streak} totalPts={totalPts} />
      <HomeLogActivityButton setShowLog={setShowLog} />
      <HomeChallengesSection
        challengeStats={challengeStats}
        myChallenges={myChallenges}
        setTab={setTab}
      />
      <HomeCalendarSection
        actCounts={actCounts}
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
      {FEATURE_FLAGS.TRIBE_FEED_ENABLED && (
        <TribeFeedSection onLogActivity={() => setShowLog(true)} />
      )}
      <HomeMobilePitch />
    </div>
  );
}

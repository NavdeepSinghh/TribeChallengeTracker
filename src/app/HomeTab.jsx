import HomeChallengesSection from "./HomeChallengesSection";
import HomeCalendarSection from "./HomeCalendarSection";
import HomeHero from "./HomeHero";
import HomeLogActivityButton from "./HomeLogActivityButton";
import HomeMobilePitch from "./HomeMobilePitch";
import HomeShareProgressPanel from "./HomeShareProgressPanel";
import HomeStatsCards from "./HomeStatsCards";
import TribeFeedSection from "./TribeFeedSection";
import FollowDiscoverySection from "./FollowDiscoverySection";
import { FEATURE_FLAGS, isFollowFeatureEnabledForUser } from "../featureFlags";

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
  user,
  userProfile,
}) {
  const followFeatureEnabled = isFollowFeatureEnabledForUser(user);
  const handOffRoutineToWorkouts = (routine) => {
    try {
      window.sessionStorage?.setItem("tribePendingRoutine", JSON.stringify(routine));
    } catch (error) {
      // Session storage is only a convenience bridge between tabs.
    }
    setTab("board");
  };

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
      {FEATURE_FLAGS.TRIBE_FEED_ENABLED && (
        <TribeFeedSection onLogActivity={() => setShowLog(true)} />
      )}
      {followFeatureEnabled && (
        <div style={{ padding: "0 20px" }}>
          <FollowDiscoverySection onUseRoutine={handOffRoutineToWorkouts} user={user} />
        </div>
      )}
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

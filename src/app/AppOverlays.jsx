import ProfileScreen from "../ProfileScreen";
import BadgeUnlockOverlay from "./BadgeUnlockOverlay";
import DayDetailSheet from "./DayDetailSheet";
import LevelUpCelebration from "./LevelUpCelebration";
import LogModal from "./LogModal";
import { today, formatDate, getEntryActivities } from "./activityModel";

export default function AppOverlays({
  badgeQueue,
  challengeStats,
  earnedBadges,
  handleDeleteActivity,
  handleLog,
  dismissLevelUp,
  levelUp,
  myHistory,
  rankRules,
  selectedDay,
  setBadgeQueue,
  setMyHistory,
  setSelectedDay,
  setShowLog,
  setShowProfile,
  setUserProfile,
  showLog,
  showProfile,
  triggerBadgeCheck,
  user,
  userProfile,
}) {
  return (
    <>
      {selectedDay && (
        <DayDetailSheet
          day={selectedDay}
          onClose={() => setSelectedDay(null)}
          onDeleteActivity={async (activity, index) => {
            const updatedDay = await handleDeleteActivity(selectedDay.date, activity, index);
            setSelectedDay(prev => prev ? { ...prev, activity: updatedDay } : prev);
          }}
          onLogMore={() => { setSelectedDay(null); setShowLog(true); }}
        />
      )}

      {badgeQueue[0] && (
        <BadgeUnlockOverlay
          badge={badgeQueue[0]}
          onDismiss={() => setBadgeQueue(q => q.slice(1))}
        />
      )}

      {levelUp && (
        <LevelUpCelebration
          levelUp={levelUp}
          onDismiss={dismissLevelUp}
          onLogMore={() => {
            dismissLevelUp();
            setSelectedDay(null);
            setShowLog(true);
          }}
        />
      )}

      {showProfile && (
        <ProfileScreen
          user={user}
          earnedBadges={earnedBadges}
          myHistory={myHistory}
          challengeStats={challengeStats}
          rankRules={rankRules}
          onProfileUpdated={setUserProfile}
          onHistoryUpdated={updated => {
            setMyHistory(updated);
            triggerBadgeCheck(updated, challengeStats);
          }}
          onClose={() => setShowProfile(false)}
        />
      )}

      {showLog && (
        <LogModal
          onClose={() => setShowLog(false)}
          onDeleteActivity={(activity, index) => handleDeleteActivity(activity?.loggedAt || formatDate(today), activity, index)}
          onLog={handleLog}
          todayActivities={getEntryActivities(myHistory[formatDate(today)])}
        />
      )}
    </>
  );
}

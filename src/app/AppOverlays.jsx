import ProfileScreen from "../ProfileScreen";
import BadgeUnlockOverlay from "./BadgeUnlockOverlay";
import DayDetailSheet from "./DayDetailSheet";
import LogModal from "./LogModal";
import { today, formatDate, getEntryActivities } from "./activityModel";

export default function AppOverlays({
  badgeQueue,
  challengeStats,
  earnedBadges,
  handleLog,
  myHistory,
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
}) {
  return (
    <>
      {selectedDay && (
        <DayDetailSheet
          day={selectedDay}
          onClose={() => setSelectedDay(null)}
          onLogMore={() => { setSelectedDay(null); setShowLog(true); }}
        />
      )}

      {badgeQueue[0] && (
        <BadgeUnlockOverlay
          badge={badgeQueue[0]}
          onDismiss={() => setBadgeQueue(q => q.slice(1))}
        />
      )}

      {showProfile && (
        <ProfileScreen
          user={user}
          earnedBadges={earnedBadges}
          myHistory={myHistory}
          challengeStats={challengeStats}
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
          onLog={handleLog}
          todayActivities={getEntryActivities(myHistory[formatDate(today)])}
        />
      )}
    </>
  );
}

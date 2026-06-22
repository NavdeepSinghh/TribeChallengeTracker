import { openHealthSettings } from "../healthService";
import { useAppTheme } from "./AppThemeContext";
import LogActivityForm from "./LogActivityForm";
import LogModalActions from "./LogModalActions";
import LogModalHeader from "./LogModalHeader";
import LogTodaySummary from "./LogTodaySummary";
import WearableSyncPanel from "./WearableSyncPanel";
import useLogModalState from "./useLogModalState";

export default function LogModal({ onClose, onDeleteActivity, onLog, todayActivities = [] }) {
  const { theme } = useAppTheme();
  const {
    actInfo,
    applyWorkout,
    handle,
    handleDeleteActivity,
    handleSync,
    isSubmitLocked,
    loggedActivities,
    note,
    setNote,
    setSyncState,
    setType,
    setValue,
    syncError,
    syncState,
    syncWorkouts,
    type,
    value,
  } = useLogModalState({ onDeleteActivity, onLog, todayActivities });

  return (
    <div style={{ position: "fixed", inset: 0, background: theme.overlayBg, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
      <div style={{ background: theme.cardBgStrong, border: `1px solid ${theme.cardBorderStrong}`, borderRadius: 24, padding: 28, width: "100%", maxWidth: 380, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.24)" }}>
        <LogModalHeader loggedActivitiesCount={loggedActivities.length} onClose={onClose} />
        <LogTodaySummary loggedActivities={loggedActivities} onDeleteActivity={handleDeleteActivity} />
        <LogActivityForm
          actInfo={actInfo}
          note={note}
          setNote={setNote}
          setType={setType}
          type={type}
          value={value}
          setValue={setValue}
        />
        <WearableSyncPanel
          applyWorkout={applyWorkout}
          handleSync={handleSync}
          openHealthSettings={openHealthSettings}
          setSyncState={setSyncState}
          syncError={syncError}
          syncState={syncState}
          syncWorkouts={syncWorkouts}
        />
        <LogModalActions
          actInfo={actInfo}
          handle={handle}
          isSubmitLocked={isSubmitLocked}
          loggedActivitiesCount={loggedActivities.length}
          onClose={onClose}
          value={value}
        />
      </div>
    </div>
  );
}

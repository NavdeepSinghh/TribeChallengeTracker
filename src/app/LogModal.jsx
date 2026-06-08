import { openHealthSettings } from "../healthService";
import LogActivityForm from "./LogActivityForm";
import LogModalActions from "./LogModalActions";
import LogModalHeader from "./LogModalHeader";
import LogTodaySummary from "./LogTodaySummary";
import WearableSyncPanel from "./WearableSyncPanel";
import useLogModalState from "./useLogModalState";

export default function LogModal({ onClose, onLog, todayActivities = [] }) {
  const {
    actInfo,
    applyWorkout,
    handle,
    handleSync,
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
  } = useLogModalState({ onLog, todayActivities });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
      <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 28, width: "100%", maxWidth: 380, maxHeight: "90vh", overflowY: "auto" }}>
        <LogModalHeader loggedActivitiesCount={loggedActivities.length} onClose={onClose} />
        <LogTodaySummary loggedActivities={loggedActivities} />
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
          loggedActivitiesCount={loggedActivities.length}
          onClose={onClose}
          value={value}
        />
      </div>
    </div>
  );
}

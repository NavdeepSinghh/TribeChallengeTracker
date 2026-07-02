import WorkoutSnapshotStrip from "../shared/WorkoutSnapshotStrip";
import PrimaryWorkoutAction from "./PrimaryWorkoutAction";
import WorkoutEntryCard from "./WorkoutEntryCard";

export default function WorkoutsHub({ daysActive, onOpenFlow, onQuickLog, streak, theme, totalPts }) {
  return (
    <>
      <WorkoutSnapshotStrip daysActive={daysActive} streak={streak} theme={theme} totalPts={totalPts} />
      <PrimaryWorkoutAction onQuickLog={onQuickLog} onStart={() => onOpenFlow("start")} theme={theme} />
      <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
        <WorkoutEntryCard
          accent="#34D399"
          copy="Structured plans, today's workout, skips, frequency, and progress."
          icon="01"
          onClick={() => onOpenFlow("plans")}
          theme={theme}
          title="Training plans"
        />
        <WorkoutEntryCard
          accent="#60A5FA"
          copy="History, PRs, training journal, and volume breakdowns."
          icon="02"
          onClick={() => onOpenFlow("progress")}
          theme={theme}
          title="Progress"
        />
        <WorkoutEntryCard
          accent="#FFD700"
          copy="Exercise demos, muscle maps, and public workouts from the tribe."
          icon="03"
          onClick={() => onOpenFlow("explore")}
          theme={theme}
          title="Explore"
        />
      </div>
    </>
  );
}

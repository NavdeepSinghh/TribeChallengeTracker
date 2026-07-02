import { useState } from "react";
import TrainingJournalSection from "../../../../app/TrainingJournalSection";
import WorkoutHistorySection from "../../WorkoutHistorySection";
import WorkoutSnapshotStrip from "../shared/WorkoutSnapshotStrip";
import ProgressModeTabs from "./ProgressModeTabs";
import ActivityBreakdownPanel from "./panels/ActivityBreakdownPanel";

function progressionLevelFromProfile(userProfile = {}) {
  const rawLevel = String(
    userProfile?.onboarding?.level
      || userProfile?.fitnessLevel
      || userProfile?.trainingLevel
      || "beginner"
  ).toLowerCase();
  if (rawLevel === "moderate" || rawLevel === "intermediate") return "intermediate";
  if (rawLevel === "fit" || rawLevel === "athlete" || rawLevel === "advanced") return "advanced";
  return "beginner";
}

export default function ProgressFlow({
  actCounts,
  daysActive,
  followFeatureEnabled,
  historyUseCases,
  insightUseCases,
  onRoutineUsed,
  routineToUse,
  streak,
  theme,
  totalPts,
  user,
  userProfile,
}) {
  const [mode, setMode] = useState("history");
  return (
    <>
      <WorkoutSnapshotStrip daysActive={daysActive} streak={streak} theme={theme} totalPts={totalPts} />
      <ProgressModeTabs mode={mode} onChange={setMode} theme={theme} />
      {mode === "history" ? (
        <WorkoutHistorySection
          insightLevel={progressionLevelFromProfile(userProfile)}
          insightUseCases={insightUseCases}
          profile={userProfile}
          useCases={historyUseCases}
        />
      ) : null}
      {mode === "journal" ? (
        <TrainingJournalSection
          followFeatureEnabled={followFeatureEnabled}
          onRoutineUsed={onRoutineUsed}
          routineToUse={routineToUse}
          user={user}
          userProfile={userProfile}
        />
      ) : null}
      {mode === "breakdown" ? (
        <ActivityBreakdownPanel actCounts={actCounts} theme={theme} />
      ) : null}
    </>
  );
}

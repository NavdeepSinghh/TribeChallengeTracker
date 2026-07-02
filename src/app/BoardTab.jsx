import { useEffect, useMemo, useState } from "react";
import { useAppTheme } from "./AppThemeContext";
import { isFollowFeatureEnabledForUser } from "../featureFlags";
import ExploreFlow from "../workouts/presentation/tab/explore/ExploreFlow";
import WorkoutsHub from "../workouts/presentation/tab/hub/WorkoutsHub";
import TrainingPlansFlow from "../workouts/presentation/tab/plans/TrainingPlansFlow";
import ProgressFlow from "../workouts/presentation/tab/progress/ProgressFlow";
import WorkoutFlowHeader from "../workouts/presentation/tab/shared/WorkoutFlowHeader";
import StartWorkoutFlow from "../workouts/presentation/tab/start/StartWorkoutFlow";
import { createWorkoutCatalogUseCases } from "../workouts/workoutCatalogComposition";
import { createGuidedWorkoutUseCases } from "../workouts/workoutGuidedComposition";
import { createWorkoutHistoryUseCases } from "../workouts/workoutHistoryComposition";
import { createWorkoutInsightUseCases } from "../workouts/workoutInsightComposition";
import { createWorkoutSocialUseCases } from "../workouts/workoutSocialComposition";
import { createTrainingPlanUseCases } from "../workouts/workoutTrainingPlanComposition";

export default function BoardTab({
  actCounts,
  daysActive,
  setShowLog,
  streak,
  totalPts,
  user,
  userProfile,
}) {
  const { theme } = useAppTheme();
  const [routineToUse, setRoutineToUse] = useState(null);
  const [activeFlow, setActiveFlow] = useState("hub");
  const [exploreMode, setExploreMode] = useState("exercises");
  const followFeatureEnabled = isFollowFeatureEnabledForUser(user);
  const workoutCatalogUseCases = useMemo(() => createWorkoutCatalogUseCases(), []);
  const guidedWorkoutUseCases = useMemo(() => createGuidedWorkoutUseCases(), []);
  const workoutHistoryUseCases = useMemo(() => createWorkoutHistoryUseCases(), []);
  const workoutInsightUseCases = useMemo(() => createWorkoutInsightUseCases(), []);
  const workoutSocialUseCases = useMemo(() => createWorkoutSocialUseCases(), []);
  const trainingPlanUseCases = useMemo(() => createTrainingPlanUseCases(), []);

  useEffect(() => {
    try {
      const rawRoutine = window.sessionStorage?.getItem("tribePendingRoutine");
      if (!rawRoutine) return;
      window.sessionStorage?.removeItem("tribePendingRoutine");
      setRoutineToUse(JSON.parse(rawRoutine));
      setActiveFlow("progress");
    } catch (error) {
      window.sessionStorage?.removeItem("tribePendingRoutine");
    }
  }, []);

  return (
    <div style={{ padding: "52px 20px 20px" }}>
      <WorkoutFlowHeader activeFlow={activeFlow} onBack={() => setActiveFlow("hub")} theme={theme} />

      {activeFlow === "hub" ? (
        <WorkoutsHub
          daysActive={daysActive}
          onOpenFlow={setActiveFlow}
          onQuickLog={() => setShowLog(true)}
          streak={streak}
          theme={theme}
          totalPts={totalPts}
        />
      ) : null}

      {activeFlow === "start" ? (
        <StartWorkoutFlow
          catalogUseCases={workoutCatalogUseCases}
          guidedUseCases={guidedWorkoutUseCases}
        />
      ) : null}

      {activeFlow === "plans" ? (
        <TrainingPlansFlow useCases={trainingPlanUseCases} />
      ) : null}

      {activeFlow === "progress" ? (
        <ProgressFlow
          actCounts={actCounts}
          daysActive={daysActive}
          followFeatureEnabled={followFeatureEnabled}
          historyUseCases={workoutHistoryUseCases}
          insightUseCases={workoutInsightUseCases}
          onRoutineUsed={() => setRoutineToUse(null)}
          routineToUse={routineToUse}
          streak={streak}
          theme={theme}
          totalPts={totalPts}
          user={user}
          userProfile={userProfile}
        />
      ) : null}

      {activeFlow === "explore" ? (
        <ExploreFlow
          catalogUseCases={workoutCatalogUseCases}
          mode={exploreMode}
          onModeChange={setExploreMode}
          onQuickLog={() => setShowLog(true)}
          socialUseCases={workoutSocialUseCases}
          theme={theme}
        />
      ) : null}
    </div>
  );
}

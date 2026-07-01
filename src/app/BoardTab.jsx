import { useEffect, useMemo, useState } from "react";
import { ACTIVITY_TYPES } from "./activityModel";
import { useAppTheme } from "./AppThemeContext";
import { isFollowFeatureEnabledForUser } from "../featureFlags";
import TrainingJournalSection from "./TrainingJournalSection";
import GuidedWorkoutSection from "../workouts/presentation/GuidedWorkoutSection";
import PublicWorkoutDiscoverySection from "../workouts/presentation/PublicWorkoutDiscoverySection";
import WorkoutHistorySection from "../workouts/presentation/WorkoutHistorySection";
import WorkoutsLibrarySection from "../workouts/presentation/WorkoutsLibrarySection";
import { createWorkoutCatalogUseCases } from "../workouts/workoutCatalogComposition";
import { createGuidedWorkoutUseCases } from "../workouts/workoutGuidedComposition";
import { createWorkoutHistoryUseCases } from "../workouts/workoutHistoryComposition";
import { createWorkoutSocialUseCases } from "../workouts/workoutSocialComposition";

export default function BoardTab({
  actCounts,
  allActivities,
  daysActive,
  setShowLog,
  setTab,
  streak,
  totalPts,
  user,
  userProfile,
}) {
  const { resolvedMode, theme } = useAppTheme();
  const isDay = resolvedMode === "day";
  const [routineToUse, setRoutineToUse] = useState(null);
  const followFeatureEnabled = isFollowFeatureEnabledForUser(user);
  const workoutCatalogUseCases = useMemo(() => createWorkoutCatalogUseCases(), []);
  const guidedWorkoutUseCases = useMemo(() => createGuidedWorkoutUseCases(), []);
  const workoutHistoryUseCases = useMemo(() => createWorkoutHistoryUseCases(), []);
  const workoutSocialUseCases = useMemo(() => createWorkoutSocialUseCases(), []);

  useEffect(() => {
    try {
      const rawRoutine = window.sessionStorage?.getItem("tribePendingRoutine");
      if (!rawRoutine) return;
      window.sessionStorage?.removeItem("tribePendingRoutine");
      setRoutineToUse(JSON.parse(rawRoutine));
    } catch (error) {
      window.sessionStorage?.removeItem("tribePendingRoutine");
    }
  }, []);

  return (
    <div style={{ padding: "52px 20px 20px" }}>
      <p style={{ color: theme.mutedStrong, fontSize: 11, fontWeight: 700, letterSpacing: 2, margin: "0 0 6px", fontFamily: "monospace" }}>WORKOUTS</p>
      <h2 style={{ margin: "0 0 24px", fontSize: 26, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: theme.text }}>Workouts 💪</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {[
          { label: "ACTIVITY POINTS", value: totalPts, suffix: " pts", color: "#FFD700", icon: "⭐" },
          { label: "CURRENT STREAK", value: streak, suffix: " days", color: "#FF6B35", icon: "🔥" },
          { label: "DAYS ACTIVE", value: daysActive, suffix: " days", color: "#34D399", icon: "📅" },
          { label: "ACTIVITIES", value: allActivities.length, suffix: " total", color: "#60A5FA", icon: "💪" },
        ].map(stat => (
          <div key={stat.label} style={{ background: theme.cardBg, borderRadius: 16, padding: "16px", border: `1px solid ${theme.cardBorder}`, textAlign: "center" }}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>{stat.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: stat.color }}>{stat.value}<span style={{ fontSize: 13 }}>{stat.suffix}</span></div>
            <div style={{ fontSize: 9, color: theme.mutedStrong, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "20px", borderRadius: 18, background: isDay ? "linear-gradient(135deg, rgba(255,107,53,0.14), rgba(255,255,255,0.96))" : "linear-gradient(135deg, rgba(255,107,53,0.12), rgba(255,215,0,0.08))", border: `1px solid ${isDay ? "rgba(255,107,53,0.28)" : "rgba(255,107,53,0.2)"}`, marginBottom: 24 }}>
        <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 800, color: isDay ? "#B84418" : "#FFD700", fontFamily: "'Syne', sans-serif" }}>Challenge Leaderboards 🏆</p>
        <p style={{ margin: "0 0 14px", fontSize: 12, color: theme.textSoft }}>Challenge rankings still live here, below your personal training and activity progress.</p>
        <button onClick={() => setTab("challenges")} style={{ padding: "10px 18px", borderRadius: 12, background: "linear-gradient(135deg, #FF6B35, #FFD700)", border: "none", color: "#000", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne', sans-serif" }}>
          View Challenges →
        </button>
      </div>

      <GuidedWorkoutSection
        catalogUseCases={workoutCatalogUseCases}
        guidedUseCases={guidedWorkoutUseCases}
      />

      <WorkoutHistorySection useCases={workoutHistoryUseCases} />

      <PublicWorkoutDiscoverySection useCases={workoutSocialUseCases} />

      <WorkoutsLibrarySection
        onQuickLog={() => setShowLog(true)}
        useCases={workoutCatalogUseCases}
      />

      <TrainingJournalSection
        onRoutineUsed={() => setRoutineToUse(null)}
        routineToUse={routineToUse}
        followFeatureEnabled={followFeatureEnabled}
        user={user}
        userProfile={userProfile}
      />

      <p style={{ color: theme.mutedStrong, fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", margin: "0 0 12px" }}>ACTIVITY BREAKDOWN</p>
      {Object.values(actCounts).some(value => value > 0) ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ACTIVITY_TYPES.filter(activity => actCounts[activity.id] > 0).map(activity => (
            <div key={activity.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: theme.cardBg, borderRadius: 14, border: `1px solid ${theme.cardBorder}` }}>
              <span style={{ fontSize: 22 }}>{activity.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>{activity.label}</span>
                  <span style={{ fontSize: 11, color: theme.mutedStrong, fontFamily: "monospace" }}>{actCounts[activity.id]}x</span>
                </div>
                <div style={{ height: 4, background: theme.progressTrack, borderRadius: 4 }}>
                  <div style={{ height: "100%", borderRadius: 4, background: activity.color, width: `${Math.min(100, (actCounts[activity.id] / 15) * 100)}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: "32px 20px", borderRadius: 16, background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 13, color: theme.textSoft }}>No activities logged yet.<br />Tap <span style={{ color: "#FF6B35", fontWeight: 700 }}>Log Today's Activity</span> to get started!</p>
        </div>
      )}
    </div>
  );
}

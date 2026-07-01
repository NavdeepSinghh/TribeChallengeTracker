import { useAppTheme } from "../../app/AppThemeContext";
import {
  TRAINING_PLAN_ALL_FILTER,
  trainingPlanExerciseCount,
  trainingPlanPreviewWorkouts,
  trainingPlanSummary,
} from "../domain/trainingPlanModels";
import { useTrainingPlansViewModel } from "./useTrainingPlansViewModel";

function FilterPill({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? "linear-gradient(135deg, #FF6B35, #FFD700)" : "rgba(255,255,255,0.06)",
        border: active ? "1px solid rgba(255,107,53,0.35)" : "1px solid rgba(255,255,255,0.10)",
        borderRadius: 999,
        color: active ? "#040404" : "rgba(255,255,255,0.72)",
        cursor: "pointer",
        fontFamily: "'Syne', sans-serif",
        fontSize: 11,
        fontWeight: 900,
        minHeight: 34,
        padding: "0 13px",
      }}
    >
      {children}
    </button>
  );
}

function TrainingPlanCard({ active, onClick, plan }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? "rgba(255,107,53,0.14)" : "rgba(255,255,255,0.045)",
        border: active ? "1px solid rgba(255,107,53,0.38)" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        cursor: "pointer",
        padding: 14,
        textAlign: "left",
        width: "100%",
      }}
    >
      <div style={{ alignItems: "start", display: "flex", gap: 10, justifyContent: "space-between" }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ color: "#FFFFFF", fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 900, margin: "0 0 5px" }}>{plan.name}</p>
          <p style={{ color: "rgba(255,255,255,0.56)", fontSize: 11, fontWeight: 700, margin: 0 }}>{trainingPlanSummary(plan)}</p>
        </div>
        <span style={{
          border: "1px solid rgba(255,107,53,0.44)",
          borderRadius: 999,
          color: "#FF6B35",
          fontFamily: "monospace",
          fontSize: 9,
          fontWeight: 900,
          padding: "4px 7px",
          textTransform: "uppercase",
        }}>
          {plan.level}
        </span>
      </div>
      <p style={{ color: "rgba(255,255,255,0.66)", fontSize: 12, lineHeight: 1.45, margin: "10px 0 0" }}>{plan.description}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 11 }}>
        {plan.tags.slice(0, 3).map(tag => (
          <span key={tag} style={tagStyle}>{tag.replace(/_/g, " ")}</span>
        ))}
      </div>
    </button>
  );
}

function SelectedPlanDetail({ plan }) {
  const workouts = trainingPlanPreviewWorkouts(plan, 4);
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(255,107,53,0.12), rgba(255,215,0,0.07))",
      border: "1px solid rgba(255,107,53,0.20)",
      borderRadius: 18,
      padding: 16,
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, marginBottom: 14 }}>
        <Metric label="Weeks" value={plan.durationWeeks} />
        <Metric label="Days" value={plan.frequencyDaysPerWeek} />
        <Metric label="Moves" value={trainingPlanExerciseCount(plan)} />
      </div>

      <p style={eyebrowStyle}>THIS WEEK</p>
      <div style={{ display: "grid", gap: 9 }}>
        {workouts.map(workout => (
          <div key={`${plan.id}-${workout.dayIndex}`} style={{
            background: "rgba(4,4,4,0.32)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            padding: 12,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div>
                <p style={{ color: "#FFFFFF", fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 900, margin: "0 0 3px" }}>{workout.name}</p>
                <p style={{ color: "rgba(255,255,255,0.56)", fontSize: 10, margin: 0 }}>{workout.label} · {workout.exerciseCount} exercises · {workout.estimatedMinutes} min</p>
              </div>
              <span style={{ color: "#FFD700", fontFamily: "monospace", fontSize: 10, fontWeight: 900 }}>DAY {workout.dayIndex}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 9 }}>
              {workout.exercises.slice(0, 4).map(exercise => (
                <span key={exercise.exerciseId} style={miniPillStyle}>{exercise.exerciseId.replace(/_/g, " ")}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 13 }}>
        <p style={eyebrowStyle}>PROGRESSION</p>
        <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 12, lineHeight: 1.45, margin: 0 }}>{plan.progression.notes}</p>
      </div>
    </div>
  );
}

export default function TrainingPlansSection({ useCases, viewModel }) {
  const { theme } = useAppTheme();
  const vm = viewModel || useTrainingPlansViewModel({ useCases });

  return (
    <section style={{
      background: "#040404",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 18,
      marginBottom: 24,
      overflow: "hidden",
    }}>
      <div style={{ padding: 18 }}>
        <p style={eyebrowStyle}>TRAINING PLANS</p>
        <h3 style={{ color: "#FFFFFF", fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 900, margin: "0 0 8px" }}>Open the app. Know the next session.</h3>
        <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 13, lineHeight: 1.45, margin: 0 }}>
          Official plans are backend-driven, free, and ready for tribe voting before enrollment ships.
        </p>
      </div>

      <div style={{ display: "grid", gap: 12, padding: "0 16px 16px" }}>
        <input
          aria-label="Search training plans"
          onChange={event => vm.updateFilter("search", event.target.value)}
          placeholder="Search goal, level, equipment"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 14,
            color: "#FFFFFF",
            fontSize: 14,
            minHeight: 44,
            outline: "none",
            padding: "0 14px",
          }}
          value={vm.filters.search}
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <FilterPill
            active={vm.filters.goal === TRAINING_PLAN_ALL_FILTER}
            onClick={() => vm.updateFilter("goal", TRAINING_PLAN_ALL_FILTER)}
          >
            All goals
          </FilterPill>
          {vm.filterOptions.goals.map(goal => (
            <FilterPill
              active={vm.filters.goal === goal.id}
              key={goal.id}
              onClick={() => vm.updateFilter("goal", goal.id)}
            >
              {goal.label}
            </FilterPill>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <FilterPill
            active={vm.filters.level === TRAINING_PLAN_ALL_FILTER}
            onClick={() => vm.updateFilter("level", TRAINING_PLAN_ALL_FILTER)}
          >
            All levels
          </FilterPill>
          {vm.filterOptions.levels.map(level => (
            <FilterPill
              active={vm.filters.level === level.id}
              key={level.id}
              onClick={() => vm.updateFilter("level", level.id)}
            >
              {level.label}
            </FilterPill>
          ))}
        </div>

        {vm.status === "loading" ? (
          <p style={{ color: theme.textSoft, fontSize: 13, margin: 0 }}>Loading training plans...</p>
        ) : null}

        {vm.status === "failed" ? (
          <div style={panelStyle("rgba(255,107,53,0.10)", "rgba(255,107,53,0.24)")}>
            <p style={{ color: "#FFFFFF", fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 900, margin: "0 0 8px" }}>Plans unavailable</p>
            <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 13, margin: "0 0 12px" }}>{vm.errorMessage}</p>
            <button onClick={vm.refresh} style={primaryButtonStyle}>Retry</button>
          </div>
        ) : null}

        {vm.isEmpty && vm.status !== "failed" && vm.status !== "loading" ? (
          <div style={panelStyle("rgba(255,255,255,0.04)", "rgba(255,255,255,0.08)")}>
            <p style={{ color: "#FFFFFF", fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 900, margin: "0 0 6px" }}>No plans found</p>
            <p style={{ color: "rgba(255,255,255,0.64)", fontSize: 13, margin: "0 0 12px" }}>Try a different goal or level.</p>
            <button onClick={vm.resetFilters} style={primaryButtonStyle}>Clear filters</button>
          </div>
        ) : null}

        {vm.status === "loaded" && vm.visiblePlans.length ? (
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.95fr) minmax(0, 1.05fr)", gap: 12 }}>
            <div style={{ display: "grid", gap: 10 }}>
              {vm.visiblePlans.map(plan => (
                <TrainingPlanCard
                  active={vm.selectedPlan?.id === plan.id}
                  key={plan.id}
                  onClick={() => vm.setSelectedPlanId(plan.id)}
                  plan={plan}
                />
              ))}
            </div>
            {vm.selectedPlan ? <SelectedPlanDetail plan={vm.selectedPlan} /> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div style={panelStyle("rgba(255,255,255,0.05)", "rgba(255,255,255,0.09)")}>
      <p style={{ color: "#FFD700", fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 900, margin: "0 0 3px" }}>{value}</p>
      <p style={{ color: "rgba(255,255,255,0.48)", fontFamily: "monospace", fontSize: 9, fontWeight: 900, letterSpacing: 1, margin: 0 }}>{label.toUpperCase()}</p>
    </div>
  );
}

function panelStyle(background, border) {
  return {
    background,
    border: `1px solid ${border}`,
    borderRadius: 16,
    padding: 14,
  };
}

const eyebrowStyle = {
  color: "rgba(255,255,255,0.52)",
  fontFamily: "monospace",
  fontSize: 10,
  fontWeight: 900,
  letterSpacing: 1.2,
  margin: "0 0 10px",
};

const tagStyle = {
  background: "rgba(255,107,53,0.10)",
  border: "1px solid rgba(255,107,53,0.24)",
  borderRadius: 999,
  color: "#FF8A65",
  fontFamily: "monospace",
  fontSize: 9,
  fontWeight: 900,
  letterSpacing: 0.5,
  padding: "4px 7px",
  textTransform: "uppercase",
};

const miniPillStyle = {
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 999,
  color: "rgba(255,255,255,0.66)",
  fontSize: 10,
  fontWeight: 800,
  padding: "4px 7px",
};

const primaryButtonStyle = {
  background: "linear-gradient(135deg, #FF6B35, #FFD700)",
  border: "none",
  borderRadius: 12,
  color: "#040404",
  cursor: "pointer",
  fontFamily: "'Syne', sans-serif",
  fontSize: 12,
  fontWeight: 900,
  minHeight: 36,
  padding: "0 13px",
};

import { useEffect, useMemo, useState } from "react";
import { useAppTheme } from "../../app/AppThemeContext";
import { resolveWorkoutAssetUrl as resolveAssetUrl } from "../domain/workoutAssetUrls";
import { ALL_FILTER_VALUE, useWorkoutCatalogViewModel } from "./useWorkoutCatalogViewModel";

export function resolveWorkoutAssetUrl(path) {
  return resolveAssetUrl(path);
}

export function getLottieFrameCount(data) {
  const inPoint = Number.isFinite(Number(data?.ip)) ? Number(data.ip) : 0;
  const outPoint = Number.isFinite(Number(data?.op)) ? Number(data.op) : 0;
  return Math.max(0, Math.round(outPoint - inPoint));
}

function useLazyJsonAsset(path) {
  const [state, setState] = useState({ status: "idle", data: null, error: "" });

  useEffect(() => {
    if (!path) {
      setState({ status: "idle", data: null, error: "" });
      return undefined;
    }
    if (typeof fetch !== "function") {
      setState({ status: "failed", data: null, error: "Fetch is unavailable" });
      return undefined;
    }

    const controller = new AbortController();
    setState({ status: "loading", data: null, error: "" });

    fetch(resolveWorkoutAssetUrl(path), { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error(`Asset returned ${response.status}`);
        return response.json();
      })
      .then(data => setState({ status: "loaded", data, error: "" }))
      .catch(error => {
        if (error.name === "AbortError") return;
        setState({ status: "failed", data: null, error: error.message || "Asset failed to load" });
      });

    return () => controller.abort();
  }, [path]);

  return state;
}

function labelFor(value) {
  return String(value || "")
    .split("_")
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function FilterSelect({ label, options, value, onChange }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 118 }}>
      <span style={{ color: "rgba(255,255,255,0.52)", fontFamily: "monospace", fontSize: 9, fontWeight: 800, letterSpacing: 1.2 }}>{label}</span>
      <select
        value={value}
        onChange={event => onChange(event.target.value)}
        style={{
          appearance: "none",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 10,
          color: "#FFFFFF",
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 12,
          fontWeight: 800,
          minHeight: 38,
          padding: "0 12px",
        }}
      >
        <option value={ALL_FILTER_VALUE}>All</option>
        {options.map(option => (
          <option key={option.id} value={option.id}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

function LoadingState() {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {[0, 1, 2].map(index => (
        <div key={index} style={{
          background: "rgba(255,255,255,0.045)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14,
          height: 88,
          overflow: "hidden",
          position: "relative",
        }}>
          <div style={{
            animation: "tribeWorkoutShimmer 1.2s ease-in-out infinite",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
            height: "100%",
            position: "absolute",
            width: "45%",
          }} />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onQuickLog, onResetFilters }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      padding: 20,
    }}>
      <p style={{ color: "#FFFFFF", fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 900, margin: "0 0 8px" }}>No exercises found</p>
      <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 13, lineHeight: 1.5, margin: "0 0 16px" }}>Adjust the filters or keep the fast logger moving while the official catalog is seeded.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <button onClick={onResetFilters} style={secondaryButtonStyle}>Reset filters</button>
        <button onClick={onQuickLog} style={primaryButtonStyle}>Quick Log</button>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div style={{
      background: "rgba(255,107,53,0.08)",
      border: "1px solid rgba(255,107,53,0.28)",
      borderRadius: 16,
      padding: 20,
    }}>
      <p style={{ color: "#FFFFFF", fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 900, margin: "0 0 8px" }}>Catalog unavailable</p>
      <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 13, lineHeight: 1.5, margin: "0 0 16px" }}>{message}</p>
      <button onClick={onRetry} style={primaryButtonStyle}>Retry</button>
    </div>
  );
}

function ExerciseCard({ exercise, isSelected, onSelect }) {
  const muscles = [...exercise.primaryMuscles, ...exercise.secondaryMuscles.slice(0, 2)];
  return (
    <button
      onClick={onSelect}
      style={{
        background: isSelected ? "linear-gradient(135deg, rgba(255,107,53,0.20), rgba(255,215,0,0.08))" : "rgba(255,255,255,0.04)",
        border: isSelected ? "1px solid rgba(255,107,53,0.56)" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        color: "#FFFFFF",
        cursor: "pointer",
        padding: 14,
        textAlign: "left",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{
          alignItems: "center",
          background: "rgba(255,107,53,0.14)",
          border: "1px solid rgba(255,107,53,0.24)",
          borderRadius: 12,
          color: "#FF6B35",
          display: "flex",
          fontFamily: "'Syne', sans-serif",
          fontSize: 20,
          fontWeight: 900,
          height: 48,
          justifyContent: "center",
          width: 48,
        }}>
          {exercise.name.charAt(0)}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 900, margin: "0 0 4px" }}>{exercise.name}</p>
          <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 12, fontWeight: 700, margin: 0 }}>{labelFor(exercise.level)} · {labelFor(exercise.movementPattern)}</p>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
        {muscles.map(muscle => (
          <span key={muscle} style={chipStyle}>{labelFor(muscle)}</span>
        ))}
      </div>
    </button>
  );
}

function ExerciseMotionPreview({ exercise }) {
  const asset = useLazyJsonAsset(exercise?.assetManifest?.lottiePath);
  const frameCount = getLottieFrameCount(asset.data);

  return (
    <div style={{
      background: "radial-gradient(circle at 50% 25%, rgba(255,107,53,0.18), rgba(255,255,255,0.04) 56%, rgba(0,0,0,0.22))",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      minHeight: 210,
      overflow: "hidden",
      position: "relative",
    }}>
      <div aria-hidden="true" className="tribe-workout-figure">
        <span className="head" />
        <span className="torso" />
        <span className="arm left" />
        <span className="arm right" />
        <span className="leg left" />
        <span className="leg right" />
        <span className="floor" />
      </div>
      <div style={{
        bottom: 12,
        color: asset.status === "loaded" ? "#34D399" : asset.status === "failed" ? "#FF8A65" : "rgba(255,255,255,0.62)",
        fontFamily: "monospace",
        fontSize: 10,
        fontWeight: 800,
        left: 14,
        letterSpacing: 1,
        position: "absolute",
      }}>
        {asset.status === "loaded" ? `LOTTIE READY · ${frameCount} FRAMES` : asset.status === "failed" ? "LOTTIE FALLBACK" : "LOADING LOTTIE"}
      </div>
    </div>
  );
}

function MuscleMap({ exercise }) {
  const [failed, setFailed] = useState(false);
  const src = resolveWorkoutAssetUrl(exercise?.assetManifest?.muscleMapFrontPath);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      padding: 14,
    }}>
      <p style={sectionEyebrowStyle}>MUSCLE FOCUS</p>
      {!failed && src ? (
        <img
          alt={`${exercise.name} muscle map`}
          loading="lazy"
          onError={() => setFailed(true)}
          src={src}
          style={{ display: "block", height: "auto", maxHeight: 230, objectFit: "contain", width: "100%" }}
        />
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {exercise.primaryMuscles.map(muscle => (
            <div key={muscle} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ background: "#FF6B35", borderRadius: 999, height: 10, width: 10 }} />
              <span style={{ color: "#FFFFFF", fontSize: 13, fontWeight: 800 }}>{labelFor(muscle)}</span>
            </div>
          ))}
          {exercise.secondaryMuscles.map(muscle => (
            <div key={muscle} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ background: "rgba(255,215,0,0.82)", borderRadius: 999, height: 10, width: 10 }} />
              <span style={{ color: "rgba(255,255,255,0.70)", fontSize: 12, fontWeight: 700 }}>{labelFor(muscle)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ExerciseDetail({ exercise }) {
  if (!exercise) return null;

  return (
    <aside style={{
      background: "rgba(255,255,255,0.035)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 18,
      padding: 16,
    }}>
      <p style={sectionEyebrowStyle}>EXERCISE DETAIL</p>
      <h3 style={{ color: "#FFFFFF", fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 900, margin: "0 0 6px" }}>{exercise.name}</h3>
      <p style={{ color: "rgba(255,255,255,0.66)", fontSize: 13, fontWeight: 700, margin: "0 0 14px" }}>{labelFor(exercise.level)} · {exercise.equipment.map(labelFor).join(", ")}</p>

      <ExerciseMotionPreview exercise={exercise} />

      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        <MuscleMap exercise={exercise} />

        <DetailList title="FORM CUES" items={exercise.formCues} />
        <DetailList title="COMMON MISTAKES" items={exercise.commonMistakes} muted />
        <DetailList title="INSTRUCTIONS" items={exercise.instructions} numbered />
      </div>
    </aside>
  );
}

function DetailList({ items, muted = false, numbered = false, title }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 14,
      padding: 14,
    }}>
      <p style={sectionEyebrowStyle}>{title}</p>
      <div style={{ display: "grid", gap: 8 }}>
        {items.map((item, index) => (
          <div key={item} style={{ display: "flex", gap: 8 }}>
            <span style={{ color: muted ? "rgba(255,255,255,0.42)" : "#FF6B35", fontFamily: "monospace", fontSize: 12, fontWeight: 900, minWidth: 18 }}>{numbered ? `${index + 1}.` : "•"}</span>
            <span style={{ color: muted ? "rgba(255,255,255,0.64)" : "rgba(255,255,255,0.82)", fontSize: 13, lineHeight: 1.45 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WorkoutsLibrarySection({
  onQuickLog,
  useCases,
  viewModel,
}) {
  const fallbackUseCases = useMemo(() => ({
    loadCatalog: { execute: async () => [] },
    getFilterOptions: { execute: async () => ({ muscles: [], equipment: [], levels: [] }) },
  }), []);
  useEffect(() => {
    if (!viewModel && !useCases) {
      console.warn("WorkoutsLibrarySection mounted without workout catalog use cases.");
    }
  }, [useCases, viewModel]);
  const liveViewModel = useWorkoutCatalogViewModel({ useCases: useCases || fallbackUseCases });
  const vm = viewModel || liveViewModel;
  const { theme } = useAppTheme();
  const totalLabel = useMemo(() => `${vm.visibleExercises.length} exercise${vm.visibleExercises.length === 1 ? "" : "s"}`, [vm.visibleExercises.length]);
  const isEmpty = vm.isEmpty ?? (vm.status === "empty" || (vm.status === "loaded" && vm.visibleExercises.length === 0));

  return (
    <section style={{
      background: "#040404",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 18,
      marginBottom: 24,
      overflow: "hidden",
    }}>
      <style>{workoutLibraryCss}</style>
      <div style={{
        background: "linear-gradient(135deg, rgba(255,107,53,0.28), rgba(255,215,0,0.08) 52%, rgba(255,255,255,0.03))",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: 18,
      }}>
        <p style={{ color: "#FFB199", fontFamily: "monospace", fontSize: 10, fontWeight: 900, letterSpacing: 1.6, margin: "0 0 8px" }}>BACKEND LIBRARY</p>
        <h3 style={{ color: "#FFFFFF", fontFamily: "'Syne', sans-serif", fontSize: 25, fontWeight: 900, margin: "0 0 8px" }}>Exercise Library</h3>
        <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 13, lineHeight: 1.45, margin: "0 0 16px" }}>Browse official exercises, inspect target muscles, and keep Quick Log one tap away.</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <button onClick={onQuickLog} style={primaryButtonStyle}>Quick Log</button>
          <button onClick={vm.refresh} style={secondaryButtonStyle}>Refresh</button>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ color: theme.mutedStrong, fontFamily: "monospace", fontSize: 9, fontWeight: 800, letterSpacing: 1.2 }}>SEARCH</span>
            <input
              value={vm.filters.search}
              onChange={event => vm.updateFilter("search", event.target.value)}
              placeholder="Search by name, muscle, equipment"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 12,
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: 700,
                minHeight: 44,
                padding: "0 14px",
                width: "100%",
              }}
            />
          </label>

          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 2 }}>
            <FilterSelect label="MUSCLE" options={vm.filterOptions.muscles} value={vm.filters.muscle} onChange={value => vm.updateFilter("muscle", value)} />
            <FilterSelect label="EQUIPMENT" options={vm.filterOptions.equipment} value={vm.filters.equipment} onChange={value => vm.updateFilter("equipment", value)} />
            <FilterSelect label="LEVEL" options={vm.filterOptions.levels} value={vm.filters.level} onChange={value => vm.updateFilter("level", value)} />
          </div>
        </div>

        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <p style={sectionEyebrowStyle}>{totalLabel.toUpperCase()}</p>
          <button onClick={vm.resetFilters} style={{
            background: "transparent",
            border: "none",
            color: "#FF6B35",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 800,
            padding: 0,
          }}>Reset</button>
        </div>

        {vm.status === "loading" ? <LoadingState /> : null}
        {vm.status === "failed" ? <ErrorState message={vm.errorMessage} onRetry={vm.refresh} /> : null}
        {isEmpty ? (
          <EmptyState onQuickLog={onQuickLog} onResetFilters={vm.resetFilters} />
        ) : null}

        {vm.status === "loaded" && vm.visibleExercises.length > 0 ? (
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gap: 10 }}>
              {vm.visibleExercises.map(exercise => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  isSelected={vm.selectedExercise?.id === exercise.id}
                  onSelect={() => vm.setSelectedExerciseId(exercise.id)}
                />
              ))}
            </div>
            <ExerciseDetail exercise={vm.selectedExercise} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

const chipStyle = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 999,
  color: "rgba(255,255,255,0.72)",
  fontSize: 10,
  fontWeight: 800,
  padding: "5px 8px",
};

const primaryButtonStyle = {
  background: "linear-gradient(135deg, #FF6B35, #FFD700)",
  border: "none",
  borderRadius: 12,
  color: "#040404",
  cursor: "pointer",
  fontFamily: "'Syne', sans-serif",
  fontSize: 13,
  fontWeight: 900,
  minHeight: 40,
  padding: "0 16px",
};

const secondaryButtonStyle = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 12,
  color: "#FFFFFF",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 800,
  minHeight: 40,
  padding: "0 16px",
};

const sectionEyebrowStyle = {
  color: "rgba(255,255,255,0.52)",
  fontFamily: "monospace",
  fontSize: 10,
  fontWeight: 900,
  letterSpacing: 1.2,
  margin: "0 0 10px",
};

const workoutLibraryCss = `
  @keyframes tribeWorkoutShimmer {
    0% { transform: translateX(-120%); }
    100% { transform: translateX(260%); }
  }

  @keyframes tribeWorkoutPulse {
    0%, 100% { transform: translate(-50%, -50%) translateY(0) rotate(0deg); }
    50% { transform: translate(-50%, -50%) translateY(18px) rotate(-5deg); }
  }

  .tribe-workout-figure {
    animation: tribeWorkoutPulse 1.8s ease-in-out infinite;
    height: 150px;
    left: 50%;
    position: absolute;
    top: 50%;
    width: 112px;
  }

  .tribe-workout-figure span {
    display: block;
    position: absolute;
  }

  .tribe-workout-figure .head {
    background: #F4C8B5;
    border-radius: 999px;
    height: 30px;
    left: 41px;
    top: 0;
    width: 30px;
  }

  .tribe-workout-figure .torso {
    background: #FF6B35;
    border-radius: 20px;
    height: 66px;
    left: 34px;
    top: 34px;
    width: 44px;
  }

  .tribe-workout-figure .arm {
    background: #F4C8B5;
    border-radius: 999px;
    height: 64px;
    top: 42px;
    width: 13px;
  }

  .tribe-workout-figure .arm.left { left: 18px; transform: rotate(20deg); }
  .tribe-workout-figure .arm.right { right: 18px; transform: rotate(-20deg); }

  .tribe-workout-figure .leg {
    background: #F4C8B5;
    border-radius: 999px;
    height: 70px;
    top: 92px;
    width: 15px;
  }

  .tribe-workout-figure .leg.left { left: 33px; transform: rotate(28deg); transform-origin: top center; }
  .tribe-workout-figure .leg.right { right: 33px; transform: rotate(-28deg); transform-origin: top center; }

  .tribe-workout-figure .floor {
    background: rgba(255,255,255,0.24);
    border-radius: 999px;
    height: 2px;
    left: 2px;
    top: 166px;
    width: 108px;
  }
`;

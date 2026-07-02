import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppTheme } from "../../app/AppThemeContext";
import { buildExerciseCoachingCues, findExerciseCueForMotionProgress, selectExerciseMotionSource } from "../domain/workoutCatalogModels";
import { resolveWorkoutAssetUrl as resolveAssetUrl } from "../domain/workoutAssetUrls";
import { ALL_FILTER_VALUE, useWorkoutCatalogViewModel } from "./useWorkoutCatalogViewModel";

const TEMP_GEMINI_WORKOUT_POSTER_PATH = "workouts/exercises/v2/gemini_motion_placeholder/poster.webp";

export function resolveWorkoutAssetUrl(path) {
  return resolveAssetUrl(path);
}

export function getLottieFrameCount(data) {
  const inPoint = Number.isFinite(Number(data?.ip)) ? Number(data.ip) : 0;
  const outPoint = Number.isFinite(Number(data?.op)) ? Number(data.op) : 0;
  return Math.max(0, Math.round(outPoint - inPoint));
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(Boolean(query.matches));
    const handleChange = event => setPrefersReducedMotion(Boolean(event.matches));

    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", handleChange);
      return () => query.removeEventListener("change", handleChange);
    }

    if (typeof query.addListener === "function") {
      query.addListener(handleChange);
      return () => query.removeListener(handleChange);
    }

    return undefined;
  }, []);

  return prefersReducedMotion;
}

export function getWorkoutMotionPlaybackMode({ prefersReducedMotion = false, forceMotion = false } = {}) {
  return prefersReducedMotion && !forceMotion ? "paused" : "playing";
}

function labelFor(value) {
  return String(value || "")
    .split("_")
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function selectStaticWorkoutPreviewSource(exercise = {}) {
  return {
    alt: `${exercise.name} temporary guided workout visual`,
    label: "TEMP VISUAL READY",
    path: TEMP_GEMINI_WORKOUT_POSTER_PATH,
  };
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

function StaticWorkoutVisualPreview({ autoPlay = true, exercise, onProgress }) {
  const preview = selectStaticWorkoutPreviewSource(exercise);
  const [failed, setFailed] = useState(false);
  const progressRef = useRef(0);

  useEffect(() => {
    setFailed(false);
    progressRef.current = 0;
    onProgress?.(0);
  }, [exercise?.id, preview.path, onProgress]);

  useEffect(() => {
    if (!autoPlay) return undefined;
    const interval = window.setInterval(() => {
      progressRef.current = (progressRef.current + 7) % 100;
      onProgress?.(progressRef.current);
    }, 360);
    return () => window.clearInterval(interval);
  }, [autoPlay, exercise?.id, onProgress]);

  return (
    <div style={{
      background: "radial-gradient(circle at 50% 25%, rgba(255,107,53,0.18), rgba(255,255,255,0.04) 56%, rgba(0,0,0,0.22))",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      minHeight: 210,
      overflow: "hidden",
      position: "relative",
    }}>
      {!failed && preview.path ? (
        <img
          alt={preview.alt}
          className={autoPlay ? "tribe-static-motion-preview is-playing" : "tribe-static-motion-preview"}
          loading="lazy"
          onError={() => setFailed(true)}
          src={resolveWorkoutAssetUrl(preview.path)}
        />
      ) : (
        <div className="tribe-motion-fallback">
          Visual preview unavailable
        </div>
      )}
      <div style={{
        background: "linear-gradient(180deg, transparent, rgba(4,4,4,0.68))",
        bottom: 0,
        height: 88,
        left: 0,
        position: "absolute",
        right: 0,
      }} />
      <div style={{
        bottom: 12,
        color: failed ? "#FF8A65" : "#34D399",
        fontFamily: "monospace",
        fontSize: 10,
        fontWeight: 800,
        left: 14,
        letterSpacing: 1,
        position: "absolute",
      }}>
        {failed ? "VISUAL UNAVAILABLE" : preview.label}
      </div>
      <div style={{
        background: "rgba(255,107,53,0.16)",
        border: "1px solid rgba(255,107,53,0.24)",
        borderRadius: 999,
        color: "#FFB199",
        fontFamily: "monospace",
        fontSize: 10,
        fontWeight: 900,
        padding: "7px 10px",
        position: "absolute",
        right: 12,
        top: 12,
      }}>
        TEMP PREVIEW
      </div>
    </div>
  );
}

function VideoWorkoutMotionPreview({ autoPlay = true, exercise, motionSource, onProgress }) {
  const [videoStatus, setVideoStatus] = useState("idle");

  useEffect(() => {
    setVideoStatus(motionSource.type === "video" ? "loading" : "idle");
  }, [motionSource.type, motionSource.path, motionSource.previewPath]);

  const videoStatusLabel = (() => {
    if (videoStatus === "failed") return "MOTION UNAVAILABLE";
    if (videoStatus === "ready") return "REALISTIC DEMO READY";
    return "LOADING REALISTIC DEMO";
  })();

  return (
    <div style={{
      background: "radial-gradient(circle at 50% 25%, rgba(255,107,53,0.18), rgba(255,255,255,0.04) 56%, rgba(0,0,0,0.22))",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      minHeight: 210,
      overflow: "hidden",
      position: "relative",
    }}>
      <video
        aria-label={`${exercise.name} animated demo`}
        autoPlay={autoPlay}
        loop
        muted
        onCanPlay={() => setVideoStatus("ready")}
        onError={() => setVideoStatus("failed")}
        onTimeUpdate={event => {
          const video = event.currentTarget;
          if (Number.isFinite(video.duration) && video.duration > 0) {
            onProgress?.((video.currentTime / video.duration) * 100);
          }
        }}
        playsInline
        poster={motionSource.posterPath ? resolveWorkoutAssetUrl(motionSource.posterPath) : undefined}
        style={{ height: "100%", inset: 0, objectFit: "contain", position: "absolute", width: "100%" }}
      >
        {motionSource.previewPath ? (
          <source src={resolveWorkoutAssetUrl(motionSource.previewPath)} type="video/webm" />
        ) : null}
        <source src={resolveWorkoutAssetUrl(motionSource.path)} type="video/mp4" />
      </video>
      {videoStatus === "failed" ? (
        <div className="tribe-motion-fallback">
          Motion preview unavailable
        </div>
      ) : null}
      {!autoPlay && videoStatus !== "failed" ? (
        <div className="tribe-motion-fallback">
          Motion paused for reduced motion
        </div>
      ) : null}
      <div style={{
        bottom: 12,
        color: videoStatus === "ready" ? "#34D399" : videoStatus === "failed" ? "#FF8A65" : "rgba(255,255,255,0.62)",
        fontFamily: "monospace",
        fontSize: 10,
        fontWeight: 800,
        left: 14,
        letterSpacing: 1,
        position: "absolute",
      }}>
        {videoStatusLabel}
      </div>
    </div>
  );
}

function ExerciseMotionPreview({ autoPlay = true, exercise, onProgress }) {
  const motionSource = selectExerciseMotionSource(exercise);

  if (motionSource.type === "video") {
    return <VideoWorkoutMotionPreview autoPlay={autoPlay} exercise={exercise} motionSource={motionSource} onProgress={onProgress} />;
  }

  return <StaticWorkoutVisualPreview autoPlay={autoPlay} exercise={exercise} onProgress={onProgress} />;
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

      <ExerciseCoachMode exercise={exercise} />

      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        <MuscleMap exercise={exercise} />

        <DetailList title="COMMON MISTAKES" items={exercise.commonMistakes} muted />
        {exercise.substitutions.length > 0 ? <DetailList title="SUBSTITUTIONS" items={exercise.substitutions} /> : null}
      </div>
    </aside>
  );
}

function ExerciseCoachMode({ exercise }) {
  const cues = useMemo(() => buildExerciseCoachingCues(exercise), [exercise]);
  const [activeCueId, setActiveCueId] = useState(cues[0]?.id || "");
  const [hasManualCueSelection, setHasManualCueSelection] = useState(false);
  const [forceMotion, setForceMotion] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const playbackMode = getWorkoutMotionPlaybackMode({ prefersReducedMotion, forceMotion });
  const activeIndex = Math.max(0, cues.findIndex(cue => cue.id === activeCueId));
  const activeCue = cues[activeIndex] || cues[0];
  const activeCueLiveMode = hasManualCueSelection || playbackMode === "paused" ? "polite" : "off";

  useEffect(() => {
    setActiveCueId(cues[0]?.id || "");
    setHasManualCueSelection(false);
    setForceMotion(false);
  }, [exercise.id, cues]);

  useEffect(() => {
    if (cues.length < 2 || hasManualCueSelection) return;
    setActiveCueId(current => findExerciseCueForMotionProgress(cues, 0, current)?.id || current);
  }, [cues, hasManualCueSelection]);

  const handleMotionProgress = useCallback((progressPercent) => {
    if (playbackMode !== "playing" || hasManualCueSelection || cues.length < 2) return;
    setActiveCueId(current => findExerciseCueForMotionProgress(cues, progressPercent, current)?.id || current);
  }, [cues, hasManualCueSelection, playbackMode]);

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(255,107,53,0.12), rgba(255,255,255,0.035))",
      border: "1px solid rgba(255,107,53,0.24)",
      borderRadius: 18,
      padding: 14,
    }}>
      <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
        <div>
          <p style={{ ...sectionEyebrowStyle, color: "#FF6B35", marginBottom: 5 }}>MOVEMENT COACH</p>
          <p style={{ color: "#FFFFFF", fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 900, margin: 0 }}>Watch the demo with the active cue.</p>
        </div>
        <div style={{ alignItems: "center", display: "flex", flexShrink: 0, gap: 8 }}>
          {playbackMode === "paused" ? (
            <button
              type="button"
              onClick={() => setForceMotion(true)}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,107,53,0.30)",
                borderRadius: 999,
                color: "#FFB199",
                cursor: "pointer",
                fontFamily: "monospace",
                fontSize: 10,
                fontWeight: 900,
                padding: "7px 9px",
                whiteSpace: "nowrap",
              }}
            >
              PLAY MOTION
            </button>
          ) : null}
          {hasManualCueSelection ? (
            <button
              type="button"
              onClick={() => setHasManualCueSelection(false)}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,107,53,0.30)",
                borderRadius: 999,
                color: "#FFB199",
                cursor: "pointer",
                fontFamily: "monospace",
                fontSize: 10,
                fontWeight: 900,
                padding: "7px 9px",
                whiteSpace: "nowrap",
              }}
            >
              SYNC TO MOTION
            </button>
          ) : null}
          <span style={{
            background: "rgba(255,107,53,0.16)",
            border: "1px solid rgba(255,107,53,0.24)",
            borderRadius: 999,
            color: "#FF6B35",
            fontFamily: "monospace",
            fontSize: 10,
            fontWeight: 900,
            padding: "7px 9px",
            whiteSpace: "nowrap",
          }}>
            {String(activeIndex + 1).padStart(2, "0")} / {String(cues.length || 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      <ExerciseMotionPreview autoPlay={playbackMode === "playing"} exercise={exercise} onProgress={handleMotionProgress} />

      {activeCue ? (
        <div
          aria-atomic="true"
          aria-live={activeCueLiveMode}
          style={{
            background: "rgba(255,107,53,0.16)",
            border: "1px solid rgba(255,107,53,0.36)",
            borderRadius: 16,
            marginTop: 12,
            padding: 14,
          }}
        >
          <p style={{ color: "#FF6B35", fontFamily: "monospace", fontSize: 10, fontWeight: 900, letterSpacing: 1.2, margin: "0 0 8px" }}>
            {labelFor(activeCue.phase).toUpperCase()} · {activeCue.view.toUpperCase()} VIEW
          </p>
          <p style={{ color: "#FFFFFF", fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 900, margin: "0 0 8px" }}>{activeCue.title}</p>
          <p style={{ color: "rgba(255,255,255,0.74)", fontSize: 13, fontWeight: 700, lineHeight: 1.48, margin: 0 }}>{activeCue.body}</p>
          {activeCue.focusMuscles.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
              {activeCue.focusMuscles.map(muscle => (
                <span key={muscle} style={{ ...chipStyle, borderColor: "rgba(255,107,53,0.30)", color: "#FFB199" }}>{labelFor(muscle)}</span>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <div style={{ display: "flex", gap: 8, marginTop: 12, overflowX: "auto", paddingBottom: 2 }}>
        {cues.map((cue, index) => {
          const selected = cue.id === activeCue?.id;
          return (
            <button
              key={cue.id}
              onClick={() => {
                setHasManualCueSelection(true);
                setActiveCueId(cue.id);
              }}
              style={{
                background: selected ? "rgba(255,107,53,0.20)" : "rgba(255,255,255,0.05)",
                border: selected ? "1px solid rgba(255,107,53,0.62)" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                color: selected ? "#FFFFFF" : "rgba(255,255,255,0.68)",
                cursor: "pointer",
                flex: "0 0 148px",
                minHeight: 62,
                padding: 10,
                textAlign: "left",
              }}
            >
              <span style={{ color: selected ? "#FF6B35" : "rgba(255,255,255,0.40)", display: "block", fontFamily: "monospace", fontSize: 10, fontWeight: 900, marginBottom: 5 }}>0{index + 1}</span>
              <span style={{ display: "block", fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 900, lineHeight: 1.15 }}>{cue.title}</span>
            </button>
          );
        })}
      </div>
    </div>
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

  @keyframes tribeStaticWorkoutPreviewPulse {
    0%, 100% { transform: scale(1); filter: saturate(1.02) brightness(0.96); }
    50% { transform: scale(1.035); filter: saturate(1.10) brightness(1.04); }
  }

  .tribe-lottie-preview {
    height: 100%;
    position: absolute;
    inset: 0;
    width: 100%;
  }

  .tribe-lottie-preview svg {
    display: block;
    height: 100% !important;
    margin: auto;
    max-width: 100%;
    width: 100% !important;
  }

  .tribe-static-motion-preview {
    display: block;
    height: 100%;
    inset: 0;
    object-fit: cover;
    position: absolute;
    transform-origin: 52% 48%;
    width: 100%;
  }

  .tribe-static-motion-preview.is-playing {
    animation: tribeStaticWorkoutPreviewPulse 3.2s ease-in-out infinite;
  }

  .tribe-motion-fallback {
    align-items: center;
    color: rgba(255,255,255,0.62);
    display: flex;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 13px;
    font-weight: 800;
    inset: 0;
    justify-content: center;
    padding: 24px;
    position: absolute;
    text-align: center;
  }
`;

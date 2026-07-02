import { buildMuscleHeatMapRegions } from "../../../../domain/workoutInsightModels";

function formatVolume(value = 0) {
  return `${Math.round(Number(value || 0)).toLocaleString()} kg`;
}

export default function MuscleVolumeHeatMapPanel({ vm }) {
  const insight = vm?.muscleVolumeInsight;
  const topMuscles = insight?.topMuscles || [];
  const heatMapRegions = insight ? buildMuscleHeatMapRegions(insight) : [];
  const isInsufficient = insight?.insufficientData;
  const cooldownSeconds = vm?.aggregateCooldownSeconds || 0;
  return (
    <div style={panelStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
        <div>
          <p style={eyebrowStyle}>MUSCLE VOLUME</p>
          <h4 style={titleStyle}>{insight?.periodKey || "This week"}</h4>
        </div>
        <button
          disabled={vm?.aggregateStatus === "syncing" || cooldownSeconds > 0}
          onClick={vm?.refreshMuscleVolume}
          style={{
            ...buttonStyle,
            opacity: vm?.aggregateStatus === "syncing" || cooldownSeconds > 0 ? 0.5 : 1,
          }}
          type="button"
        >
          {cooldownSeconds > 0 ? `Try in ${cooldownSeconds}s` : (vm?.aggregateStatus === "syncing" ? "Refreshing..." : "Refresh weekly read")}
        </button>
      </div>

      {vm?.aggregateStatus === "loading" ? (
        <p style={bodyStyle}>Loading weekly muscle focus...</p>
      ) : null}

      {vm?.aggregateStatus === "failed" ? (
        <p style={bodyStyle}>{vm.errorMessage || "Muscle volume could not load. Try again shortly."}</p>
      ) : null}

      {topMuscles.length ? (
        <div style={{ display: "grid", gap: 9 }}>
          <MuscleBodyHeatMap regions={heatMapRegions} />
          <div style={{
            alignItems: "center",
            display: "grid",
            gap: 10,
            gridTemplateColumns: "88px 1fr 72px",
          }}>
            {topMuscles.map(muscle => (
              <MuscleBar key={muscle.muscle} muscle={muscle} />
            ))}
          </div>
          <p style={{ ...bodyStyle, fontSize: 11 }}>
            {isInsufficient
              ? `Needs ${Math.max(0, (insight?.minimumSessionCount || 3) - (insight?.sessionCount || 0))} more completed workout(s) for a stronger weekly read.`
              : "Rounded weekly volume by primary muscle group. Private until you choose to share."}
          </p>
        </div>
      ) : (
        <p style={bodyStyle}>Finish three guided workouts this week to unlock a private muscle-focus map.</p>
      )}
    </div>
  );
}

function MuscleBodyHeatMap({ regions = [] }) {
  const region = key => regions.find(item => item.region === key) || { intensity: 0, volumeKg: 0 };
  const regionStyle = key => {
    const intensity = Number(region(key).intensity || 0);
    return {
      fill: intensity > 0 ? `rgba(255,107,53,${0.16 + (intensity * 0.78)})` : "rgba(255,255,255,0.08)",
      stroke: intensity > 0 ? "rgba(255,215,0,0.36)" : "rgba(255,255,255,0.10)",
      strokeWidth: 2,
    };
  };
  const topRegions = regions.slice(0, 3);

  return (
    <div style={bodyMapShellStyle}>
      <svg aria-label="Weekly muscle volume body heat map" role="img" viewBox="0 0 520 270" style={{ display: "block", width: "100%" }}>
        <rect x="0" y="0" width="520" height="270" rx="28" fill="rgba(4,4,4,0.40)" />
        <text x="72" y="34" fill="rgba(255,255,255,0.52)" fontFamily="monospace" fontSize="13" fontWeight="900">FRONT</text>
        <text x="330" y="34" fill="rgba(255,255,255,0.52)" fontFamily="monospace" fontSize="13" fontWeight="900">BACK</text>

        <circle cx="132" cy="62" r="20" fill="rgba(255,210,178,0.90)" />
        <circle cx="388" cy="62" r="20" fill="rgba(255,210,178,0.90)" />
        <rect x="119" y="82" width="26" height="22" rx="9" fill="rgba(255,210,178,0.72)" />
        <rect x="375" y="82" width="26" height="22" rx="9" fill="rgba(255,210,178,0.72)" />

        <path d="M92 98 C102 82 162 82 172 98 L156 178 C145 188 119 188 108 178 Z" {...regionStyle("chest")} />
        <path d="M110 120 C126 112 140 112 154 120 L150 178 C140 190 122 190 114 178 Z" {...regionStyle("core")} />
        <path d="M84 104 C62 120 56 164 64 196 C76 196 86 184 91 161 Z" {...regionStyle("shoulders")} />
        <path d="M180 104 C202 120 208 164 200 196 C188 196 178 184 173 161 Z" {...regionStyle("shoulders")} />
        <path d="M76 138 C66 157 64 196 70 224 C82 224 90 203 91 167 Z" {...regionStyle("arms_front")} />
        <path d="M188 138 C198 157 200 196 194 224 C182 224 174 203 173 167 Z" {...regionStyle("arms_front")} />
        <path d="M104 184 C96 210 96 238 105 255 C119 255 126 224 126 190 Z" {...regionStyle("quads")} />
        <path d="M160 184 C168 210 168 238 159 255 C145 255 138 224 138 190 Z" {...regionStyle("quads")} />
        <path d="M105 232 C102 246 102 260 108 266 L124 266 C128 254 127 242 124 232 Z" {...regionStyle("calves")} />
        <path d="M140 232 C137 246 136 254 140 266 L156 266 C162 260 162 246 159 232 Z" {...regionStyle("calves")} />

        <path d="M348 98 C358 82 418 82 428 98 L412 178 C401 188 375 188 364 178 Z" {...regionStyle("lats")} />
        <path d="M370 102 C382 96 394 96 406 102 L404 142 C392 150 380 150 368 142 Z" {...regionStyle("upper_back")} />
        <path d="M372 144 C386 136 398 136 404 144 L402 179 C391 187 380 187 366 179 Z" {...regionStyle("lower_back")} />
        <path d="M360 178 C374 190 402 190 416 178 L410 208 C392 218 376 218 354 208 Z" {...regionStyle("glutes")} />
        <path d="M340 104 C318 120 312 164 320 196 C332 196 342 184 347 161 Z" {...regionStyle("shoulders")} />
        <path d="M436 104 C458 120 464 164 456 196 C444 196 434 184 429 161 Z" {...regionStyle("shoulders")} />
        <path d="M332 138 C322 157 320 196 326 224 C338 224 346 203 347 167 Z" {...regionStyle("arms_back")} />
        <path d="M444 138 C454 157 456 196 450 224 C438 224 430 203 429 167 Z" {...regionStyle("arms_back")} />
        <path d="M358 206 C352 229 352 248 361 263 C374 263 382 236 383 212 Z" {...regionStyle("hamstrings")} />
        <path d="M410 206 C416 229 416 248 407 263 C394 263 386 236 385 212 Z" {...regionStyle("hamstrings")} />
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {topRegions.map(item => (
          <span key={item.region} style={heatMapPillStyle}>
            {item.label} · {formatVolume(item.volumeKg)}
          </span>
        ))}
      </div>
    </div>
  );
}

function MuscleBar({ muscle }) {
  return (
    <>
      <span style={{
        color: "rgba(255,255,255,0.72)",
        fontFamily: "monospace",
        fontSize: 10,
        fontWeight: 900,
        letterSpacing: 0.7,
        textTransform: "uppercase",
      }}>
        {muscle.label}
      </span>
      <div style={{
        background: "rgba(255,255,255,0.06)",
        borderRadius: 999,
        height: 10,
        overflow: "hidden",
      }}>
        <div style={{
          background: "linear-gradient(90deg, #FF6B35, #FFD700)",
          borderRadius: 999,
          height: "100%",
          width: `${Math.round((muscle.intensity || 0) * 100)}%`,
        }} />
      </div>
      <span style={{
        color: "#FFD700",
        fontFamily: "monospace",
        fontSize: 10,
        fontWeight: 900,
        textAlign: "right",
      }}>
        {formatVolume(muscle.volumeKg)}
      </span>
    </>
  );
}

const panelStyle = {
  background: "rgba(255,255,255,0.035)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
  padding: 14,
};

const bodyMapShellStyle = {
  background: "radial-gradient(circle at 50% 10%, rgba(255,107,53,0.14), rgba(4,4,4,0.30))",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 18,
  display: "grid",
  gap: 9,
  padding: 10,
};

const heatMapPillStyle = {
  background: "rgba(255,107,53,0.12)",
  border: "1px solid rgba(255,107,53,0.26)",
  borderRadius: 999,
  color: "#FFB089",
  fontFamily: "monospace",
  fontSize: 10,
  fontWeight: 900,
  padding: "5px 8px",
};

const eyebrowStyle = {
  color: "rgba(255,255,255,0.52)",
  fontFamily: "monospace",
  fontSize: 10,
  fontWeight: 900,
  letterSpacing: 1.2,
  margin: "0 0 7px",
};

const titleStyle = {
  color: "#FFFFFF",
  fontFamily: "'Syne', sans-serif",
  fontSize: 20,
  fontWeight: 900,
  margin: 0,
};

const bodyStyle = {
  color: "rgba(255,255,255,0.66)",
  fontSize: 13,
  lineHeight: 1.45,
  margin: 0,
};

const buttonStyle = {
  background: "rgba(255,107,53,0.14)",
  border: "1px solid rgba(255,107,53,0.28)",
  borderRadius: 12,
  color: "#FF6B35",
  cursor: "pointer",
  fontFamily: "'Syne', sans-serif",
  fontSize: 12,
  fontWeight: 900,
  minHeight: 36,
  padding: "0 12px",
  whiteSpace: "nowrap",
};

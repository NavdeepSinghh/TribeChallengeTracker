const fs = require('fs');
const path = require('path');
const { loadMediaManifest } = require('./validate-workout-high-fidelity-media');

const INPUT_FILE = path.resolve(__dirname, 'workout-high-fidelity-media-poc.json');
const OUTPUT_FILE = path.resolve(__dirname, '../docs/workouts/review-packs/high-fidelity-motion-poc-board-2026-07-02.html');

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function label(value) {
  return String(value || '')
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function cueKeyframes(record) {
  return record.renderBrief.phaseTimeline.map((phase, index) => {
    const cueName = `cue-${record.id}-${index}`;
    const start = Number(phase.startPercent);
    const end = Number(phase.endPercent);
    const before = Math.max(0, start - 0.1).toFixed(1);
    const after = Math.min(100, end + 0.1).toFixed(1);
    return `
      @keyframes ${cueName} {
        0%, ${before}% { opacity: 0.28; transform: translateX(0) scale(0.98); }
        ${start}%, ${end}% { opacity: 1; transform: translateX(-6px) scale(1); border-color: rgba(255,107,53,0.76); }
        ${after}%, 100% { opacity: 0.28; transform: translateX(0) scale(0.98); }
      }
    `;
  }).join('\n');
}

function styles(records) {
  return `
    :root {
      --brand: #ff6b35;
      --dark: #040404;
      --panel: rgba(255,255,255,0.045);
      --line: rgba(255,255,255,0.10);
      --muted: rgba(255,255,255,0.62);
      --skin: #d79562;
      --skin-light: #ffc48d;
      --muscle-primary: rgba(255,107,53,0.92);
      --muscle-secondary: rgba(45,212,191,0.58);
    }
    * { box-sizing: border-box; }
    body {
      background:
        radial-gradient(circle at 10% 0%, rgba(255,107,53,0.22), transparent 34%),
        radial-gradient(circle at 75% 15%, rgba(45,212,191,0.16), transparent 30%),
        var(--dark);
      color: white;
      font-family: "Space Grotesk", Inter, system-ui, sans-serif;
      margin: 0;
      padding: 34px;
    }
    header { max-width: 1120px; margin: 0 auto 26px; }
    h1 {
      font-family: Syne, Inter, system-ui, sans-serif;
      font-size: clamp(36px, 6vw, 76px);
      letter-spacing: 0;
      line-height: 0.92;
      margin: 0 0 14px;
    }
    p { color: var(--muted); line-height: 1.55; }
    .board { display: grid; gap: 22px; max-width: 1380px; margin: 0 auto; }
    .card {
      background: linear-gradient(145deg, rgba(255,107,53,0.13), rgba(255,255,255,0.035));
      border: 1px solid rgba(255,107,53,0.28);
      border-radius: 22px;
      display: grid;
      gap: 20px;
      grid-template-columns: minmax(320px, 1.1fr) minmax(280px, 0.9fr);
      overflow: hidden;
      padding: 20px;
    }
    .motion-stage {
      background:
        radial-gradient(circle at 50% 30%, rgba(45,212,191,0.24), transparent 28%),
        radial-gradient(circle at 50% 80%, rgba(255,107,53,0.16), transparent 28%),
        rgba(0,0,0,0.32);
      border: 1px solid var(--line);
      border-radius: 18px;
      min-height: 420px;
      overflow: hidden;
      position: relative;
    }
    .motion-stage::before {
      background-image: linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
      background-size: 26px 26px;
      content: "";
      inset: 0;
      opacity: 0.2;
      position: absolute;
    }
    .stage-label {
      color: rgba(255,255,255,0.72);
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 11px;
      font-weight: 900;
      left: 18px;
      letter-spacing: 0.16em;
      position: absolute;
      text-transform: uppercase;
      top: 16px;
      z-index: 3;
    }
    svg { display: block; height: 100%; position: relative; width: 100%; z-index: 2; }
    .ground { stroke: rgba(255,255,255,0.12); stroke-width: 2; stroke-dasharray: 9 8; }
    .body { fill: none; stroke: url(#skinGradient); stroke-width: 16; stroke-linecap: round; stroke-linejoin: round; }
    .body-fill { fill: url(#skinGradient); stroke: rgba(255,255,255,0.14); stroke-width: 1.4; }
    .torso { fill: #191919; stroke: rgba(255,255,255,0.18); stroke-width: 1.4; }
    .equipment { fill: #999; stroke: rgba(255,255,255,0.28); stroke-width: 2; }
    .equipment-dark { fill: #2d2d2d; stroke: rgba(255,255,255,0.22); stroke-width: 2; }
    .primary { fill: var(--muscle-primary); stroke: var(--muscle-primary); filter: drop-shadow(0 0 10px rgba(255,107,53,0.62)); opacity: 0.9; }
    .secondary { fill: var(--muscle-secondary); stroke: var(--muscle-secondary); filter: drop-shadow(0 0 8px rgba(45,212,191,0.42)); opacity: 0.7; }
    .joint { fill: rgba(255,255,255,0.68); opacity: 0.7; }
    .squat-motion { animation: squat 3.4s ease-in-out infinite; transform-origin: 180px 285px; }
    .push-motion { animation: push 3s ease-in-out infinite; transform-origin: 180px 185px; }
    .lat-arms { animation: latPull 3.6s ease-in-out infinite; transform-origin: 180px 170px; }
    .rdl-torso { animation: hinge 3.8s ease-in-out infinite; transform-origin: 176px 184px; }
    .rdl-bar { animation: barHinge 3.8s ease-in-out infinite; }
    .split-motion { animation: splitSquat 4s ease-in-out infinite; transform-origin: 170px 292px; }
    @keyframes squat { 0%, 100% { transform: translateY(0); } 54% { transform: translateY(34px) scaleY(0.96); } }
    @keyframes push { 0%, 100% { transform: translateY(-18px); } 52% { transform: translateY(28px); } }
    @keyframes latPull { 0%, 100% { transform: translateY(-32px); } 56%, 72% { transform: translateY(14px); } }
    @keyframes hinge { 0%, 100% { transform: rotate(0deg); } 56%, 72% { transform: rotate(36deg); } }
    @keyframes barHinge { 0%, 100% { transform: translate(0, 0); } 56%, 72% { transform: translate(36px, 58px); } }
    @keyframes splitSquat { 0%, 100% { transform: translateY(0); } 58%, 86% { transform: translateY(34px); } }
    .info { align-self: stretch; display: grid; gap: 14px; }
    .topline {
      align-items: center;
      color: var(--muted);
      display: flex;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 11px;
      font-weight: 900;
      justify-content: space-between;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    h2 {
      font-family: Syne, Inter, system-ui, sans-serif;
      font-size: clamp(28px, 4vw, 42px);
      line-height: 0.98;
      margin: 0;
    }
    .chips { display: flex; flex-wrap: wrap; gap: 7px; }
    .chip {
      border: 1px solid var(--line);
      border-radius: 999px;
      color: white;
      font-size: 12px;
      font-weight: 900;
      padding: 7px 10px;
    }
    .chip.primary-chip { border-color: rgba(255,107,53,0.62); color: #ffb199; }
    .chip.secondary-chip { border-color: rgba(45,212,191,0.48); color: #99f6e4; }
    .cue-stack { display: grid; gap: 10px; }
    .cue {
      background: rgba(0,0,0,0.26);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 12px;
      transform-origin: right center;
    }
    .cue strong {
      color: var(--brand);
      display: block;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 11px;
      letter-spacing: 0.12em;
      margin-bottom: 6px;
      text-transform: uppercase;
    }
    .cue span { color: white; display: block; font-size: 15px; font-weight: 900; line-height: 1.25; }
    .cue em { color: var(--muted); display: block; font-size: 11px; font-style: normal; font-weight: 800; margin-top: 7px; }
    .meta {
      background: rgba(0,0,0,0.24);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 12px;
    }
    .meta-title {
      color: var(--brand);
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.13em;
      margin: 0 0 8px;
      text-transform: uppercase;
    }
    .meta p { font-size: 13px; font-weight: 700; margin: 0; }
    @media (max-width: 860px) {
      body { padding: 18px; }
      .card { grid-template-columns: 1fr; padding: 14px; }
      .motion-stage { min-height: 340px; }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-play-state: paused !important; }
    }
    ${records.map(cueKeyframes).join('\n')}
  `;
}

function svgDefs() {
  return `
    <defs>
      <linearGradient id="skinGradient" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#ffc48d"/>
        <stop offset="100%" stop-color="#b96d43"/>
      </linearGradient>
      <filter id="softShadow">
        <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#000" flood-opacity="0.42"/>
      </filter>
    </defs>
  `;
}

function gobletSquatSvg() {
  return `
    <svg viewBox="0 0 360 360" role="img" aria-label="Goblet squat animated motion prototype">
      ${svgDefs()}
      <line class="ground" x1="54" y1="318" x2="306" y2="318"/>
      <g class="squat-motion" filter="url(#softShadow)">
        <circle class="body-fill" cx="180" cy="76" r="25"/>
        <rect class="torso" x="151" y="106" width="58" height="82" rx="26"/>
        <ellipse class="secondary" cx="180" cy="144" rx="13" ry="32"/>
        <circle class="equipment-dark" cx="180" cy="130" r="18"/>
        <path class="body" d="M153 120 C126 144 124 170 142 190"/>
        <path class="body" d="M207 120 C234 144 236 170 218 190"/>
        <path class="body" d="M163 188 L132 260 L118 315"/>
        <path class="body" d="M197 188 L228 260 L242 315"/>
        <path class="primary" d="M154 202 L132 258" stroke-width="13" stroke-linecap="round"/>
        <path class="primary" d="M206 202 L228 258" stroke-width="13" stroke-linecap="round"/>
        <ellipse class="primary" cx="151" cy="190" rx="19" ry="14"/>
        <ellipse class="primary" cx="209" cy="190" rx="19" ry="14"/>
        <circle class="joint" cx="151" cy="119" r="4"/><circle class="joint" cx="209" cy="119" r="4"/>
        <circle class="joint" cx="132" cy="260" r="4"/><circle class="joint" cx="228" cy="260" r="4"/>
      </g>
    </svg>
  `;
}

function pushUpSvg() {
  return `
    <svg viewBox="0 0 360 360" role="img" aria-label="Push-up animated motion prototype">
      ${svgDefs()}
      <line class="ground" x1="42" y1="272" x2="318" y2="272"/>
      <g class="push-motion" filter="url(#softShadow)">
        <circle class="body-fill" cx="266" cy="168" r="20"/>
        <path class="body" d="M238 180 L164 188 L82 204"/>
        <path class="torso" d="M226 174 C195 166 168 170 144 188 C167 204 198 207 228 194 Z"/>
        <path class="primary" d="M210 180 C188 178 166 182 151 191" stroke-width="12" stroke-linecap="round"/>
        <path class="secondary" d="M163 190 L92 204" stroke-width="10" stroke-linecap="round"/>
        <path class="body" d="M219 190 L207 250"/>
        <path class="body" d="M196 190 L184 250"/>
        <path class="primary" d="M218 197 L208 242" stroke-width="10" stroke-linecap="round"/>
        <path class="primary" d="M196 198 L186 242" stroke-width="10" stroke-linecap="round"/>
        <path class="body" d="M102 205 L70 248"/>
        <circle class="joint" cx="219" cy="190" r="4"/><circle class="joint" cx="196" cy="190" r="4"/>
      </g>
    </svg>
  `;
}

function latPulldownSvg() {
  return `
    <svg viewBox="0 0 360 360" role="img" aria-label="Lat pulldown animated motion prototype">
      ${svgDefs()}
      <path class="equipment" d="M85 304 L85 60 L275 60 L275 304" fill="none"/>
      <line class="equipment" x1="130" y1="72" x2="230" y2="72"/>
      <line class="equipment" x1="180" y1="72" x2="180" y2="122"/>
      <rect class="equipment-dark" x="130" y="278" width="100" height="20" rx="8"/>
      <g filter="url(#softShadow)">
        <circle class="body-fill" cx="180" cy="136" r="24"/>
        <rect class="torso" x="151" y="168" width="58" height="82" rx="24"/>
        <path class="primary" d="M150 176 C128 204 128 230 150 250" stroke-width="12" stroke-linecap="round"/>
        <path class="primary" d="M210 176 C232 204 232 230 210 250" stroke-width="12" stroke-linecap="round"/>
        <path class="secondary" d="M160 177 C172 198 188 198 200 177" stroke-width="9" stroke-linecap="round"/>
        <path class="body" d="M154 248 L132 300"/>
        <path class="body" d="M206 248 L228 300"/>
        <g class="lat-arms">
          <path class="body" d="M150 174 L126 104 L118 72"/>
          <path class="body" d="M210 174 L234 104 L242 72"/>
          <path class="secondary" d="M143 148 L126 104" stroke-width="10" stroke-linecap="round"/>
          <path class="secondary" d="M217 148 L234 104" stroke-width="10" stroke-linecap="round"/>
        </g>
      </g>
    </svg>
  `;
}

function romanianDeadliftSvg() {
  return `
    <svg viewBox="0 0 360 360" role="img" aria-label="Romanian deadlift animated motion prototype">
      ${svgDefs()}
      <line class="ground" x1="54" y1="316" x2="306" y2="316"/>
      <g filter="url(#softShadow)">
        <path class="body" d="M176 184 L151 304"/>
        <path class="body" d="M198 184 L223 304"/>
        <path class="primary" d="M176 198 L154 292" stroke-width="12" stroke-linecap="round"/>
        <path class="primary" d="M198 198 L220 292" stroke-width="12" stroke-linecap="round"/>
        <ellipse class="primary" cx="187" cy="190" rx="26" ry="16"/>
        <g class="rdl-torso">
          <circle class="body-fill" cx="180" cy="74" r="24"/>
          <rect class="torso" x="153" y="104" width="54" height="88" rx="24"/>
          <ellipse class="secondary" cx="180" cy="146" rx="12" ry="32"/>
          <path class="body" d="M158 126 L132 196"/>
          <path class="body" d="M202 126 L228 196"/>
        </g>
        <g class="rdl-bar">
          <line class="equipment-dark" x1="118" y1="206" x2="246" y2="206"/>
          <circle class="equipment-dark" cx="106" cy="206" r="14"/>
          <circle class="equipment-dark" cx="258" cy="206" r="14"/>
        </g>
      </g>
    </svg>
  `;
}

function bulgarianSplitSquatSvg() {
  return `
    <svg viewBox="0 0 360 360" role="img" aria-label="Bulgarian split squat animated motion prototype">
      ${svgDefs()}
      <line class="ground" x1="42" y1="318" x2="318" y2="318"/>
      <rect class="equipment-dark" x="225" y="244" width="78" height="22" rx="8"/>
      <g class="split-motion" filter="url(#softShadow)">
        <circle class="body-fill" cx="170" cy="86" r="24"/>
        <rect class="torso" x="144" y="116" width="52" height="82" rx="23"/>
        <ellipse class="secondary" cx="170" cy="154" rx="11" ry="30"/>
        <path class="body" d="M145 134 L122 208"/>
        <path class="body" d="M195 134 L218 208"/>
        <path class="body" d="M160 198 L130 262 L118 318"/>
        <path class="body" d="M191 198 L244 252 L286 260"/>
        <path class="primary" d="M160 210 L132 262" stroke-width="13" stroke-linecap="round"/>
        <ellipse class="primary" cx="191" cy="198" rx="21" ry="14"/>
        <path class="secondary" d="M195 206 L240 250" stroke-width="10" stroke-linecap="round"/>
        <circle class="joint" cx="130" cy="262" r="4"/><circle class="joint" cx="244" cy="252" r="4"/>
      </g>
    </svg>
  `;
}

function motionSvg(id) {
  const map = {
    goblet_squat: gobletSquatSvg,
    push_up: pushUpSvg,
    lat_pulldown: latPulldownSvg,
    romanian_deadlift: romanianDeadliftSvg,
    bulgarian_split_squat: bulgarianSplitSquatSvg,
  };
  return (map[id] || gobletSquatSvg)();
}

function chips(values, className) {
  return values.map((value) => `<span class="chip ${className}">${escapeHtml(label(value))}</span>`).join('');
}

function cueStack(record) {
  return record.renderBrief.phaseTimeline.map((phase, index) => `
    <div class="cue" style="animation: cue-${record.id}-${index} ${record.mediaManifest.durationMs}ms linear infinite;">
      <strong>${String(index + 1).padStart(2, '0')} · ${escapeHtml(label(phase.cueId))}</strong>
      <span>${escapeHtml(phase.label)}</span>
      <em>${phase.startPercent}-${phase.endPercent}% of motion loop</em>
    </div>
  `).join('');
}

function renderRecord(record) {
  return `
    <article class="card">
      <section class="motion-stage">
        <div class="stage-label">${escapeHtml(label(record.renderBrief.cameraAngle))} · ${record.mediaManifest.durationMs}ms loop</div>
        ${motionSvg(record.id)}
      </section>
      <section class="info">
        <div class="topline">
          <span>${escapeHtml(record.mediaManifest.styleVersion)}</span>
          <span>${escapeHtml(record.status)}</span>
        </div>
        <h2>${escapeHtml(label(record.id))}</h2>
        <div class="chips">
          ${chips(record.renderBrief.primaryMuscles, 'primary-chip')}
          ${chips(record.renderBrief.secondaryMuscles, 'secondary-chip')}
        </div>
        <div class="meta">
          <p class="meta-title">Movement Focus</p>
          <p>${escapeHtml(record.renderBrief.movementFocus)}</p>
        </div>
        <div class="cue-stack">${cueStack(record)}</div>
        <div class="meta">
          <p class="meta-title">Production Intent</p>
          <p>Prototype only. Final asset should become rendered video at <code>${escapeHtml(record.mediaManifest.videoPath)}</code> with current Lottie/SVG fallback preserved until Claude approves real media.</p>
        </div>
      </section>
    </article>
  `;
}

function html(records) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>TribeLog High-Fidelity Motion POC Board</title>
  <style>${styles(records)}</style>
</head>
<body>
  <header>
    <h1>High-Fidelity Motion POC Board</h1>
    <p>Animated SVG motion prototypes for the five Claude-approved high-fidelity review exercises. This board is not production media; it locks composition, cue timing, muscle highlight treatment, and equipment readability before generating real MP4/WebM assets.</p>
  </header>
  <main class="board">
    ${records.map(renderRecord).join('\n')}
  </main>
</body>
</html>`;
}

function main() {
  const records = loadMediaManifest(INPUT_FILE);
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, html(records));
  console.log(`Rendered high-fidelity motion POC board to ${OUTPUT_FILE}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  html,
  renderRecord,
};

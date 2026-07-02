const fs = require('fs');
const path = require('path');
const { loadMediaManifest } = require('./validate-workout-high-fidelity-media');

const INPUT_FILE = path.resolve(__dirname, 'workout-high-fidelity-media-poc.json');
const OUTPUT_FILE = path.resolve(__dirname, '../docs/workouts/review-packs/high-fidelity-animation-poc-checklist-2026-07-01.html');

function label(value) {
  return String(value || '')
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function chipList(values, className = '') {
  return values.map((value) => `<span class="chip ${className}">${escapeHtml(label(value))}</span>`).join('');
}

function timelineList(phases = []) {
  return phases.map((phase) => `
    <li>
      <strong>${escapeHtml(label(phase.cueId))}</strong>
      <span>${escapeHtml(phase.label)}</span>
      <em>${phase.startPercent}-${phase.endPercent}%</em>
    </li>
  `).join('');
}

function renderRecord(record) {
  return `
    <article class="card">
      <div class="topline">
        <span class="status">${escapeHtml(record.status)}</span>
        <span>${escapeHtml(record.mediaManifest.styleVersion)}</span>
      </div>
      <h2>${escapeHtml(label(record.id))}</h2>
      <div class="grid">
        <section>
          <h3>Motion</h3>
          <p><strong>Camera</strong> ${escapeHtml(label(record.renderBrief.cameraAngle))}</p>
          <p><strong>Duration</strong> ${record.mediaManifest.durationMs}ms at ${record.mediaManifest.frameRate}fps</p>
          <p><strong>Focus</strong> ${escapeHtml(record.renderBrief.movementFocus)}</p>
        </section>
        <section>
          <h3>Muscles</h3>
          <div class="chips">${chipList(record.renderBrief.primaryMuscles, 'primary')}</div>
          <div class="chips">${chipList(record.renderBrief.secondaryMuscles, 'secondary')}</div>
        </section>
      </div>
      <section>
        <h3>Equipment</h3>
        <div class="chips">${chipList(record.renderBrief.equipment)}</div>
      </section>
      <section>
        <h3>Coach Cue Timeline</h3>
        <ol class="timeline">${timelineList(record.renderBrief.phaseTimeline)}</ol>
      </section>
      <section>
        <h3>Avoid</h3>
        <ul>${record.renderBrief.avoid.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      </section>
      <section class="paths">
        <h3>Planned assets</h3>
        <code>${escapeHtml(record.mediaManifest.videoPath)}</code>
        <code>${escapeHtml(record.mediaManifest.posterPath)}</code>
        <code>${escapeHtml(record.mediaManifest.previewPath)}</code>
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
  <title>TribeLog High-Fidelity Animation POC Checklist</title>
  <style>
    :root {
      --brand: #ff6b35;
      --dark: #040404;
      --muted: rgba(255,255,255,0.62);
      --line: rgba(255,255,255,0.10);
      --green: #34d399;
      --gold: #ffd700;
    }
    * { box-sizing: border-box; }
    body {
      background: radial-gradient(circle at top left, rgba(255,107,53,0.18), transparent 32%), var(--dark);
      color: #fff;
      font-family: "Space Grotesk", Inter, system-ui, sans-serif;
      margin: 0;
      padding: 32px;
    }
    header { margin-bottom: 28px; max-width: 960px; }
    h1 {
      font-family: Syne, Inter, system-ui, sans-serif;
      font-size: clamp(34px, 6vw, 70px);
      line-height: 0.95;
      margin: 0 0 12px;
    }
    p { color: var(--muted); line-height: 1.55; }
    .board {
      display: grid;
      gap: 18px;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    }
    .card {
      background: linear-gradient(145deg, rgba(255,107,53,0.13), rgba(255,255,255,0.04));
      border: 1px solid rgba(255,107,53,0.24);
      border-radius: 18px;
      padding: 20px;
    }
    .topline {
      align-items: center;
      color: var(--muted);
      display: flex;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 11px;
      font-weight: 900;
      justify-content: space-between;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .status {
      color: var(--brand);
    }
    h2 {
      font-family: Syne, Inter, system-ui, sans-serif;
      font-size: 28px;
      margin: 12px 0 18px;
    }
    h3 {
      color: var(--brand);
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 11px;
      letter-spacing: 0.14em;
      margin: 0 0 10px;
      text-transform: uppercase;
    }
    .grid {
      display: grid;
      gap: 14px;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }
    section {
      border-top: 1px solid var(--line);
      margin-top: 14px;
      padding-top: 14px;
    }
    strong { color: #fff; display: block; font-size: 12px; margin-bottom: 3px; text-transform: uppercase; }
    .chips { display: flex; flex-wrap: wrap; gap: 7px; margin: 7px 0; }
    .chip {
      border: 1px solid var(--line);
      border-radius: 999px;
      color: #fff;
      display: inline-flex;
      font-size: 12px;
      font-weight: 800;
      padding: 7px 10px;
    }
    .chip.primary { border-color: rgba(255,107,53,0.54); color: #ffb199; }
    .chip.secondary { border-color: rgba(52,211,153,0.45); color: #a7f3d0; }
    ul { color: var(--muted); margin: 0; padding-left: 18px; }
    .timeline {
      display: grid;
      gap: 8px;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .timeline li {
      background: rgba(0,0,0,0.22);
      border: 1px solid var(--line);
      border-radius: 12px;
      display: grid;
      gap: 4px;
      padding: 10px;
    }
    .timeline strong {
      color: var(--brand);
      display: inline;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 11px;
      margin: 0;
    }
    .timeline span {
      color: #fff;
      font-size: 13px;
      font-weight: 800;
    }
    .timeline em {
      color: var(--muted);
      font-size: 11px;
      font-style: normal;
      font-weight: 800;
    }
    code {
      background: rgba(0,0,0,0.28);
      border: 1px solid var(--line);
      border-radius: 8px;
      color: #ffd7c7;
      display: block;
      font-size: 12px;
      margin-top: 7px;
      overflow-wrap: anywhere;
      padding: 8px;
    }
  </style>
</head>
<body>
  <header>
    <h1>High-Fidelity Animation POC Checklist</h1>
    <p>Five planned TribeLog exercise animation briefs for Claude Design review. These records are intentionally marked planned and should not be applied to live Firestore until assets are created, hashed, and approved.</p>
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
  console.log(`Rendered high-fidelity POC checklist to ${OUTPUT_FILE}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  html,
  renderRecord,
};

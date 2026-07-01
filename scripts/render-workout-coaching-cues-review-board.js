const fs = require('fs');
const path = require('path');

const { loadOfficialExerciseSeed } = require('./generate-workout-coaching-cues-draft');

const OUTPUT_FILE = path.resolve(
  __dirname,
  '../docs/workouts/review-packs/coach-mode-full-cues-review-board-2026-07-01.html',
);

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function titleCase(value) {
  return String(value || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function groupExercises(exercises) {
  return exercises.reduce((groups, exercise) => {
    const key = exercise.movementPattern || 'other';
    if (!groups[key]) groups[key] = [];
    groups[key].push(exercise);
    return groups;
  }, {});
}

function renderCue(cue) {
  return `
    <article class="cue-card">
      <div class="cue-top">
        <span class="phase">${escapeHtml(cue.phase)}</span>
        <span class="range">${cue.startPercent}-${cue.endPercent}%</span>
      </div>
      <h4>${escapeHtml(cue.title)}</h4>
      <p>${escapeHtml(cue.body)}</p>
      <div class="meta">
        <span>${escapeHtml(cue.view)}</span>
        ${cue.focusMuscles.map((muscle) => `<span>${escapeHtml(titleCase(muscle))}</span>`).join('')}
      </div>
    </article>
  `;
}

function renderExercise(exercise, cueRecord) {
  return `
    <section class="exercise-card">
      <div class="exercise-head">
        <div>
          <p>${escapeHtml(exercise.id)}</p>
          <h3>${escapeHtml(exercise.name)}</h3>
        </div>
        <div class="tags">
          ${(exercise.primaryMuscles || []).map((muscle) => `<span>${escapeHtml(titleCase(muscle))}</span>`).join('')}
        </div>
      </div>
      <div class="cue-grid">
        ${cueRecord.coachingCues.map(renderCue).join('')}
      </div>
    </section>
  `;
}

function renderHtml(exercises, cueRecords) {
  const cuesById = new Map(cueRecords.map((record) => [record.id, record]));
  const groups = groupExercises(exercises);
  const order = ['push', 'pull', 'squat', 'hinge', 'core', 'cardio', 'mobility'];

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>TribeLog Coach Mode Full Cue Review</title>
  <style>
    :root {
      color-scheme: dark;
      --orange: #ff6b35;
      --black: #040404;
      --surface: #111111;
      --line: rgba(255, 107, 53, 0.28);
      --muted: rgba(255, 255, 255, 0.64);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--black);
      color: white;
      font-family: "Space Grotesk", Inter, system-ui, sans-serif;
      line-height: 1.45;
    }
    main {
      max-width: 1440px;
      margin: 0 auto;
      padding: 48px 28px 80px;
    }
    h1, h2, h3, h4 {
      margin: 0;
      letter-spacing: 0;
    }
    h1 {
      font-family: Syne, Inter, system-ui, sans-serif;
      font-size: clamp(42px, 7vw, 96px);
      font-weight: 900;
      line-height: 0.92;
    }
    .lede {
      max-width: 760px;
      color: var(--muted);
      font-size: 18px;
      margin: 18px 0 36px;
    }
    .stats {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 42px;
    }
    .stats span,
    .tags span,
    .meta span {
      border: 1px solid var(--line);
      border-radius: 999px;
      color: var(--orange);
      display: inline-flex;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.08em;
      padding: 7px 11px;
      text-transform: uppercase;
    }
    .group {
      margin-top: 48px;
    }
    .group h2 {
      color: var(--orange);
      font-family: Syne, Inter, system-ui, sans-serif;
      font-size: 34px;
      font-weight: 900;
      text-transform: uppercase;
    }
    .exercise-card {
      background: linear-gradient(135deg, rgba(255, 107, 53, 0.09), rgba(255, 255, 255, 0.035));
      border: 1px solid var(--line);
      border-radius: 8px;
      margin-top: 18px;
      padding: 22px;
    }
    .exercise-head {
      align-items: flex-start;
      display: flex;
      gap: 20px;
      justify-content: space-between;
      margin-bottom: 18px;
    }
    .exercise-head p {
      color: var(--muted);
      font-family: "Space Mono", ui-monospace, SFMono-Regular, monospace;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.14em;
      margin: 0 0 4px;
      text-transform: uppercase;
    }
    .exercise-head h3 {
      font-family: Syne, Inter, system-ui, sans-serif;
      font-size: 28px;
      font-weight: 900;
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: flex-end;
      max-width: 460px;
    }
    .cue-grid {
      display: grid;
      gap: 14px;
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    .cue-card {
      background: rgba(4, 4, 4, 0.72);
      border: 1px solid rgba(255, 255, 255, 0.09);
      border-radius: 8px;
      min-height: 236px;
      padding: 18px;
    }
    .cue-top {
      align-items: center;
      color: var(--orange);
      display: flex;
      font-size: 11px;
      font-weight: 900;
      justify-content: space-between;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .cue-card h4 {
      font-family: Syne, Inter, system-ui, sans-serif;
      font-size: 22px;
      font-weight: 900;
      margin-top: 16px;
    }
    .cue-card p {
      color: rgba(255, 255, 255, 0.72);
      font-size: 15px;
      margin: 10px 0 18px;
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
    }
    .meta span {
      color: rgba(255, 255, 255, 0.78);
      font-size: 10px;
      padding: 5px 8px;
    }
    @media (max-width: 1100px) {
      .cue-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 720px) {
      main { padding: 32px 16px 56px; }
      .exercise-head { display: block; }
      .tags { justify-content: flex-start; margin-top: 12px; }
      .cue-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <main>
    <h1>Coach Mode Full Cue Review</h1>
    <p class="lede">Review board for the 50-exercise TribeLog coaching cue draft. This is a local content artifact only; cues have not been applied to live Firestore.</p>
    <div class="stats">
      <span>${exercises.length} exercises</span>
      <span>${cueRecords.reduce((sum, record) => sum + record.coachingCues.length, 0)} cues</span>
      <span>4 cues per exercise</span>
      <span>Backend-ready JSON</span>
    </div>
    ${order.filter((group) => groups[group]).map((group) => `
      <section class="group">
        <h2>${escapeHtml(titleCase(group))}</h2>
        ${groups[group].map((exercise) => renderExercise(exercise, cuesById.get(exercise.id))).join('')}
      </section>
    `).join('')}
  </main>
</body>
</html>`;
}

function main() {
  const exercises = loadOfficialExerciseSeed();
  const cueRecords = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'workout-coaching-cues-full-draft.json'), 'utf8'));
  fs.writeFileSync(OUTPUT_FILE, renderHtml(exercises, cueRecords));
  console.log(`Rendered cue review board at ${OUTPUT_FILE}`);
}

if (require.main === module) {
  main();
}

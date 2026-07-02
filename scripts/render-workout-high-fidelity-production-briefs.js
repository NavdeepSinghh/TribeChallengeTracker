const fs = require('fs');
const path = require('path');
const { loadMediaManifest } = require('./validate-workout-high-fidelity-media');

const INPUT_FILE = path.resolve(__dirname, 'workout-high-fidelity-media-poc.json');
const OUTPUT_MD = path.resolve(__dirname, '../docs/workouts/review-packs/high-fidelity-production-asset-briefs-2026-07-02.md');
const OUTPUT_HTML = path.resolve(__dirname, '../docs/workouts/review-packs/high-fidelity-production-asset-briefs-2026-07-02.html');

const BRAND_STYLE = {
  background: '#040404',
  orange: '#FF6B35',
  secondary: '#F59E8B',
  teal: '#5AD7DD',
  text: '#F7F2EA',
};

const EXERCISE_NOTES = {
  goblet_squat: {
    assetTone: 'quiet studio strength demo with a realistic adult athlete holding a kettlebell at chest height',
    formPriorities: [
      'torso stays tall through the descent',
      'hips descend between the heels instead of folding forward',
      'knees track over the second toe',
    ],
  },
  push_up: {
    assetTone: 'bodyweight floor demo with a realistic adult athlete shown in a clean side angle',
    formPriorities: [
      'body stays in one line from shoulders to heels',
      'chest lowers as elbows bend under control',
      'press finishes without hips sagging or neck craning',
    ],
  },
  lat_pulldown: {
    assetTone: 'gym machine demo with clear lat pulldown equipment and a front three-quarter camera',
    formPriorities: [
      'ribs stay stacked without leaning far back',
      'elbows drive down toward the ribs',
      'shoulders stay away from the ears',
    ],
  },
  romanian_deadlift: {
    assetTone: 'barbell hinge demo with a realistic adult athlete and side camera for hip movement',
    formPriorities: [
      'hips move back before the torso lowers',
      'spine stays neutral with soft knees',
      'bar tracks close to the legs',
    ],
  },
  bulgarian_split_squat: {
    assetTone: 'single-leg dumbbell demo with rear foot elevated on a simple bench',
    formPriorities: [
      'front foot stays planted and balanced',
      'descent stays controlled and mostly vertical',
      'front knee tracks over the toes without collapsing inward',
    ],
  },
};

function titleCase(value) {
  return String(value || '')
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function percentToSeconds(percent, durationMs) {
  return Number(((Number(percent) / 100) * durationMs / 1000).toFixed(2));
}

function buildPhaseLine(phase, durationMs) {
  const start = percentToSeconds(phase.startPercent, durationMs);
  const end = percentToSeconds(phase.endPercent, durationMs);
  return `${phase.cueId}: ${phase.label} (${start}s-${end}s, ${phase.startPercent}-${phase.endPercent}%)`;
}

function buildAssetBrief(record) {
  const notes = EXERCISE_NOTES[record.id];
  if (!notes) {
    throw new Error(`${record.id}: missing production brief notes.`);
  }
  const durationSeconds = Number((record.mediaManifest.durationMs / 1000).toFixed(1));
  const phases = record.renderBrief.phaseTimeline.map((phase) => buildPhaseLine(phase, record.mediaManifest.durationMs));
  const muscleCopy = [
    `primary muscles: ${record.renderBrief.primaryMuscles.join(', ')}`,
    `secondary muscles: ${record.renderBrief.secondaryMuscles.join(', ')}`,
  ].join('; ');

  const videoPrompt = [
    `Create a ${durationSeconds}s looping realistic workout demonstration for TribeLog: ${titleCase(record.id)}.`,
    `Style: ${notes.assetTone}. Dark near-black studio, subtle teal rim light, brand orange ${BRAND_STYLE.orange} used only for tasteful muscle glow accents and equipment highlights.`,
    `Camera: ${record.renderBrief.cameraAngle}. Keep the full body and equipment visible on mobile. No cropped joints.`,
    `Movement focus: ${record.renderBrief.movementFocus}`,
    `Muscle emphasis: ${muscleCopy}. Muscle overlay should be subtle, anatomical, and non-medical.`,
    `Timeline: ${phases.join(' | ')}.`,
    `Form priorities: ${notes.formPriorities.join('; ')}.`,
    `Output clean motion only. Do not bake text, labels, captions, app UI, logos, watermarks, timers, medical claims, before/after claims, or social-media reaction UI into the video.`,
    `Avoid: ${record.renderBrief.avoid.join('; ')}.`,
  ].join('\n');

  const posterPrompt = [
    `Create one poster frame for ${titleCase(record.id)} at 1280x720.`,
    `Use the same camera, athlete, lighting, equipment, and muscle-highlight treatment as the video.`,
    `Choose the clearest mid-rep teaching frame, not the most dramatic frame.`,
    `No text, no logo, no watermark, no app UI baked into the image.`,
  ].join('\n');

  return {
    id: record.id,
    name: titleCase(record.id),
    storage: {
      mp4: record.mediaManifest.videoPath,
      webm: record.mediaManifest.previewPath,
      poster: record.mediaManifest.posterPath,
    },
    media: {
      durationMs: record.mediaManifest.durationMs,
      frameRate: record.mediaManifest.frameRate,
      styleVersion: record.mediaManifest.styleVersion,
      expectedSizeBudget: {
        mp4MaxMb: 3,
        webmMaxMb: 2,
        posterMaxKb: 250,
      },
    },
    phaseTimeline: record.renderBrief.phaseTimeline,
    videoPrompt,
    posterPrompt,
    qaChecklist: [
      'Full body and equipment are visible at mobile size.',
      'Motion loops cleanly without a jarring reset.',
      'Primary muscle glow matches the manifest and never implies diagnosis or treatment.',
      'Cue text remains in TribeLog Coach Mode UI, not inside the media asset.',
      'No competitor UI, social-reel buttons, app screenshots, logos, or watermarks are embedded.',
      'No sexualized body proportions, medical claims, pain claims, or fake urgency.',
      'MP4, WebM, and poster are real media files and match the exact storage paths.',
    ],
  };
}

function buildAssetBriefs(records) {
  return records.map(buildAssetBrief);
}

function renderMarkdown(briefs) {
  const sections = briefs.map((brief) => {
    const timeline = brief.phaseTimeline
      .map((phase) => `- ${buildPhaseLine(phase, brief.media.durationMs)}`)
      .join('\n');
    const qa = brief.qaChecklist.map((item) => `- [ ] ${item}`).join('\n');
    return `## ${brief.name}

Storage:
- MP4: \`${brief.storage.mp4}\`
- WebM: \`${brief.storage.webm}\`
- Poster: \`${brief.storage.poster}\`

Media target:
- Duration: ${brief.media.durationMs}ms
- Frame rate: ${brief.media.frameRate}fps
- Style version: \`${brief.media.styleVersion}\`
- Size budget: MP4 <= ${brief.media.expectedSizeBudget.mp4MaxMb}MB, WebM <= ${brief.media.expectedSizeBudget.webmMaxMb}MB, poster <= ${brief.media.expectedSizeBudget.posterMaxKb}KB

Timeline:
${timeline}

Video prompt:
\`\`\`text
${brief.videoPrompt}
\`\`\`

Poster prompt:
\`\`\`text
${brief.posterPrompt}
\`\`\`

QA checklist:
${qa}
`;
  }).join('\n');

  return `# TribeLog High-Fidelity Production Asset Briefs

Status date: 2026-07-02

Purpose: production-ready generation briefs for the five high-fidelity workout media POC exercises. These are not live assets and must not be applied to Firestore until Claude approves real MP4/WebM/poster outputs and the validator is run with \`--require-ready\`.

Global style:
- Background: ${BRAND_STYLE.background}
- Brand orange: ${BRAND_STYLE.orange}
- Secondary muscle highlight: ${BRAND_STYLE.secondary}
- Subtle rim light: ${BRAND_STYLE.teal}
- Text/UI should remain in the app layer, not inside generated media.

${sections}
`;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderHtml(briefs) {
  const cards = briefs.map((brief) => {
    const timeline = brief.phaseTimeline.map((phase) => `
      <li><strong>${escapeHtml(phase.cueId)}</strong><span>${escapeHtml(phase.label)}</span><em>${phase.startPercent}-${phase.endPercent}%</em></li>
    `).join('');
    const qa = brief.qaChecklist.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
    return `
      <section class="card">
        <div class="topline">${escapeHtml(brief.media.styleVersion)} / ${brief.media.durationMs}ms / ${brief.media.frameRate}fps</div>
        <h2>${escapeHtml(brief.name)}</h2>
        <div class="paths">
          <span>MP4 <code>${escapeHtml(brief.storage.mp4)}</code></span>
          <span>WEBM <code>${escapeHtml(brief.storage.webm)}</code></span>
          <span>POSTER <code>${escapeHtml(brief.storage.poster)}</code></span>
        </div>
        <h3>Timeline</h3>
        <ol class="timeline">${timeline}</ol>
        <h3>Video Prompt</h3>
        <pre>${escapeHtml(brief.videoPrompt)}</pre>
        <h3>Poster Prompt</h3>
        <pre>${escapeHtml(brief.posterPrompt)}</pre>
        <h3>QA Checklist</h3>
        <ul class="qa">${qa}</ul>
      </section>
    `;
  }).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>TribeLog High-Fidelity Production Asset Briefs</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: ${BRAND_STYLE.background};
      --surface: #111;
      --line: rgba(255,107,53,.28);
      --orange: ${BRAND_STYLE.orange};
      --text: ${BRAND_STYLE.text};
      --muted: rgba(247,242,234,.66);
      --teal: ${BRAND_STYLE.teal};
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: radial-gradient(circle at 20% 0%, rgba(90,215,221,.16), transparent 32%), var(--bg);
      color: var(--text);
      font-family: "Space Grotesk", Inter, system-ui, sans-serif;
      padding: 36px;
    }
    header {
      max-width: 1120px;
      margin: 0 auto 28px;
    }
    .eyebrow {
      color: var(--orange);
      font: 800 12px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace;
      letter-spacing: .18em;
      text-transform: uppercase;
    }
    h1, h2 {
      font-family: Syne, Inter, system-ui, sans-serif;
      letter-spacing: 0;
    }
    h1 {
      font-size: clamp(38px, 7vw, 88px);
      line-height: .9;
      margin: 12px 0;
    }
    p { color: var(--muted); max-width: 860px; }
    .grid {
      max-width: 1120px;
      margin: 0 auto;
      display: grid;
      gap: 22px;
    }
    .card {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: linear-gradient(145deg, rgba(255,107,53,.1), rgba(255,255,255,.035));
      padding: 24px;
      box-shadow: 0 24px 80px rgba(0,0,0,.36);
    }
    .topline {
      color: var(--orange);
      font: 800 11px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace;
      letter-spacing: .14em;
      text-transform: uppercase;
    }
    h2 { font-size: 32px; margin: 8px 0 16px; }
    h3 {
      color: var(--orange);
      font: 900 13px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace;
      letter-spacing: .1em;
      text-transform: uppercase;
      margin-top: 24px;
    }
    code, pre {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }
    pre {
      white-space: pre-wrap;
      background: rgba(0,0,0,.34);
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 8px;
      padding: 16px;
      line-height: 1.55;
      color: rgba(247,242,234,.88);
    }
    .paths {
      display: grid;
      gap: 8px;
      color: var(--muted);
    }
    .paths span {
      display: grid;
      grid-template-columns: 70px minmax(0, 1fr);
      gap: 12px;
      align-items: start;
    }
    .paths code { color: var(--text); overflow-wrap: anywhere; }
    .timeline {
      display: grid;
      gap: 8px;
      padding-left: 0;
      list-style: none;
    }
    .timeline li {
      display: grid;
      grid-template-columns: 110px 1fr 90px;
      gap: 12px;
      padding: 10px 12px;
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 8px;
      background: rgba(0,0,0,.24);
    }
    .timeline strong { color: var(--teal); }
    .timeline em { color: var(--orange); font-style: normal; text-align: right; }
    .qa {
      display: grid;
      gap: 8px;
      color: rgba(247,242,234,.82);
      padding-left: 20px;
    }
    @media (max-width: 760px) {
      body { padding: 20px; }
      .timeline li { grid-template-columns: 1fr; }
      .timeline em { text-align: left; }
    }
  </style>
</head>
<body>
  <header>
    <div class="eyebrow">TribeLog / high-fidelity POC</div>
    <h1>Production Asset Briefs</h1>
    <p>Generation prompts and QA checks for the five realistic workout media proof-of-concept assets. Text and coaching cues stay in TribeLog UI; generated media remains clean motion only.</p>
  </header>
  <main class="grid">${cards}</main>
</body>
</html>
`;
}

function writeOutput() {
  const records = loadMediaManifest(INPUT_FILE);
  const briefs = buildAssetBriefs(records);
  fs.mkdirSync(path.dirname(OUTPUT_MD), { recursive: true });
  fs.writeFileSync(OUTPUT_MD, renderMarkdown(briefs));
  fs.writeFileSync(OUTPUT_HTML, renderHtml(briefs));
  console.log(`Rendered high-fidelity production briefs to ${OUTPUT_MD}`);
  console.log(`Rendered high-fidelity production briefs board to ${OUTPUT_HTML}`);
  return { briefs, markdownPath: OUTPUT_MD, htmlPath: OUTPUT_HTML };
}

if (require.main === module) {
  writeOutput();
}

module.exports = {
  buildAssetBrief,
  buildAssetBriefs,
  renderHtml,
  renderMarkdown,
  writeOutput,
};

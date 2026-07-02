const fs = require('fs');
const path = require('path');
const { loadMediaManifest, parseArgs: parseMediaArgs } = require('./validate-workout-high-fidelity-media');
const { verifyAssetFiles } = require('./verify-workout-high-fidelity-asset-files');

const DEFAULT_FILE = path.resolve(__dirname, 'workout-high-fidelity-media-poc.json');
const DEFAULT_MEDIA_ROOT = path.resolve(__dirname, '../generated');
const DEFAULT_OUTPUT = path.resolve(__dirname, '../docs/workouts/review-packs/high-fidelity-real-asset-review-board-2026-07-02.html');

function parseArgs(argv = process.argv.slice(2)) {
  const mediaOptions = parseMediaArgs(argv);
  const options = {
    file: mediaOptions.file || DEFAULT_FILE,
    mediaRoot: DEFAULT_MEDIA_ROOT,
    output: DEFAULT_OUTPUT,
    requireMetadata: false,
  };

  argv.forEach((arg, index) => {
    if (arg === '--media-root') {
      options.mediaRoot = path.resolve(process.cwd(), argv[index + 1]);
    } else if (arg.startsWith('--media-root=')) {
      options.mediaRoot = path.resolve(process.cwd(), arg.split('=').slice(1).join('='));
    } else if (arg === '--output') {
      options.output = path.resolve(process.cwd(), argv[index + 1]);
    } else if (arg.startsWith('--output=')) {
      options.output = path.resolve(process.cwd(), arg.split('=').slice(1).join('='));
    } else if (arg === '--require-metadata') {
      options.requireMetadata = true;
    }
  });

  return options;
}

function escapeHTML(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function titleCase(value) {
  return String(value || '')
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function bytesLabel(bytes) {
  const value = Number(bytes);
  if (!Number.isFinite(value) || value <= 0) return '0 B';
  if (value >= 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(2)} MB`;
  if (value >= 1024) return `${Math.round(value / 1024)} KB`;
  return `${value} B`;
}

function relativeHref(fromFile, targetFile) {
  const relative = path.relative(path.dirname(fromFile), targetFile).split(path.sep).join('/');
  return relative.startsWith('.') ? relative : `./${relative}`;
}

function phaseSummary(record) {
  return (record.renderBrief?.phaseTimeline || [])
    .map((phase) => `${phase.cueId}: ${phase.startPercent}-${phase.endPercent}%`)
    .join(' · ');
}

function fileFor(result, kind) {
  return result.files.find((file) => file.kind === kind);
}

function fileReady(file) {
  return Boolean(file && file.check && file.check.ok && (!file.metadata || file.metadata.ok));
}

function buildReviewBoardModel(records, options = {}) {
  const mediaRoot = options.mediaRoot || DEFAULT_MEDIA_ROOT;
  const output = options.output || DEFAULT_OUTPUT;
  const report = verifyAssetFiles(records, {
    mediaRoot,
    requireFiles: false,
    requireMetadata: Boolean(options.requireMetadata),
  });

  const cards = report.results.map((result) => {
    const record = records.find((candidate) => candidate.id === result.id) || { id: result.id };
    const mp4 = fileFor(result, 'mp4');
    const webm = fileFor(result, 'webm');
    const poster = fileFor(result, 'poster');
    const playable = fileReady(mp4) || fileReady(webm);
    return {
      id: result.id,
      title: titleCase(result.id),
      record,
      result,
      mp4,
      webm,
      poster,
      playable,
      posterReady: fileReady(poster),
      mp4Ready: fileReady(mp4),
      webmReady: fileReady(webm),
      phaseSummary: phaseSummary(record),
      hrefs: {
        mp4: mp4 && mp4.check.exists ? relativeHref(output, mp4.absolutePath) : '',
        webm: webm && webm.check.exists ? relativeHref(output, webm.absolutePath) : '',
        poster: poster && poster.check.exists ? relativeHref(output, poster.absolutePath) : '',
      },
    };
  });

  return {
    mediaRoot,
    output,
    report,
    cards,
    readyCount: cards.filter((card) => card.playable && card.posterReady).length,
    totalCount: cards.length,
  };
}

function renderFileStatus(file) {
  const ok = fileReady(file);
  const check = file.check || {};
  const metadata = file.metadata;
  const metadataText = metadata
    ? metadata.ok
      ? `${metadata.width}x${metadata.height}, ${metadata.durationMs}ms, ${metadata.frameRate}fps`
      : `metadata failed: ${escapeHTML(metadata.reason || metadata.failures?.join('; ') || 'unknown')}`
    : 'metadata not required';

  return `
    <li class="${ok ? 'ok' : 'pending'}">
      <strong>${escapeHTML(file.kind.toUpperCase())}</strong>
      <span>${ok ? 'READY' : 'PENDING'}</span>
      <code>${escapeHTML(file.path)}</code>
      <small>${escapeHTML(check.reason || 'unknown')} · ${escapeHTML(bytesLabel(check.bytes || 0))} · ${metadataText}</small>
    </li>
  `;
}

function renderMedia(card) {
  if (card.playable) {
    const posterAttr = card.posterReady ? ` poster="${escapeHTML(card.hrefs.poster)}"` : '';
    const webm = card.webmReady ? `<source src="${escapeHTML(card.hrefs.webm)}" type="video/webm">` : '';
    const mp4 = card.mp4Ready ? `<source src="${escapeHTML(card.hrefs.mp4)}" type="video/mp4">` : '';
    return `
      <video controls muted loop playsinline preload="metadata"${posterAttr}>
        ${webm}
        ${mp4}
      </video>
    `;
  }

  return `
    <div class="missing-media">
      <div class="play">▶</div>
      <strong>Real media pending</strong>
      <p>Drop approved MP4/WebM/poster files into the expected storage path under <code>${escapeHTML(card.record.mediaManifest?.videoPath?.split('/').slice(0, -1).join('/') || card.id)}</code>, then rerun this board.</p>
    </div>
  `;
}

function renderHTML(model) {
  const cards = model.cards.map((card) => `
    <article class="card ${card.playable && card.posterReady ? 'ready' : 'pending'}">
      <header>
        <div>
          <p class="eyebrow">${escapeHTML(card.record.mediaManifest?.styleVersion || 'style pending')}</p>
          <h2>${escapeHTML(card.title)}</h2>
        </div>
        <span>${card.playable && card.posterReady ? 'READY' : 'PENDING'}</span>
      </header>
      <div class="media">${renderMedia(card)}</div>
      <section>
        <h3>Asset Gate</h3>
        <ul>${card.result.files.map(renderFileStatus).join('')}</ul>
      </section>
      <section>
        <h3>Coach Cue Timeline</h3>
        <p>${escapeHTML(card.phaseSummary || 'No phase timeline found.')}</p>
      </section>
      <section>
        <h3>Review Checks</h3>
        <ol>
          <li>Motion clearly teaches the exercise without baked-in text.</li>
          <li>Primary muscles glow orange, secondary muscles stay subtle.</li>
          <li>Form is not misleading or unsafe for a general fitness app.</li>
          <li>File sizes and metadata stay inside mobile budgets.</li>
          <li>Visual style is TribeLog-owned and not a competitor clone.</li>
        </ol>
      </section>
    </article>
  `).join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>TribeLog High-Fidelity Asset Review Board</title>
  <style>
    :root {
      --brand: #ff6b35;
      --dark: #040404;
      --green: #34d399;
      --muted: rgba(255,255,255,.66);
      --border: rgba(255,107,53,.24);
      --panel: rgba(255,255,255,.055);
    }
    * { box-sizing: border-box; }
    body {
      background:
        radial-gradient(circle at 20% 0%, rgba(255,107,53,.22), transparent 34rem),
        radial-gradient(circle at 90% 10%, rgba(52,211,153,.14), transparent 30rem),
        var(--dark);
      color: white;
      font-family: "Space Grotesk", Inter, system-ui, sans-serif;
      margin: 0;
      padding: 34px;
    }
    .hero {
      border-bottom: 1px solid rgba(255,255,255,.12);
      margin-bottom: 24px;
      padding-bottom: 22px;
    }
    .eyebrow, h3, code, small, li span {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      letter-spacing: .08em;
      text-transform: uppercase;
    }
    .eyebrow {
      color: var(--brand);
      font-size: 12px;
      font-weight: 900;
      margin: 0 0 8px;
    }
    h1 {
      font-family: "Syne", Inter, system-ui, sans-serif;
      font-size: clamp(42px, 7vw, 88px);
      line-height: .9;
      margin: 0 0 14px;
    }
    .hero p {
      color: var(--muted);
      font-size: 18px;
      line-height: 1.45;
      margin: 0;
      max-width: 920px;
    }
    .summary {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 18px;
    }
    .pill {
      border: 1px solid var(--border);
      border-radius: 999px;
      color: var(--brand);
      font-weight: 900;
      padding: 9px 13px;
    }
    .grid {
      display: grid;
      gap: 18px;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
    }
    .card {
      background: linear-gradient(145deg, rgba(255,107,53,.12), rgba(255,255,255,.045));
      border: 1px solid var(--border);
      border-radius: 22px;
      overflow: hidden;
      padding: 16px;
    }
    .card.pending {
      border-color: rgba(255,255,255,.13);
    }
    header {
      align-items: start;
      display: flex;
      gap: 12px;
      justify-content: space-between;
    }
    h2 {
      font-family: "Syne", Inter, system-ui, sans-serif;
      font-size: 28px;
      line-height: 1;
      margin: 0 0 14px;
    }
    header > span {
      background: rgba(255,107,53,.16);
      border: 1px solid var(--border);
      border-radius: 999px;
      color: var(--brand);
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 11px;
      font-weight: 900;
      padding: 8px 10px;
    }
    .ready header > span {
      background: rgba(52,211,153,.14);
      border-color: rgba(52,211,153,.30);
      color: var(--green);
    }
    .media {
      align-items: center;
      aspect-ratio: 16 / 9;
      background: rgba(0,0,0,.48);
      border: 1px solid rgba(255,255,255,.10);
      border-radius: 18px;
      display: flex;
      justify-content: center;
      margin-bottom: 14px;
      overflow: hidden;
    }
    video {
      height: 100%;
      object-fit: contain;
      width: 100%;
    }
    .missing-media {
      color: var(--muted);
      padding: 26px;
      text-align: center;
    }
    .play {
      color: var(--brand);
      font-size: 34px;
      margin-bottom: 8px;
    }
    section {
      background: rgba(0,0,0,.20);
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 16px;
      margin-top: 10px;
      padding: 13px;
    }
    h3 {
      color: var(--brand);
      font-size: 11px;
      margin: 0 0 9px;
    }
    ul, ol {
      display: grid;
      gap: 8px;
      margin: 0;
      padding-left: 20px;
    }
    li {
      color: rgba(255,255,255,.82);
      line-height: 1.35;
    }
    li span {
      border-radius: 999px;
      display: inline-block;
      font-size: 10px;
      font-weight: 900;
      margin: 0 6px;
      padding: 3px 7px;
    }
    li.ok span {
      background: rgba(52,211,153,.14);
      color: var(--green);
    }
    li.pending span {
      background: rgba(255,107,53,.14);
      color: var(--brand);
    }
    code {
      color: rgba(255,255,255,.86);
      display: block;
      font-size: 11px;
      margin-top: 4px;
      overflow-wrap: anywhere;
      text-transform: none;
    }
    small {
      color: rgba(255,255,255,.52);
      display: block;
      font-size: 10px;
      margin-top: 4px;
      text-transform: none;
    }
    section p {
      color: var(--muted);
      line-height: 1.45;
      margin: 0;
    }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <p class="eyebrow">TribeLog / high-fidelity POC</p>
      <h1>Real Asset Review Board</h1>
      <p>Use this board after MP4/WebM/poster files are generated but before upload or Firestore apply. Missing media is intentionally shown as pending; this board never fakes readiness.</p>
      <div class="summary">
        <span class="pill">${model.readyCount}/${model.totalCount} exercises ready</span>
        <span class="pill">${escapeHTML(model.report.failures.length)} gate issues</span>
        <span class="pill">Media root: ${escapeHTML(model.mediaRoot)}</span>
      </div>
    </section>
    <section class="grid">
      ${cards}
    </section>
  </main>
</body>
</html>`;
}

function renderAssetReviewBoard(records, options = {}) {
  return renderHTML(buildReviewBoardModel(records, options));
}

function main() {
  const options = parseArgs();
  const records = loadMediaManifest(options.file);
  const html = renderAssetReviewBoard(records, options);
  fs.mkdirSync(path.dirname(options.output), { recursive: true });
  fs.writeFileSync(options.output, html);
  console.log(`Rendered high-fidelity real asset review board to ${options.output}`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = {
  buildReviewBoardModel,
  bytesLabel,
  parseArgs,
  renderAssetReviewBoard,
  renderHTML,
};

const BRAND_ORANGE = "#FF6B35";
const BRAND_BLACK = "#040404";
const BRAND_GOLD = "#FFD700";
const BRAND_GREEN = "#34D399";

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function truncate(value, max = 48) {
  const text = String(value || "").trim().replace(/\s+/g, " ");
  return text.length > max ? `${text.slice(0, Math.max(0, max - 3))}...` : text;
}

function wrapText(value, maxChars = 18, maxLines = 3) {
  const words = String(value || "").trim().replace(/\s+/g, " ").split(" ").filter(Boolean);
  const lines = [];
  let current = "";

  words.forEach(word => {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) {
      current = next;
      return;
    }
    if (current) lines.push(current);
    current = word;
  });
  if (current) lines.push(current);

  const limited = lines.slice(0, maxLines);
  if (lines.length > maxLines && limited.length) {
    limited[limited.length - 1] = truncate(limited[limited.length - 1], maxChars);
  }
  return limited.length ? limited : ["Workout"];
}

function svgTextLines(lines, x, y, lineHeight, extra = "") {
  return lines
    .map((line, index) => `<text x="${x}" y="${y + (index * lineHeight)}" ${extra}>${escapeXml(line)}</text>`)
    .join("");
}

export function buildWorkoutShareCardSvg(card = {}, options = {}) {
  const width = options.width || 1080;
  const height = options.height || 1350;
  const titleLines = wrapText(card.title || "Workout update", 18, 3);
  const metrics = Array.isArray(card.metrics) ? card.metrics.slice(0, 4) : [];
  const highlights = Array.isArray(card.highlights) ? card.highlights.slice(0, 4) : [];
  const subtitle = truncate(card.subtitle || card.ownerDisplayName || "Logged with TribeLog", 58);
  const typeLabel = truncate(card.type || card.eyebrow || "TRIBELOG WORKOUT", 28).replace(/_/g, " ").toUpperCase();

  const metricNodes = metrics.map((metric, index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;
    const x = 92 + (col * 450);
    const y = 655 + (row * 142);
    return `
      <rect x="${x}" y="${y}" width="398" height="104" rx="28" fill="rgba(255,255,255,0.075)" stroke="rgba(255,255,255,0.12)" />
      <text x="${x + 30}" y="${y + 42}" class="metric-label">${escapeXml(truncate(metric.label, 20).toUpperCase())}</text>
      <text x="${x + 30}" y="${y + 82}" class="metric-value">${escapeXml(truncate(metric.value, 18))}</text>
    `;
  }).join("");

  const highlightNodes = highlights.map((highlight, index) => {
    const y = 980 + (index * 54);
    return `
      <circle cx="108" cy="${y - 6}" r="8" fill="${BRAND_ORANGE}" />
      <text x="134" y="${y}" class="highlight">${escapeXml(truncate(highlight, 44))}</text>
    `;
  }).join("");

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <radialGradient id="pulse" cx="18%" cy="10%" r="82%">
      <stop offset="0%" stop-color="${BRAND_ORANGE}" stop-opacity="0.42"/>
      <stop offset="42%" stop-color="${BRAND_ORANGE}" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="${BRAND_BLACK}" stop-opacity="1"/>
    </radialGradient>
    <linearGradient id="brandLine" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${BRAND_ORANGE}" />
      <stop offset="100%" stop-color="${BRAND_GOLD}" />
    </linearGradient>
    <style>
      .brand { font-family: Syne, Arial Black, sans-serif; font-weight: 900; fill: #fff; letter-spacing: 0; }
      .mono { font-family: Space Grotesk, ui-monospace, SFMono-Regular, Menlo, monospace; font-weight: 900; fill: ${BRAND_ORANGE}; letter-spacing: 5px; }
      .sub { font-family: Space Grotesk, Arial, sans-serif; font-weight: 800; fill: rgba(255,255,255,0.68); }
      .metric-label { font-family: Space Grotesk, ui-monospace, monospace; font-size: 24px; font-weight: 900; fill: rgba(255,255,255,0.52); letter-spacing: 3px; }
      .metric-value { font-family: Syne, Arial Black, sans-serif; font-size: 42px; font-weight: 900; fill: #fff; }
      .highlight { font-family: Space Grotesk, Arial, sans-serif; font-size: 31px; font-weight: 800; fill: rgba(255,255,255,0.74); }
    </style>
  </defs>
  <rect width="${width}" height="${height}" fill="${BRAND_BLACK}" />
  <rect x="36" y="36" width="${width - 72}" height="${height - 72}" rx="72" fill="url(#pulse)" stroke="rgba(255,107,53,0.34)" stroke-width="3" />
  <path d="M80 1040 C300 970 440 1120 650 1046 C818 986 920 1024 1000 1078" fill="none" stroke="${BRAND_GREEN}" stroke-opacity="0.20" stroke-width="18" stroke-linecap="round" />
  <rect x="84" y="96" width="154" height="154" rx="38" fill="rgba(255,107,53,0.18)" stroke="rgba(255,107,53,0.38)" stroke-width="3" />
  <text x="114" y="195" class="brand" style="font-size:112px; fill:${BRAND_ORANGE};">W</text>
  <text x="84" y="326" class="mono" style="font-size:28px;">${escapeXml(typeLabel)}</text>
  ${svgTextLines(titleLines, 84, 430, 94, 'class="brand" style="font-size:88px;"')}
  <text x="84" y="${450 + (titleLines.length * 94)}" class="sub" style="font-size:34px;">${escapeXml(subtitle)}</text>
  <rect x="84" y="610" width="912" height="308" rx="44" fill="rgba(4,4,4,0.52)" stroke="rgba(255,255,255,0.10)" />
  ${metricNodes}
  ${highlightNodes}
  <line x1="84" y1="1208" x2="996" y2="1208" stroke="url(#brandLine)" stroke-width="6" stroke-linecap="round" />
  <text x="84" y="1272" class="brand" style="font-size:46px;">TRIBELOG</text>
  <text x="392" y="1268" class="sub" style="font-size:28px;">Built by the tribe, for the tribe.</text>
</svg>`.trim();
}

export function svgToDataUrl(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export async function renderWorkoutShareCardPngBlob(card, options = {}) {
  const width = options.width || 1080;
  const height = options.height || 1350;
  const svg = buildWorkoutShareCardSvg(card, { width, height });
  const dataUrl = svgToDataUrl(svg);
  const image = new Image();
  image.decoding = "async";
  const loaded = new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });
  image.src = dataUrl;
  await loaded;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, width, height);
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error("Could not render share card image."));
    }, "image/png", 0.95);
  });
}

export async function downloadWorkoutShareCardImage(card) {
  const blob = await renderWorkoutShareCardPngBlob(card);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const cleanTitle = String(card.title || "tribelog-workout").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  anchor.href = url;
  anchor.download = `${cleanTitle || "tribelog-workout"}-share-card.png`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

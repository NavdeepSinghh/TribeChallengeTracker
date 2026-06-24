const roundRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

const text = (ctx, value, x, y, size, color = '#fff', weight = 800, align = 'left') => {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px Arial`;
  ctx.textAlign = align;
  ctx.fillText(value, x, y);
};

const drawBackground = (ctx, canvas, top, bottom) => {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, top);
  gradient.addColorStop(1, bottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const panel = (ctx, x, y, width, height, stroke = 'rgba(255,255,255,0.22)') => {
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  roundRect(ctx, x, y, width, height, 46);
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 3;
  ctx.stroke();
};

const pill = (ctx, label, x, y, width, height, fill, color) => {
  ctx.fillStyle = fill;
  roundRect(ctx, x, y, width, height, height / 2);
  ctx.fill();
  text(ctx, label, x + width / 2, y + 58, 28, color, 900, 'center');
};

function renderModernWinCardCanvas({
  displayName,
  totalPoints,
  streak,
  daysActive,
  rank,
  instagramHandle,
}) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  drawBackground(ctx, canvas, '#130B03', '#050505');

  ctx.fillStyle = 'rgba(255,215,0,0.16)';
  ctx.beginPath();
  ctx.arc(890, 410, 330, 0, Math.PI * 2);
  ctx.fill();
  text(ctx, rank?.icon || '✨', 800, 470, 210, 'rgba(255,255,255,0.18)', 900, 'center');

  text(ctx, 'WIN CARD', 92, 228, 54, '#FFD700', 900);
  text(ctx, (displayName || 'Tribe Member').slice(0, 28), 92, 286, 34, 'rgba(255,255,255,0.76)', 800);
  if (instagramHandle) {
    text(ctx, `@${instagramHandle.replace(/^@+/, '')}`.slice(0, 30), 92, 336, 30, '#FF6B35', 900);
  }

  panel(ctx, 92, 430, 896, 720, 'rgba(255,215,0,0.34)');
  text(ctx, `${totalPoints || 0}`, 540, 720, 170, '#FFD700', 900, 'center');
  text(ctx, 'ACTIVITY POINTS', 540, 800, 30, 'rgba(255,255,255,0.62)', 900, 'center');
  text(ctx, `${rank?.icon || '✨'} ${(rank?.label || 'Rookie').toUpperCase()}`, 540, 920, 46, rank?.color || '#FFD700', 900, 'center');

  pill(ctx, `${streak || 0} DAY STREAK`, 146, 994, 370, 92, 'rgba(255,107,53,0.18)', '#FF6B35');
  pill(ctx, `${daysActive || 0} ACTIVE DAYS`, 562, 994, 370, 92, 'rgba(52,211,153,0.16)', '#34D399');

  text(ctx, 'A win is proof you showed up.', 540, 1420, 46, '#FFFFFF', 900, 'center');
  text(ctx, 'Tag @risewiththetribe and share your next one.', 540, 1510, 30, 'rgba(255,255,255,0.72)', 800, 'center');
  text(ctx, 'risewiththetribe.app', 540, 1760, 34, '#FFD700', 900, 'center');
  return canvas;
}

function renderWeeklyRecapCanvas({
  totalPoints,
  streak,
  daysActive,
  sessions,
  instagramHandle,
  periodLabel = '7-Day Recap',
}) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  const totalDays = String(periodLabel).includes('30') ? 30 : 7;
  drawBackground(ctx, canvas, '#07111F', '#07130E');

  ctx.fillStyle = 'rgba(52,211,153,0.16)';
  ctx.beginPath();
  ctx.arc(930, 330, 260, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(96,165,250,0.16)';
  ctx.beginPath();
  ctx.arc(100, 1580, 300, 0, Math.PI * 2);
  ctx.fill();

  text(ctx, String(periodLabel).toUpperCase(), 92, 228, 58, '#60A5FA', 900);
  text(ctx, 'A quick look at the work you stacked this week.', 92, 286, 32, 'rgba(255,255,255,0.74)', 800);
  if (instagramHandle) {
    text(ctx, `@${instagramHandle.replace(/^@+/, '')}`.slice(0, 30), 92, 338, 28, '#34D399', 900);
  }

  panel(ctx, 92, 430, 896, 500, 'rgba(96,165,250,0.34)');
  text(ctx, `${daysActive || 0}/${totalDays}`, 540, 690, 140, '#34D399', 900, 'center');
  text(ctx, 'DAYS ACTIVE', 540, 748, 30, 'rgba(255,255,255,0.62)', 900, 'center');

  if (totalDays === 7) {
    const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    labels.forEach((label, index) => {
      const x = 154 + index * 112;
      const active = index < (daysActive || 0);
      ctx.fillStyle = active ? '#34D399' : 'rgba(255,255,255,0.12)';
      ctx.beginPath();
      ctx.arc(x + 31, 835, 31, 0, Math.PI * 2);
      ctx.fill();
      text(ctx, label, x + 31, 780, 22, 'rgba(255,255,255,0.68)', 900, 'center');
      text(ctx, active ? '✓' : '–', x + 31, 844, 24, active ? '#000' : 'rgba(255,255,255,0.5)', 900, 'center');
    });
  } else {
    const ratio = Math.min(1, (daysActive || 0) / totalDays);
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    roundRect(ctx, 154, 810, 772, 34, 17);
    ctx.fill();
    if (ratio > 0) {
      ctx.fillStyle = '#34D399';
      roundRect(ctx, 154, 810, 772 * ratio, 34, Math.min(17, (772 * ratio) / 2));
      ctx.fill();
    }
    text(ctx, `${Math.round(ratio * 100)}% consistency`, 540, 888, 28, 'rgba(255,255,255,0.68)', 900, 'center');
  }

  panel(ctx, 92, 1060, 424, 220, 'rgba(255,107,53,0.3)');
  text(ctx, `${sessions || 0}`, 304, 1192, 70, '#FF6B35', 900, 'center');
  text(ctx, 'SESSIONS', 304, 1238, 24, 'rgba(255,255,255,0.62)', 900, 'center');
  panel(ctx, 564, 1060, 424, 220, 'rgba(255,215,0,0.3)');
  text(ctx, `${totalPoints || 0}`, 776, 1192, 70, '#FFD700', 900, 'center');
  text(ctx, 'ACTIVITY PTS', 776, 1238, 24, 'rgba(255,255,255,0.62)', 900, 'center');

  text(ctx, `${streak || 0}-day streak going into next week.`, 540, 1488, 42, '#FFFFFF', 900, 'center');
  text(ctx, 'Share the week. Start the next one.', 540, 1570, 30, 'rgba(255,255,255,0.72)', 800, 'center');
  text(ctx, '@risewiththetribe', 540, 1768, 32, '#60A5FA', 900, 'center');
  return canvas;
}

export async function resizeImageToBase64(file, maxDimension = 384, quality = 0.68) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });

  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
  let currentQuality = quality;
  let base64 = canvas.toDataURL('image/jpeg', currentQuality).split(',')[1];
  while (base64.length > 700000 && currentQuality > 0.35) {
    currentQuality -= 0.1;
    base64 = canvas.toDataURL('image/jpeg', currentQuality).split(',')[1];
  }
  return base64;
}

export const makeWinCardBlob = (input) => new Promise(resolve => {
  const canvas = input?.variant === 'weekly' || input?.variant === 'monthly'
    ? renderWeeklyRecapCanvas(input)
    : renderModernWinCardCanvas(input || {});
  canvas.toBlob(resolve, 'image/png', 0.94);
});

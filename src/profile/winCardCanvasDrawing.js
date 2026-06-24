function drawRoundedRect(ctx, x, y, width, height, radius) {
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
}

export function drawWinCardBackground(ctx, canvas) {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#080808');
  gradient.addColorStop(0.56, '#15110c');
  gradient.addColorStop(1, '#0a1510');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(255,107,53,0.20)';
  ctx.beginPath();
  ctx.arc(920, 180, 280, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(52,211,153,0.14)';
  ctx.beginPath();
  ctx.arc(120, 1660, 330, 0, Math.PI * 2);
  ctx.fill();
}

export function drawWinCardHeader(ctx, { displayName, instagramHandle }) {
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 58px Arial';
  ctx.fillText('RISE WITH THE TRIBE', 92, 180);
  ctx.fillStyle = '#FF6B35';
  ctx.font = '800 32px Arial';
  ctx.fillText('@risewiththetribe', 92, 232);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 104px Arial';
  ctx.fillText('WIN CARD', 92, 420);
  ctx.fillStyle = 'rgba(255,255,255,0.72)';
  ctx.font = '700 34px Arial';
  ctx.fillText((displayName || 'Tribe Member').slice(0, 28), 96, 482);
  if (instagramHandle) {
    ctx.fillStyle = '#FFD700';
    ctx.fillText(`@${instagramHandle.replace(/^@+/, '')}`.slice(0, 30), 96, 530);
  }
}

export function drawWinCardStats(ctx, { totalPoints, streak, daysActive, referralJoins }) {
  const stats = [
    ['ACTIVITY PTS', `${totalPoints}`, '#FFD700'],
    ['STREAK', `${streak}d`, '#FF6B35'],
    ['DAYS ACTIVE', `${daysActive}`, '#34D399'],
    ['REFERRAL JOINS', `${referralJoins}`, '#60A5FA'],
  ];
  stats.forEach(([label, value, color], index) => {
    const y = 670 + index * 210;
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    drawRoundedRect(ctx, 92, y, 896, 160, 28);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.font = '900 28px Arial';
    ctx.fillText(label, 136, y + 54);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 64px Arial';
    ctx.fillText(value, 136, y + 125);
  });
}

export function drawWinCardFooter(ctx, { rank }) {
  ctx.fillStyle = rank?.color || '#FFD700';
  ctx.font = '900 48px Arial';
  ctx.fillText(`${rank?.icon || '✨'} ${rank?.label || 'Tribe Member'}`, 92, 1550);
  ctx.fillStyle = 'rgba(255,255,255,0.72)';
  ctx.font = '700 34px Arial';
  ctx.fillText('Built one log at a time.', 92, 1622);
  ctx.fillStyle = '#FF6B35';
  ctx.font = '900 34px Arial';
  ctx.fillText('Tag @risewiththetribe', 92, 1694);
  ctx.fillStyle = '#FFD700';
  ctx.font = '900 40px Arial';
  ctx.fillText('risewiththetribe.app', 92, 1760);
}

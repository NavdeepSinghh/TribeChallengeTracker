import { GOLD } from './challengeTheme';
import { drawRoundedRect } from './challengeCanvasUtils';

export function drawChallengeLaunchCardStats({
  accent,
  challenge,
  ctx,
}) {
  const stats = [
    [`${challenge.duration || 0}`, 'DAYS'],
    [`${challenge.memberCount || 1}`, 'MEMBERS'],
    [challenge.difficulty?.toUpperCase?.() || 'OPEN', 'LEVEL'],
  ];
  stats.forEach(([value, label], index) => {
    const x = 120 + index * 300;
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    drawRoundedRect(ctx, x, 1030, 260, 150, 24);
    ctx.fill();
    ctx.fillStyle = index === 0 ? accent : index === 1 ? GOLD : '#34D399';
    ctx.font = '900 46px Arial';
    ctx.fillText(value, x + 130, 1095);
    ctx.fillStyle = 'rgba(255,255,255,0.62)';
    ctx.font = '900 22px Arial';
    ctx.fillText(label, x + 130, 1142);
  });
}

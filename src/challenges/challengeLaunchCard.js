import { ACCENT, GOLD } from './challengeTheme';
import { drawRoundedRect, wrapCanvasText } from './challengeCanvasUtils';
import { drawChallengeLaunchCardStats } from './challengeLaunchCardStats';

export const makeChallengeLaunchCardBlob = ({ challenge, shareLink }) => new Promise(resolve => {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  const accent = challenge.color || ACCENT;

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#080808');
  gradient.addColorStop(0.55, '#14100d');
  gradient.addColorStop(1, '#08140f');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = `${accent}2a`;
  ctx.beginPath();
  ctx.arc(920, 240, 300, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,215,0,0.12)';
  ctx.beginPath();
  ctx.arc(120, 1580, 340, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = accent;
  ctx.lineWidth = 8;
  drawRoundedRect(ctx, 72, 72, 936, 1776, 54);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('RISE WITH THE TRIBE', 540, 185);
  ctx.fillStyle = accent;
  ctx.font = '800 30px Arial';
  ctx.fillText('@risewiththetribe', 540, 235);

  ctx.font = '900 150px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(challenge.emoji || '🔥', 540, 430);

  ctx.fillStyle = challenge.campaignLabel ? accent : GOLD;
  ctx.font = '900 30px Arial';
  ctx.fillText((challenge.campaignLabel || 'CHALLENGE LAUNCH').toUpperCase(), 540, 535);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 82px Arial';
  wrapCanvasText(ctx, challenge.name, 540, 650, 820, 90, 2);

  ctx.fillStyle = 'rgba(255,255,255,0.72)';
  ctx.font = '700 34px Arial';
  wrapCanvasText(ctx, challenge.tagline, 540, 860, 820, 46, 2);

  drawChallengeLaunchCardStats({ accent, challenge, ctx });

  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  drawRoundedRect(ctx, 120, 1270, 840, 230, 30);
  ctx.fill();
  ctx.fillStyle = GOLD;
  ctx.font = '900 28px Arial';
  ctx.fillText(challenge.campaignHashtag || '#RiseWithTheTribe', 540, 1345);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 34px Arial';
  wrapCanvasText(ctx, challenge.campaignCta || 'Tag @risewiththetribe and bring your accountability partner.', 540, 1410, 730, 44, 2);

  ctx.fillStyle = accent;
  ctx.font = '900 34px Arial';
  ctx.fillText('JOIN CODE', 540, 1625);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 72px Arial';
  ctx.fillText(challenge.inviteCode || 'INVITE', 540, 1710);
  ctx.fillStyle = 'rgba(255,255,255,0.60)';
  ctx.font = '700 28px Arial';
  ctx.fillText(shareLink.replace(/^https?:\/\//, '').slice(0, 52), 540, 1785);

  canvas.toBlob(resolve, 'image/png', 0.94);
});

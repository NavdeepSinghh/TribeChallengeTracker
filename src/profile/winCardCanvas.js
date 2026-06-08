import {
  drawWinCardBackground,
  drawWinCardFooter,
  drawWinCardHeader,
  drawWinCardStats,
} from './winCardCanvasDrawing';

export function renderWinCardCanvas({
  displayName,
  totalPoints,
  streak,
  daysActive,
  rank,
  referralJoins,
  instagramHandle,
}) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  drawWinCardBackground(ctx, canvas);
  drawWinCardHeader(ctx, { displayName, instagramHandle });
  drawWinCardStats(ctx, { totalPoints, streak, daysActive, referralJoins });
  drawWinCardFooter(ctx, { rank });

  return canvas;
}

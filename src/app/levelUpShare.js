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

export const levelUpShareText = ({ rank, rankScore, streak, daysActive }) => (
  `I just reached ${rank?.label || "a new level"} on TribeLog: ${rankScore || 0} Tribe Score · ${streak || 0}-day streak · ${daysActive || 0} active days.\nTag @risewiththetribe and keep rising.`
);

export const makeLevelUpShareImageBlob = ({ rank, rankScore, streak, daysActive }) => new Promise((resolve) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d");
  const accent = rank?.color || "#FFD700";
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#090909");
  gradient.addColorStop(0.48, "#15100C");
  gradient.addColorStop(1, "#07140F");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = `${accent}36`;
  ctx.beginPath();
  ctx.arc(870, 210, 340, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(52,211,153,0.18)";
  ctx.beginPath();
  ctx.arc(120, 1660, 360, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = `${accent}88`;
  ctx.lineWidth = 8;
  roundRect(ctx, 72, 72, 936, 1776, 58);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 44px Arial";
  ctx.fillText("TRIBELOG LEVEL UP", 540, 190);
  ctx.fillStyle = accent;
  ctx.font = "900 150px Arial";
  ctx.fillText(rank?.icon || "⭐", 540, 430);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 88px Arial";
  ctx.fillText(rank?.label || "New Level", 540, 560);
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "800 32px Arial";
  ctx.fillText("earned through consistency", 540, 625);

  [
    ["TRIBE SCORE", `${rankScore || 0}`, accent],
    ["DAY STREAK", `${streak || 0}`, "#FF6B35"],
    ["ACTIVE DAYS", `${daysActive || 0}`, "#34D399"],
  ].forEach(([label, value, color], index) => {
    const y = 790 + index * 235;
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    roundRect(ctx, 150, y, 780, 170, 32);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.font = "900 60px Arial";
    ctx.fillText(value, 540, y + 78);
    ctx.fillStyle = "rgba(255,255,255,0.58)";
    ctx.font = "900 24px Arial";
    ctx.fillText(label, 540, y + 122);
  });

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 46px Arial";
  ctx.fillText("Keep showing up.", 540, 1600);
  ctx.fillStyle = accent;
  ctx.font = "900 34px Arial";
  ctx.fillText("@risewiththetribe", 540, 1660);
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "800 28px Arial";
  ctx.fillText("tribechallengetracker.web.app", 540, 1710);
  canvas.toBlob(resolve, "image/png", 0.94);
});

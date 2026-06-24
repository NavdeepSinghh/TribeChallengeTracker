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

export const progressShareText = ({ totalPts, streak, daysActive, instagramHandle }) => {
  const userTag = instagramHandle ? ` @${instagramHandle.replace(/^@+/, "")}` : "";
  return `Rise With The Tribe: ${totalPts} pts · ${streak}-day streak · ${daysActive} days active${userTag}\nTag @risewiththetribe and join the next challenge.`;
};

const drawStoryShareImage = (ctx, canvas, { totalPts, streak, daysActive, rank, palette }) => {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#07100D");
  gradient.addColorStop(1, "#050505");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255,107,53,0.20)";
  ctx.beginPath();
  ctx.arc(930, 140, 290, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(52,211,153,0.16)";
  ctx.beginPath();
  ctx.arc(80, 1580, 330, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.font = "900 32px Arial";
  ctx.textAlign = "center";
  ctx.fillText("RISE WITH THE TRIBE", 540, 190);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 92px Arial";
  ctx.fillText("I SHOWED UP", 540, 440);
  ctx.fillText("TODAY", 540, 540);
  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "800 32px Arial";
  ctx.fillText(`${streak || 0} days strong. Keep rising.`, 540, 620);

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  roundRect(ctx, 96, 710, 888, 560, 46);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,107,53,0.28)";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = palette.secondary;
  ctx.font = "900 78px Arial";
  ctx.fillText(`${totalPts || 0}`, 540, 875);
  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.font = "900 24px Arial";
  ctx.fillText("ACTIVITY POINTS", 540, 930);
  ctx.fillStyle = palette.primary;
  ctx.font = "900 60px Arial";
  ctx.fillText(`${streak || 0}`, 330, 1070);
  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.font = "900 22px Arial";
  ctx.fillText("DAY STREAK", 330, 1118);
  ctx.fillStyle = palette.third;
  ctx.font = "900 60px Arial";
  ctx.fillText(`${daysActive || 0}`, 750, 1070);
  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.font = "900 22px Arial";
  ctx.fillText("ACTIVE DAYS", 750, 1118);
  ctx.fillStyle = rank?.color || "#FFD700";
  ctx.font = "900 42px Arial";
  ctx.fillText(`${rank?.icon || "✨"} ${rank?.label || "Rookie"}`, 540, 1212);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 46px Arial";
  ctx.fillText("Log yours. Keep rising.", 540, 1508);
  ctx.fillStyle = palette.primary;
  roundRect(ctx, 230, 1588, 620, 96, 48);
  ctx.fill();
  ctx.fillStyle = "#000000";
  ctx.font = "900 28px Arial";
  ctx.fillText("OPEN TRIBELOG", 540, 1648);
  ctx.fillStyle = palette.secondary;
  ctx.font = "900 32px Arial";
  ctx.fillText("@risewiththetribe", 540, 1782);
  ctx.textAlign = "left";
};

export const makeProgressShareImageBlob = ({ totalPts, streak, daysActive, rank, templateId = "classic", variant = "progress" }) => new Promise((resolve) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d");
  const palettes = {
    classic: { bg0: "#080808", bg1: "#18110d", bg2: "#0d1511", primary: "#FF6B35", secondary: "#FFD700", third: "#34D399", card: "rgba(255,255,255,0.07)" },
    gold: { bg0: "#110d05", bg1: "#20180a", bg2: "#0e1110", primary: "#FFD700", secondary: "#FF6B35", third: "#FDE68A", card: "rgba(255,215,0,0.1)" },
    neon: { bg0: "#05070d", bg1: "#111827", bg2: "#071611", primary: "#34D399", secondary: "#60A5FA", third: "#A78BFA", card: "rgba(52,211,153,0.09)" },
  };
  const palette = palettes[templateId] || palettes.classic;
  if (variant === "story") {
    drawStoryShareImage(ctx, canvas, { totalPts, streak, daysActive, rank, palette });
    canvas.toBlob(resolve, "image/png", 0.94);
    return;
  }

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, palette.bg0);
  gradient.addColorStop(0.5, palette.bg1);
  gradient.addColorStop(1, palette.bg2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = templateId === "neon" ? "rgba(52,211,153,0.24)" : "rgba(255,107,53,0.24)";
  ctx.beginPath();
  ctx.arc(930, 160, 270, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = templateId === "neon" ? "rgba(96,165,250,0.18)" : "rgba(255,215,0,0.18)";
  ctx.beginPath();
  ctx.arc(140, 1770, 290, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 82px Arial";
  ctx.fillText("Rise With The Tribe", 96, 210);
  ctx.fillStyle = palette.primary;
  ctx.font = "700 34px Arial";
  ctx.fillText("@risewiththetribe", 96, 260);
  ctx.fillStyle = templateId === "classic" ? (rank.color || "#FFD700") : palette.secondary;
  ctx.font = "900 64px Arial";
  ctx.fillText(`${rank.icon || "🌱"} ${rank.label || "Rookie"}`, 96, 350);

  const stats = [
    ["STREAK", `${streak}d`, palette.primary],
    ["ACTIVITY PTS", `${totalPts}`, palette.secondary],
    ["DAYS ACTIVE", `${daysActive}`, palette.third],
  ];
  stats.forEach(([label, value, color], index) => {
    const y = 520 + index * 300;
    ctx.fillStyle = palette.card;
    roundRect(ctx, 96, y, 888, 220, 34);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.font = "800 34px Arial";
    ctx.fillText(label, 146, y + 70);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "900 92px Arial";
    ctx.fillText(value, 146, y + 166);
  });

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "700 36px Arial";
  ctx.fillText("Built one log at a time.", 96, 1640);
  ctx.fillStyle = palette.primary;
  ctx.font = "800 34px Arial";
  ctx.fillText("Tag @risewiththetribe", 96, 1698);
  ctx.fillStyle = palette.secondary;
  ctx.font = "900 42px Arial";
  ctx.fillText("risewiththetribe.app", 96, 1760);

  canvas.toBlob(resolve, "image/png", 0.94);
});

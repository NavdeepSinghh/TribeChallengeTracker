import { calcBadgeXP, getTribeRank } from "../badgeService";
import HomeHeroProfileButton from "./HomeHeroProfileButton";
import { getStreakMotivator } from "./homeHeroCopy";

export default function HomeHero({
  earnedBadges,
  setShowProfile,
  streak,
  totalPts,
  userProfile,
}) {
  const rank = getTribeRank(calcBadgeXP(earnedBadges));
  const avatarColor = userProfile?.avatarColor || rank.color;
  const frameId = userProfile?.cosmetics?.profileFrameId || "none";
  const frame = {
    ember: ["#FF6B35", "#FFD700"],
    gold: ["#FFD700", "#F59E0B"],
    neon: ["#34D399", "#60A5FA"],
  }[frameId];

  return (
    <div style={{ padding: "52px 24px 20px", background: "linear-gradient(180deg, #0f0f0f 0%, #080808 100%)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: "#555", fontSize: 11, fontWeight: 700, letterSpacing: 2, margin: "0 0 8px", fontFamily: "monospace" }}>RISE WITH THE TRIBE</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 32, lineHeight: 1 }}>{rank.icon}</span>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900, fontFamily: "'Syne', sans-serif", lineHeight: 1, color: rank.color }}>
              {rank.label}
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#777", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, lineHeight: 1.4 }}>
            {getStreakMotivator(streak)}
          </p>
        </div>
        <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <HomeHeroProfileButton
            avatarColor={avatarColor}
            frame={frame}
            rank={rank}
            setShowProfile={setShowProfile}
            userProfile={userProfile}
          />
          <div>
            <div style={{ fontSize: 11, color: "#444", fontFamily: "monospace", fontWeight: 700, letterSpacing: 1 }}>POINTS</div>
            <div style={{ fontSize: 36, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: "#FFD700" }}>{totalPts}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

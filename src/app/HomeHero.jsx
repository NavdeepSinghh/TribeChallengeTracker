import { useAppTheme } from "./AppThemeContext";
import HomeHeroProfileButton from "./HomeHeroProfileButton";
import { getStreakMotivator } from "./homeHeroCopy";
import { calculateRankScore, getTribeStatus, rankRequirementText } from "../rankRules";

export default function HomeHero({
  myHistory,
  rankRules,
  setShowProfile,
  streak,
  totalPts,
  userProfile,
}) {
  const { theme } = useAppTheme();
  const activeDays = Object.values(myHistory || {}).filter(day => (day?.activities || []).length > 0).length;
  const completedChallenges = userProfile?.stats?.challengesCompleted || 0;
  const rankScore = calculateRankScore(myHistory, rankRules?.dailyRankPointCap);
  const { rank, next } = getTribeStatus({ score: rankScore, activeDays, streak, completedChallenges }, rankRules);
  const avatarColor = userProfile?.avatarColor || rank.color;
  const frameId = userProfile?.cosmetics?.profileFrameId || "none";
  const frame = {
    ember: ["#FF6B35", "#FFD700"],
    gold: ["#FFD700", "#F59E0B"],
    neon: ["#34D399", "#60A5FA"],
  }[frameId];

  return (
    <div style={{ padding: "52px 24px 20px", background: theme.heroBg }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: theme.mutedStrong, fontSize: 11, fontWeight: 700, letterSpacing: 2, margin: "0 0 8px", fontFamily: "monospace" }}>RISE WITH THE TRIBE</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 32, lineHeight: 1 }}>{rank.icon}</span>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900, fontFamily: "'Syne', sans-serif", lineHeight: 1, color: rank.color }}>
              {rank.label}
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: theme.textSoft, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, lineHeight: 1.4 }}>
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
            <div style={{ fontSize: 11, color: theme.mutedStrong, fontFamily: "monospace", fontWeight: 700, letterSpacing: 1 }}>POINTS</div>
            <div style={{ fontSize: 36, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: "#FFD700" }}>{totalPts}</div>
          </div>
        </div>
      </div>
      {next && (
        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
            <span style={{ color: theme.textSoft, fontSize: 10, fontWeight: 800, fontFamily: "monospace" }}>
              Next: {next.icon} {next.label}
            </span>
            <span style={{ color: rank.color, fontSize: 10, fontWeight: 800, fontFamily: "monospace", textAlign: "right" }}>
              {rankRequirementText(next)}
            </span>
          </div>
          <div style={{ height: 5, borderRadius: 999, background: theme.progressTrack, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${Math.min(100, Math.max(0, ((rankScore - rank.minScore) / Math.max(1, next.minScore - rank.minScore)) * 100))}%`,
              background: `linear-gradient(90deg, ${rank.color}, ${next.color})`,
              borderRadius: 999,
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

import RankBadge from "./RankBadge";

export default function HomeHeroProfileButton({
  avatarColor,
  frame,
  rank,
  setShowProfile,
  userProfile,
}) {
  return (
    <span style={{ position: "relative", display: "inline-flex", flexShrink: 0 }}>
      <button onClick={() => setShowProfile(true)} style={{
        width: 38, height: 38, borderRadius: "50%",
        background: `${avatarColor}22`,
        border: "2px solid transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, cursor: "pointer", overflow: "hidden", padding: 0,
        boxShadow: frame ? `0 0 18px ${frame[0]}33` : undefined,
        backgroundImage: frame ? `linear-gradient(#111,#111), linear-gradient(135deg, ${frame[0]}, ${frame[1]})` : `linear-gradient(#111,#111), linear-gradient(135deg, ${avatarColor}55, ${avatarColor}55)`,
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}>
        {userProfile?.profileImageData ? (
          <img
            src={`data:image/jpeg;base64,${userProfile.profileImageData}`}
            alt="Profile"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (userProfile?.avatarEmoji || rank.icon)}
      </button>
      <RankBadge rank={rank} size={17} />
    </span>
  );
}

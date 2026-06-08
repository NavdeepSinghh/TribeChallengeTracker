export default function BadgeCategoryFilter({ badgeCat, categories, setBadgeCat }) {
  return (
    <div style={{ overflowX: "auto", paddingBottom: 4, marginBottom: 18 }}>
      <div style={{ display: "flex", gap: 8, padding: "0 20px", width: "max-content" }}>
        {categories.map(category => {
          const active = badgeCat === category.id;
          return (
            <button key={category.id} onClick={() => setBadgeCat(category.id)} style={{
              padding: "7px 15px", borderRadius: 20, whiteSpace: "nowrap",
              background: active ? "rgba(255,107,53,0.18)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${active ? "#FF6B35" : "rgba(255,255,255,0.08)"}`,
              color: active ? "#FF6B35" : "#666",
              fontSize: 12, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif",
              cursor: "pointer", transition: "all .2s",
            }}>
              {category.icon} {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

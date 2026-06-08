export default function AppAuthenticatedFrame({ children }) {
  return (
    <div style={{
      minHeight: "100vh", background: "#080808",
      fontFamily: "'Space Grotesk', sans-serif",
      color: "#fff", maxWidth: 430, margin: "0 auto", position: "relative",
      paddingTop: "env(safe-area-inset-top)",
      paddingBottom: "calc(80px + env(safe-area-inset-bottom))",
      paddingLeft: "env(safe-area-inset-left)",
      paddingRight: "env(safe-area-inset-right)",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      {children}
    </div>
  );
}

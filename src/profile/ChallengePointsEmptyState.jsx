export default function ChallengePointsEmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '32px 0' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>*</div>
      <p style={{ margin: 0, fontSize: 14, color: '#555' }}>No challenge points yet</p>
      <p style={{ margin: '6px 0 0', fontSize: 12, color: '#444' }}>
        Log daily tasks inside a challenge to earn points
      </p>
    </div>
  );
}

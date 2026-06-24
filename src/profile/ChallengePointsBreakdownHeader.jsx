export default function ChallengePointsBreakdownHeader({ totalChallengePoints }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
      <div>
        <p style={{ margin: 0, fontSize: 10, color: '#555', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 2 }}>PER CHALLENGE</p>
        <h3 style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#fff' }}>
          Points Breakdown
        </h3>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#34D399' }}>
          {totalChallengePoints}
        </div>
        <div style={{ fontSize: 9, color: '#555', fontFamily: 'monospace', fontWeight: 700 }}>CHALLENGE PTS</div>
      </div>
    </div>
  );
}

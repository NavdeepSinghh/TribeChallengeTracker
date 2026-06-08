export default function ChallengeTrackerIdentity({ challenge, memberData }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 16 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${challenge.color}22`, border: `1.5px solid ${challenge.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
        {challenge.emoji}
      </div>
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#fff' }}>{challenge.name}</h2>
        <p style={{ margin: 0, fontSize: 10, color: '#555', fontFamily: 'monospace', fontWeight: 700 }}>
          {challenge.duration} DAYS · {(memberData?.totalPoints || 0)} PTS TOTAL
        </p>
      </div>
    </div>
  );
}

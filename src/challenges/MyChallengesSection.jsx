import ChallengeCard from './ChallengeCard';
import { card } from './challengeTheme';

export default function MyChallengesSection({
  myChallenges,
  openChallenge,
  user,
}) {
  if (myChallenges.length === 0) {
    return (
      <div style={{ ...card, textAlign: 'center', padding: '36px 24px', marginBottom: 24 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
        <p style={{ color: '#fff', fontWeight: 700, margin: '0 0 6px' }}>No challenges yet</p>
        <p style={{ color: '#555', fontSize: 13, margin: 0 }}>
          Create one or search below to join a public challenge
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 1, fontFamily: 'monospace', margin: '0 0 12px' }}>
        MY CHALLENGES ({myChallenges.length})
      </p>
      {myChallenges.map(c => (
        <ChallengeCard
          key={c.id}
          challenge={c}
          isOwner={c.createdBy === user.uid}
          onClick={() => openChallenge(c.id)}
        />
      ))}
    </div>
  );
}

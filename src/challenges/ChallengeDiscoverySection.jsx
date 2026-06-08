import ChallengeCard from './ChallengeCard';
import { card } from './challengeTheme';

export default function ChallengeDiscoverySection({
  handleSearch,
  searchQuery,
  searchResults,
  searching,
  setDetailChallenge,
  setTrackerChallenge,
  setView,
  user,
}) {
  return (
    <div>
      <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 1, fontFamily: 'monospace', margin: '0 0 10px' }}>
        DISCOVER CHALLENGES 🔍
      </p>
      <div style={{ position: 'relative', marginBottom: 14 }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, pointerEvents: 'none' }}>🔍</span>
        <input
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Search public challenges…"
          style={{
            width: '100%', padding: '12px 16px 12px 38px',
            borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)', color: '#fff',
            fontSize: 14, fontFamily: "'Space Grotesk', sans-serif",
            boxSizing: 'border-box', outline: 'none',
          }}
        />
        {searching && (
          <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 12 }}>⏳</span>
        )}
      </div>

      {searchQuery.trim() && !searching && searchResults.length === 0 && (
        <div style={{ ...card, textAlign: 'center', padding: '24px' }}>
          <p style={{ margin: 0, fontSize: 13, color: '#555' }}>No public challenges found for "{searchQuery}"</p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div>
          <p style={{ color: '#444', fontSize: 9, fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1, margin: '0 0 10px' }}>
            {searchResults.length} RESULT{searchResults.length !== 1 ? 'S' : ''}
          </p>
          {searchResults.map(c => (
            <ChallengeCard
              key={c.id}
              challenge={c}
              isOwner={c.createdBy === user.uid}
              alreadyJoined={c.alreadyJoined}
              onClick={() => { setDetailChallenge(c); setView(c.alreadyJoined ? 'tracker' : 'detail'); if (c.alreadyJoined) setTrackerChallenge(c); }}
            />
          ))}
        </div>
      )}

      {!searchQuery.trim() && (
        <div style={{ ...card, padding: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, color: '#ccc' }}>Find your next challenge</p>
          <p style={{ margin: 0, fontSize: 12, color: '#555' }}>
            Search by name to discover public challenges from the community. Private challenges require an invite link.
          </p>
        </div>
      )}
    </div>
  );
}

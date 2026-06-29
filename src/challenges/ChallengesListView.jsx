import ChallengeDiscoverySection from './ChallengeDiscoverySection';
import ChallengesListHeader from './ChallengesListHeader';
import MyChallengesSection from './MyChallengesSection';

export default function ChallengesListView({
  activeChallenges,
  completedChallenges,
  handleSearch,
  myChallenges,
  openChallenge,
  searchQuery,
  searchResults,
  searching,
  setDetailChallenge,
  setView,
  user,
}) {
  return (
    <div>
      <ChallengesListHeader setView={setView} />
      <MyChallengesSection
        emptyBody="Create one or join a public challenge below."
        emptyTitle="No active challenges"
        myChallenges={activeChallenges || myChallenges}
        openChallenge={openChallenge}
        title="ACTIVE CHALLENGES"
        user={user}
      />
      <ChallengeDiscoverySection
        handleSearch={handleSearch}
        searchQuery={searchQuery}
        searchResults={searchResults}
        searching={searching}
        setDetailChallenge={setDetailChallenge}
        setView={setView}
        user={user}
      />
      {completedChallenges?.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <MyChallengesSection
            myChallenges={completedChallenges}
            openChallenge={openChallenge}
            title="COMPLETED CHALLENGES"
            user={user}
          />
        </div>
      )}
    </div>
  );
}

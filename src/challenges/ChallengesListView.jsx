import ChallengeDiscoverySection from './ChallengeDiscoverySection';
import ChallengesListHeader from './ChallengesListHeader';
import MyChallengesSection from './MyChallengesSection';

export default function ChallengesListView({
  handleSearch,
  myChallenges,
  openChallenge,
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
      <ChallengesListHeader setView={setView} />
      <MyChallengesSection
        myChallenges={myChallenges}
        openChallenge={openChallenge}
        user={user}
      />
      <ChallengeDiscoverySection
        handleSearch={handleSearch}
        searchQuery={searchQuery}
        searchResults={searchResults}
        searching={searching}
        setDetailChallenge={setDetailChallenge}
        setTrackerChallenge={setTrackerChallenge}
        setView={setView}
        user={user}
      />
    </div>
  );
}

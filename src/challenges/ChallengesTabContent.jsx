import ChallengeTrackerScreen from '../ChallengeTrackerScreen';
import ChallengeDetail from './ChallengeDetail';
import ChallengesListView from './ChallengesListView';
import CreateChallenge from './CreateChallenge';

export default function ChallengesTabContent({
  activeChallenges,
  completedChallenges,
  detailChallenge,
  handleCreate,
  handleJoined,
  handleLeft,
  handleSearch,
  myChallenges,
  openChallenge,
  pendingReferralUid,
  profile,
  refreshList,
  searchQuery,
  searchResults,
  searching,
  setDetailChallenge,
  setView,
  trackerChallenge,
  user,
  view,
}) {
  if (view === 'list') {
    return (
      <ChallengesListView
        handleSearch={handleSearch}
        activeChallenges={activeChallenges}
        completedChallenges={completedChallenges}
        myChallenges={myChallenges}
        openChallenge={openChallenge}
        searchQuery={searchQuery}
        searchResults={searchResults}
        searching={searching}
        setDetailChallenge={setDetailChallenge}
        setView={setView}
        user={user}
      />
    );
  }

  if (view === 'create') {
    return (
      <CreateChallenge
        profile={profile}
        onBack={refreshList}
        onCreate={handleCreate}
      />
    );
  }

  if (view === 'detail' && detailChallenge) {
    return (
      <ChallengeDetail
        challenge={detailChallenge}
        onBack={refreshList}
        onJoined={handleJoined}
        pendingReferralUid={pendingReferralUid}
      />
    );
  }

  if (view === 'tracker' && trackerChallenge) {
    return (
      <div style={{ padding: 0 }}>
        <ChallengeTrackerScreen
          challenge={trackerChallenge}
          onBack={refreshList}
          onLeft={handleLeft}
        />
      </div>
    );
  }

  return null;
}

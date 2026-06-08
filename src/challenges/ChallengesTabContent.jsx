import ChallengeTrackerScreen from '../ChallengeTrackerScreen';
import ChallengeDetail from './ChallengeDetail';
import ChallengesListView from './ChallengesListView';
import CreateChallenge from './CreateChallenge';

export default function ChallengesTabContent({
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
  setTrackerChallenge,
  setView,
  trackerChallenge,
  user,
  view,
}) {
  if (view === 'list') {
    return (
      <ChallengesListView
        handleSearch={handleSearch}
        myChallenges={myChallenges}
        openChallenge={openChallenge}
        searchQuery={searchQuery}
        searchResults={searchResults}
        searching={searching}
        setDetailChallenge={setDetailChallenge}
        setTrackerChallenge={setTrackerChallenge}
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

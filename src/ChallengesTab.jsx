import { useAuth } from './AuthContext';
import ChallengesTabContent from './challenges/ChallengesTabContent';
import ChallengesTabLoading from './challenges/ChallengesTabLoading';
import useChallengesTabState from './challenges/useChallengesTabState';

// ─── MAIN CHALLENGES TAB ──────────────────────────────────────────────────────
export default function ChallengesTab({ pendingJoinCode, pendingReferralUid, onJoinHandled, onStatsChanged }) {
  const { user }                              = useAuth();
  const {
    detailChallenge,
    handleCreate,
    handleJoined,
    handleLeft,
    handleSearch,
    loading,
    myChallenges,
    openChallenge,
    profile,
    refreshList,
    searchQuery,
    searchResults,
    searching,
    setDetailChallenge,
    setTrackerChallenge,
    setView,
    trackerChallenge,
    view,
  } = useChallengesTabState({
    onJoinHandled,
    onStatsChanged,
    pendingJoinCode,
    user,
  });

  if (loading) {
    return <ChallengesTabLoading />;
  }

  return (
    <div style={{ padding: '52px 20px 20px', fontFamily: "'Space Grotesk', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <ChallengesTabContent
        detailChallenge={detailChallenge}
        handleCreate={handleCreate}
        handleJoined={handleJoined}
        handleLeft={handleLeft}
        handleSearch={handleSearch}
        myChallenges={myChallenges}
        openChallenge={openChallenge}
        pendingReferralUid={pendingReferralUid}
        profile={profile}
        refreshList={refreshList}
        searchQuery={searchQuery}
        searchResults={searchResults}
        searching={searching}
        setDetailChallenge={setDetailChallenge}
        setTrackerChallenge={setTrackerChallenge}
        setView={setView}
        trackerChallenge={trackerChallenge}
        user={user}
        view={view}
      />
    </div>
  );
}

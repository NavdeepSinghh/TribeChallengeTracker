import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getMemberData } from './trackingService';
import { leaveChallenge } from './challengeService';
import TodayTab from './challengeTracker/TodayTab';
import LeaderboardTab from './challengeTracker/LeaderboardTab';
import ProgressTab from './challengeTracker/ProgressTab';
import LeaveDialog from './challengeTracker/LeaveDialog';
import ChallengeTrackerHeader from './challengeTracker/ChallengeTrackerHeader';
import ChallengePulseCard from './challengeTracker/ChallengePulseCard';
import ChallengeUpdatesCard from './challengeTracker/ChallengeUpdatesCard';

export default function ChallengeTrackerScreen({ challenge, onBack, onLeft }) {
  const { user } = useAuth();
  const [innerTab, setInnerTab] = useState('today');
  const [memberData, setMemberData] = useState(null);
  const [showLeaveDialog, setShowLeave] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const loadMember = useCallback(() => {
    getMemberData(user.uid, challenge.id).then(setMemberData);
  }, [user.uid, challenge.id]);

  useEffect(() => { loadMember(); }, [loadMember]);

  const handleLeave = async () => {
    setLeaving(true);
    try {
      await leaveChallenge(user.uid, challenge.id);
      onLeft?.();
      onBack();
    } catch (e) {
      console.error('[Leave]', e);
      setLeaving(false);
      setShowLeave(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080808', fontFamily: "'Space Grotesk', sans-serif", color: '#fff', maxWidth: 430, margin: '0 auto' }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {showLeaveDialog && memberData && (
        <LeaveDialog
          challenge={challenge}
          memberData={memberData}
          leaving={leaving}
          onConfirm={handleLeave}
          onCancel={() => setShowLeave(false)}
        />
      )}

      <ChallengeTrackerHeader
        challenge={challenge}
        innerTab={innerTab}
        memberData={memberData}
        onBack={onBack}
        onLeave={() => setShowLeave(true)}
        setInnerTab={setInnerTab}
      />

      <ChallengePulseCard challenge={challenge} memberData={memberData} />
      <ChallengeUpdatesCard challenge={challenge} memberData={memberData} user={user} />

      {innerTab === 'today' && (
        <TodayTab challenge={challenge} memberData={memberData} onLogged={loadMember} />
      )}
      {innerTab === 'leaderboard' && (
        <LeaderboardTab challenge={challenge} currentUid={user.uid} />
      )}
      {innerTab === 'progress' && (
        <ProgressTab challenge={challenge} memberData={memberData} />
      )}
    </div>
  );
}

import { useEffect } from 'react';
import { getChallengeByInviteCode } from '../challengeService';

export default function usePendingChallengeInvite({
  joinedIds,
  onJoinHandled,
  pendingJoinCode,
  setDetailChallenge,
  setTrackerChallenge,
  setView,
}) {
  useEffect(() => {
    if (!pendingJoinCode) return;
    getChallengeByInviteCode(pendingJoinCode).then(c => {
      if (c) {
        setDetailChallenge(c);
        setView(joinedIds.has(c.id) ? 'tracker' : 'detail');
        if (joinedIds.has(c.id)) setTrackerChallenge(c);
      }
      onJoinHandled?.();
      window.history.replaceState({}, '', window.location.pathname);
    });
  }, [pendingJoinCode]);
}

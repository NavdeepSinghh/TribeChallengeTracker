import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { getAllProgress } from '../trackingService';
import { buildCalendarDays } from './challengeTrackerDates';

export default function useProgressTabState({ challenge, memberData }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProgress(user.uid, challenge.id).then(p => { setProgress(p); setLoading(false); });
  }, [challenge.id, user.uid]);

  const days = buildCalendarDays(challenge, progress);

  const [sy, sm, sd] = challenge.startDate.split('-').map(Number);
  const [ey, em, ed] = challenge.endDate.split('-').map(Number);
  const startDate = new Date(sy, sm - 1, sd);
  const endDate = new Date(ey, em - 1, ed);
  const todayMid = new Date(); todayMid.setHours(0, 0, 0, 0);
  const daysLeft = Math.max(0, Math.ceil((endDate - todayMid) / 86400000));
  const dayNum = Math.min(challenge.duration, Math.max(1, Math.floor((todayMid - startDate) / 86400000) + 1));
  const pctDone = Math.round((dayNum / challenge.duration) * 100);
  const completedDays = memberData?.daysCompleted || 0;
  const isComplete = completedDays >= challenge.duration;
  const completionLabel = challenge.isPremium && challenge.packLabel ? challenge.packLabel : 'Challenge complete';

  const fmtDate = (d) => d.toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' });
  const shareCompletion = async () => {
    const packText = challenge.isPremium && challenge.packLabel ? `${challenge.packLabel} · ` : '';
    const text = `I completed ${packText}${challenge.name} on Rise With The Tribe: ${memberData?.totalPoints || 0} pts · ${completedDays}/${challenge.duration} days · ${memberData?.currentStreak || 0} day streak.\nTag @risewiththetribe and join the next challenge.`;
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard?.writeText(text);
    }
  };

  return {
    completedDays,
    completionLabel,
    dayNum,
    days,
    daysLeft,
    endDate,
    fmtDate,
    isComplete,
    loading,
    pctDone,
    progress,
    shareCompletion,
    startDate,
  };
}

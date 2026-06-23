import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { calcPoints, getTodayLog, logDay } from '../trackingService';
import { dayNumber } from './challengeTrackerDates';

export default function useTodayTabState({ challenge, onLogged }) {
  const { user } = useAuth();
  const [checked, setChecked] = useState(new Set());
  const [todayLog, setTodayLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [completion, setCompletion] = useState(null);

  useEffect(() => {
    getTodayLog(user.uid, challenge.id).then(log => {
      if (log) {
        setTodayLog(log);
        setChecked(new Set(log.completedTasks));
      }
      setLoading(false);
    });
  }, [challenge.id, user.uid]);

  const toggle = (taskId) => {
    if (todayLog) return;
    setChecked(prev => {
      const next = new Set(prev);
      next.has(taskId) ? next.delete(taskId) : next.add(taskId);
      return next;
    });
  };

  const handleLog = async () => {
    if (!checked.size || saving) return;
    setSaving(true);
    const result = await logDay(user.uid, challenge, [...checked], challenge.tasks.length);
    setTodayLog({ completedTasks: [...checked], points: result.points, allComplete: result.allComplete });
    if (result.completion?.isNew) setCompletion(result.completion.record);
    setToast(`🎉 +${result.points} pts${result.allComplete ? ' · Full day!' : ''}${result.newStreak > 1 ? ` · 🔥 ${result.newStreak} streak` : ''}`);
    setTimeout(() => setToast(null), 3500);
    onLogged?.();
    setSaving(false);
  };

  const dayNum = dayNumber(challenge.startDate);
  const preview = calcPoints(checked.size, challenge.tasks.length);
  const allDone = todayLog?.allComplete;

  return {
    allDone,
    checked,
    completion,
    dismissCompletion: () => setCompletion(null),
    dayNum,
    handleLog,
    loading,
    preview,
    saving,
    todayLog,
    toast,
    toggle,
  };
}

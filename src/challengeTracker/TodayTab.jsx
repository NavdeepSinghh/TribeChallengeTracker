import TodayHeader from './TodayHeader';
import TodayLogAction from './TodayLogAction';
import TodayPointsCard from './TodayPointsCard';
import TodayTaskList from './TodayTaskList';
import TodayToast from './TodayToast';
import useTodayTabState from './useTodayTabState';

export default function TodayTab({ challenge, memberData, onLogged }) {
  const { allDone, checked, dayNum, handleLog, loading, preview, saving, todayLog, toast, toggle } = useTodayTabState({
    challenge,
    onLogged,
  });

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#555' }}>Loading…</div>;

  return (
    <div style={{ padding: '20px 20px 100px' }}>
      <TodayToast toast={toast} />
      <TodayHeader allDone={allDone} challenge={challenge} dayNum={dayNum} memberData={memberData} todayLog={todayLog} />
      <TodayTaskList checked={checked} tasks={challenge.tasks} todayLog={todayLog} toggle={toggle} />
      <TodayPointsCard checked={checked} preview={preview} tasks={challenge.tasks} todayLog={todayLog} />
      <TodayLogAction
        checked={checked}
        dayNum={dayNum}
        handleLog={handleLog}
        memberData={memberData}
        preview={preview}
        saving={saving}
        todayLog={todayLog}
      />
    </div>
  );
}

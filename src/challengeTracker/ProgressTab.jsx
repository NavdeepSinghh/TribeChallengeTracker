import ProgressCalendarGrid from './ProgressCalendarGrid';
import ProgressCompletionRecap from './ProgressCompletionRecap';
import ProgressDateSummary from './ProgressDateSummary';
import ProgressLegend from './ProgressLegend';
import ProgressStatsGrid from './ProgressStatsGrid';
import useProgressTabState from './useProgressTabState';

export default function ProgressTab({ challenge, memberData }) {
  const {
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
  } = useProgressTabState({ challenge, memberData });

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#555' }}>Loading…</div>;

  return (
    <div style={{ padding: '20px 20px 100px' }}>
      <ProgressDateSummary
        challenge={challenge}
        dayNum={dayNum}
        daysLeft={daysLeft}
        endDate={endDate}
        fmtDate={fmtDate}
        pctDone={pctDone}
        startDate={startDate}
      />

      <ProgressStatsGrid memberData={memberData} />

      {isComplete && (
        <ProgressCompletionRecap
          challenge={challenge}
          completedDays={completedDays}
          completionLabel={completionLabel}
          memberData={memberData}
          shareCompletion={shareCompletion}
        />
      )}

      <ProgressLegend />
      <ProgressCalendarGrid challenge={challenge} days={days} />

      <p style={{ color: '#444', fontSize: 10, fontFamily: 'monospace', textAlign: 'center', marginTop: 14 }}>
        {Object.keys(progress).length} of {challenge.duration} days logged
      </p>
    </div>
  );
}

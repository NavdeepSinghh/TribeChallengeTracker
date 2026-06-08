import ChallengePointsBreakdownHeader from './ChallengePointsBreakdownHeader';
import ChallengePointsEmptyState from './ChallengePointsEmptyState';
import ChallengePointsList from './ChallengePointsList';

export default function ChallengePointsBreakdownSheet({
  open,
  onClose,
  totalChallengePoints,
  challengePoints,
}) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 350,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 430,
          background: '#111',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px 24px 0 0',
          padding: '20px 24px 52px',
          maxHeight: '72vh', overflowY: 'auto',
        }}
      >
        <div style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 4, margin: '0 auto 20px' }} />

        <ChallengePointsBreakdownHeader totalChallengePoints={totalChallengePoints} />

        {challengePoints.length === 0 ? (
          <ChallengePointsEmptyState />
        ) : (
          <ChallengePointsList
            challengePoints={challengePoints}
            totalChallengePoints={totalChallengePoints}
          />
        )}
      </div>
    </div>
  );
}

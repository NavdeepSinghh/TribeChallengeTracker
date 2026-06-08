import ChallengeTrackerHeaderActions from './ChallengeTrackerHeaderActions';
import ChallengeTrackerIdentity from './ChallengeTrackerIdentity';
import ChallengeTrackerTabNav from './ChallengeTrackerTabNav';

export default function ChallengeTrackerHeader({
  challenge,
  innerTab,
  memberData,
  onBack,
  onLeave,
  setInnerTab,
}) {
  return (
    <div style={{ padding: '52px 20px 0', background: 'linear-gradient(180deg, #0f0f0f, #080808)' }}>
      <ChallengeTrackerHeaderActions onBack={onBack} onLeave={onLeave} />
      <ChallengeTrackerIdentity challenge={challenge} memberData={memberData} />
      <ChallengeTrackerTabNav innerTab={innerTab} setInnerTab={setInnerTab} />
    </div>
  );
}

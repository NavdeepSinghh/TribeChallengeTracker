import { COMMUNITY_EVENT_INTEREST_OPTIONS } from '../communityEvents';
import CommunityEventInterestFooter from './CommunityEventInterestFooter';
import CommunityEventInterestOptionButton from './CommunityEventInterestOptionButton';

export default function CommunityEventInterestSection({
  communityEventInterestMessage,
  communityEventInterestSummary,
  isAdmin,
  isSavingCommunityEventInterest,
  onCommunityEventInterestToggle,
  selectedCommunityEventInterestIds,
}) {
  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: 'rgba(251,113,133,0.05)',
      border: '1px solid rgba(251,113,133,0.16)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>COMMUNITY EVENT INTEREST</p>
          <p style={{ margin: '4px 0 0', color: '#FB7185', fontSize: 10, fontFamily: 'monospace' }}>
            First-party event demand, no commerce
          </p>
        </div>
        <span style={{ color: selectedCommunityEventInterestIds.length ? '#FB7185' : '#777', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
          {selectedCommunityEventInterestIds.length ? `${selectedCommunityEventInterestIds.length} SAVED` : 'TAP TO SAVE'}
        </span>
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        {COMMUNITY_EVENT_INTEREST_OPTIONS.map(option => {
          const selected = selectedCommunityEventInterestIds.includes(option.id);
          return (
            <CommunityEventInterestOptionButton
              key={option.id}
              demandCount={communityEventInterestSummary[option.id]}
              isAdmin={isAdmin}
              isSavingCommunityEventInterest={isSavingCommunityEventInterest}
              onCommunityEventInterestToggle={onCommunityEventInterestToggle}
              option={option}
              selected={selected}
            />
          );
        })}
      </div>
      <CommunityEventInterestFooter communityEventInterestMessage={communityEventInterestMessage} />
    </div>
  );
}

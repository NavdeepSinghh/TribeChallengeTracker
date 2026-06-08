import { card } from './challengeTheme';

export default function CreateChallengeCampaignCopyCard({
  created,
  createdCampaignShareText,
}) {
  return (
    <div style={{ ...card, textAlign: 'left', marginBottom: 16, border: `1px solid ${created.color}33`, background: `${created.color}0d` }}>
      <p style={{ color: created.color, fontSize: 10, fontWeight: 800, letterSpacing: 1, fontFamily: 'monospace', margin: '0 0 10px' }}>CAMPAIGN COPY</p>
      <p style={{ margin: 0, whiteSpace: 'pre-line', fontSize: 12, color: '#aaa', lineHeight: 1.5 }}>{createdCampaignShareText}</p>
    </div>
  );
}

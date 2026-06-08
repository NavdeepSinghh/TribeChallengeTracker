import { DM_KEYWORD_PROMPTS } from './profileConstants';

export default function WeeklyCampaignDmKeywordSection({ dmKeywordCopy }) {
  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: 'rgba(167,139,250,0.05)',
      border: '1px solid rgba(167,139,250,0.16)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Instagram DM Keyword Kit</p>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
            Manual replies for Reels, Stories, and community DMs
          </p>
        </div>
        <span style={{ color: '#A78BFA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
          {DM_KEYWORD_PROMPTS.length} KEYWORDS
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
        {DM_KEYWORD_PROMPTS.map(prompt => (
          <div key={prompt.keyword} style={{ borderRadius: 10, padding: 10, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ margin: 0, color: '#A78BFA', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>DM {prompt.keyword}</p>
            <p style={{ margin: '5px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>{prompt.label}</p>
            <p style={{ margin: '4px 0 0', color: '#777', fontSize: 9, lineHeight: 1.35 }}>{prompt.reply}</p>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigator.clipboard?.writeText(dmKeywordCopy)}
        style={{
          marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
          border: '1px solid rgba(167,139,250,0.22)', background: 'rgba(167,139,250,0.10)',
          color: '#A78BFA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
        }}
      >
        COPY DM KEYWORD REPLIES
      </button>
    </div>
  );
}

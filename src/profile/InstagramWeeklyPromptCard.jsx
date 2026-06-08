import { ACCENT, GOLD } from './profileConstants';

export default function InstagramWeeklyPromptCard({
  instagramPromptCopy,
  instagramWeeklyPrompt,
}) {
  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,107,53,0.18)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Instagram Weekly Prompt Kit</p>
          <p style={{ margin: '4px 0 0', color: ACCENT, fontSize: 10, fontFamily: 'monospace', fontWeight: 900 }}>
            {instagramWeeklyPrompt.label}
          </p>
        </div>
        <span style={{ color: GOLD, fontSize: 18 }}>↗</span>
      </div>
      <p style={{ margin: '0 0 6px', color: '#fff', fontSize: 12, fontWeight: 900 }}>{instagramWeeklyPrompt.title}</p>
      <p style={{ margin: 0, color: '#888', fontSize: 11, lineHeight: 1.45 }}>{instagramPromptCopy}</p>
      <button
        onClick={() => navigator.clipboard?.writeText(instagramPromptCopy)}
        style={{
          marginTop: 12, width: '100%', border: '1px solid rgba(255,107,53,0.24)',
          borderRadius: 12, padding: '10px 12px', background: 'rgba(255,107,53,0.10)',
          color: ACCENT, fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
        }}
      >
        COPY INSTAGRAM PROMPT
      </button>
    </div>
  );
}

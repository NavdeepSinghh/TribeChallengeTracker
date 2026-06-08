import { INSTAGRAM_WEEKLY_PROMPTS } from './profileConstants';

export default function WeeklyCampaignInstagramCalendarSection({ instagramContentCalendarCopy }) {
  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: 'rgba(96,165,250,0.05)',
      border: '1px solid rgba(96,165,250,0.16)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>INSTAGRAM CONTENT CALENDAR</p>
          <p style={{ margin: '4px 0 0', color: '#8DB8FF', fontSize: 10, fontFamily: 'monospace' }}>
            Seven-day creator/admin cadence
          </p>
        </div>
        <span style={{ color: '#60A5FA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
          {INSTAGRAM_WEEKLY_PROMPTS.length} DAYS
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
        {INSTAGRAM_WEEKLY_PROMPTS.map((prompt, index) => (
          <div key={prompt.label} style={{ borderRadius: 10, padding: 10, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ margin: 0, color: '#60A5FA', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][index]} · {prompt.label}
            </p>
            <p style={{ margin: '5px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>{prompt.title}</p>
            <p style={{ margin: '4px 0 0', color: '#777', fontSize: 9, lineHeight: 1.35 }}>{prompt.hook}</p>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigator.clipboard?.writeText(instagramContentCalendarCopy)}
        style={{
          marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
          border: '1px solid rgba(96,165,250,0.22)', background: 'rgba(96,165,250,0.10)',
          color: '#60A5FA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
        }}
      >
        COPY CONTENT CALENDAR
      </button>
    </div>
  );
}

import { ACCENT, GOLD, reminderButtonStyle } from './profileConstants';

export default function ProfileReminderCard({
  reminderLabel,
  reminderError,
  onReminder,
  onReminderOff,
  theme,
}) {
  const palette = theme || {
    cardBg: 'rgba(255,255,255,0.03)',
    cardBorder: 'rgba(255,255,255,0.06)',
    muted: '#555',
    mutedStrong: '#888',
    text: '#fff',
    textInverse: '#111',
  };

  return (
    <>
      <p style={{ color: palette.mutedStrong, fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>DAILY REMINDER</p>
      <div style={{
        background: palette.cardBg, border: `1px solid ${palette.cardBorder}`,
        borderRadius: 16, padding: 16, marginBottom: 24,
      }}>
        <div style={{ fontSize: 16, color: palette.text, fontWeight: 900, fontFamily: "'Syne', sans-serif", marginBottom: 4 }}>
          {reminderLabel === 'Off' ? 'Reminders are off' : `Reminder set for ${reminderLabel}`}
        </div>
        <div style={{ fontSize: 12, color: palette.mutedStrong, lineHeight: 1.45, marginBottom: 12 }}>
          Browser reminders work while the web app is open. Use the mobile apps for background reminders.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <button onClick={() => onReminder(8, 0)} style={reminderButtonStyle(ACCENT, palette.textInverse)}>Morning</button>
          <button onClick={() => onReminder(20, 0)} style={reminderButtonStyle(GOLD, palette.textInverse)}>Evening</button>
          <button onClick={onReminderOff} style={reminderButtonStyle(palette.cardBgStrong || palette.cardBg, palette.text)}>Off</button>
        </div>
        {reminderError && (
          <div style={{ marginTop: 10, color: '#ffb199', fontSize: 11, fontWeight: 700 }}>
            {reminderError}
          </div>
        )}
      </div>
    </>
  );
}

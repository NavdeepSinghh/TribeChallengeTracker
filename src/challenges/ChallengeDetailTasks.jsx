import { card } from './challengeTheme';

export default function ChallengeDetailTasks({ challenge }) {
  const isCustom = challenge.challengeKind === 'custom' || challenge.templateId === 'custom';
  const reminders = challenge.reminders || {};
  const community = challenge.community || {};

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 1, fontFamily: 'monospace', margin: '0 0 10px' }}>THE RULES</p>
        <div style={{ ...card, padding: '6px 18px' }}>
          {challenge.rules.map((rule, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 0', borderBottom: i < challenge.rules.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <span style={{ color: challenge.color, fontWeight: 700, fontSize: 14, flexShrink: 0, marginTop: 1 }}>
                {i + 1}.
              </span>
              <span style={{ fontSize: 13, color: '#ccc', lineHeight: 1.5 }}>{rule}</span>
            </div>
          ))}
        </div>
      </div>

      {challenge.tasks?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 1, fontFamily: 'monospace', margin: '0 0 10px' }}>
            {isCustom ? 'CHALLENGE TASKS' : 'DAILY TASKS'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {challenge.tasks.map(task => (
              <div key={task.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
                <span style={{ fontSize: 20 }}>{task.emoji}</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ fontSize: 13, color: '#ccc', fontWeight: 700 }}>{task.label}</span>
                  {isCustom && (
                    <p style={{ margin: '3px 0 0', color: '#666', fontSize: 11, fontFamily: 'monospace' }}>
                      {task.targetValue} {task.unit} · {task.frequency} · {task.points || 0} pts
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isCustom && (
        <div style={{ ...card, marginBottom: 16, border: '1px solid rgba(52,211,153,0.16)', background: 'rgba(52,211,153,0.045)' }}>
          <p style={{ margin: '0 0 8px', color: '#34D399', fontSize: 10, fontFamily: 'monospace', fontWeight: 900, letterSpacing: 1 }}>
            CHALLENGE SETTINGS
          </p>
          <p style={{ margin: '0 0 6px', color: '#bbb', fontSize: 12, lineHeight: 1.5 }}>
            {reminders.enabled
              ? `Members can get ${reminders.cadence || 'daily'} reminders around ${reminders.timeOfDay || '19:00'}.`
              : 'Scheduled reminders are off for this challenge.'}
          </p>
          <p style={{ margin: 0, color: '#777', fontSize: 12, lineHeight: 1.5 }}>
            {community.memberMessagesEnabled
              ? 'Announcements and member messages are enabled.'
              : 'Admin announcements are enabled; member chat is off.'}
          </p>
        </div>
      )}

      {challenge.dailyPrompts?.length > 0 && (
        <div style={{ ...card, marginBottom: 16, border: '1px solid rgba(167,139,250,0.22)', background: 'rgba(167,139,250,0.055)' }}>
          <p style={{ margin: '0 0 10px', fontSize: 10, color: '#A78BFA', fontFamily: 'monospace', fontWeight: 800, letterSpacing: 1 }}>
            PACK ACCOUNTABILITY PROMPTS
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {challenge.dailyPrompts.map((prompt, index) => (
              <div key={`${prompt}-${index}`} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: '#A78BFA', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }}>{String(index + 1).padStart(2, '0')}</span>
                <p style={{ margin: 0, color: '#bbb', fontSize: 12, lineHeight: 1.45 }}>{prompt}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

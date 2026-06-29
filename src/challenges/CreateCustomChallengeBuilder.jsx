import {
  CUSTOM_TASK_FREQUENCIES,
  CUSTOM_TASK_TYPES,
  createCustomTask,
} from './customChallengeModel';
import { card } from './challengeTheme';

const field = {
  width: '100%',
  padding: '11px 12px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)',
  color: '#fff',
  fontSize: 13,
  fontFamily: "'Space Grotesk', sans-serif",
  boxSizing: 'border-box',
  outline: 'none',
};

const label = {
  color: '#666',
  fontSize: 9,
  fontFamily: 'monospace',
  fontWeight: 800,
  letterSpacing: 1,
  margin: '0 0 6px',
};

function SmallLabel({ children }) {
  return <p style={label}>{children}</p>;
}

function updateTask(tasks, taskId, patch) {
  return tasks.map(task => (task.id === taskId ? { ...task, ...patch } : task));
}

export default function CreateCustomChallengeBuilder({
  customChallenge,
  setCustomChallenge,
}) {
  const tasks = customChallenge.tasks || [];
  const reminders = customChallenge.reminders || {};
  const community = customChallenge.community || {};

  const patchCustomChallenge = patch => setCustomChallenge(current => ({
    ...current,
    ...patch,
  }));

  const patchReminder = patch => setCustomChallenge(current => ({
    ...current,
    reminders: { ...current.reminders, ...patch },
  }));

  const patchCommunity = patch => setCustomChallenge(current => ({
    ...current,
    community: { ...current.community, ...patch },
  }));

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ ...card, marginBottom: 14, border: '1px solid rgba(167,139,250,0.22)', background: 'rgba(167,139,250,0.055)' }}>
        <p style={{ margin: '0 0 10px', color: '#A78BFA', fontSize: 10, fontFamily: 'monospace', fontWeight: 900, letterSpacing: 1 }}>
          CUSTOM CHALLENGE BASICS
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: 10, marginBottom: 10 }}>
          <div>
            <SmallLabel>EMOJI</SmallLabel>
            <input
              value={customChallenge.emoji}
              maxLength={4}
              onChange={event => patchCustomChallenge({ emoji: event.target.value })}
              style={field}
            />
          </div>
          <div>
            <SmallLabel>DAYS</SmallLabel>
            <input
              type="number"
              min="1"
              max="365"
              value={customChallenge.duration}
              onChange={event => patchCustomChallenge({ duration: event.target.value })}
              style={field}
            />
          </div>
        </div>
        <SmallLabel>DESCRIPTION MEMBERS WILL SEE</SmallLabel>
        <textarea
          value={customChallenge.description}
          onChange={event => patchCustomChallenge({ description: event.target.value })}
          rows={3}
          style={{ ...field, resize: 'vertical', lineHeight: 1.4 }}
        />
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div>
            <p style={{ margin: '0 0 3px', color: '#fff', fontWeight: 900, fontSize: 15 }}>Tasks</p>
            <p style={{ margin: 0, color: '#666', fontSize: 11 }}>Each task becomes part of the challenge rules and daily logging expectation.</p>
          </div>
          <button
            type="button"
            onClick={() => patchCustomChallenge({ tasks: [...tasks, createCustomTask(tasks.length)] })}
            style={{
              border: '1px solid rgba(255,107,53,0.35)',
              background: 'rgba(255,107,53,0.1)',
              color: '#FF6B35',
              borderRadius: 10,
              padding: '8px 10px',
              fontWeight: 900,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            + Task
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tasks.map((task, index) => (
            <div key={task.id} style={{ ...card, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                <p style={{ margin: 0, color: '#777', fontSize: 10, fontFamily: 'monospace', fontWeight: 900 }}>
                  TASK {index + 1}
                </p>
                {tasks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => patchCustomChallenge({ tasks: tasks.filter(item => item.id !== task.id) })}
                    style={{ border: 0, background: 'transparent', color: '#F87171', cursor: 'pointer', fontWeight: 800 }}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 10, marginBottom: 10 }}>
                <div>
                  <SmallLabel>EMOJI</SmallLabel>
                  <input
                    value={task.emoji}
                    maxLength={4}
                    onChange={event => patchCustomChallenge({ tasks: updateTask(tasks, task.id, { emoji: event.target.value }) })}
                    style={field}
                  />
                </div>
                <div>
                  <SmallLabel>TASK NAME</SmallLabel>
                  <input
                    value={task.label}
                    onChange={event => patchCustomChallenge({ tasks: updateTask(tasks, task.id, { label: event.target.value }) })}
                    style={field}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div>
                  <SmallLabel>TYPE</SmallLabel>
                  <select
                    value={task.type}
                    onChange={event => {
                      const type = CUSTOM_TASK_TYPES.find(option => option.id === event.target.value);
                      patchCustomChallenge({
                        tasks: updateTask(tasks, task.id, {
                          type: event.target.value,
                          unit: type?.unit || task.unit,
                          emoji: task.emoji || type?.emoji || '✅',
                        }),
                      });
                    }}
                    style={field}
                  >
                    {CUSTOM_TASK_TYPES.map(option => (
                      <option key={option.id} value={option.id}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <SmallLabel>FREQUENCY</SmallLabel>
                  <select
                    value={task.frequency}
                    onChange={event => patchCustomChallenge({ tasks: updateTask(tasks, task.id, { frequency: event.target.value }) })}
                    style={field}
                  >
                    {CUSTOM_TASK_FREQUENCIES.map(option => (
                      <option key={option.id} value={option.id}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div>
                  <SmallLabel>TARGET</SmallLabel>
                  <input
                    type="number"
                    min="0"
                    value={task.targetValue}
                    onChange={event => patchCustomChallenge({ tasks: updateTask(tasks, task.id, { targetValue: event.target.value }) })}
                    style={field}
                  />
                </div>
                <div>
                  <SmallLabel>UNIT</SmallLabel>
                  <input
                    value={task.unit}
                    onChange={event => patchCustomChallenge({ tasks: updateTask(tasks, task.id, { unit: event.target.value }) })}
                    style={field}
                  />
                </div>
                <div>
                  <SmallLabel>PTS</SmallLabel>
                  <input
                    type="number"
                    min="0"
                    value={task.points}
                    onChange={event => patchCustomChallenge({ tasks: updateTask(tasks, task.id, { points: event.target.value }) })}
                    style={field}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...card, marginBottom: 14 }}>
        <p style={{ margin: '0 0 10px', color: '#fff', fontWeight: 900, fontSize: 15 }}>Scheduled Reminders</p>
        <label style={{ display: 'flex', gap: 10, alignItems: 'center', color: '#ccc', fontSize: 13, marginBottom: 12 }}>
          <input
            type="checkbox"
            checked={reminders.enabled !== false}
            onChange={event => patchReminder({ enabled: event.target.checked })}
          />
          Remind members to log progress
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, opacity: reminders.enabled === false ? 0.45 : 1 }}>
          <div>
            <SmallLabel>TIME</SmallLabel>
            <input
              type="time"
              value={reminders.timeOfDay || '19:00'}
              disabled={reminders.enabled === false}
              onChange={event => patchReminder({ timeOfDay: event.target.value })}
              style={field}
            />
          </div>
          <div>
            <SmallLabel>CADENCE</SmallLabel>
            <select
              value={reminders.cadence || 'daily'}
              disabled={reminders.enabled === false}
              onChange={event => patchReminder({ cadence: event.target.value })}
              style={field}
            >
              <option value="daily">Daily</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>
        <label style={{ display: 'flex', gap: 10, alignItems: 'center', color: '#888', fontSize: 12, marginTop: 12 }}>
          <input
            type="checkbox"
            checked={reminders.onlyIfNotLogged !== false}
            disabled={reminders.enabled === false}
            onChange={event => patchReminder({ onlyIfNotLogged: event.target.checked })}
          />
          Only nudge members who have not logged yet
        </label>
      </div>

      <div style={{ ...card }}>
        <p style={{ margin: '0 0 10px', color: '#fff', fontWeight: 900, fontSize: 15 }}>Community</p>
        <label style={{ display: 'flex', gap: 10, alignItems: 'center', color: '#ccc', fontSize: 13, marginBottom: 10 }}>
          <input
            type="checkbox"
            checked={community.announcementsEnabled !== false}
            onChange={event => patchCommunity({ announcementsEnabled: event.target.checked })}
          />
          Admin announcements
        </label>
        <label style={{ display: 'flex', gap: 10, alignItems: 'center', color: '#ccc', fontSize: 13 }}>
          <input
            type="checkbox"
            checked={community.memberMessagesEnabled !== false}
            onChange={event => patchCommunity({ memberMessagesEnabled: event.target.checked })}
          />
          Member messages
        </label>
      </div>
    </div>
  );
}

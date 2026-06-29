export const CUSTOM_TASK_TYPES = [
  { id: 'steps', label: 'Steps', unit: 'steps', emoji: '👟' },
  { id: 'distance', label: 'Distance', unit: 'km', emoji: '🏃' },
  { id: 'minutes', label: 'Minutes', unit: 'min', emoji: '⏱️' },
  { id: 'sessions', label: 'Sessions', unit: 'sessions', emoji: '💪' },
  { id: 'water', label: 'Water', unit: 'L', emoji: '💧' },
  { id: 'custom', label: 'Custom', unit: 'done', emoji: '✅' },
];

export const CUSTOM_TASK_FREQUENCIES = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'total', label: 'Challenge total' },
];

export const DEFAULT_CUSTOM_CHALLENGE_TASKS = [
  {
    id: 'custom_steps',
    label: 'Walk 8,000 steps',
    emoji: '👟',
    type: 'steps',
    targetValue: 8000,
    unit: 'steps',
    frequency: 'daily',
    points: 30,
    required: true,
  },
  {
    id: 'custom_workout',
    label: 'Complete a workout',
    emoji: '💪',
    type: 'sessions',
    targetValue: 1,
    unit: 'session',
    frequency: 'daily',
    points: 40,
    required: true,
  },
];

export const DEFAULT_REMINDER_SETTINGS = {
  enabled: true,
  cadence: 'daily',
  timeOfDay: '19:00',
  onlyIfNotLogged: true,
};

export const DEFAULT_COMMUNITY_SETTINGS = {
  announcementsEnabled: true,
  memberMessagesEnabled: true,
};

function cleanText(value, fallback, max = 80) {
  const cleaned = String(value || '').trim().replace(/\s+/g, ' ').slice(0, max);
  return cleaned || fallback;
}

function numberInRange(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

export function createCustomTask(index = 0) {
  return {
    id: `custom_task_${Date.now()}_${index}`,
    label: 'New task',
    emoji: '✅',
    type: 'custom',
    targetValue: 1,
    unit: 'done',
    frequency: 'daily',
    points: 20,
    required: true,
  };
}

export function normalizeCustomTask(task = {}, index = 0) {
  const type = CUSTOM_TASK_TYPES.some(option => option.id === task.type) ? task.type : 'custom';
  const typeConfig = CUSTOM_TASK_TYPES.find(option => option.id === type) || CUSTOM_TASK_TYPES[CUSTOM_TASK_TYPES.length - 1];
  const frequency = CUSTOM_TASK_FREQUENCIES.some(option => option.id === task.frequency) ? task.frequency : 'daily';
  return {
    id: cleanText(task.id, `custom_task_${index + 1}`, 48),
    label: cleanText(task.label || task.title, `${typeConfig.label} task`, 80),
    title: cleanText(task.label || task.title, `${typeConfig.label} task`, 80),
    emoji: cleanText(task.emoji, typeConfig.emoji, 4),
    type,
    targetValue: numberInRange(task.targetValue, 1, 0.1, 100000),
    unit: cleanText(task.unit, typeConfig.unit, 16),
    frequency,
    points: Math.round(numberInRange(task.points, 20, 0, 500)),
    required: task.required !== false,
  };
}

export function normalizeCustomChallengeSettings(settings = {}) {
  const tasks = (Array.isArray(settings.tasks) && settings.tasks.length
    ? settings.tasks
    : DEFAULT_CUSTOM_CHALLENGE_TASKS
  ).map(normalizeCustomTask);

  const reminders = {
    ...DEFAULT_REMINDER_SETTINGS,
    ...(settings.reminders || {}),
    enabled: settings.reminders?.enabled !== false,
    onlyIfNotLogged: settings.reminders?.onlyIfNotLogged !== false,
  };

  const community = {
    ...DEFAULT_COMMUNITY_SETTINGS,
    ...(settings.community || {}),
    announcementsEnabled: settings.community?.announcementsEnabled !== false,
    memberMessagesEnabled: settings.community?.memberMessagesEnabled !== false,
  };

  return {
    description: cleanText(settings.description, 'A custom accountability challenge built by the creator.', 180),
    duration: Math.round(numberInRange(settings.duration, 30, 1, 365)),
    emoji: cleanText(settings.emoji, '🎯', 4),
    color: cleanText(settings.color, '#A78BFA', 16),
    tasks,
    reminders,
    community,
  };
}

export function buildCustomChallengeRules(tasks = []) {
  return tasks.map(task => {
    const target = Number.isInteger(task.targetValue)
      ? String(task.targetValue)
      : String(Number(task.targetValue).toFixed(1)).replace(/\.0$/, '');
    const cadence = task.frequency === 'total'
      ? 'during the challenge'
      : task.frequency;
    return `${task.emoji} ${task.label}: ${target} ${task.unit} ${cadence} for ${task.points} pts.`;
  });
}

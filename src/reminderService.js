const REMINDER_HOUR_KEY = 'dailyReminderHour';
const REMINDER_MINUTE_KEY = 'dailyReminderMinute';

let reminderTimer = null;

export function getDailyReminderLabel() {
  const hour = localStorage.getItem(REMINDER_HOUR_KEY);
  const minute = localStorage.getItem(REMINDER_MINUTE_KEY) || '0';
  if (hour === null) return 'Off';
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export async function setDailyReminder(hour, minute) {
  if (!('Notification' in window)) {
    throw new Error('Browser notifications are not available on this device.');
  }
  if (Notification.permission !== 'granted') {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission is required for reminders.');
    }
  }
  localStorage.setItem(REMINDER_HOUR_KEY, String(hour));
  localStorage.setItem(REMINDER_MINUTE_KEY, String(minute));
  startDailyReminderLoop();
  return getDailyReminderLabel();
}

export function cancelDailyReminder() {
  localStorage.removeItem(REMINDER_HOUR_KEY);
  localStorage.removeItem(REMINDER_MINUTE_KEY);
  if (reminderTimer) clearTimeout(reminderTimer);
  reminderTimer = null;
}

export function startDailyReminderLoop() {
  if (reminderTimer) clearTimeout(reminderTimer);
  const hour = localStorage.getItem(REMINDER_HOUR_KEY);
  const minute = localStorage.getItem(REMINDER_MINUTE_KEY);
  if (hour === null || !('Notification' in window) || Notification.permission !== 'granted') return;

  const now = new Date();
  const next = new Date();
  next.setHours(Number(hour), Number(minute || 0), 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  reminderTimer = window.setTimeout(() => {
    new Notification("Log today's progress", {
      body: 'Add your activity and keep your streak alive.',
      tag: 'daily-log-reminder',
    });
    startDailyReminderLoop();
  }, next.getTime() - now.getTime());
}

export const localDateStr = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const todayStr = () => localDateStr();

export function dayNumber(challengeStartDate) {
  const [y, mo, d] = challengeStartDate.split('-').map(Number);
  const start = new Date(y, mo - 1, d);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.max(1, Math.floor((now - start) / 86400000) + 1);
}

export function buildCalendarDays(challenge, progress) {
  const [y, mo, d] = challenge.startDate.split('-').map(Number);
  const today = todayStr();
  return Array.from({ length: challenge.duration }, (_, i) => {
    const date = new Date(y, mo - 1, d + i);
    const dateStr = localDateStr(date);
    return {
      dateStr,
      dayNum: i + 1,
      log: progress[dateStr] || null,
      isToday: dateStr === today,
      isPast: dateStr < today,
    };
  });
}

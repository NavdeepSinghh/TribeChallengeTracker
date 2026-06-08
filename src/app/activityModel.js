export const ACTIVITY_TYPES = [
  { id: "run",   label: "Run",       icon: "🏃", unit: "km",  color: "#34D399" },
  { id: "yoga",  label: "Yoga",      icon: "🧘", unit: "min", color: "#A78BFA" },
  { id: "gym",   label: "Gym",       icon: "💪", unit: "min", color: "#F59E0B" },
  { id: "cycle", label: "Cycle",     icon: "🚴", unit: "km",  color: "#60A5FA" },
  { id: "swim",  label: "Swim",      icon: "🏊", unit: "min", color: "#38BDF8" },
  { id: "walk",  label: "Walk",      icon: "🚶", unit: "km",  color: "#4ADE80" },
];

export const SHARE_TEMPLATES = [
  { id: "classic", label: "Classic", pro: false },
  { id: "gold", label: "Gold", pro: true },
  { id: "neon", label: "Neon", pro: true },
];

export const today = new Date();

export const formatDate = (d) => d.toISOString().split("T")[0];

export const getEntryActivities = (entry) =>
  entry?.activities ?? (entry?.type ? [entry] : []);

export const getStreak = (history) => {
  let streak = 0;
  let d = new Date(today);
  while (true) {
    const entry = history[formatDate(d)];
    const hasActivity = entry?.activities ? entry.activities.length > 0 : !!entry?.type;
    if (hasActivity) streak++;
    else break;
    d.setDate(d.getDate() - 1);
  }
  return streak;
};

export const getCalendarDays = (history) => {
  const days = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = formatDate(d);
    days.push({
      date: key,
      day: d.getDate(),
      weekday: d.toLocaleDateString("en", { weekday: "short" }),
      activity: history[key] || null,
    });
  }
  return days;
};

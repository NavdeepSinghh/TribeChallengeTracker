const numberFormatter = new Intl.NumberFormat('en', { maximumFractionDigits: 1 });

function taskText(task = {}) {
  return `${task.id || ''} ${task.label || ''} ${task.emoji || ''}`.toLowerCase();
}

function completedTaskCounts(tasks = [], progress = {}) {
  const counts = new Map(tasks.map(task => [task.id, 0]));
  Object.values(progress || {}).forEach(log => {
    (log?.completedTasks || []).forEach(taskId => {
      counts.set(taskId, (counts.get(taskId) || 0) + 1);
    });
  });
  return counts;
}

function parseMeasurement(text, units) {
  const pattern = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(k)?\\+?\\s*(${units.join('|')})\\b`, 'i');
  const match = text.match(pattern);
  if (!match) return 0;
  const value = Number(match[1]);
  if (!Number.isFinite(value)) return 0;
  return match[2] ? value * 1000 : value;
}

function parseMinutes(text) {
  const hours = parseMeasurement(text, ['hours?', 'hrs?', 'h']);
  if (hours > 0) return hours * 60;
  return parseMeasurement(text, ['minutes?', 'mins?', 'min', 'm']);
}

function parseLitres(text) {
  const gallons = parseMeasurement(text, ['gallons?', 'gal']);
  if (gallons > 0) return gallons * 3.785;
  const ml = parseMeasurement(text, ['millilitres?', 'milliliters?', 'ml']);
  if (ml > 0) return ml / 1000;
  return parseMeasurement(text, ['litres?', 'liters?', 'l']);
}

function parseDistanceKm(text) {
  const metres = parseMeasurement(text, ['metres?', 'meters?', 'm']);
  if (metres > 0 && !/\bmin(?:ute)?s?\b/i.test(text)) return metres / 1000;
  return parseMeasurement(text, ['kilometres?', 'kilometers?', 'kms?', 'km']);
}

function parseSteps(text) {
  return parseMeasurement(text, ['steps?', 'step']);
}

function formatValue(value, suffix = '') {
  if (!Number.isFinite(value)) return `0${suffix}`;
  if (Math.abs(value) >= 1000) {
    const compact = value >= 1000000
      ? `${numberFormatter.format(value / 1000000)}M`
      : `${numberFormatter.format(value / 1000)}k`;
    return `${compact}${suffix}`;
  }
  return `${numberFormatter.format(value)}${suffix}`;
}

function addMetric(metrics, metric) {
  if (!metric || !metric.value) return;
  metrics.push(metric);
}

export function buildChallengePulse({ challenge = {}, tasks = [], progress = {}, memberData = null } = {}) {
  const effectiveTasks = tasks.length ? tasks : challenge.tasks || [];
  const taskCounts = completedTaskCounts(effectiveTasks, progress);
  const totalPoints = Object.values(progress || {}).reduce((sum, log) => sum + (Number(log?.points) || 0), 0);
  const completedDays = Object.values(progress || {}).filter(log => log?.allComplete).length || Number(memberData?.daysCompleted) || 0;
  const taskCompletions = Array.from(taskCounts.values()).reduce((sum, count) => sum + count, 0);

  let waterLitres = 0;
  let hydrationChecks = 0;
  let steps = 0;
  let stepDays = 0;
  let workoutMinutes = 0;
  let movementSessions = 0;
  let distanceKm = 0;
  let checkIns = 0;

  effectiveTasks.forEach(task => {
    const count = taskCounts.get(task.id) || 0;
    if (!count) return;
    const text = taskText(task);
    const litres = parseLitres(text);
    const taskSteps = parseSteps(text);
    const minutes = parseMinutes(text);
    const km = parseDistanceKm(text);
    const isHydration = /water|hydration|drink/.test(text);
    const isMovement = /workout|training|movement|move|run|walk|cycle|bike|swim|gym|yoga|activity|session|outdoor/.test(text);
    const isStep = /steps?|walk/.test(text);
    const isCheckIn = /check.?in|logged|log|proof|share|support|note|reflection|photo|reading|diet|nutrition|recovery|meditat|habit/.test(text);

    if (isHydration) {
      if (litres > 0) waterLitres += litres * count;
      else hydrationChecks += count;
    }
    if (isStep) {
      if (taskSteps > 0) steps += taskSteps * count;
      else stepDays += count;
    }
    if (isMovement) {
      if (minutes > 0) workoutMinutes += minutes * count;
      else movementSessions += count;
      if (km > 0) distanceKm += km * count;
    }
    if (isCheckIn) checkIns += count;
  });

  const primaryMetrics = [];
  addMetric(primaryMetrics, workoutMinutes > 0
    ? { icon: '⏱️', label: 'WORKOUT', value: formatValue(workoutMinutes / 60, 'h'), caption: 'from challenge tasks' }
    : movementSessions > 0
      ? { icon: '💪', label: 'SESSIONS', value: String(movementSessions), caption: 'movement check-ins' }
      : null);
  addMetric(primaryMetrics, distanceKm > 0 ? { icon: '📍', label: 'DISTANCE', value: formatValue(distanceKm, ' km'), caption: 'challenge distance' } : null);
  addMetric(primaryMetrics, steps > 0
    ? { icon: '👟', label: 'STEPS', value: formatValue(steps), caption: 'from step tasks' }
    : stepDays > 0
      ? { icon: '👟', label: 'STEP DAYS', value: String(stepDays), caption: 'walk/step check-ins' }
      : null);
  addMetric(primaryMetrics, waterLitres > 0
    ? { icon: '💧', label: 'WATER', value: formatValue(waterLitres, ' L'), caption: 'hydration total' }
    : hydrationChecks > 0
      ? { icon: '💧', label: 'HYDRATION', value: String(hydrationChecks), caption: 'water check-ins' }
      : null);
  addMetric(primaryMetrics, totalPoints > 0 ? { icon: '⭐', label: 'CHALLENGE PTS', value: String(totalPoints), caption: 'earned here' } : null);
  addMetric(primaryMetrics, completedDays > 0 ? { icon: '✅', label: 'FULL DAYS', value: String(completedDays), caption: 'all tasks done' } : null);
  addMetric(primaryMetrics, checkIns > 0 ? { icon: '📌', label: 'CHECK-INS', value: String(checkIns), caption: 'supporting habits' } : null);
  addMetric(primaryMetrics, taskCompletions > 0 ? { icon: '🎯', label: 'TASKS', value: String(taskCompletions), caption: 'total completions' } : null);

  const focus = [];
  effectiveTasks.forEach(task => {
    const text = taskText(task);
    if (/water|hydration|drink/.test(text) && !focus.includes('water')) focus.push('water');
    if (/steps?|walk/.test(text) && !focus.includes('steps')) focus.push('steps');
    if (/workout|training|movement|move|run|cycle|bike|swim|gym|yoga|activity|session/.test(text) && !focus.includes('movement')) focus.push('movement');
    if (/check.?in|logged|proof|share|support|note|reflection|photo|reading|diet|nutrition|recovery|meditat|habit/.test(text) && !focus.includes('check-ins')) focus.push('check-ins');
  });

  return {
    metrics: primaryMetrics.slice(0, 4),
    focus,
    hasLogs: taskCompletions > 0 || totalPoints > 0,
  };
}

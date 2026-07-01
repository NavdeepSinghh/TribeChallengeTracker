const fs = require('fs');
const path = require('path');

const {
  validateCueCoverage,
  validateCueRecord,
} = require('./apply-workout-coaching-cues');

const SEED_FILES = [
  'workout-exercise-seed-batch-1.json',
  'workout-exercise-seed-batch-2.json',
  'workout-exercise-seed-batch-3.json',
  'workout-exercise-seed-batch-4.json',
  'workout-exercise-seed-batch-5.json',
];

const PILOT_FILE = 'workout-coaching-cues-pilot.json';
const OUTPUT_FILE = 'workout-coaching-cues-full-draft.json';

function readJson(fileName) {
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, fileName), 'utf8'));
}

function loadOfficialExerciseSeed() {
  return SEED_FILES.flatMap(readJson);
}

function slugLabel(value) {
  return String(value || '').replace(/_/g, ' ');
}

function primary(exercise, fallback = 'target muscles') {
  return (exercise.primaryMuscles && exercise.primaryMuscles[0]) || fallback;
}

function secondary(exercise, fallback = 'core') {
  return (exercise.secondaryMuscles && exercise.secondaryMuscles[0]) || fallback;
}

function focus(exercise, extras = []) {
  const muscles = [...new Set([
    ...(exercise.primaryMuscles || []),
    ...extras,
  ])].filter((muscle) => /^[a-z0-9_]{2,60}$/.test(String(muscle || '')));
  return muscles.slice(0, 3);
}

function cue(id, phase, title, body, startPercent, endPercent, focusMuscles, view = 'front') {
  return {
    id,
    phase,
    title,
    body,
    startPercent,
    endPercent,
    focusMuscles,
    view,
  };
}

function setupCue(exercise, body, view = 'front') {
  return cue('setup', 'setup', 'Set the base first', body, 0, 18, focus(exercise, ['core']), view);
}

function returnCue(exercise, body, view = 'front') {
  return cue('return', 'return', 'Control the reset', body, 73, 100, focus(exercise, [secondary(exercise)]), view);
}

function pressCues(exercise) {
  return [
    setupCue(exercise, `Set your grip and brace before the first rep. Keep ${slugLabel(primary(exercise))} ready to do the work.`),
    cue('lower', 'lowering', 'Lower with control', 'Let the weight travel in a steady path. Keep shoulders packed and ribs quiet.', 19, 55, focus(exercise, ['front_delts']), 'side'),
    cue('press', 'pressing', 'Drive smoothly', 'Press without bouncing or twisting. Finish with strong arms and a steady torso.', 56, 78, focus(exercise, ['triceps']), 'front'),
    returnCue(exercise, 'Reset at the top before the next rep. Keep tension instead of rushing into the next descent.', 'front'),
  ];
}

function flyCues(exercise) {
  return [
    setupCue(exercise, 'Set a small bend in the elbows and keep shoulder blades settled before opening the arms.', 'front'),
    cue('open', 'lowering', 'Open wide, stay controlled', 'Move through the chest with a smooth arc. Stop before the shoulders roll forward.', 19, 56, focus(exercise, ['front_delts']), 'front'),
    cue('squeeze', 'lifting', 'Bring the arms together', 'Think about hugging the space in front of you. Keep the elbows softly bent.', 57, 82, focus(exercise), 'front'),
    returnCue(exercise, 'Pause with control, then open again without letting the weights pull you out of position.', 'front'),
  ];
}

function lateralRaiseCues(exercise) {
  return [
    setupCue(exercise, 'Stand tall with dumbbells by your sides. Keep ribs down and shoulders relaxed.', 'front'),
    cue('raise', 'lifting', 'Lead with elbows', 'Raise arms out to the sides with control. Keep wrists and elbows moving together.', 19, 58, focus(exercise, ['upper_traps']), 'front'),
    cue('top', 'top', 'Pause at shoulder height', 'Hold the top briefly without shrugging hard or swinging the torso.', 59, 74, focus(exercise), 'front'),
    returnCue(exercise, 'Lower slowly until arms return to the sides. Keep tension through the last few inches.', 'front'),
  ];
}

function tricepsCues(exercise) {
  return [
    setupCue(exercise, 'Set elbows near your ribs and stand tall. Keep shoulders quiet before pressing down.', 'front'),
    cue('press', 'pressing', 'Extend from the elbows', 'Press the handle down by straightening the arms. Avoid leaning your body into the rep.', 19, 58, focus(exercise, ['forearms']), 'side'),
    cue('finish', 'finish', 'Lock in the squeeze', 'Finish with arms long and triceps tight. Keep wrists stacked and neck relaxed.', 59, 76, focus(exercise), 'front'),
    returnCue(exercise, 'Let the handle rise under control. Keep elbows in place for the next rep.', 'side'),
  ];
}

function dipCues(exercise) {
  return [
    setupCue(exercise, 'Hands secure on the bench, chest tall, feet planted. Start with elbows softly bent.', 'side'),
    cue('lower', 'lowering', 'Bend elbows back', 'Lower with the upper arms moving behind you. Keep the chest open and shoulders controlled.', 19, 56, focus(exercise, ['front_delts']), 'side'),
    cue('press', 'pressing', 'Press through the hands', 'Drive up by extending the elbows. Keep hips close to the bench.', 57, 82, focus(exercise, ['chest']), 'side'),
    returnCue(exercise, 'Reset at the top with steady shoulders before the next rep.', 'front'),
  ];
}

function verticalPullCues(exercise) {
  return [
    setupCue(exercise, 'Brace lightly and reach tall. Let the shoulders lengthen without losing control.', 'front'),
    cue('pull', 'pulling', 'Elbows drive down', 'Start the pull by moving elbows toward the ribs. Keep chest lifted and neck relaxed.', 19, 55, focus(exercise, ['biceps']), 'back'),
    cue('finish', 'finish', 'Finish strong, no swing', 'Pause when the pull is complete. Keep the torso steady instead of turning it into a lean.', 56, 74, focus(exercise, ['rhomboids']), 'front'),
    returnCue(exercise, 'Reach back to the start with control so the lats lengthen before the next rep.', 'back'),
  ];
}

function rowCues(exercise) {
  return [
    setupCue(exercise, 'Brace the torso and set the shoulders before the first pull. Keep the neck long.', 'side'),
    cue('pull', 'pulling', 'Row elbows back', 'Pull elbows toward the hips or ribs. Keep the weight close and avoid twisting.', 19, 55, focus(exercise, ['biceps']), 'back'),
    cue('squeeze', 'finish', 'Squeeze the upper back', 'Pause with shoulder blades moving together. Keep ribs from flaring up.', 56, 74, focus(exercise, ['rear_delts']), 'back'),
    returnCue(exercise, 'Reach forward under control. Keep the spine position steady for the next rep.', 'side'),
  ];
}

function rearDeltCues(exercise) {
  return [
    setupCue(exercise, 'Set a steady torso and soft elbows. Start with shoulders relaxed, not shrugged.', 'front'),
    cue('open', 'lifting', 'Open from the shoulders', 'Move the arms apart with control. Let rear shoulders do the work, not momentum.', 19, 58, focus(exercise, ['rhomboids']), 'back'),
    cue('top', 'top', 'Hold the wide position', 'Pause briefly with arms wide and shoulder blades controlled.', 59, 74, focus(exercise), 'back'),
    returnCue(exercise, 'Return slowly and keep tension instead of letting the weight snap back.', 'front'),
  ];
}

function curlCues(exercise) {
  return [
    setupCue(exercise, 'Stand tall and keep elbows close to your sides before the first curl.', 'front'),
    cue('curl', 'lifting', 'Bend elbows, stay still', 'Curl the weight without swinging. Keep shoulders relaxed and upper arms quiet.', 19, 55, focus(exercise, ['forearms']), 'front'),
    cue('top', 'top', 'Squeeze at the top', 'Pause briefly with forearms high. Keep elbows from drifting forward.', 56, 72, focus(exercise), 'side'),
    returnCue(exercise, 'Lower slowly until arms are long again. Keep control through the whole range.', 'front'),
  ];
}

function squatCues(exercise) {
  return [
    setupCue(exercise, 'Feet planted, ribs stacked, brace lightly before the first rep.', 'front'),
    cue('descend', 'lowering', 'Sit down with control', 'Send hips down and let knees track with toes. Keep pressure through the mid-foot.', 19, 55, focus(exercise, ['core']), 'side'),
    cue('bottom', 'bottom', 'Stay strong at depth', 'Keep the torso organized and heels grounded before driving up.', 56, 72, focus(exercise, [secondary(exercise)]), 'side'),
    cue('stand', 'lifting', 'Drive the floor away', 'Stand tall without letting knees collapse inward or the weight drift forward.', 73, 100, focus(exercise), 'front'),
  ];
}

function hingeCues(exercise) {
  return [
    setupCue(exercise, 'Start tall with ribs stacked and a small knee bend. Keep the load close.', 'side'),
    cue('hinge', 'lowering', 'Push hips back', 'Hinge from the hips while the torso follows. Keep the weight close to the body.', 19, 56, focus(exercise, ['lower_back']), 'side'),
    cue('loaded', 'bottom', 'Find the loaded position', `Pause when ${slugLabel(primary(exercise))} feel ready to work and the spine stays long.`, 57, 72, focus(exercise), 'side'),
    cue('stand', 'lifting', 'Drive hips through', 'Stand by bringing hips forward. Finish tall without leaning back.', 73, 100, focus(exercise, [secondary(exercise)]), 'side'),
  ];
}

function calfRaiseCues(exercise) {
  return [
    setupCue(exercise, 'Stand tall with feet planted and balance steady before lifting the heels.', 'front'),
    cue('lift', 'lifting', 'Rise onto the toes', 'Lift heels smoothly and keep ankles tracking straight.', 19, 58, focus(exercise), 'front'),
    cue('top', 'top', 'Pause high', 'Hold the top briefly with control instead of bouncing.', 59, 74, focus(exercise), 'front'),
    returnCue(exercise, 'Lower heels slowly until the calves lengthen again.', 'side'),
  ];
}

function legIsolationCues(exercise, mode) {
  const isCurl = mode === 'curl';
  return [
    setupCue(exercise, 'Set the machine position and keep hips anchored before the first rep.', 'side'),
    cue('move', isCurl ? 'curling' : 'extending', isCurl ? 'Curl the pad back' : 'Extend the knees', isCurl ? 'Bend the knees smoothly and keep the upper body still.' : 'Straighten the legs smoothly without kicking or bouncing.', 19, 58, focus(exercise), 'side'),
    cue('squeeze', 'finish', 'Pause with control', 'Hold the finish briefly so the target muscles do the work.', 59, 74, focus(exercise), 'front'),
    returnCue(exercise, 'Return slowly and keep the machine path steady.', 'side'),
  ];
}

function plankCues(exercise, side = false) {
  return [
    setupCue(exercise, side ? 'Stack elbow under shoulder and line up ankles, hips, and ribs.' : 'Set elbows under shoulders and create one long line from head to heels.', side ? 'side' : 'front'),
    cue('brace', 'hold', 'Brace and breathe', 'Keep steady tension while taking controlled breaths. Do not rush the hold.', 19, 48, focus(exercise, ['shoulders']), side ? 'side' : 'front'),
    cue('align', 'hold', side ? 'Keep hips lifted' : 'Keep hips level', side ? 'Hold the side line without rotating forward or backward.' : 'Keep hips from hiking up or dropping down.', 49, 76, focus(exercise, ['glutes']), side ? 'side' : 'side'),
    cue('finish', 'finish', 'Finish with control', 'End the set by lowering with control and keeping position until the last second.', 77, 100, focus(exercise), side ? 'side' : 'front'),
  ];
}

function coreMoveCues(exercise) {
  return [
    setupCue(exercise, 'Set ribs down and brace lightly before the first rep.', 'front'),
    cue('move', 'working', 'Move with control', 'Let the target muscles guide the motion. Keep the lower back and hips steady.', 19, 56, focus(exercise, ['hip_flexors']), 'front'),
    cue('peak', 'finish', 'Own the finish', 'Pause briefly at the hardest point without rushing or swinging.', 57, 74, focus(exercise), 'front'),
    returnCue(exercise, 'Return to the start slowly and keep tension ready for the next rep.', 'front'),
  ];
}

function cardioCues(exercise) {
  return [
    setupCue(exercise, 'Set posture and rhythm before increasing effort. Keep breathing steady.', 'side'),
    cue('drive', 'working', 'Find a smooth rhythm', 'Move with repeatable steps or strokes. Keep effort steady instead of jerky.', 19, 56, focus(exercise, [secondary(exercise)]), 'side'),
    cue('posture', 'working', 'Hold posture under effort', 'Stay tall through the torso and keep shoulders relaxed as the pace continues.', 57, 78, focus(exercise, ['core']), 'front'),
    returnCue(exercise, 'Ease back with control and keep movement smooth through the final seconds.', 'side'),
  ];
}

function mobilityCues(exercise) {
  return [
    setupCue(exercise, 'Move into the starting position slowly and keep breathing calm.', 'side'),
    cue('enter', 'moving', 'Ease into range', 'Move gradually until the target area feels loaded, not forced.', 19, 48, focus(exercise, [secondary(exercise)]), 'side'),
    cue('hold', 'hold', 'Breathe in the position', 'Stay relaxed enough to breathe while keeping the position organized.', 49, 78, focus(exercise), 'side'),
    returnCue(exercise, 'Come out of the position slowly and reset before repeating.', 'side'),
  ];
}

function generateCueRecord(exercise) {
  let coachingCues;

  if (exercise.id === 'dumbbell_chest_fly') coachingCues = flyCues(exercise);
  else if (exercise.id === 'lateral_raise') coachingCues = lateralRaiseCues(exercise);
  else if (exercise.id === 'triceps_pushdown') coachingCues = tricepsCues(exercise);
  else if (exercise.id === 'bench_dip') coachingCues = dipCues(exercise);
  else if (['lat_pulldown', 'pull_up', 'assisted_pull_up'].includes(exercise.id)) coachingCues = verticalPullCues(exercise);
  else if (['seated_cable_row', 'one_arm_dumbbell_row', 'barbell_bent_over_row'].includes(exercise.id)) coachingCues = rowCues(exercise);
  else if (['face_pull', 'rear_delt_fly'].includes(exercise.id)) coachingCues = rearDeltCues(exercise);
  else if (['dumbbell_biceps_curl', 'hammer_curl'].includes(exercise.id)) coachingCues = curlCues(exercise);
  else if (exercise.id === 'standing_calf_raise') coachingCues = calfRaiseCues(exercise);
  else if (exercise.id === 'leg_extension') coachingCues = legIsolationCues(exercise, 'extension');
  else if (exercise.id === 'seated_leg_curl') coachingCues = legIsolationCues(exercise, 'curl');
  else if (exercise.movementPattern === 'push') coachingCues = pressCues(exercise);
  else if (exercise.movementPattern === 'squat') coachingCues = squatCues(exercise);
  else if (exercise.movementPattern === 'hinge') coachingCues = hingeCues(exercise);
  else if (exercise.id === 'plank') coachingCues = plankCues(exercise);
  else if (exercise.id === 'side_plank') coachingCues = plankCues(exercise, true);
  else if (exercise.movementPattern === 'core') coachingCues = coreMoveCues(exercise);
  else if (exercise.movementPattern === 'cardio') coachingCues = cardioCues(exercise);
  else if (exercise.movementPattern === 'mobility') coachingCues = mobilityCues(exercise);
  else coachingCues = coreMoveCues(exercise);

  return validateCueRecord({ id: exercise.id, coachingCues });
}

function main() {
  const exercises = loadOfficialExerciseSeed();
  const pilot = readJson(PILOT_FILE).map(validateCueRecord);
  const pilotById = new Map(pilot.map((record) => [record.id, record]));
  const records = exercises.map((exercise) => pilotById.get(exercise.id) || generateCueRecord(exercise));

  validateCueCoverage(records, exercises);

  const outputPath = path.resolve(__dirname, OUTPUT_FILE);
  fs.writeFileSync(outputPath, `${JSON.stringify(records, null, 2)}\n`);
  console.log(`Generated ${records.length} coaching cue records at ${outputPath}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  generateCueRecord,
  loadOfficialExerciseSeed,
};

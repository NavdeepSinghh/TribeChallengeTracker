const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

const OUT_ROOT = path.resolve(__dirname, '../generated/workouts/exercises/v1');

const upperPush = [
  ['bench_press', 'bench-press', 'Bench Press', ['chest'], ['triceps', 'front_delts'], ['barbell', 'bench'], 'intermediate', 'push'],
  ['dumbbell_bench_press', 'dumbbell-bench-press', 'Dumbbell Bench Press', ['chest'], ['triceps', 'front_delts'], ['dumbbell', 'bench'], 'beginner', 'push'],
  ['incline_dumbbell_press', 'incline-dumbbell-press', 'Incline Dumbbell Press', ['upper_chest'], ['front_delts', 'triceps'], ['dumbbell', 'incline_bench'], 'intermediate', 'push'],
  ['push_up', 'push-up', 'Push-Up', ['chest'], ['triceps', 'front_delts', 'core'], ['bodyweight'], 'beginner', 'push'],
  ['machine_chest_press', 'machine-chest-press', 'Machine Chest Press', ['chest'], ['triceps', 'front_delts'], ['machine'], 'beginner', 'push'],
  ['dumbbell_shoulder_press', 'dumbbell-shoulder-press', 'Dumbbell Shoulder Press', ['shoulders'], ['triceps', 'upper_chest'], ['dumbbell'], 'intermediate', 'push'],
  ['lateral_raise', 'lateral-raise', 'Lateral Raise', ['side_delts'], ['upper_traps'], ['dumbbell'], 'beginner', 'push'],
  ['dumbbell_chest_fly', 'dumbbell-chest-fly', 'Dumbbell Chest Fly', ['chest'], ['front_delts'], ['dumbbell', 'bench'], 'intermediate', 'push'],
  ['triceps_pushdown', 'triceps-pushdown', 'Triceps Pushdown', ['triceps'], ['forearms'], ['cable'], 'beginner', 'push'],
  ['bench_dip', 'bench-dip', 'Bench Dip', ['triceps'], ['chest', 'front_delts'], ['bench', 'bodyweight'], 'beginner', 'push'],
];

const upperPull = [
  ['lat_pulldown', 'lat-pulldown', 'Lat Pulldown', ['lats'], ['biceps', 'rhomboids', 'rear_delts'], ['cable'], 'beginner', 'pull'],
  ['pull_up', 'pull-up', 'Pull-Up', ['lats'], ['biceps', 'rhomboids', 'rear_delts'], ['pull_up_bar', 'bodyweight'], 'intermediate', 'pull'],
  ['assisted_pull_up', 'assisted-pull-up', 'Assisted Pull-Up', ['lats'], ['biceps', 'rhomboids'], ['assisted_pull_up_machine'], 'beginner', 'pull'],
  ['seated_cable_row', 'seated-cable-row', 'Seated Cable Row', ['rhomboids', 'lats'], ['biceps', 'rear_delts'], ['cable'], 'beginner', 'pull'],
  ['one_arm_dumbbell_row', 'one-arm-dumbbell-row', 'One-Arm Dumbbell Row', ['lats', 'rhomboids'], ['biceps', 'rear_delts'], ['dumbbell', 'bench'], 'intermediate', 'pull'],
  ['barbell_bent_over_row', 'barbell-bent-over-row', 'Barbell Bent-Over Row', ['rhomboids', 'lats'], ['biceps', 'rear_delts', 'core'], ['barbell'], 'intermediate', 'pull'],
  ['face_pull', 'face-pull', 'Face Pull', ['rear_delts'], ['rhomboids', 'upper_traps'], ['cable'], 'beginner', 'pull'],
  ['rear_delt_fly', 'rear-delt-fly', 'Rear Delt Fly', ['rear_delts'], ['rhomboids', 'upper_traps'], ['dumbbell'], 'beginner', 'pull'],
  ['dumbbell_biceps_curl', 'dumbbell-biceps-curl', 'Dumbbell Biceps Curl', ['biceps'], ['forearms'], ['dumbbell'], 'beginner', 'pull'],
  ['hammer_curl', 'hammer-curl', 'Hammer Curl', ['biceps', 'forearms'], [], ['dumbbell'], 'beginner', 'pull'],
];

const lowerBody = [
  ['back_squat', 'back-squat', 'Back Squat', ['quads', 'glutes'], ['hamstrings', 'core'], ['barbell', 'rack'], 'intermediate', 'squat'],
  ['goblet_squat', 'goblet-squat', 'Goblet Squat', ['quads', 'glutes'], ['hamstrings', 'core'], ['dumbbell', 'kettlebell'], 'beginner', 'squat'],
  ['leg_press', 'leg-press', 'Leg Press', ['quads', 'glutes'], ['hamstrings'], ['machine'], 'beginner', 'squat'],
  ['romanian_deadlift', 'romanian-deadlift', 'Romanian Deadlift', ['hamstrings', 'glutes'], ['lower_back'], ['barbell', 'dumbbell'], 'intermediate', 'hinge'],
  ['conventional_deadlift', 'conventional-deadlift', 'Conventional Deadlift', ['hamstrings', 'glutes'], ['quads', 'lower_back', 'core'], ['barbell'], 'advanced', 'hinge'],
  ['hip_thrust', 'hip-thrust', 'Hip Thrust', ['glutes'], ['hamstrings'], ['barbell', 'bench'], 'intermediate', 'hinge'],
  ['walking_lunge', 'walking-lunge', 'Walking Lunge', ['quads', 'glutes'], ['hamstrings', 'calves'], ['bodyweight', 'dumbbell'], 'beginner', 'squat'],
  ['bulgarian_split_squat', 'bulgarian-split-squat', 'Bulgarian Split Squat', ['quads', 'glutes'], ['hamstrings', 'core'], ['bench', 'dumbbell'], 'intermediate', 'squat'],
  ['step_up', 'step-up', 'Step-Up', ['quads', 'glutes'], ['hamstrings', 'calves'], ['box', 'dumbbell'], 'beginner', 'squat'],
  ['leg_extension', 'leg-extension', 'Leg Extension', ['quads'], [], ['machine'], 'beginner', 'squat'],
  ['seated_leg_curl', 'seated-leg-curl', 'Seated Leg Curl', ['hamstrings'], [], ['machine'], 'beginner', 'hinge'],
  ['standing_calf_raise', 'standing-calf-raise', 'Standing Calf Raise', ['calves'], [], ['machine', 'bodyweight'], 'beginner', 'squat'],
  ['glute_bridge', 'glute-bridge', 'Glute Bridge', ['glutes'], ['hamstrings', 'core'], ['bodyweight'], 'beginner', 'hinge'],
  ['kettlebell_swing', 'kettlebell-swing', 'Kettlebell Swing', ['glutes', 'hamstrings'], ['core', 'lower_back'], ['kettlebell'], 'intermediate', 'hinge'],
];

const coreBatch = [
  ['plank', 'plank', 'Plank', ['core'], ['shoulders', 'glutes'], ['bodyweight'], 'beginner', 'core'],
  ['side_plank', 'side-plank', 'Side Plank', ['obliques'], ['core', 'shoulders'], ['bodyweight'], 'intermediate', 'core'],
  ['dead_bug', 'dead-bug', 'Dead Bug', ['core'], ['hip_flexors', 'lower_back'], ['bodyweight'], 'beginner', 'core'],
  ['bird_dog', 'bird-dog', 'Bird Dog', ['core'], ['glutes', 'lower_back', 'shoulders'], ['bodyweight'], 'beginner', 'core'],
  ['bicycle_crunch', 'bicycle-crunch', 'Bicycle Crunch', ['obliques', 'core'], ['hip_flexors'], ['bodyweight'], 'intermediate', 'core'],
  ['hanging_knee_raise', 'hanging-knee-raise', 'Hanging Knee Raise', ['lower_abs'], ['hip_flexors', 'forearms'], ['pull_up_bar', 'bodyweight'], 'intermediate', 'core'],
  ['russian_twist', 'russian-twist', 'Russian Twist', ['obliques'], ['core', 'hip_flexors'], ['bodyweight', 'medicine_ball'], 'beginner', 'core'],
  ['mountain_climber', 'mountain-climber', 'Mountain Climber', ['core', 'hip_flexors'], ['shoulders', 'quads'], ['bodyweight'], 'beginner', 'core'],
];

const cardioMobility = [
  ['treadmill_run', 'treadmill-run', 'Treadmill Run', ['quads', 'hamstrings', 'calves'], ['core', 'glutes'], ['treadmill'], 'beginner', 'cardio'],
  ['incline_walk', 'incline-walk', 'Incline Walk', ['quads', 'glutes'], ['calves', 'hamstrings', 'core'], ['treadmill'], 'beginner', 'cardio'],
  ['stationary_bike', 'stationary-bike', 'Stationary Bike', ['quads'], ['hamstrings', 'calves', 'glutes'], ['stationary_bike'], 'beginner', 'cardio'],
  ['rowing_machine', 'rowing-machine', 'Rowing Machine', ['lats', 'rhomboids', 'hamstrings', 'glutes'], ['biceps', 'core', 'calves'], ['rowing_machine'], 'intermediate', 'cardio'],
  ['cat_cow', 'cat-cow', 'Cat-Cow', ['lower_back', 'core'], ['shoulders', 'glutes'], ['bodyweight', 'mat'], 'beginner', 'mobility'],
  ['downward_dog', 'downward-dog', 'Downward Dog', ['hamstrings', 'calves'], ['shoulders', 'lats', 'lower_back'], ['bodyweight', 'mat'], 'beginner', 'mobility'],
  ['childs_pose', 'childs-pose', "Child's Pose", ['lats', 'lower_back'], ['shoulders', 'glutes'], ['bodyweight', 'mat'], 'beginner', 'mobility'],
  ['worlds_greatest_stretch', 'worlds-greatest-stretch', "World's Greatest Stretch", ['hip_flexors'], ['hamstrings', 'glutes', 'core', 'shoulders'], ['bodyweight', 'mat'], 'intermediate', 'mobility'],
];

const batches = {
  1: {
    name: 'upper-push',
    definitions: upperPush,
  },
  2: {
    name: 'upper-pull',
    definitions: upperPull,
  },
  3: {
    name: 'lower-body',
    definitions: lowerBody,
  },
  4: {
    name: 'core',
    definitions: coreBatch,
  },
  5: {
    name: 'cardio-mobility',
    definitions: cardioMobility,
  },
};

let currentLayerIndex = 1;

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function parseArgs(argv = process.argv.slice(2)) {
  const options = { batch: 1 };
  argv.forEach((arg, index) => {
    if (arg === '--batch') {
      options.batch = Number(argv[index + 1]);
    } else if (arg.startsWith('--batch=')) {
      options.batch = Number(arg.split('=').slice(1).join('='));
    }
  });
  if (!batches[options.batch]) {
    throw new Error(`Unknown batch "${options.batch}". Available: ${Object.keys(batches).join(', ')}`);
  }
  return options;
}

function lottieFor(exerciseId, primary, secondary = []) {
  currentLayerIndex = 1;
  const primarySet = new Set(primary);
  const secondarySet = new Set(secondary);
  const armMuscles = ['triceps', 'biceps', 'forearms'];
  const legMuscles = ['quads', 'hamstrings', 'glutes', 'calves'];
  const isArmFocused = primary.some(muscle => armMuscles.includes(muscle));
  const isLegFocused = primary.some(muscle => legMuscles.includes(muscle));
  const highlight = isArmFocused ? '#FFD700' : '#FF6B35';
  const limbColor = (muscles, inactive = '#F3C9A8') => {
    if (muscles.some(muscle => primarySet.has(muscle))) {
      return highlight;
    }
    if (muscles.some(muscle => secondarySet.has(muscle))) {
      return '#FFB199';
    }
    return inactive;
  };
  const profile = motionProfile(exerciseId);
  const torsoColor = isLegFocused || profile.darkTorso ? '#2B2B2B' : highlight;
  const upperArmColor = limbColor(['biceps', 'triceps']);
  const forearmColor = limbColor(['forearms']);
  const thighColor = limbColor(['quads', 'hamstrings', 'glutes']);
  const calfColor = limbColor(['calves']);
  const shoulderColor = limbColor(['shoulders', 'side_delts', 'front_delts', 'rear_delts'], '#F3C9A8');
  const coreColor = limbColor(['core', 'obliques', 'lower_abs', 'lower_back'], torsoColor);
  const equipmentColor = '#2A2A2A';

  return {
    v: '5.7.4',
    fr: 30,
    ip: 0,
    op: 90,
    w: 420,
    h: 420,
    nm: `${exerciseId} anatomical demo`,
    assets: [],
    layers: [
      shapeLayer('floor', '#C7BFB5', [[118, 344], [302, 344]], 4),
      ...equipmentLayers(profile, equipmentColor),
      ellipseLayer('head', '#F3C9A8', [210, 78], [36, 36]),
      capsuleLayer('torso', torsoColor, [210, 108], [56, 92], profile.torso[0], profile.torso[1]),
      capsuleLayer('corePanel', coreColor, [210, 132], [34, 56], profile.torso[0], profile.torso[1], 16, 72),
      capsuleLayer('leftUpperArm', upperArmColor, [184, 128], [15, 70], profile.leftUpperArm[0], profile.leftUpperArm[1]),
      capsuleLayer('rightUpperArm', upperArmColor, [236, 128], [15, 70], profile.rightUpperArm[0], profile.rightUpperArm[1]),
      capsuleLayer('leftForearm', forearmColor, profile.leftForearmJoint, [14, 62], profile.leftForearm[0], profile.leftForearm[1]),
      capsuleLayer('rightForearm', forearmColor, profile.rightForearmJoint, [14, 62], profile.rightForearm[0], profile.rightForearm[1]),
      capsuleLayer('leftThigh', thighColor, [196, 198], [18, 82], profile.leftThigh[0], profile.leftThigh[1]),
      capsuleLayer('rightThigh', thighColor, [224, 198], [18, 82], profile.rightThigh[0], profile.rightThigh[1]),
      capsuleLayer('leftLowerLeg', calfColor, profile.leftLowerLegJoint, [16, 70], profile.leftLowerLeg[0], profile.leftLowerLeg[1]),
      capsuleLayer('rightLowerLeg', calfColor, profile.rightLowerLegJoint, [16, 70], profile.rightLowerLeg[0], profile.rightLowerLeg[1]),
      ellipseLayer('leftShoulder', shoulderColor, [184, 128], [10, 10]),
      ellipseLayer('rightShoulder', shoulderColor, [236, 128], [10, 10]),
    ],
  };
}

function motionProfile(exerciseId) {
  const base = {
    darkTorso: false,
    torso: [0, 0],
    leftUpperArm: [16, 22],
    rightUpperArm: [-16, -22],
    leftForearmJoint: [173, 190],
    rightForearmJoint: [247, 190],
    leftForearm: [12, 18],
    rightForearm: [-12, -18],
    leftThigh: [8, 12],
    rightThigh: [-8, -12],
    leftLowerLegJoint: [184, 276],
    rightLowerLegJoint: [236, 276],
    leftLowerLeg: [-6, -10],
    rightLowerLeg: [6, 10],
    equipment: 'none',
  };

  const withProfile = (overrides) => ({ ...base, ...overrides });
  if (/curl/.test(exerciseId)) {
    return withProfile({
      darkTorso: true,
      leftUpperArm: [8, 8],
      rightUpperArm: [-8, -8],
      leftForearmJoint: [174, 190],
      rightForearmJoint: [246, 190],
      leftForearm: [72, -28],
      rightForearm: [-72, 28],
      equipment: 'dumbbells',
    });
  }
  if (/pull_up|pulldown/.test(exerciseId)) {
    return withProfile({
      darkTorso: true,
      leftUpperArm: [-146, -116],
      rightUpperArm: [146, 116],
      leftForearmJoint: [144, 124],
      rightForearmJoint: [276, 124],
      leftForearm: [-90, -122],
      rightForearm: [90, 122],
      leftThigh: [4, 8],
      rightThigh: [-4, -8],
      equipment: 'bar',
    });
  }
  if (/row|face_pull|rear_delt/.test(exerciseId)) {
    return withProfile({
      darkTorso: true,
      torso: [18, 32],
      leftUpperArm: [72, 38],
      rightUpperArm: [-72, -38],
      leftForearmJoint: [160, 170],
      rightForearmJoint: [260, 170],
      leftForearm: [82, 54],
      rightForearm: [-82, -54],
      leftThigh: [18, 18],
      rightThigh: [-18, -18],
      equipment: 'rowHandle',
    });
  }
  if (/press|push|dip|fly|raise/.test(exerciseId)) {
    const overhead = /shoulder_press|lateral_raise/.test(exerciseId);
    return withProfile({
      leftUpperArm: overhead ? [-72, -128] : [-36, -58],
      rightUpperArm: overhead ? [72, 128] : [36, 58],
      leftForearmJoint: [164, overhead ? 118 : 166],
      rightForearmJoint: [256, overhead ? 118 : 166],
      leftForearm: overhead ? [-42, -82] : [-26, -48],
      rightForearm: overhead ? [42, 82] : [26, 48],
      equipment: /dumbbell|raise|fly/.test(exerciseId) ? 'dumbbells' : /bench_press|chest_press/.test(exerciseId) ? 'bar' : 'none',
    });
  }
  if (/squat|leg_press|lunge|split_squat|step_up/.test(exerciseId)) {
    const split = /lunge|split_squat|step_up/.test(exerciseId);
    return withProfile({
      darkTorso: true,
      torso: [0, split ? -8 : 0],
      leftUpperArm: [12, 12],
      rightUpperArm: [-12, -12],
      leftThigh: split ? [-46, -18] : [22, 48],
      rightThigh: split ? [50, 18] : [-22, -48],
      leftLowerLegJoint: [178, 276],
      rightLowerLegJoint: [242, 276],
      leftLowerLeg: split ? [44, 18] : [-28, -44],
      rightLowerLeg: split ? [-36, -14] : [28, 44],
      equipment: /goblet/.test(exerciseId) ? 'goblet' : 'none',
    });
  }
  if (/deadlift|hinge|thrust|bridge|swing|leg_curl/.test(exerciseId)) {
    return withProfile({
      darkTorso: true,
      torso: /thrust|bridge/.test(exerciseId) ? [82, 64] : [24, 48],
      leftUpperArm: [32, 36],
      rightUpperArm: [-32, -36],
      leftThigh: /thrust|bridge/.test(exerciseId) ? [64, 36] : [10, 22],
      rightThigh: /thrust|bridge/.test(exerciseId) ? [-64, -36] : [-10, -22],
      leftLowerLeg: /thrust|bridge/.test(exerciseId) ? [-58, -32] : [-12, -22],
      rightLowerLeg: /thrust|bridge/.test(exerciseId) ? [58, 32] : [12, 22],
      equipment: /swing|deadlift|romanian/.test(exerciseId) ? 'weight' : 'none',
    });
  }
  if (/plank|crunch|bug|bird|twist|mountain|knee_raise/.test(exerciseId)) {
    return withProfile({
      darkTorso: false,
      torso: [86, 76],
      leftUpperArm: [96, 82],
      rightUpperArm: [96, 82],
      leftForearmJoint: [154, 244],
      rightForearmJoint: [260, 244],
      leftForearm: [78, 96],
      rightForearm: [78, 96],
      leftThigh: [74, /mountain|bicycle|knee_raise/.test(exerciseId) ? 34 : 64],
      rightThigh: [104, /mountain|bicycle|knee_raise/.test(exerciseId) ? 138 : 104],
      leftLowerLegJoint: [178, 286],
      rightLowerLegJoint: [242, 286],
      leftLowerLeg: [82, /mountain|bicycle|knee_raise/.test(exerciseId) ? 38 : 82],
      rightLowerLeg: [98, /mountain|bicycle|knee_raise/.test(exerciseId) ? 138 : 98],
    });
  }
  if (/run|walk|bike|rowing/.test(exerciseId)) {
    if (/bike/.test(exerciseId)) {
      return withProfile({
        darkTorso: true,
        torso: [28, 28],
        leftUpperArm: [54, 54],
        rightUpperArm: [54, 54],
        leftThigh: [46, 116],
        rightThigh: [116, 46],
        leftLowerLeg: [-54, -124],
        rightLowerLeg: [-124, -54],
        equipment: 'bike',
      });
    }
    if (/rowing/.test(exerciseId)) {
      return withProfile({
        darkTorso: true,
        torso: [34, 8],
        leftUpperArm: [74, 34],
        rightUpperArm: [-74, -34],
        leftForearmJoint: [158, 172],
        rightForearmJoint: [262, 172],
        leftForearm: [82, 42],
        rightForearm: [-82, -42],
        leftThigh: [54, 36],
        rightThigh: [-54, -36],
        equipment: 'rowHandle',
      });
    }
    return withProfile({
      darkTorso: true,
      leftUpperArm: [42, -34],
      rightUpperArm: [-42, 34],
      leftForearm: [28, -28],
      rightForearm: [-28, 28],
      leftThigh: [-34, 34],
      rightThigh: [34, -34],
      leftLowerLeg: [28, -28],
      rightLowerLeg: [-28, 28],
    });
  }
  if (/cat_cow|dog|pose|stretch/.test(exerciseId)) {
    return withProfile({
      darkTorso: false,
      torso: /downward|childs/.test(exerciseId) ? [68, 48] : [44, 14],
      leftUpperArm: /downward|childs/.test(exerciseId) ? [102, 82] : [72, 54],
      rightUpperArm: /downward|childs/.test(exerciseId) ? [102, 82] : [72, 54],
      leftForearmJoint: [154, 236],
      rightForearmJoint: [260, 236],
      leftForearm: [88, 100],
      rightForearm: [88, 100],
      leftThigh: /stretch/.test(exerciseId) ? [24, -38] : [62, 44],
      rightThigh: /stretch/.test(exerciseId) ? [112, 54] : [-62, -44],
      leftLowerLeg: /stretch/.test(exerciseId) ? [-34, -74] : [34, 22],
      rightLowerLeg: /stretch/.test(exerciseId) ? [82, 46] : [-34, -22],
    });
  }
  return base;
}

function equipmentLayers(profile, color) {
  if (profile.equipment === 'bar') {
    return [
      shapeLayer('bar', color, [[118, 116], [302, 116]], 8),
      shapeLayer('leftPlate', color, [[124, 102], [124, 130]], 8),
      shapeLayer('rightPlate', color, [[296, 102], [296, 130]], 8),
    ];
  }
  if (profile.equipment === 'dumbbells') {
    return [
      shapeLayer('leftDumbbell', color, [[122, 178], [154, 178]], 8),
      shapeLayer('rightDumbbell', color, [[266, 178], [298, 178]], 8),
    ];
  }
  if (profile.equipment === 'goblet' || profile.equipment === 'weight') {
    return [ellipseLayer('weight', color, [210, profile.equipment === 'goblet' ? 164 : 272], [32, 32])];
  }
  if (profile.equipment === 'rowHandle') {
    return [shapeLayer('rowHandle', color, [[156, 184], [264, 184]], 8)];
  }
  if (profile.equipment === 'bike') {
    return [
      ellipseStrokeLayer('leftWheel', color, [154, 318], [58, 58], 6),
      ellipseStrokeLayer('rightWheel', color, [266, 318], [58, 58], 6),
      shapeLayer('bikeFrame', color, [[154, 318], [210, 250], [266, 318], [204, 318], [210, 250]], 5),
    ];
  }
  return [];
}

function shapeLayer(name, color, points, width = 6) {
  return {
    ddd: 0,
    ind: currentLayerIndex++,
    ty: 4,
    nm: name,
    ks: transform(),
    shapes: [{
      ty: 'sh',
      ks: {
        a: 0,
        k: {
          i: points.map(() => [0, 0]),
          o: points.map(() => [0, 0]),
          v: points,
          c: false,
        },
      },
    }, {
      ty: 'st',
      c: { a: 0, k: hex(color) },
      w: { a: 0, k: width },
      lc: 2,
      lj: 2,
    }],
  };
}

function capsuleLayer(name, color, position, size, startRot = 0, midRot = startRot, radius = Math.min(size[0], size[1]) / 2, opacity = 100) {
  return {
    ddd: 0,
    ind: currentLayerIndex++,
    ty: 4,
    nm: name,
    ks: transform(position, startRot, midRot),
    shapes: [{
      ty: 'rc',
      p: { a: 0, k: [0, size[1] / 2] },
      s: { a: 0, k: size },
      r: { a: 0, k: radius },
    }, {
      ty: 'fl',
      c: { a: 0, k: hex(color) },
      o: { a: 0, k: opacity },
    }, {
      ty: 'st',
      c: { a: 0, k: hex('#040404') },
      o: { a: 0, k: 10 },
      w: { a: 0, k: 1 },
    }],
  };
}

function limbLayer(name, color, position, points, startRot, midRot) {
  return {
    ddd: 0,
    ind: currentLayerIndex++,
    ty: 4,
    nm: name,
    ks: transform(position, startRot, midRot),
    shapes: [{
      ty: 'sh',
      ks: {
        a: 0,
        k: {
          i: points.map(() => [0, 0]),
          o: points.map(() => [0, 0]),
          v: points,
          c: false,
        },
      },
    }, {
      ty: 'st',
      c: { a: 0, k: hex(color) },
      w: { a: 0, k: 14 },
      lc: 2,
      lj: 2,
    }],
  };
}

function ellipseStrokeLayer(name, color, position, size, width = 4) {
  return {
    ddd: 0,
    ind: currentLayerIndex++,
    ty: 4,
    nm: name,
    ks: transform(position),
    shapes: [{
      ty: 'el',
      p: { a: 0, k: [0, 0] },
      s: { a: 0, k: size },
    }, {
      ty: 'st',
      c: { a: 0, k: hex(color) },
      w: { a: 0, k: width },
      lc: 2,
      lj: 2,
    }],
  };
}

function ellipseLayer(name, color, position, size) {
  return {
    ddd: 0,
    ind: currentLayerIndex++,
    ty: 4,
    nm: name,
    ks: transform(position),
    shapes: [{
      ty: 'el',
      p: { a: 0, k: [0, 0] },
      s: { a: 0, k: size },
    }, {
      ty: 'fl',
      c: { a: 0, k: hex(color) },
      o: { a: 0, k: 100 },
    }],
  };
}

function transform(position = [0, 0], startRot = 0, midRot = startRot) {
  return {
    o: { a: 0, k: 100 },
    r: { a: startRot === midRot ? 0 : 1, k: startRot === midRot ? startRot : [
      { t: 0, s: [startRot] },
      { t: 45, s: [midRot] },
      { t: 90, s: [startRot] },
    ] },
    p: { a: 0, k: position },
    a: { a: 0, k: [0, 0, 0] },
    s: { a: 0, k: [100, 100, 100] },
  };
}

function hex(value) {
  const clean = value.replace('#', '');
  return [0, 2, 4].map(index => parseInt(clean.slice(index, index + 2), 16) / 255).concat(1);
}

function muscleMap(exerciseName, primary, secondary, view) {
  const primarySet = new Set(primary);
  const secondarySet = new Set(secondary);
  const aliases = {
    chest: ['chest', 'upper_chest'],
    upper_chest: ['upper_chest', 'chest'],
    front_delts: ['front_delts', 'shoulders'],
    side_delts: ['side_delts', 'shoulders'],
    rear_delts: ['rear_delts', 'shoulders'],
    shoulders: ['shoulders', 'front_delts', 'side_delts', 'rear_delts'],
    triceps: ['triceps'],
    biceps: ['biceps'],
    forearms: ['forearms'],
    core: ['core'],
    lower_abs: ['lower_abs'],
    obliques: ['obliques'],
    hip_flexors: ['hip_flexors'],
    upper_traps: ['upper_traps'],
    lats: ['lats'],
    rhomboids: ['rhomboids', 'mid_back'],
    mid_back: ['mid_back', 'rhomboids'],
    lower_back: ['lower_back', 'back'],
    back: ['back', 'lower_back'],
    quads: ['quads'],
    hamstrings: ['hamstrings'],
    glutes: ['glutes'],
    calves: ['calves'],
  };
  const colorFor = (muscles, inactive = '#2B2B2B') => {
    const keys = Array.isArray(muscles) ? muscles : [muscles];
    const expanded = keys.flatMap(muscle => aliases[muscle] || [muscle]);
    if (expanded.some(muscle => primarySet.has(muscle))) {
      return '#FF6B35';
    }
    if (expanded.some(muscle => secondarySet.has(muscle))) {
      return '#FFB199';
    }
    return inactive;
  };
  const delts = colorFor(['front_delts', 'side_delts', 'shoulders']);
  const rearDelts = colorFor(['rear_delts', 'shoulders']);
  const chest = colorFor(['chest', 'upper_chest']);
  const upperArms = colorFor(['triceps', 'biceps'], '#2B2B2B');
  const forearms = colorFor(['forearms'], '#2B2B2B');
  const core = colorFor(['core'], '#242424');
  const lowerAbs = colorFor(['lower_abs'], '#242424');
  const obliques = colorFor(['obliques'], '#242424');
  const hipFlexors = colorFor(['hip_flexors'], '#F3C9A8');
  const traps = colorFor(['upper_traps'], '#2B2B2B');
  const lats = colorFor(['lats'], '#242424');
  const rhomboids = colorFor(['rhomboids', 'mid_back'], '#242424');
  const lowerBack = colorFor(['lower_back', 'back'], '#242424');
  const quads = colorFor(['quads'], '#F3C9A8');
  const hamstrings = colorFor(['hamstrings'], '#F3C9A8');
  const glutes = colorFor(['glutes'], '#F3C9A8');
  const calves = colorFor(['calves'], '#F3C9A8');
  const title = escapeXml(exerciseName);
  const isActiveRegion = color => color === '#FF6B35' || color === '#FFB199';
  const region = (d, color, stroke = 'rgba(4,4,4,.22)') => (
    isActiveRegion(color) ? `<path d="${d}" fill="${color}" stroke="${stroke}" stroke-width="2"/>` : ''
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="520" viewBox="0 0 360 520" role="img" aria-label="${exerciseName} ${view} muscle map">
  <defs>
    <style>
      .label { fill: #FFFFFF; font-family: Space Grotesk, Arial, sans-serif; font-size: 20px; font-weight: 800; letter-spacing: 0; }
      .small { fill: rgba(255,255,255,.62); font-family: Space Grotesk, Arial, sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 0; }
      .body { fill: #2B2B2B; stroke: rgba(255,255,255,.24); stroke-width: 3; }
      .skin { fill: #F3C9A8; stroke: rgba(255,255,255,.18); stroke-width: 2; }
      .joint { fill: #1E1E1E; stroke: rgba(255,255,255,.22); stroke-width: 2; }
      .center { stroke: rgba(255,255,255,.16); stroke-width: 2; fill: none; }
    </style>
  </defs>
  <rect width="360" height="520" rx="28" fill="#040404"/>
  <text x="24" y="38" class="label">${title}</text>
  <text x="24" y="62" class="small">${view.toUpperCase()} VIEW</text>

  <g transform="translate(180 92) scale(.86)">
    <circle class="skin" cx="0" cy="0" r="34"/>
    <rect class="skin" x="-15" y="32" width="30" height="22" rx="10"/>
    <path class="body" d="M-68 62 C-42 42 42 42 68 62 C83 107 77 172 51 223 C21 241 -21 241 -51 223 C-77 172 -83 107 -68 62 Z"/>

    ${view === 'front' ? `
    <path d="M-72 64 C-109 75 -133 105 -143 150 C-130 163 -110 166 -97 154 C-90 118 -77 93 -55 77 Z" fill="${delts}" stroke="rgba(4,4,4,.24)" stroke-width="2"/>
    <path d="M72 64 C109 75 133 105 143 150 C130 163 110 166 97 154 C90 118 77 93 55 77 Z" fill="${delts}" stroke="rgba(4,4,4,.24)" stroke-width="2"/>
    <path d="M-57 78 C-33 63 -9 62 -1 82 C-9 122 -37 139 -64 124 C-72 105 -70 90 -57 78 Z" fill="${chest}" stroke="rgba(4,4,4,.26)" stroke-width="2"/>
    <path d="M57 78 C33 63 9 62 1 82 C9 122 37 139 64 124 C72 105 70 90 57 78 Z" fill="${chest}" stroke="rgba(4,4,4,.26)" stroke-width="2"/>
    <path d="M-48 130 C-20 145 20 145 48 130 C50 168 39 203 25 224 C8 231 -8 231 -25 224 C-39 203 -50 168 -48 130 Z" fill="${core}" stroke="rgba(255,255,255,.08)" stroke-width="2"/>
    ${region('M-52 126 C-39 138 -35 174 -43 211 C-55 200 -63 178 -63 151 C-61 139 -57 131 -52 126 Z', obliques, 'rgba(255,255,255,.08)')}
    ${region('M52 126 C39 138 35 174 43 211 C55 200 63 178 63 151 C61 139 57 131 52 126 Z', obliques, 'rgba(255,255,255,.08)')}
    ${region('M-24 183 C-7 191 7 191 24 183 C27 202 19 218 0 225 C-19 218 -27 202 -24 183 Z', lowerAbs, 'rgba(255,255,255,.08)')}
    ${region('M-43 226 C-22 239 22 239 43 226 C38 245 22 257 0 260 C-22 257 -38 245 -43 226 Z', hipFlexors)}
    ` : `
    <path d="M-72 64 C-109 75 -133 105 -143 150 C-130 163 -110 166 -97 154 C-90 118 -77 93 -55 77 Z" fill="${rearDelts}" stroke="rgba(4,4,4,.24)" stroke-width="2"/>
    <path d="M72 64 C109 75 133 105 143 150 C130 163 110 166 97 154 C90 118 77 93 55 77 Z" fill="${rearDelts}" stroke="rgba(4,4,4,.24)" stroke-width="2"/>
    <path d="M-54 72 C-27 57 27 57 54 72 C44 105 28 129 0 145 C-28 129 -44 105 -54 72 Z" fill="${traps}" stroke="rgba(255,255,255,.08)" stroke-width="2"/>
    <path d="M-58 101 C-30 88 30 88 58 101 C52 137 34 167 0 188 C-34 167 -52 137 -58 101 Z" fill="${rhomboids}" stroke="rgba(255,255,255,.08)" stroke-width="2"/>
    <path d="M-66 113 C-88 143 -89 186 -51 222 C-35 196 -28 157 -35 122 Z" fill="${lats}" stroke="rgba(4,4,4,.22)" stroke-width="2"/>
    <path d="M66 113 C88 143 89 186 51 222 C35 196 28 157 35 122 Z" fill="${lats}" stroke="rgba(4,4,4,.22)" stroke-width="2"/>
    <path d="M-47 154 C-21 169 21 169 47 154 C48 186 37 209 23 225 C8 231 -8 231 -23 225 C-37 209 -48 186 -47 154 Z" fill="${core}" stroke="rgba(255,255,255,.08)" stroke-width="2"/>
    ${region('M-37 176 C-16 190 16 190 37 176 C37 198 26 215 0 225 C-26 215 -37 198 -37 176 Z', lowerBack, 'rgba(255,255,255,.08)')}
    `}

    <path d="M-76 79 C-113 88 -137 117 -144 153 C-131 168 -111 172 -98 160 C-93 125 -86 96 -76 79 Z" fill="${upperArms}" stroke="rgba(4,4,4,.24)" stroke-width="2"/>
    <path d="M76 79 C113 88 137 117 144 153 C131 168 111 172 98 160 C93 125 86 96 76 79 Z" fill="${upperArms}" stroke="rgba(4,4,4,.24)" stroke-width="2"/>
    <path d="M-101 160 C-117 206 -118 258 -105 303 C-88 306 -77 293 -82 275 C-91 235 -90 194 -98 160 Z" fill="${forearms}" stroke="rgba(4,4,4,.2)" stroke-width="2"/>
    <path d="M101 160 C117 206 118 258 105 303 C88 306 77 293 82 275 C91 235 90 194 98 160 Z" fill="${forearms}" stroke="rgba(4,4,4,.2)" stroke-width="2"/>
    <path class="skin" d="M-43 227 C-62 274 -70 333 -62 405 C-42 418 -20 412 -15 390 C-19 332 -11 284 8 238 Z"/>
    <path class="skin" d="M43 227 C62 274 70 333 62 405 C42 418 20 412 15 390 C19 332 11 284 -8 238 Z"/>
    ${view === 'front' ? `
    ${region('M-43 226 C-22 239 22 239 43 226 C38 245 22 257 0 260 C-22 257 -38 245 -43 226 Z', hipFlexors)}
    ${region('M-39 242 C-55 284 -58 330 -50 366 C-34 375 -20 369 -19 350 C-19 310 -10 274 8 238 Z', quads)}
    ${region('M39 242 C55 284 58 330 50 366 C34 375 20 369 19 350 C19 310 10 274 -8 238 Z', quads)}
    ${region('M-50 360 C-59 384 -56 403 -42 411 C-29 416 -18 407 -15 390 C-18 375 -19 363 -19 350 C-29 358 -40 362 -50 360 Z', calves)}
    ${region('M50 360 C59 384 56 403 42 411 C29 416 18 407 15 390 C18 375 19 363 19 350 C29 358 40 362 50 360 Z', calves)}
    ` : `
    ${region('M-45 224 C-65 240 -62 272 -36 284 C-15 275 -8 250 -2 235 C-14 225 -31 221 -45 224 Z', glutes)}
    ${region('M45 224 C65 240 62 272 36 284 C15 275 8 250 2 235 C14 225 31 221 45 224 Z', glutes)}
    ${region('M-42 243 C-61 289 -64 340 -55 386 C-39 397 -22 390 -19 368 C-20 324 -10 279 8 238 Z', hamstrings)}
    ${region('M42 243 C61 289 64 340 55 386 C39 397 22 390 19 368 C20 324 10 279 -8 238 Z', hamstrings)}
    ${region('M-54 359 C-62 384 -57 404 -42 411 C-29 416 -18 407 -15 390 C-18 374 -19 362 -19 350 C-30 357 -42 362 -54 359 Z', calves)}
    ${region('M54 359 C62 384 57 404 42 411 C29 416 18 407 15 390 C18 374 19 362 19 350 C30 357 42 362 54 359 Z', calves)}
    `}
    <circle class="joint" cx="-73" cy="68" r="8"/>
    <circle class="joint" cx="73" cy="68" r="8"/>
    <circle class="joint" cx="-100" cy="160" r="7"/>
    <circle class="joint" cx="100" cy="160" r="7"/>
    <path class="center" d="M0 58 L0 232"/>
  </g>

  <rect x="24" y="474" width="18" height="18" rx="5" fill="#FF6B35"/>
  <text x="50" y="488" fill="#FFFFFF" font-family="Space Grotesk, Arial, sans-serif" font-size="12" font-weight="800">Primary</text>
  <rect x="124" y="474" width="18" height="18" rx="5" fill="#FFB199"/>
  <text x="150" y="488" fill="#FFFFFF" font-family="Space Grotesk, Arial, sans-serif" font-size="12" font-weight="800">Secondary</text>
  <rect x="244" y="474" width="18" height="18" rx="5" fill="#2B2B2B" stroke="rgba(255,255,255,.22)"/>
  <text x="270" y="488" fill="#FFFFFF" font-family="Space Grotesk, Arial, sans-serif" font-size="12" font-weight="800">Inactive</text>
</svg>
`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function thumbnailSvg(exerciseName, primary, secondary) {
  const primaryLabel = primary.map(toTitle).join(' + ');
  const secondaryLabel = secondary.slice(0, 2).map(toTitle).join(' + ');
  const colorFor = thumbnailMuscleColor(primary, secondary);
  const thumbChest = colorFor(['chest', 'upper_chest']);
  const thumbDelts = colorFor(['front_delts', 'side_delts', 'shoulders']);
  const thumbRearDelts = colorFor(['rear_delts', 'shoulders']);
  const thumbUpperArms = colorFor(['triceps', 'biceps'], '#2B2B2B');
  const thumbForearms = colorFor(['forearms'], '#2B2B2B');
  const thumbCore = colorFor(['core'], '#242424');
  const thumbLowerAbs = colorFor(['lower_abs'], '#242424');
  const thumbObliques = colorFor(['obliques'], '#242424');
  const thumbHipFlexors = colorFor(['hip_flexors'], '#F3C9A8');
  const thumbLats = colorFor(['lats'], '#242424');
  const thumbRhomboids = colorFor(['rhomboids', 'mid_back'], '#242424');
  const thumbLowerBack = colorFor(['lower_back', 'back'], '#242424');
  const thumbQuads = colorFor(['quads'], '#F3C9A8');
  const thumbHamstrings = colorFor(['hamstrings'], '#F3C9A8');
  const thumbGlutes = colorFor(['glutes'], '#F3C9A8');
  const thumbCalves = colorFor(['calves'], '#F3C9A8');
  const backPriority = primary.some(muscle => ['lats', 'rhomboids', 'mid_back', 'rear_delts', 'hamstrings', 'glutes', 'calves'].includes(muscle))
    && !primary.some(muscle => ['chest', 'upper_chest', 'front_delts', 'side_delts', 'shoulders', 'quads'].includes(muscle));
  const thumbIsActiveRegion = color => color === '#FF6B35' || color === '#FFB199';
  const thumbRegion = (d, color) => (thumbIsActiveRegion(color) ? `<path d="${d}" fill="${color}"/>` : '');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <defs>
    <linearGradient id="brand" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#FF6B35"/>
      <stop offset="1" stop-color="#D89A00"/>
    </linearGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000000" flood-opacity=".35"/>
    </filter>
  </defs>
  <rect width="640" height="360" fill="#040404"/>
  <circle cx="560" cy="26" r="172" fill="#FF6B35" opacity=".16"/>
  <circle cx="90" cy="330" r="156" fill="#FFB199" opacity=".10"/>
  <rect x="34" y="34" width="572" height="292" rx="30" fill="#101010" stroke="rgba(255,255,255,.14)" filter="url(#soft)"/>
  <rect x="64" y="64" width="112" height="28" rx="14" fill="url(#brand)"/>
  <text x="120" y="84" fill="#040404" text-anchor="middle" font-family="Space Grotesk, Arial, sans-serif" font-size="13" font-weight="900">TRIBELOG</text>
  <text x="64" y="148" fill="#FFFFFF" font-family="Syne, Space Grotesk, Arial, sans-serif" font-size="44" font-weight="900">${escapeXml(exerciseName)}</text>
  <text x="66" y="188" fill="rgba(255,255,255,.70)" font-family="Space Grotesk, Arial, sans-serif" font-size="19" font-weight="700">Primary · ${escapeXml(primaryLabel)}</text>
  <text x="66" y="220" fill="rgba(255,255,255,.48)" font-family="Space Grotesk, Arial, sans-serif" font-size="16" font-weight="700">Secondary · ${escapeXml(secondaryLabel || 'None')}</text>
  <g transform="translate(466 74) scale(.48)">
    <circle cx="0" cy="0" r="34" fill="#F3C9A8" stroke="rgba(255,255,255,.18)" stroke-width="3"/>
    <rect x="-15" y="32" width="30" height="22" rx="10" fill="#F3C9A8"/>
    <path d="M-68 62 C-42 42 42 42 68 62 C83 107 77 172 51 223 C21 241 -21 241 -51 223 C-77 172 -83 107 -68 62 Z" fill="#2B2B2B" stroke="rgba(255,255,255,.24)" stroke-width="3"/>
    ${backPriority ? `
    <path d="M-72 64 C-109 75 -133 105 -143 150 C-130 163 -110 166 -97 154 C-90 118 -77 93 -55 77 Z" fill="${thumbRearDelts}"/>
    <path d="M72 64 C109 75 133 105 143 150 C130 163 110 166 97 154 C90 118 77 93 55 77 Z" fill="${thumbRearDelts}"/>
    <path d="M-58 101 C-30 88 30 88 58 101 C52 137 34 167 0 188 C-34 167 -52 137 -58 101 Z" fill="${thumbRhomboids}"/>
    <path d="M-66 113 C-88 143 -89 186 -51 222 C-35 196 -28 157 -35 122 Z" fill="${thumbLats}"/>
    <path d="M66 113 C88 143 89 186 51 222 C35 196 28 157 35 122 Z" fill="${thumbLats}"/>
    ${thumbRegion('M-37 176 C-16 190 16 190 37 176 C37 198 26 215 0 225 C-26 215 -37 198 -37 176 Z', thumbLowerBack)}
    ` : `
    <path d="M-57 78 C-33 63 -9 62 -1 82 C-9 122 -37 139 -64 124 C-72 105 -70 90 -57 78 Z" fill="${thumbChest}"/>
    <path d="M57 78 C33 63 9 62 1 82 C9 122 37 139 64 124 C72 105 70 90 57 78 Z" fill="${thumbChest}"/>
    <path d="M-72 64 C-109 75 -133 105 -143 150 C-130 163 -110 166 -97 154 C-90 118 -77 93 -55 77 Z" fill="${thumbDelts}"/>
    <path d="M72 64 C109 75 133 105 143 150 C130 163 110 166 97 154 C90 118 77 93 55 77 Z" fill="${thumbDelts}"/>
    <path d="M-48 130 C-20 145 20 145 48 130 C50 168 39 203 25 224 C8 231 -8 231 -25 224 C-39 203 -50 168 -48 130 Z" fill="${thumbCore}"/>
    ${thumbRegion('M-52 126 C-39 138 -35 174 -43 211 C-55 200 -63 178 -63 151 C-61 139 -57 131 -52 126 Z', thumbObliques)}
    ${thumbRegion('M52 126 C39 138 35 174 43 211 C55 200 63 178 63 151 C61 139 57 131 52 126 Z', thumbObliques)}
    ${thumbRegion('M-24 183 C-7 191 7 191 24 183 C27 202 19 218 0 225 C-19 218 -27 202 -24 183 Z', thumbLowerAbs)}
    ${thumbRegion('M-43 226 C-22 239 22 239 43 226 C38 245 22 257 0 260 C-22 257 -38 245 -43 226 Z', thumbHipFlexors)}
    `}
    <path d="M-76 79 C-113 88 -137 117 -144 153 C-131 168 -111 172 -98 160 C-93 125 -86 96 -76 79 Z" fill="${thumbUpperArms}"/>
    <path d="M76 79 C113 88 137 117 144 153 C131 168 111 172 98 160 C93 125 86 96 76 79 Z" fill="${thumbUpperArms}"/>
    <path d="M-101 160 C-117 206 -118 258 -105 303 C-88 306 -77 293 -82 275 C-91 235 -90 194 -98 160 Z" fill="${thumbForearms}"/>
    <path d="M101 160 C117 206 118 258 105 303 C88 306 77 293 82 275 C91 235 90 194 98 160 Z" fill="${thumbForearms}"/>
    <path d="M-43 227 C-62 274 -70 333 -62 405 C-42 418 -20 412 -15 390 C-19 332 -11 284 8 238 Z" fill="#F3C9A8"/>
    <path d="M43 227 C62 274 70 333 62 405 C42 418 20 412 15 390 C19 332 11 284 -8 238 Z" fill="#F3C9A8"/>
    ${backPriority ? `
    ${thumbRegion('M-45 224 C-65 240 -62 272 -36 284 C-15 275 -8 250 -2 235 C-14 225 -31 221 -45 224 Z', thumbGlutes)}
    ${thumbRegion('M45 224 C65 240 62 272 36 284 C15 275 8 250 2 235 C14 225 31 221 45 224 Z', thumbGlutes)}
    ${thumbRegion('M-42 243 C-61 289 -64 340 -55 386 C-39 397 -22 390 -19 368 C-20 324 -10 279 8 238 Z', thumbHamstrings)}
    ${thumbRegion('M42 243 C61 289 64 340 55 386 C39 397 22 390 19 368 C20 324 10 279 -8 238 Z', thumbHamstrings)}
    ${thumbRegion('M-54 359 C-62 384 -57 404 -42 411 C-29 416 -18 407 -15 390 C-18 374 -19 362 -19 350 C-30 357 -42 362 -54 359 Z', thumbCalves)}
    ${thumbRegion('M54 359 C62 384 57 404 42 411 C29 416 18 407 15 390 C18 374 19 362 19 350 C30 357 42 362 54 359 Z', thumbCalves)}
    ` : `
    ${thumbRegion('M-43 226 C-22 239 22 239 43 226 C38 245 22 257 0 260 C-22 257 -38 245 -43 226 Z', thumbHipFlexors)}
    ${thumbRegion('M-39 242 C-55 284 -58 330 -50 366 C-34 375 -20 369 -19 350 C-19 310 -10 274 8 238 Z', thumbQuads)}
    ${thumbRegion('M39 242 C55 284 58 330 50 366 C34 375 20 369 19 350 C19 310 10 274 -8 238 Z', thumbQuads)}
    ${thumbRegion('M-50 360 C-59 384 -56 403 -42 411 C-29 416 -18 407 -15 390 C-18 375 -19 363 -19 350 C-29 358 -40 362 -50 360 Z', thumbCalves)}
    ${thumbRegion('M50 360 C59 384 56 403 42 411 C29 416 18 407 15 390 C18 375 19 363 19 350 C29 358 40 362 50 360 Z', thumbCalves)}
    `}
  </g>
  <rect x="64" y="270" width="160" height="34" rx="17" fill="#FF6B35"/>
  <text x="144" y="292" fill="#040404" text-anchor="middle" font-family="Space Grotesk, Arial, sans-serif" font-size="14" font-weight="900">${exerciseName}</text>
</svg>`;
}

function thumbnailMuscleColor(primary, secondary) {
  const primarySet = new Set(primary);
  const secondarySet = new Set(secondary);
  const aliases = {
    chest: ['chest', 'upper_chest'],
    upper_chest: ['upper_chest', 'chest'],
    front_delts: ['front_delts', 'shoulders'],
    side_delts: ['side_delts', 'shoulders'],
    rear_delts: ['rear_delts', 'shoulders'],
    shoulders: ['shoulders', 'front_delts', 'side_delts', 'rear_delts'],
    triceps: ['triceps'],
    biceps: ['biceps'],
    core: ['core'],
    lower_abs: ['lower_abs'],
    obliques: ['obliques'],
    hip_flexors: ['hip_flexors'],
    lats: ['lats'],
    rhomboids: ['rhomboids', 'mid_back'],
    mid_back: ['mid_back', 'rhomboids'],
    forearms: ['forearms'],
    lower_back: ['lower_back', 'back'],
    back: ['back', 'lower_back'],
    quads: ['quads'],
    hamstrings: ['hamstrings'],
    glutes: ['glutes'],
    calves: ['calves'],
  };
  return (muscles, inactive = '#2B2B2B') => {
    const keys = Array.isArray(muscles) ? muscles : [muscles];
    const expanded = keys.flatMap(muscle => aliases[muscle] || [muscle]);
    if (expanded.some(muscle => primarySet.has(muscle))) {
      return '#FF6B35';
    }
    if (expanded.some(muscle => secondarySet.has(muscle))) {
      return '#FFB199';
    }
    return inactive;
  };
}

function toTitle(value) {
  return String(value)
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

async function writeThumbnail(filePath, exerciseName, primary, secondary) {
  await sharp(Buffer.from(thumbnailSvg(exerciseName, primary, secondary)))
    .webp({ quality: 88 })
    .toFile(filePath);
}

function seedFor([id, slug, name, primary, secondary, equipment, level, pattern]) {
  return {
    id,
    slug,
    name,
    status: 'published',
    version: 1,
    primaryMuscles: primary,
    secondaryMuscles: secondary,
    equipment,
    level,
    movementPattern: pattern,
    instructions: [
      `Set up for the ${name.toLowerCase()} with control.`,
      'Move through the working range without rushing.',
      'Finish each rep with the target muscles doing the work.',
    ],
    formCues: [
      'Keep the ribs stacked over the hips.',
      'Control the lowering phase.',
      'Stop the set before form breaks down.',
    ],
    commonMistakes: [
      'Rushing the rep.',
      'Losing shoulder position.',
      'Using momentum instead of control.',
    ],
    substitutions: [],
    assetManifest: {
      lottiePath: `workouts/exercises/v1/${id}/demo.lottie.json`,
      thumbnailPath: `workouts/exercises/v1/${id}/thumbnail.webp`,
      muscleMapFrontPath: `workouts/exercises/v1/${id}/muscle-map-front.svg`,
      muscleMapBackPath: `workouts/exercises/v1/${id}/muscle-map-back.svg`,
      assetVersion: 1,
      assetHash: '',
    },
  };
}

async function main() {
  const options = parseArgs();
  const batch = batches[options.batch];
  const seedOut = path.resolve(__dirname, `workout-exercise-seed-batch-${options.batch}.json`);
  const manifestOut = path.resolve(__dirname, `workout-assets-manifest-batch-${options.batch}.json`);

  ensureDir(OUT_ROOT);
  const seeds = [];
  const manifest = [];

  for (const definition of batch.definitions) {
    const [id, , name, primary, secondary] = definition;
    const dir = path.join(OUT_ROOT, id);
    ensureDir(dir);

    const lottiePath = path.join(dir, 'demo.lottie.json');
    const frontPath = path.join(dir, 'muscle-map-front.svg');
    const backPath = path.join(dir, 'muscle-map-back.svg');
    const thumbPath = path.join(dir, 'thumbnail.webp');

    fs.writeFileSync(lottiePath, JSON.stringify(lottieFor(id, primary, secondary), null, 2));
    fs.writeFileSync(frontPath, muscleMap(name, primary, secondary, 'front'));
    fs.writeFileSync(backPath, muscleMap(name, primary, secondary, 'back'));
    await writeThumbnail(thumbPath, name, primary, secondary);

    const assetHash = `sha256:${sha256(lottiePath).slice(0, 16)}:${sha256(frontPath).slice(0, 16)}`;
    const seed = seedFor(definition);
    seed.assetManifest.assetHash = assetHash;
    seeds.push(seed);

    ['demo.lottie.json', 'muscle-map-front.svg', 'muscle-map-back.svg', 'thumbnail.webp'].forEach((fileName) => {
      const localPath = path.join(dir, fileName);
      manifest.push({
        exerciseId: id,
        localPath: path.relative(path.resolve(__dirname, '..'), localPath),
        storagePath: `workouts/exercises/v1/${id}/${fileName}`,
        contentType: fileName.endsWith('.json') ? 'application/json' : fileName.endsWith('.svg') ? 'image/svg+xml' : 'image/webp',
        sha256: sha256(localPath),
      });
    });
  }

  fs.writeFileSync(seedOut, JSON.stringify(seeds, null, 2));
  fs.writeFileSync(manifestOut, JSON.stringify(manifest, null, 2));
  console.log(`Generated Batch ${options.batch} (${batch.name}): ${seeds.length} exercise seeds and ${manifest.length} asset manifest entries.`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  batches,
  parseArgs,
};

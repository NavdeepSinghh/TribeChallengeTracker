const fs = require('fs');
const path = require('path');
const {
  slugify,
  validateExpansionCandidates,
} = require('../../scripts/validate-workout-exercise-expansion-candidates');

const repoRoot = path.resolve(__dirname, '../..');

function loadPlan() {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, 'scripts/workout-exercise-expansion-candidates.json'), 'utf8'));
}

describe('workout exercise expansion candidates', () => {
  it('validates 150 reviewed expansion candidates toward a 200+ library', () => {
    const plan = validateExpansionCandidates(loadPlan());

    expect(plan.exercises).toHaveLength(150);
    expect(plan.targetTotalOfficialExercises).toBe(200);
    expect(plan.existingOfficialExerciseCount + plan.exercises.length).toBe(200);
    expect(plan.metadataVocabulary.levels).toEqual(['beginner', 'intermediate', 'advanced']);
    expect(plan.metadataVocabulary.equipment).toEqual(expect.arrayContaining([
      'bodyweight',
      'dumbbell',
      'barbell',
      'machine',
      'medicine_ball',
      'outdoor',
    ]));
    expect(plan.groups.map(group => group.category)).toEqual([
      'upper_push',
      'upper_pull',
      'lower_body',
      'core',
      'cardio',
      'mobility',
      'power',
    ]);
    expect(plan.groups.find(group => group.category === 'power').exercises.map(exercise => exercise.name)).toEqual([
      'Medicine Ball Slam',
      'Box Jump',
    ]);
    expect(plan.deferredCandidates.phase4CoachPro.exercises).toEqual(expect.arrayContaining([
      'clean_pull',
      'hang_power_clean',
      'power_snatch',
      'kettlebell_snatch',
    ]));
  });

  it('creates stable candidate ids from exercise names', () => {
    expect(slugify("World's Greatest Stretch Flow")).toBe('worlds_greatest_stretch_flow');
    expect(slugify('Front-Foot-Elevated Split Squat')).toBe('front_foot_elevated_split_squat');

    const plan = validateExpansionCandidates(loadPlan());
    expect(plan.exercises.find(exercise => exercise.name === 'Chest Dip')).toMatchObject({
      id: 'chest_dip',
      category: 'upper_push',
      reviewStatus: 'candidate',
    });
  });

  it('rejects duplicate candidates before asset generation starts', () => {
    const plan = loadPlan();
    plan.groups[1].exercises.push('Chest Dip');
    plan.candidateCountTarget += 1;

    expect(() => validateExpansionCandidates(plan)).toThrow(/duplicate expansion exercise id/i);
  });

  it('rejects unsupported health-style claims in candidate names', () => {
    const plan = loadPlan();
    plan.groups[0].exercises[0] = 'Shoulder Injury Cure Press';

    expect(() => validateExpansionCandidates(plan)).toThrow(/unsupported health or medical claim/i);
  });

  it('rejects count drift from the target candidate total', () => {
    const plan = loadPlan();
    plan.groups[0].exercises.pop();

    expect(() => validateExpansionCandidates(plan)).toThrow(/candidateCountTarget is 150 but found 149/i);
  });

  it('rejects deferred high-risk exercises if they re-enter the active candidate list', () => {
    const plan = loadPlan();
    plan.groups.find(group => group.category === 'power').exercises[0] = 'Clean Pull';

    expect(() => validateExpansionCandidates(plan)).toThrow(/deferred candidate cannot also be in the active expansion list/i);
  });

  it('rejects fragmented level vocabulary before batch generation starts', () => {
    const plan = loadPlan();
    plan.metadataVocabulary.levels = ['beginner', 'intermediate', 'expert'];

    expect(() => validateExpansionCandidates(plan)).toThrow(/levels must include advanced/i);
  });
});

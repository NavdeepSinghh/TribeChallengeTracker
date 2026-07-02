import {
  buildTrainingPlanFilterOptions,
  buildSkippedTrainingPlanDayEnrollment,
  buildTrainingPlanExerciseSwap,
  buildTrainingPlanFrequencyAdjustment,
  buildTrainingPlanEnrollment,
  filterTrainingPlans,
  selectTodayTrainingPlanWorkout,
} from "./trainingPlanModels";

export class LoadTrainingPlansUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(filters = {}) {
    const plans = await this.repository.listPublishedTrainingPlans();
    return filterTrainingPlans(plans, filters);
  }
}

export class GetTrainingPlanFilterOptionsUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    const plans = await this.repository.listPublishedTrainingPlans();
    return buildTrainingPlanFilterOptions(plans);
  }
}

export class LoadTrainingPlanEnrollmentsUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    return this.repository.listTrainingPlanEnrollments();
  }
}

export class EnrollInTrainingPlanUseCase {
  constructor(repository, { now = () => new Date(), timezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC" } = {}) {
    this.repository = repository;
    this.now = now;
    this.timezone = timezone;
  }

  async execute(plan) {
    const enrollment = buildTrainingPlanEnrollment({
      plan,
      today: this.now(),
      timezone: this.timezone(),
    });
    return this.repository.saveTrainingPlanEnrollment(enrollment);
  }
}

export class LeaveTrainingPlanUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(planId) {
    return this.repository.leaveTrainingPlan(planId);
  }
}

export class SelectTodayTrainingPlanWorkoutUseCase {
  constructor({ today = () => new Date() } = {}) {
    this.today = today;
  }

  execute(plan, enrollment) {
    return selectTodayTrainingPlanWorkout(plan, enrollment, this.today());
  }
}

export class SkipTrainingPlanDayUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(enrollment, dayKey) {
    const nextEnrollment = buildSkippedTrainingPlanDayEnrollment(enrollment, dayKey);
    return this.repository.saveTrainingPlanEnrollmentPatch(nextEnrollment.planId, {
      completedDayKeys: nextEnrollment.completedDayKeys,
      skippedDayKeys: nextEnrollment.skippedDayKeys,
    });
  }
}

export class AdjustTrainingPlanFrequencyUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(enrollment, daysPerWeek) {
    const nextEnrollment = buildTrainingPlanFrequencyAdjustment(enrollment, daysPerWeek);
    return this.repository.saveTrainingPlanEnrollmentPatch(nextEnrollment.planId, {
      customFrequencyDaysPerWeek: nextEnrollment.customFrequencyDaysPerWeek,
    });
  }
}

export class SwapTrainingPlanExerciseUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(enrollment, swap) {
    const nextEnrollment = buildTrainingPlanExerciseSwap(enrollment, swap);
    return this.repository.saveTrainingPlanEnrollmentPatch(nextEnrollment.planId, {
      exerciseSwaps: nextEnrollment.exerciseSwaps,
    });
  }
}

import { createDefaultTrainingPlanRepository } from "./data/firestoreTrainingPlanRepository";
import {
  EnrollInTrainingPlanUseCase,
  AdjustTrainingPlanFrequencyUseCase,
  GetTrainingPlanFilterOptionsUseCase,
  LeaveTrainingPlanUseCase,
  LoadTrainingPlanEnrollmentsUseCase,
  LoadTrainingPlansUseCase,
  SelectTodayTrainingPlanWorkoutUseCase,
  SkipTrainingPlanDayUseCase,
  SwapTrainingPlanExerciseUseCase,
} from "./domain/trainingPlanUseCases";

export function createTrainingPlanUseCases(repository = createDefaultTrainingPlanRepository()) {
  return {
    adjustFrequency: new AdjustTrainingPlanFrequencyUseCase(repository),
    enrollInPlan: new EnrollInTrainingPlanUseCase(repository),
    loadTrainingPlans: new LoadTrainingPlansUseCase(repository),
    loadEnrollments: new LoadTrainingPlanEnrollmentsUseCase(repository),
    getFilterOptions: new GetTrainingPlanFilterOptionsUseCase(repository),
    leavePlan: new LeaveTrainingPlanUseCase(repository),
    selectTodayWorkout: new SelectTodayTrainingPlanWorkoutUseCase(),
    skipPlanDay: new SkipTrainingPlanDayUseCase(repository),
    swapExercise: new SwapTrainingPlanExerciseUseCase(repository),
  };
}

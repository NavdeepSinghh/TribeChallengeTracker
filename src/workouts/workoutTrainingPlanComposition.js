import { createDefaultTrainingPlanRepository } from "./data/firestoreTrainingPlanRepository";
import {
  GetTrainingPlanFilterOptionsUseCase,
  LoadTrainingPlansUseCase,
} from "./domain/trainingPlanUseCases";

export function createTrainingPlanUseCases(repository = createDefaultTrainingPlanRepository()) {
  return {
    loadTrainingPlans: new LoadTrainingPlansUseCase(repository),
    getFilterOptions: new GetTrainingPlanFilterOptionsUseCase(repository),
  };
}

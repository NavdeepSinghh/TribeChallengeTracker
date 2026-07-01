import { createDefaultWorkoutCatalogRepository } from "./data/firestoreWorkoutCatalogRepository";
import {
  GetWorkoutExerciseFilterOptionsUseCase,
  LoadWorkoutExerciseCatalogUseCase,
} from "./domain/workoutCatalogUseCases";

export function createWorkoutCatalogUseCases(repository = createDefaultWorkoutCatalogRepository()) {
  return {
    loadCatalog: new LoadWorkoutExerciseCatalogUseCase(repository),
    getFilterOptions: new GetWorkoutExerciseFilterOptionsUseCase(repository),
  };
}


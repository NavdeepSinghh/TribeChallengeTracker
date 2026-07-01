import {
  filterExercises,
  selectBackendCatalogFilter,
} from "./workoutCatalogModels";

export class LoadWorkoutExerciseCatalogUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(filters = {}) {
    const backendFilter = selectBackendCatalogFilter(filters);
    const exercises = await this.repository.listPublishedExercises(backendFilter);
    return filterExercises(exercises, filters);
  }
}

export class GetWorkoutExerciseFilterOptionsUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    return this.repository.listFilterOptions();
  }
}


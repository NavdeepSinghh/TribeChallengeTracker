import {
  buildTrainingPlanFilterOptions,
  filterTrainingPlans,
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

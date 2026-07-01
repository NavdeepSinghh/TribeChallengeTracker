import {
  buildVolumeTrend,
  summarizeWorkoutHistory,
} from "./workoutHistoryModels";

export class LoadWorkoutHistoryUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute({ limit = 12 } = {}) {
    return this.repository.listCompletedSessions({ limit });
  }
}

export class LoadWorkoutPersonalRecordsUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    return this.repository.listPersonalRecords();
  }
}

export class GetWorkoutHistorySummaryUseCase {
  execute({ sessions = [], personalRecords = [] } = {}) {
    return summarizeWorkoutHistory(sessions, personalRecords);
  }
}

export class GetWorkoutVolumeTrendUseCase {
  execute({ sessions = [], limit = 6 } = {}) {
    return buildVolumeTrend(sessions, limit);
  }
}

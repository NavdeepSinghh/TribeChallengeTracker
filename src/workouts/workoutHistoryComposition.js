import { createDefaultWorkoutHistoryRepository } from "./data/firestoreWorkoutHistoryRepository";
import {
  GetWorkoutHistorySummaryUseCase,
  GetWorkoutVolumeTrendUseCase,
  LoadWorkoutHistoryUseCase,
  LoadWorkoutPersonalRecordsUseCase,
} from "./domain/workoutHistoryUseCases";

export function createWorkoutHistoryUseCases(repository = createDefaultWorkoutHistoryRepository()) {
  return {
    loadHistory: new LoadWorkoutHistoryUseCase(repository),
    loadPersonalRecords: new LoadWorkoutPersonalRecordsUseCase(repository),
    getSummary: new GetWorkoutHistorySummaryUseCase(),
    getVolumeTrend: new GetWorkoutVolumeTrendUseCase(),
  };
}

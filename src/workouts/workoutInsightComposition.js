import { createDefaultWorkoutInsightRepository } from "./data/firestoreWorkoutInsightRepository";
import {
  BuildMuscleVolumeInsightUseCase,
  BuildProgressionInsightCopyUseCase,
  LoadWorkoutInsightAggregatesUseCase,
  LoadWorkoutProgressionSuggestionsUseCase,
  SelectProgressionExerciseCandidateUseCase,
  SyncWorkoutInsightAggregateUseCase,
  SyncWorkoutProgressionSuggestionUseCase,
} from "./domain/workoutInsightUseCases";

export function createWorkoutInsightUseCases(repository = createDefaultWorkoutInsightRepository()) {
  return {
    buildMuscleVolumeInsight: new BuildMuscleVolumeInsightUseCase(),
    buildProgressionInsightCopy: new BuildProgressionInsightCopyUseCase(),
    loadAggregates: new LoadWorkoutInsightAggregatesUseCase(repository),
    loadProgressionSuggestions: new LoadWorkoutProgressionSuggestionsUseCase(repository),
    selectProgressionCandidate: new SelectProgressionExerciseCandidateUseCase(),
    syncAggregate: new SyncWorkoutInsightAggregateUseCase(repository),
    syncProgressionSuggestion: new SyncWorkoutProgressionSuggestionUseCase(repository),
  };
}

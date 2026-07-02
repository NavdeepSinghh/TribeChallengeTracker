import {
  buildMuscleVolumeInsight,
  buildProgressionInsightCopy,
  selectProgressionExerciseCandidate,
} from "./workoutInsightModels";

export class LoadWorkoutProgressionSuggestionsUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    return this.repository.listProgressionSuggestions();
  }
}

export class SyncWorkoutProgressionSuggestionUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute({ exerciseId, level = "beginner" } = {}) {
    return this.repository.syncProgressionSuggestion({ exerciseId, level });
  }
}

export class LoadWorkoutInsightAggregatesUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute({ limit = 4 } = {}) {
    return this.repository.listInsightAggregates({ limit });
  }
}

export class SyncWorkoutInsightAggregateUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute({ weekKey } = {}) {
    return this.repository.syncInsightAggregate({ weekKey });
  }
}

export class SelectProgressionExerciseCandidateUseCase {
  execute({ sessions = [], suggestions = [] } = {}) {
    return selectProgressionExerciseCandidate(sessions, suggestions);
  }
}

export class BuildProgressionInsightCopyUseCase {
  execute({ candidate, suggestion } = {}) {
    return buildProgressionInsightCopy({ candidate, suggestion });
  }
}

export class BuildMuscleVolumeInsightUseCase {
  execute({ aggregate } = {}) {
    return buildMuscleVolumeInsight(aggregate);
  }
}

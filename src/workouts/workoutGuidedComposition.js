import { createDefaultGuidedWorkoutRepository } from "./data/webGuidedWorkoutRepository";
import {
  ClearActiveGuidedWorkoutUseCase,
  ClearPendingGuidedWorkoutFinishUseCase,
  FinishGuidedWorkoutUseCase,
  LoadActiveGuidedWorkoutUseCase,
  LoadPendingGuidedWorkoutFinishUseCase,
  SaveActiveGuidedWorkoutUseCase,
  SavePendingGuidedWorkoutFinishUseCase,
} from "./domain/guidedWorkoutUseCases";

export function createGuidedWorkoutUseCases(repository = createDefaultGuidedWorkoutRepository()) {
  return {
    clearActiveSession: new ClearActiveGuidedWorkoutUseCase(repository),
    clearPendingFinish: new ClearPendingGuidedWorkoutFinishUseCase(repository),
    finishSession: new FinishGuidedWorkoutUseCase(repository),
    loadActiveSession: new LoadActiveGuidedWorkoutUseCase(repository),
    loadPendingFinish: new LoadPendingGuidedWorkoutFinishUseCase(repository),
    saveActiveSession: new SaveActiveGuidedWorkoutUseCase(repository),
    savePendingFinish: new SavePendingGuidedWorkoutFinishUseCase(repository),
  };
}

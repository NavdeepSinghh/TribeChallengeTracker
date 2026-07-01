// Reference scaffold only. Keep domain types free of React and Firebase imports.

export type WorkoutLevel = "beginner" | "intermediate" | "advanced";
export type WorkoutVisibility = "private" | "tribe" | "public";

export interface ExerciseAssetManifest {
  lottiePath: string;
  thumbnailPath: string;
  muscleMapFrontPath: string;
  muscleMapBackPath: string;
  assetVersion: number;
  assetHash: string;
}

export interface Exercise {
  id: string;
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string[];
  level: WorkoutLevel;
  instructions: string[];
  formCues: string[];
  commonMistakes: string[];
  assetManifest: ExerciseAssetManifest;
}

export interface WorkoutCatalogFilter {
  searchText?: string;
  muscleGroup?: string;
  equipment?: string;
  level?: WorkoutLevel;
}

export interface WorkoutCatalogRepository {
  listExercises(filter: WorkoutCatalogFilter): Promise<Exercise[]>;
}

export class ListExercisesUseCase {
  constructor(private readonly repository: WorkoutCatalogRepository) {}

  execute(filter: WorkoutCatalogFilter): Promise<Exercise[]> {
    return this.repository.listExercises(filter);
  }
}


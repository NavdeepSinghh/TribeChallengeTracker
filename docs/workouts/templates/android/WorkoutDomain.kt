package app.tribelog.workouts.template

// Reference scaffold only. Keep domain models free of Compose and Firebase imports.

enum class WorkoutLevel {
    Beginner,
    Intermediate,
    Advanced
}

enum class WorkoutVisibility {
    Private,
    Tribe,
    Public
}

data class ExerciseAssetManifest(
    val lottiePath: String,
    val thumbnailPath: String,
    val muscleMapFrontPath: String,
    val muscleMapBackPath: String,
    val assetVersion: Int,
    val assetHash: String
)

data class Exercise(
    val id: String,
    val name: String,
    val primaryMuscles: List<String>,
    val secondaryMuscles: List<String>,
    val equipment: List<String>,
    val level: WorkoutLevel,
    val instructions: List<String>,
    val formCues: List<String>,
    val commonMistakes: List<String>,
    val assetManifest: ExerciseAssetManifest
)

data class WorkoutCatalogFilter(
    val searchText: String = "",
    val muscleGroup: String? = null,
    val equipment: String? = null,
    val level: WorkoutLevel? = null
)

interface WorkoutCatalogRepository {
    suspend fun listExercises(filter: WorkoutCatalogFilter): List<Exercise>
}

class ListExercisesUseCase(
    private val repository: WorkoutCatalogRepository
) {
    suspend fun execute(filter: WorkoutCatalogFilter): List<Exercise> {
        return repository.listExercises(filter)
    }
}


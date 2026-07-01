import Foundation

// Reference scaffold only. Do not add this file to the production target as-is.

enum WorkoutLevel: String, Codable, Equatable {
    case beginner
    case intermediate
    case advanced
}

enum WorkoutVisibility: String, Codable, Equatable {
    case `private`
    case tribe
    case `public`
}

struct Exercise: Identifiable, Codable, Equatable {
    let id: String
    let name: String
    let primaryMuscles: [String]
    let secondaryMuscles: [String]
    let equipment: [String]
    let level: WorkoutLevel
    let instructions: [String]
    let formCues: [String]
    let commonMistakes: [String]
    let assetManifest: ExerciseAssetManifest
}

struct ExerciseAssetManifest: Codable, Equatable {
    let lottiePath: String
    let thumbnailPath: String
    let muscleMapFrontPath: String
    let muscleMapBackPath: String
    let assetVersion: Int
    let assetHash: String
}

struct WorkoutCatalogFilter: Equatable {
    var searchText: String = ""
    var muscleGroup: String?
    var equipment: String?
    var level: WorkoutLevel?
}

protocol WorkoutCatalogRepository {
    func listExercises(filter: WorkoutCatalogFilter) async throws -> [Exercise]
}

struct ListExercisesUseCase {
    let repository: WorkoutCatalogRepository

    func execute(filter: WorkoutCatalogFilter) async throws -> [Exercise] {
        try await repository.listExercises(filter: filter)
    }
}


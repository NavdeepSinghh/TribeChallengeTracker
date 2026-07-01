import Foundation

// Reference scaffold only. ViewModel exposes UI state and depends on domain use cases only.

@MainActor
final class WorkoutCatalogViewModel: ObservableObject {
    enum State: Equatable {
        case idle
        case loading
        case loaded([Exercise])
        case empty
        case failed(String)
    }

    @Published private(set) var state: State = .idle
    @Published var searchText: String = ""
    @Published var selectedLevel: WorkoutLevel?

    private let listExercises: ListExercisesUseCase

    init(listExercises: ListExercisesUseCase) {
        self.listExercises = listExercises
    }

    func load() async {
        state = .loading
        do {
            let filter = WorkoutCatalogFilter(searchText: searchText, level: selectedLevel)
            let exercises = try await listExercises.execute(filter: filter)
            state = exercises.isEmpty ? .empty : .loaded(exercises)
        } catch {
            state = .failed("Workouts could not load. Try again.")
        }
    }
}


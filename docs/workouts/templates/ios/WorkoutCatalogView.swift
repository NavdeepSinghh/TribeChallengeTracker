import SwiftUI

// Reference scaffold only. The View observes UI state and does not query Firestore directly.

struct WorkoutCatalogView: View {
    @StateObject var viewModel: WorkoutCatalogViewModel

    var body: some View {
        NavigationStack {
            Group {
                switch viewModel.state {
                case .idle, .loading:
                    ProgressView()
                case .empty:
                    ContentUnavailableView("No exercises", systemImage: "figure.strengthtraining.traditional")
                case .failed(let message):
                    VStack(spacing: 12) {
                        Text(message)
                        Button("Retry") {
                            Task { await viewModel.load() }
                        }
                    }
                case .loaded(let exercises):
                    List(exercises) { exercise in
                        VStack(alignment: .leading, spacing: 4) {
                            Text(exercise.name).font(.headline)
                            Text(exercise.primaryMuscles.joined(separator: " · "))
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                }
            }
            .navigationTitle("Workouts")
            .task { await viewModel.load() }
        }
    }
}


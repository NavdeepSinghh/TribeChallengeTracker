package app.tribelog.workouts.template

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

// Reference scaffold only. ViewModel depends on domain use cases, not Firestore or Compose.

sealed interface WorkoutCatalogUiState {
    data object Idle : WorkoutCatalogUiState
    data object Loading : WorkoutCatalogUiState
    data class Loaded(val exercises: List<Exercise>) : WorkoutCatalogUiState
    data object Empty : WorkoutCatalogUiState
    data class Failed(val message: String) : WorkoutCatalogUiState
}

class WorkoutCatalogViewModel(
    private val listExercises: ListExercisesUseCase
) : ViewModel() {
    private val mutableState = MutableStateFlow<WorkoutCatalogUiState>(WorkoutCatalogUiState.Idle)
    val state: StateFlow<WorkoutCatalogUiState> = mutableState.asStateFlow()

    var searchText: String = ""
    var selectedLevel: WorkoutLevel? = null

    fun load() {
        viewModelScope.launch {
            mutableState.value = WorkoutCatalogUiState.Loading
            try {
                val exercises = listExercises.execute(
                    WorkoutCatalogFilter(searchText = searchText, level = selectedLevel)
                )
                mutableState.value = if (exercises.isEmpty()) {
                    WorkoutCatalogUiState.Empty
                } else {
                    WorkoutCatalogUiState.Loaded(exercises)
                }
            } catch (_: Throwable) {
                mutableState.value = WorkoutCatalogUiState.Failed("Workouts could not load. Try again.")
            }
        }
    }
}


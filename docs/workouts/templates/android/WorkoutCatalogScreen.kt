package app.tribelog.workouts.template

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

// Reference scaffold only. Screen renders state and delegates behavior to ViewModel.

@Composable
fun WorkoutCatalogScreen(viewModel: WorkoutCatalogViewModel) {
    val state by viewModel.state.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.load()
    }

    when (val current = state) {
        WorkoutCatalogUiState.Idle,
        WorkoutCatalogUiState.Loading -> CircularProgressIndicator()

        WorkoutCatalogUiState.Empty -> Text("No exercises yet")

        is WorkoutCatalogUiState.Failed -> Column(Modifier.padding(16.dp)) {
            Text(current.message)
            Button(onClick = { viewModel.load() }) {
                Text("Retry")
            }
        }

        is WorkoutCatalogUiState.Loaded -> Column(Modifier.padding(16.dp)) {
            Text("Workouts")
            current.exercises.forEach { exercise ->
                Text(exercise.name)
                Text(exercise.primaryMuscles.joinToString(" · "))
            }
        }
    }
}


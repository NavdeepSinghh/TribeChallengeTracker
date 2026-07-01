# Milestone 3 Architecture Review

## Layer Separation

| Layer | Files | Status |
|---|---|---|
| Domain | `workoutCatalogModels.js`, `workoutCatalogUseCases.js` | Pass |
| Data | `firestoreWorkoutCatalogRepository.js` | Pass |
| Presentation | `useWorkoutCatalogViewModel.js`, `WorkoutsLibrarySection.jsx` | Pass |
| Composition | `workoutCatalogComposition.js` | Pass |
| App wiring | `BoardTab.jsx`, `boardTabProps.js` | Pass |

## ViewModel Compliance

- `useWorkoutCatalogViewModel` receives use cases.
- It does not import Firestore.
- It does not instantiate repository implementations.
- UI state is explicit: `idle`, `loading`, `loaded`, `empty`, `failed`.
- Search/filter state is held in the ViewModel.
- Search is local; backend reloads only happen when indexed filters change.
- Empty-search rendering is owned by the ViewModel through `isEmpty`, so the view does not infer divergent empty behavior from filtered results.

## Repository Compliance

- Firestore imports appear only in `src/workouts/data/firestoreWorkoutCatalogRepository.js`.
- Repository maps Firestore documents into domain entities before returning.
- Query strategy matches existing composite indexes.

## Dependency Injection

- `createWorkoutCatalogUseCases` is the composition root for Web.
- `BoardTab` constructs the use cases once and passes them to the Workouts library.
- Tests can inject a static ViewModel or fake use cases without touching Firestore.

## Risks

- The presentation component imports the ViewModel hook directly, which is expected for React. It does not import Firestore.
- Full emulator rule tests are still deferred to Milestone 8 per approved plan.

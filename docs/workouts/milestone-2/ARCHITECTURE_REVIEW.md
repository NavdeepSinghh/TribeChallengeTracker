# Milestone 2 Architecture Review

## Status

Completed.

## Findings

### Admin Boundary

The seed path is operational/admin-side only. It uses Firebase Admin SDK and refuses live writes unless the provided admin UID exists in `/admins`.

### Backend-Driven Content

The seed file establishes the initial backend catalog shape for 3 proof exercises. Clients still do not hardcode exercise content.

### Asset Manifest Discipline

The validator enforces versioned asset paths:

```text
workouts/exercises/vN/{exerciseId}/...
```

### Social Safety

Direct `publicWorkouts` writes now require a real owned source session in Firestore rules. This reduces malicious-client discovery spam risk while preserving the Cloud Function as the trusted path.

### Points Consistency

Activity and feed mirrors now use the same point source.

## Residual Risk

- Full runtime rules allow/deny tests remain deferred to the Milestone 8 gate.
- Live seed apply has not been run.
- No admin UI exists yet; this is a script-based seed/update path.


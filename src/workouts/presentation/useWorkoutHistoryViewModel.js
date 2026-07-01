import { useCallback, useEffect, useMemo, useState } from "react";

export function useWorkoutHistoryViewModel({ useCases } = {}) {
  const [status, setStatus] = useState("loading");
  const [sessions, setSessions] = useState([]);
  const [personalRecords, setPersonalRecords] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const summary = useMemo(
    () => useCases?.getSummary?.execute({ sessions, personalRecords }) || {},
    [personalRecords, sessions, useCases],
  );
  const volumeTrend = useMemo(
    () => useCases?.getVolumeTrend?.execute({ sessions, limit: 6 }) || [],
    [sessions, useCases],
  );

  const load = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const [nextSessions, nextRecords] = await Promise.all([
        useCases.loadHistory.execute({ limit: 12 }),
        useCases.loadPersonalRecords.execute(),
      ]);
      setSessions(nextSessions);
      setPersonalRecords(nextRecords);
      setStatus(nextSessions.length || nextRecords.length ? "loaded" : "empty");
    } catch (error) {
      setSessions([]);
      setPersonalRecords([]);
      setErrorMessage(error.message || "Workout history could not load.");
      setStatus("failed");
    }
  }, [useCases]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    errorMessage,
    load,
    personalRecords,
    sessions,
    status,
    summary,
    volumeTrend,
  };
}

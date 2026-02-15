import { useState, useCallback } from "react";

export type JobStatus = "Not Applied" | "Applied" | "Rejected" | "Selected";

export interface StatusEntry {
  status: JobStatus;
  updatedAt: string; // ISO string
}

const STORAGE_KEY = "jobTrackerStatus";

function loadAll(): Record<string, StatusEntry> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAll(data: Record<string, StatusEntry>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useJobStatus() {
  const [statuses, setStatuses] = useState<Record<string, StatusEntry>>(loadAll);

  const getStatus = useCallback(
    (jobId: string): JobStatus => statuses[jobId]?.status ?? "Not Applied",
    [statuses]
  );

  const getEntry = useCallback(
    (jobId: string): StatusEntry | undefined => statuses[jobId],
    [statuses]
  );

  const setStatus = useCallback((jobId: string, status: JobStatus) => {
    setStatuses((prev) => {
      const next = {
        ...prev,
        [jobId]: { status, updatedAt: new Date().toISOString() },
      };
      saveAll(next);
      return next;
    });
  }, []);

  const allEntries = statuses;

  return { getStatus, getEntry, setStatus, allEntries };
}

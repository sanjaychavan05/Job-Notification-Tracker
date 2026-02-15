import { useState, useCallback } from "react";

const STORAGE_KEY = "jobTrackerPreferences";

export interface Preferences {
  roleKeywords: string;
  preferredLocations: string[];
  preferredMode: string[];
  experienceLevel: string;
  skills: string;
  minMatchScore: number;
}

export const defaultPreferences: Preferences = {
  roleKeywords: "",
  preferredLocations: [],
  preferredMode: [],
  experienceLevel: "",
  skills: "",
  minMatchScore: 40,
};

function load(): Preferences | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(
    () => load() ?? defaultPreferences
  );

  const hasPreferences = useCallback(() => {
    return load() !== null;
  }, []);

  const save = useCallback((prefs: Preferences) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
  }, []);

  return { preferences, save, hasPreferences };
}

import type { Job } from "@/data/jobs";
import type { Preferences } from "@/hooks/usePreferences";

function parseCSV(csv: string): string[] {
  return csv
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function computeMatchScore(job: Job, prefs: Preferences): number {
  let score = 0;

  const keywords = parseCSV(prefs.roleKeywords);
  const userSkills = parseCSV(prefs.skills);
  const titleLower = job.title.toLowerCase();
  const descLower = job.description.toLowerCase();

  // +25 if any roleKeyword in title
  if (keywords.length > 0 && keywords.some((kw) => titleLower.includes(kw))) {
    score += 25;
  }

  // +15 if any roleKeyword in description
  if (keywords.length > 0 && keywords.some((kw) => descLower.includes(kw))) {
    score += 15;
  }

  // +15 if location matches
  if (
    prefs.preferredLocations.length > 0 &&
    prefs.preferredLocations.includes(job.location)
  ) {
    score += 15;
  }

  // +10 if mode matches
  if (prefs.preferredMode.length > 0 && prefs.preferredMode.includes(job.mode)) {
    score += 10;
  }

  // +10 if experience matches
  if (prefs.experienceLevel && job.experience === prefs.experienceLevel) {
    score += 10;
  }

  // +15 if skill overlap
  if (
    userSkills.length > 0 &&
    job.skills.some((s) => userSkills.includes(s.toLowerCase()))
  ) {
    score += 15;
  }

  // +5 if posted <= 2 days ago
  if (job.postedDaysAgo <= 2) {
    score += 5;
  }

  // +5 if source is LinkedIn
  if (job.source === "LinkedIn") {
    score += 5;
  }

  return Math.min(score, 100);
}

export function extractSalaryNum(range: string): number {
  // Extract first number from salary string for sorting
  const match = range.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

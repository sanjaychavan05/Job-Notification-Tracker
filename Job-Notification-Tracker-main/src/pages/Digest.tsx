import { useState, useMemo, useCallback } from "react";
import { Mail, Copy, Send, Clock, MapPin, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { jobs } from "@/data/jobs";
import type { Job } from "@/data/jobs";
import { usePreferences } from "@/hooks/usePreferences";
import { useJobStatus, type StatusEntry } from "@/hooks/useJobStatus";
import { computeMatchScore } from "@/lib/matchScore";
import { useToast } from "@/hooks/use-toast";

interface DigestEntry {
  job: Job;
  matchScore: number;
}

interface StoredDigest {
  date: string;
  entries: { jobId: string; matchScore: number }[];
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDisplayDate(): string {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function loadDigest(dateKey: string): StoredDigest | null {
  try {
    const raw = localStorage.getItem(`jobTrackerDigest_${dateKey}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveDigest(dateKey: string, entries: DigestEntry[]): void {
  const stored: StoredDigest = {
    date: dateKey,
    entries: entries.map((e) => ({ jobId: e.job.id, matchScore: e.matchScore })),
  };
  localStorage.setItem(`jobTrackerDigest_${dateKey}`, JSON.stringify(stored));
}

function hydrateDigest(stored: StoredDigest): DigestEntry[] {
  const jobMap = new Map(jobs.map((j) => [j.id, j]));
  return stored.entries
    .map((e) => {
      const job = jobMap.get(e.jobId);
      return job ? { job, matchScore: e.matchScore } : null;
    })
    .filter(Boolean) as DigestEntry[];
}

function digestToPlainText(entries: DigestEntry[]): string {
  const lines = [
    `Top ${entries.length} Jobs For You — 9AM Digest`,
    formatDisplayDate(),
    "",
    ...entries.map(
      (e, i) =>
        `${i + 1}. ${e.job.title} at ${e.job.company}\n   📍 ${e.job.location} · ${e.job.experience === "Fresher" ? "Fresher" : e.job.experience + " yrs"} · Match: ${e.matchScore}%\n   Apply: ${e.job.applyUrl}`
    ),
    "",
    "This digest was generated based on your preferences.",
  ];
  return lines.join("\n");
}

function scoreColor(score: number): string {
  if (score >= 80) return "bg-success/15 text-success border-success/30";
  if (score >= 60) return "bg-warning/15 text-warning-foreground border-warning/30";
  if (score >= 40) return "bg-muted text-muted-foreground border-border";
  return "bg-muted/50 text-muted-foreground/60 border-border/50";
}

const Digest = () => {
  const { preferences, hasPreferences } = usePreferences();
  const prefsExist = hasPreferences();
  const { toast } = useToast();
  const { allEntries } = useJobStatus();

  const recentStatusUpdates = useMemo(() => {
    const jobMap = new Map(jobs.map((j) => [j.id, j]));
    return Object.entries(allEntries)
      .filter(([, entry]) => entry.status !== "Not Applied")
      .map(([jobId, entry]) => ({ job: jobMap.get(jobId)!, ...entry }))
      .filter((e) => e.job)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10);
  }, [allEntries]);

  const [digestEntries, setDigestEntries] = useState<DigestEntry[]>(() => {
    if (!prefsExist) return [];
    const existing = loadDigest(todayKey());
    return existing ? hydrateDigest(existing) : [];
  });

  const [generated, setGenerated] = useState<boolean>(() => {
    if (!prefsExist) return false;
    return loadDigest(todayKey()) !== null;
  });

  const generateDigest = useCallback(() => {
    const key = todayKey();
    const existing = loadDigest(key);
    if (existing) {
      setDigestEntries(hydrateDigest(existing));
      setGenerated(true);
      toast({ title: "Digest loaded", description: "Today's digest was already generated." });
      return;
    }

    const scored = jobs
      .map((job) => ({ job, matchScore: computeMatchScore(job, preferences) }))
      .sort((a, b) => {
        if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
        return a.job.postedDaysAgo - b.job.postedDaysAgo;
      })
      .slice(0, 10);

    saveDigest(key, scored);
    setDigestEntries(scored);
    setGenerated(true);
    toast({ title: "Digest generated", description: "Your top 10 jobs for today are ready." });
  }, [preferences, toast]);

  const handleCopy = useCallback(async () => {
    const text = digestToPlainText(digestEntries);
    await navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  }, [digestEntries, toast]);

  const handleEmailDraft = useCallback(() => {
    const text = digestToPlainText(digestEntries);
    const subject = encodeURIComponent("My 9AM Job Digest");
    const body = encodeURIComponent(text);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
  }, [digestEntries]);

  // --- No preferences state ---
  if (!prefsExist) {
    return (
      <div className="mx-auto max-w-7xl px-system-3 py-system-5">
        <div className="max-w-prose">
          <h1 className="text-4xl text-foreground">Daily Digest</h1>
          <p className="mt-system-1 text-base text-muted-foreground">
            Your curated job digest, delivered every morning.
          </p>
        </div>
        <div className="mt-system-5 flex flex-col items-center rounded-lg border border-border bg-card px-system-4 py-system-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Mail className="h-7 w-7 text-muted-foreground" />
          </div>
          <h2 className="mt-system-3 text-xl text-foreground">Set preferences first</h2>
          <p className="mt-system-1 max-w-sm text-sm text-muted-foreground">
            Set preferences to generate a personalized digest.
          </p>
          <Button variant="outline" size="sm" className="mt-system-3" asChild>
            <a href="/settings">Go to Settings</a>
          </Button>
        </div>
      </div>
    );
  }

  // --- Not yet generated state ---
  if (!generated) {
    return (
      <div className="mx-auto max-w-7xl px-system-3 py-system-5">
        <div className="max-w-prose">
          <h1 className="text-4xl text-foreground">Daily Digest</h1>
          <p className="mt-system-1 text-base text-muted-foreground">
            Your curated job digest, delivered every morning.
          </p>
        </div>
        <div className="mt-system-5 flex flex-col items-center rounded-lg border border-border bg-card px-system-4 py-system-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Sparkles className="h-7 w-7 text-muted-foreground" />
          </div>
          <h2 className="mt-system-3 text-xl text-foreground">Ready to generate</h2>
          <p className="mt-system-1 max-w-sm text-sm text-muted-foreground">
            Click below to simulate your 9AM daily digest based on your saved preferences.
          </p>
          <Button className="mt-system-3" onClick={generateDigest}>
            Generate Today's 9AM Digest (Simulated)
          </Button>
          <p className="mt-system-2 text-xs text-muted-foreground">
            Demo Mode: Daily 9AM trigger simulated manually.
          </p>
        </div>
      </div>
    );
  }

  // --- No matches state ---
  if (digestEntries.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-system-3 py-system-5">
        <div className="max-w-prose">
          <h1 className="text-4xl text-foreground">Daily Digest</h1>
          <p className="mt-system-1 text-base text-muted-foreground">
            Your curated job digest, delivered every morning.
          </p>
        </div>
        <div className="mt-system-5 flex flex-col items-center rounded-lg border border-border bg-card px-system-4 py-system-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Mail className="h-7 w-7 text-muted-foreground" />
          </div>
          <h2 className="mt-system-3 text-xl text-foreground">No matching roles today</h2>
          <p className="mt-system-1 max-w-sm text-sm text-muted-foreground">
            No matching roles today. Check again tomorrow.
          </p>
        </div>
      </div>
    );
  }

  // --- Digest rendered ---
  return (
    <div className="mx-auto max-w-7xl px-system-3 py-system-5">
      <div className="max-w-prose">
        <h1 className="text-4xl text-foreground">Daily Digest</h1>
        <p className="mt-system-1 text-base text-muted-foreground">
          Your curated job digest, delivered every morning.
        </p>
      </div>

      {/* Email-style digest card */}
      <div className="mx-auto mt-system-5 max-w-2xl">
        <div className="rounded-lg border border-border bg-card shadow-sm">
          {/* Email header */}
          <div className="border-b border-border px-system-4 py-system-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Top {digestEntries.length} Jobs For You — 9AM Digest
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{formatDisplayDate()}</p>
          </div>

          {/* Job entries */}
          <div className="divide-y divide-border">
            {digestEntries.map((entry, idx) => (
              <div key={entry.job.id} className="px-system-4 py-system-3">
                <div className="flex items-start justify-between gap-system-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">{idx + 1}.</span>
                      <h3 className="text-base font-semibold text-foreground">{entry.job.title}</h3>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{entry.job.company}</p>
                  </div>
                  <Badge variant="outline" className={`shrink-0 text-xs font-semibold ${scoreColor(entry.matchScore)}`}>
                    {entry.matchScore}%
                  </Badge>
                </div>

                <div className="mt-system-1 flex flex-wrap items-center gap-x-system-2 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {entry.job.location} · {entry.job.mode}
                  </span>
                  <span>{entry.job.experience === "Fresher" ? "Fresher" : `${entry.job.experience} yrs`}</span>
                  <span className="font-medium text-foreground">{entry.job.salaryRange}</span>
                </div>

                <div className="mt-system-2 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {entry.job.postedDaysAgo === 0
                      ? "Today"
                      : entry.job.postedDaysAgo === 1
                      ? "1 day ago"
                      : `${entry.job.postedDaysAgo} days ago`}
                  </span>
                  <Button variant="ghost" size="sm" asChild className="gap-1 text-xs">
                    <a href={entry.job.applyUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Apply
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Email footer */}
          <div className="border-t border-border px-system-4 py-system-3">
            <p className="text-xs text-muted-foreground">
              This digest was generated based on your preferences.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-system-3 flex flex-wrap items-center gap-system-2">
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
            <Copy className="h-3.5 w-3.5" />
            Copy Digest to Clipboard
          </Button>
          <Button variant="outline" size="sm" onClick={handleEmailDraft} className="gap-1.5">
            <Send className="h-3.5 w-3.5" />
            Create Email Draft
          </Button>
        </div>

        {/* Recent Status Updates */}
        {recentStatusUpdates.length > 0 && (
          <div className="mt-system-5">
            <h2 className="text-xl font-semibold text-foreground">Recent Status Updates</h2>
            <div className="mt-system-2 rounded-lg border border-border bg-card divide-y divide-border">
              {recentStatusUpdates.map((entry) => (
                <div key={entry.job.id} className="flex items-center justify-between px-system-3 py-system-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{entry.job.title}</p>
                    <p className="text-xs text-muted-foreground">{entry.job.company}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-system-2">
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold ${
                        entry.status === "Selected"
                          ? "bg-success/15 text-success border-success/30"
                          : entry.status === "Applied"
                          ? "bg-[hsl(210_60%_50%/0.15)] text-[hsl(210_60%_50%)] border-[hsl(210_60%_50%/0.3)]"
                          : entry.status === "Rejected"
                          ? "bg-destructive/15 text-destructive border-destructive/30"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {entry.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.updatedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Simulation note */}
        <p className="mt-system-3 text-center text-xs text-muted-foreground">
          Demo Mode: Daily 9AM trigger simulated manually.
        </p>
      </div>
    </div>
  );
};

export default Digest;

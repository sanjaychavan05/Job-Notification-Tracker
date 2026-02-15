import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { jobs } from "@/data/jobs";
import type { Job } from "@/data/jobs";
import JobCard from "@/components/JobCard";
import JobDetailModal from "@/components/JobDetailModal";
import FilterBar, { type Filters } from "@/components/FilterBar";
import { useSavedJobs } from "@/hooks/useSavedJobs";
import { usePreferences } from "@/hooks/usePreferences";
import { useJobStatus } from "@/hooks/useJobStatus";
import { computeMatchScore, extractSalaryNum } from "@/lib/matchScore";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const defaultFilters: Filters = {
  keyword: "",
  location: "all",
  mode: "all",
  experience: "all",
  source: "all",
  sort: "latest",
  status: "all",
};

const Dashboard = () => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [viewJob, setViewJob] = useState<Job | null>(null);
  const [thresholdOn, setThresholdOn] = useState(false);
  const { isSaved, toggleSave } = useSavedJobs();
  const { preferences, hasPreferences } = usePreferences();
  const { getStatus, setStatus } = useJobStatus();
  const { toast } = useToast();
  const prefsExist = hasPreferences();

  const scored = useMemo(() => {
    return jobs.map((job) => ({
      job,
      matchScore: prefsExist ? computeMatchScore(job, preferences) : 0,
    }));
  }, [preferences, prefsExist]);

  const filtered = useMemo(() => {
    let result = [...scored];

    // threshold toggle
    if (thresholdOn && prefsExist) {
      result = result.filter((r) => r.matchScore >= preferences.minMatchScore);
    }

    // keyword
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      result = result.filter(
        (r) =>
          r.job.title.toLowerCase().includes(kw) ||
          r.job.company.toLowerCase().includes(kw)
      );
    }

    if (filters.location !== "all") {
      result = result.filter((r) => r.job.location === filters.location);
    }
    if (filters.mode !== "all") {
      result = result.filter((r) => r.job.mode === filters.mode);
    }
    if (filters.experience !== "all") {
      result = result.filter((r) => r.job.experience === filters.experience);
    }
    if (filters.source !== "all") {
      result = result.filter((r) => r.job.source === filters.source);
    }
    if (filters.status !== "all") {
      result = result.filter((r) => getStatus(r.job.id) === filters.status);
    }

    // sort
    if (filters.sort === "latest") {
      result.sort((a, b) => a.job.postedDaysAgo - b.job.postedDaysAgo);
    } else if (filters.sort === "oldest") {
      result.sort((a, b) => b.job.postedDaysAgo - a.job.postedDaysAgo);
    } else if (filters.sort === "matchScore") {
      result.sort((a, b) => b.matchScore - a.matchScore);
    } else if (filters.sort === "salary") {
      result.sort(
        (a, b) => extractSalaryNum(b.job.salaryRange) - extractSalaryNum(a.job.salaryRange)
      );
    }

    return result;
  }, [filters, scored, thresholdOn, prefsExist, preferences.minMatchScore, getStatus]);

  return (
    <div className="mx-auto max-w-7xl px-system-3 py-system-5">
      <div className="max-w-prose">
        <h1 className="text-4xl text-foreground">Dashboard</h1>
        <p className="mt-system-1 text-base text-muted-foreground">
          {filtered.length} job{filtered.length !== 1 ? "s" : ""} found across India's top companies.
        </p>
      </div>

      {/* Preferences banner */}
      {!prefsExist && (
        <div className="mt-system-3 flex items-center gap-system-2 rounded-lg border border-warning/30 bg-warning/5 px-system-3 py-system-2">
          <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
          <p className="flex-1 text-sm text-foreground">
            Set your preferences to activate intelligent matching.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link to="/settings">Go to Settings</Link>
          </Button>
        </div>
      )}

      {/* Filters + threshold toggle */}
      <div className="mt-system-3 space-y-system-2">
        <FilterBar filters={filters} onChange={setFilters} />
        {prefsExist && (
          <div className="flex items-center gap-2">
            <Switch checked={thresholdOn} onCheckedChange={setThresholdOn} id="threshold" />
            <Label htmlFor="threshold" className="text-sm text-muted-foreground cursor-pointer">
              Show only jobs above my threshold ({preferences.minMatchScore}%)
            </Label>
          </div>
        )}
      </div>

      {/* Job List */}
      <div className="mt-system-3 grid gap-system-2 md:grid-cols-2">
        {filtered.map(({ job, matchScore }) => (
          <JobCard
            key={job.id}
            job={job}
            matchScore={prefsExist ? matchScore : undefined}
            isSaved={isSaved(job.id)}
            onToggleSave={toggleSave}
            onView={setViewJob}
            status={getStatus(job.id)}
            onStatusChange={(id, status) => {
              setStatus(id, status);
              if (status !== "Not Applied") {
                toast({ title: `Status updated: ${status}` });
              }
            }}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-system-5 flex flex-col items-center rounded-lg border border-border bg-card px-system-4 py-system-5 text-center">
          <p className="text-lg text-foreground">No roles match your criteria.</p>
          <p className="mt-system-1 text-sm text-muted-foreground">
            Adjust filters or lower your threshold in Settings.
          </p>
        </div>
      )}

      {/* Detail Modal */}
      <JobDetailModal job={viewJob} open={!!viewJob} onOpenChange={(o) => !o && setViewJob(null)} />
    </div>
  );
};

export default Dashboard;
